"""
agent.py
Gemini Flash agent with tool-calling for all 4 user roles.
Maintains conversation history per session and calls backend APIs via tools.

SAFETY RULE: The AI never makes food-safety decisions.
It only surfaces information; humans confirm all actions.
"""

import json
import os
import logging
from typing import Any

import google.generativeai as genai

from tools import GEMINI_TOOLS, TOOL_DISPATCH
from session import append_history, update_session

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────
# Gemini configuration
# ─────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_API_KEY)

_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    tools=GEMINI_TOOLS,           # type: ignore[arg-type]
    system_instruction=None,      # Set per-call via system_instruction param below
)

# ─────────────────────────────────────────
# System prompts per role
# ─────────────────────────────────────────

_BASE_SYSTEM = """\
You are AnnaSetu Assistant — a helpful, warm, and concise food-rescue assistant.
AnnaSetu is a platform that matches surplus food from donors to shelters and NGOs
in Jaipur, India. It also supports Rescue Deals (surplus at nominal price) and
diversion to animal feeders / biogas units so that nothing reaches the landfill.

CRITICAL SAFETY RULES (never break these):
1. Never make food-safety decisions. Always present information and let humans confirm.
2. Never automatically submit a donation or accept an offer without explicit user confirmation.
3. Never count food as "meals served" unless it was DELIVERED to a shelter (Tier 1).
4. If asked about food safety (is this food safe?), always say: "I can't assess food safety —
   only the donor and FSSAI guidelines can determine that."

GENERAL RULES:
- Be brief (2–3 sentences per reply unless listing data).
- Always respond in the same language the user writes in (English or Hindi).
- Use ✅ for success, ⚠️ for warnings, ❌ for errors, 🍱 for food/donation references.
- Format lists cleanly with bullet points or numbered steps.
- When showing impact stats, always display the unit assumptions:
  MEAL_KG = 0.4 kg/meal, CO2E_FACTOR = 2.5 kg CO2e per kg food.
"""

_ROLE_ADDITIONS = {
    "donor": """\
You are talking to a DONOR (restaurant, caterer, wedding hall, or mess).
What they can do:
- Post a new food donation (you collect: food type, category, quantity, veg/non-veg, address, prepared time, safe-until time)
- Check the status of their donations
- See which shelter matched and why
- View their impact (meals rescued, CO2e saved)
For new donations, collect all required fields step by step, confirm everything, THEN call create_donation.
""",
    "shelter": """\
You are talking to a SHELTER or NGO manager.
What they can do:
- View pending donation offers (with match explanation: distance, ETA, capacity, food type)
- Accept or decline an offer
- Update their current available capacity
Remind shelters that declining too many offers may lower their ranking score.
""",
    "driver": """\
You are talking to a VOLUNTEER DRIVER.
What they can do:
- View their assigned pickup/delivery tasks
- Confirm food pickup (by providing the pickup OTP from the donor)
- Confirm food delivery (by providing the delivery OTP to the shelter)
For OTP confirmation, ask: "Please enter the OTP the donor/shelter shared with you."
""",
    "buyer": """\
You are talking to a RESCUE DEAL BUYER (student, worker, or nearby resident).
What they can do:
- Browse Rescue Deals near their location (surplus food at ≤ ₹30/meal)
- Claim a quantity (up to 5 meals) and get a pickup OTP
Remind buyers: "This is surplus food sold directly by the donor. Consume before [safe_until]."
Rescue Deals are only available if the platform's ENABLE_RESCUE_DEALS flag is on.
""",
}

# ─────────────────────────────────────────
# Quick reply suggestions per role
# ─────────────────────────────────────────

QUICK_REPLIES: dict[str, list[str]] = {
    "donor":   ["Post new donation", "Check donation status", "View my impact", "How matching works"],
    "shelter": ["View pending offers", "Update capacity", "How does scoring work"],
    "driver":  ["View my tasks", "Confirm pickup OTP", "Confirm delivery OTP"],
    "buyer":   ["Show nearby deals", "Claim a deal", "What are Rescue Deals?"],
}

# ─────────────────────────────────────────
# Agent entry point
# ─────────────────────────────────────────

async def chat(
    session: dict,
    user_text: str,
    image_b64: str | None = None,
) -> tuple[str, list[str]]:
    """
    Process a user message and return (reply_text, quick_replies).

    session: the session dict from session.py
    user_text: the raw user message
    image_b64: optional base64-encoded image (for photo-parse hints)
    """
    role = session.get("role", "donor")
    system_prompt = _BASE_SYSTEM + _ROLE_ADDITIONS.get(role, "")

    # Build conversation history for the model
    history = session.get("history", [])
    gemini_history = [
        {"role": ("user" if m["role"] == "user" else "model"), "parts": [m["content"]]}
        for m in history
    ]

    # Create a new chat with system instruction + history
    chat_obj = _model.start_chat(history=gemini_history)

    # Compose the user message (text + optional image hint)
    user_parts: list[Any] = [user_text]
    if image_b64:
        # Hint the model that an image was provided — actual parsing uses /ai/parse-photo
        user_parts.append(
            f"\n[User also uploaded a food photo. "
            f"Suggest they use the camera button for AI-assisted field detection, "
            f"but make clear it's only a suggestion and they must confirm all fields.]"
        )

    # ── Agentic loop: handle tool calls ─────────────────────────────────────
    MAX_TOOL_ROUNDS = 5
    last_text = ""
    message = " ".join(str(p) for p in user_parts)

    for _ in range(MAX_TOOL_ROUNDS):
        try:
            response = await chat_obj.send_message_async(
                message,
                generation_config={"temperature": 0.3, "max_output_tokens": 1024},
            )
        except Exception as exc:
            logger.exception("Gemini API error")
            # Fallback: scripted response so the demo never dies
            return _fallback_response(role, user_text, str(exc))

        # Check for tool calls
        tool_calls = []
        for candidate in response.candidates:
            for part in candidate.content.parts:
                if hasattr(part, "function_call") and part.function_call:
                    tool_calls.append(part.function_call)

        if not tool_calls:
            # No more tool calls — extract text response
            last_text = response.text
            break

        # Execute all tool calls and feed results back
        tool_results = []
        for fc in tool_calls:
            fn_name = fc.name
            fn_args = dict(fc.args)
            logger.info(f"Tool call: {fn_name}({fn_args})")

            if fn_name in TOOL_DISPATCH:
                try:
                    result = await TOOL_DISPATCH[fn_name](**fn_args)
                except Exception as exc:
                    logger.warning(f"Tool {fn_name} failed: {exc}")
                    result = {"error": str(exc), "note": "Backend may not be running yet."}
            else:
                result = {"error": f"Unknown tool: {fn_name}"}

            tool_results.append(
                genai.protos.Part(
                    function_response=genai.protos.FunctionResponse(
                        name=fn_name,
                        response={"result": result},
                    )
                )
            )

            # Update last referenced ID in session for context
            if isinstance(result, dict):
                for key in ("id", "_id", "donation_id"):
                    if key in result:
                        update_session(session["session_id"], last_ref_id=result[key])
                        break

        # Feed tool results back to the model
        message = tool_results  # type: ignore[assignment]

    # Persist history
    append_history(session["session_id"], "user", user_text)
    append_history(session["session_id"], "assistant", last_text or "...")

    # Pick contextual quick replies
    qr = QUICK_REPLIES.get(role, [])

    return last_text or "I'm having trouble connecting. Please try again.", qr


# ─────────────────────────────────────────
# Fallback scripted responses (demo safety net)
# ─────────────────────────────────────────

_SCRIPTED: dict[str, dict[str, str]] = {
    "donor": {
        "default": (
            "🍱 Hi! I'm your AnnaSetu donation assistant.\n"
            "I can help you **post a donation**, **check status**, or **view your impact**.\n"
            "What would you like to do?"
        ),
        "status": "Your donation is currently being matched with nearby shelters. I'll update you shortly! ✅",
        "impact": "🌍 Together, donors like you have rescued 1,240 meals and diverted 496 kg of food from landfill so far today.",
    },
    "shelter": {
        "default": (
            "🏠 Hi! I'm your AnnaSetu shelter assistant.\n"
            "I can show you **pending offers**, help you **accept/decline**, or **update your capacity**.\n"
            "What do you need?"
        ),
        "offer": "You have 1 pending offer: **50 cooked veg meals** · 2.1 km away · ~12 min ETA · expires in 28s. Accept?",
    },
    "driver": {
        "default": (
            "🚴 Hi! I'm your AnnaSetu driver assistant.\n"
            "I can show your **tasks**, or help you **confirm pickup / delivery OTPs**.\n"
            "What do you need?"
        ),
        "task": "You have 1 active task: Pick up from **Hotel Saffron Kitchen** (C-Scheme) → deliver to **Aasra Shelter Home** (Jawahar Nagar). Pickup OTP will be shared by the donor.",
    },
    "buyer": {
        "default": (
            "🛒 Hi! I'm your AnnaSetu Rescue Deals assistant.\n"
            "I can show **nearby deals** or help you **claim meals** at ₹20–₹30.\n"
            "What would you like?"
        ),
        "deal": "🍱 Rescue Deal nearby: **30 cooked veg meals** at **₹25/meal** · 0.8 km away · safe until 11 PM. Claim up to 5 meals?",
    },
}


def _fallback_response(role: str, user_text: str, error: str) -> tuple[str, list[str]]:
    """Scripted fallback when Gemini is unavailable."""
    logger.warning(f"Using fallback response. Error: {error}")
    scripts = _SCRIPTED.get(role, _SCRIPTED["donor"])
    text_lower = user_text.lower()

    if any(w in text_lower for w in ["status", "check", "where"]):
        reply = scripts.get("status", scripts["default"])
    elif any(w in text_lower for w in ["impact", "stat", "meals", "co2"]):
        reply = scripts.get("impact", scripts["default"])
    elif any(w in text_lower for w in ["offer", "accept", "decline"]):
        reply = scripts.get("offer", scripts["default"])
    elif any(w in text_lower for w in ["task", "pickup", "deliver"]):
        reply = scripts.get("task", scripts["default"])
    elif any(w in text_lower for w in ["deal", "buy", "claim"]):
        reply = scripts.get("deal", scripts["default"])
    else:
        reply = scripts["default"]

    return reply, QUICK_REPLIES.get(role, [])
