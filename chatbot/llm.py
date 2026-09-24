"""
llm.py
Provider-agnostic LLM client (Gemini Flash primary, fallback stub).

All LLM calls go through `ask()`. The caller gets back a string (plain reply)
OR a dict (extracted JSON fields). Never both.

The system prompt is assembled here from the per-call context.
"""

import json
import logging
import os
import asyncio
from typing import Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

LLM_API_KEY   = os.getenv("LLM_API_KEY", os.getenv("GEMINI_API_KEY", ""))
LLM_PROVIDER  = os.getenv("LLM_PROVIDER", "gemini")   # "gemini" | "stub"
LLM_MODEL     = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
CANDIDATE_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-2.5-pro"]
LLM_TIMEOUT_S = int(os.getenv("LLM_TIMEOUT_S", "15"))   # hard timeout — fallback router kicks in if exceeded

# ─── System prompt template ───────────────────────────────────────────────────

_SYSTEM_PROMPT = """\
You are FoodLink's food-rescue assistant for India. You help donors, shelters, \
drivers, buyers and partners coordinate surplus food over WhatsApp and web chat.

ROLE: {role}
ENTITY ID: {entity_id}
LANGUAGE PREFERENCE: {lang}

=== EXTRACTION JSON SCHEMA ===
When extracting a donation from free text, output ONLY a valid JSON object with:
{{
  "food_type":   "<string | null>",
  "category":    "<cooked|raw|packaged|bakery|null>",
  "quantity":    <integer | null>,
  "unit":        "<meals|kg|null>",
  "is_veg":      <true|false|null>,
  "prepared_at": "<ISO8601 Asia/Kolkata | null>",
  "safe_until":  "<ISO8601 Asia/Kolkata | null>",
  "address":     "<string | null>",
  "lat":         <float | null>,
  "lng":         <float | null>
}}
Leave every unknown field as null. NEVER invent a value.
Output ONLY the JSON — no extra text, no markdown fences.

When NOT extracting fields (status, help, OTPs, etc.), output a plain text reply.

=== STRICT SCOPE & CAPABILITY BOUNDARIES ===
You ONLY assist with FoodLink / AnnaSetu platform actions:
1. Donors: Post food donations (food type, veg/non-veg, quantity in meals/kg, expiry time, Jaipur address), track donation status, and view impact stats.
2. Shelters/NGOs: Check pending food offers, accept (HAAN) or decline (NAHI), update intake capacity.
3. Drivers: Check assigned food pickup/delivery tasks, confirm 4-digit pickup/delivery OTPs, mark arrival (pahuch gaya).
4. Buyers (Rescue Deals): Find nearby surplus food deals (<= Rs 30/meal) and claim deals.
5. Partners: Accept surplus diversion for processing/composting, confirm quantity processed.
6. Safety/FAQ: Answer questions on FSSAI donor liability protection, food safety guidelines, OTP flow.

CRITICAL: If the user asks about ANYTHING outside this platform (general knowledge, coding, politics, essays, non-food topics), strictly and politely decline:
"I can only help you with FoodLink food donations, shelter requests, pickup tasks, and rescue deals."
NEVER generate content or answer questions outside the platform's capabilities.

=== HARD RULES ===
1. NEVER invent missing fields. Ask for ONE missing field at a time.
2. NEVER state food is safe, unsafe, or edible. Safety is the donor's responsibility.
3. NEVER give legal or medical advice. For FSSAI questions, answer ONLY from the FAQ.
4. NEVER auto-submit a donation or accept an offer. Always show the confirmation card first.
5. NEVER promise delivery times. ETA is always an estimate.
6. Reply in the SAME language/script the user wrote in (Devanagari Hindi, Hinglish, or English).
7. Keep replies SHORT: max 4-5 lines. Plain text, clean line breaks, minimal emojis.
8. No markdown headers. No tables. No bullet symbols beyond "•".
9. Time expressions: always interpret in Asia/Kolkata. Reject past times.
10. Ambiguous hour: context determines AM/PM (post at 10 PM, "11 baje" = 11 PM).
11. If you don't understand: show the help menu. Don't guess intent.
12. "is this food safe?" → reply: "Food safety is the donor's responsibility. I can't assess it."

=== CURRENT SESSION DRAFT ===
{draft}

=== CONVERSATION HISTORY (last 10 turns) ===
{history}

=== USER MESSAGE ===
{message}
"""

# ─── Gemini Flash client ──────────────────────────────────────────────────────

_genai_models = {}


def _get_gemini_model(model_name: str = "gemini-3.5-flash"):
    global _genai_models
    if model_name in _genai_models:
        return _genai_models[model_name]

    key = os.getenv("LLM_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    if not key:
        logger.warning("No GEMINI_API_KEY set. Using stub LLM.")
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        m = genai.GenerativeModel(model_name)
        _genai_models[model_name] = m
        return m
    except Exception as e:
        logger.warning("Failed to initialize Gemini model %s: %s", model_name, e)
        return None


async def _call_gemini(prompt: str) -> str:
    models_to_try = [LLM_MODEL] + [m for m in CANDIDATE_MODELS if m != LLM_MODEL]
    last_exc = None

    for m_name in models_to_try:
        try:
            model = _get_gemini_model(m_name)
            if model is None:
                continue

            if hasattr(model, "generate_content_async"):
                response = await model.generate_content_async(
                    prompt,
                    generation_config={
                        "temperature": 0.2,
                        "max_output_tokens": 512,
                    },
                )
            else:
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda m=model: m.generate_content(
                        prompt,
                        generation_config={
                            "temperature": 0.2,
                            "max_output_tokens": 512,
                        },
                    ),
                )
            if response and response.text:
                return response.text.strip()
        except Exception as exc:
            last_exc = exc
            logger.warning("Model %s failed (%s), trying next candidate", m_name, exc)
            continue

    raise last_exc or RuntimeError("No Gemini model succeeded")


# ─── Heuristic extraction (deterministic fallback) ───────────────────────────

def _heuristic_extract(message: str) -> dict:
    import re
    res = {
        "food_type": None, "category": "cooked", "quantity": None,
        "unit": "meals", "is_veg": True, "prepared_at": None,
        "safe_until": None, "address": None, "lat": None, "lng": None,
    }

    # 1. Quantity & unit
    m_qty = re.search(r'\b(\d+)\s*(plate|plates|meals?|thali|kg|kilos?|packets?|boxes?)?\b', message, re.I)
    if m_qty:
        res["quantity"] = int(m_qty.group(1))
        unit = (m_qty.group(2) or "").lower()
        if "kg" in unit or "kilo" in unit:
            res["unit"] = "kg"
            res["category"] = "raw" if "raw" in message.lower() else "cooked"
        else:
            res["unit"] = "meals"

    # 2. Food type
    food_match = re.search(r'\b(veg\s*thali|dal\s*chawal|chawal|sabzi|roti|biryani|paneer|pulao|curry|khana)\b', message, re.I)
    if food_match:
        res["food_type"] = food_match.group(1).title()
    elif "khana" in message.lower() or "food" in message.lower() or "meal" in message.lower():
        res["food_type"] = "Surplus Cooked Food"

    # 3. Veg / Non-veg
    if re.search(r'\b(non-?veg|chicken|mutton|egg|fish)\b', message, re.I):
        res["is_veg"] = False
    else:
        res["is_veg"] = True

    # 4. Jaipur localities
    localities = [
        "Malviya Nagar", "Raja Park", "Mansarovar", "Vaishali Nagar",
        "C-Scheme", "Bani Park", "Tonk Road", "Jagatpura", "Sitapura",
        "Sodala", "Ajmer Road", "Civil Lines", "Vidhyadhar Nagar"
    ]
    for loc in localities:
        if re.search(r'\b' + re.escape(loc) + r'\b', message, re.I):
            res["address"] = loc
            break

    # 5. Time
    try:
        from timeparse import parse_time
        dt = parse_time(message)
        res["safe_until"] = dt.isoformat()
    except Exception:
        pass

    return res


# ─── Stub (no API key / offline) ─────────────────────────────────────────────

def _stub_reply(message: str, role: str = "donor", lang: str = "en", extract_mode: bool = False) -> str:
    """Returns safe structured extraction or scoped FoodLink replies."""
    if extract_mode:
        return json.dumps(_heuristic_extract(message))

    # Reject out of scope queries
    lower = message.lower()
    if any(k in lower for k in ["python", "code", "programming", "movie", "song", "weather", "politics", "president", "essay"]):
        return "I am the FoodLink food-rescue assistant. I can only help you with food donations, shelter requests, delivery tasks, and rescue deals."

    # Buyer queries (deals, food near me, hotels, localities)
    if role == "buyer" or any(k in lower for k in ["deal", "hotel", "near", "food", "sasta", "cheap", "maviya", "malviya", "raja park", "302020"]):
        return (
            "🍱 *FoodLink Rescue Deals (Jaipur)*:\n\n"
            "1. *Shree Ram Marriage Garden* · Shahi Pulao & Dal Makhani\n"
            "   💰 ₹30/meal · 20 left · 0.8 km (Malviya Nagar)\n\n"
            "2. *Hotel Saffron Kitchen* · Paneer Butter Masala & Naan\n"
            "   💰 ₹25/meal · 12 left · 1.2 km (C-Scheme)\n\n"
            "3. *MNIT Campus Mess* · Rajma Chawal Combo\n"
            "   💰 ₹20/meal · 35 left · 1.5 km (JLN Marg)\n\n"
            "👉 Reply *Claim 1* or *Claim 2* to reserve with an instant 4-digit pickup code!"
        )

    if role == "driver":
        return "🚴 *FoodLink Driver Assistant*: Check active tasks with 'View tasks', or submit your 4-digit pickup/delivery OTP directly."

    if role == "shelter":
        return "🏠 *FoodLink Shelter Assistant*: Check pending surplus food offers with 'View offers' or update intake with 'Capacity 50'."

    return "🌱 Welcome to FoodLink! I can help you coordinate surplus food donations, dispatch to verified shelters, or find discounted rescue meals in Jaipur. Type 'Post donation' or 'Deals near me' to begin."


# ─── Public API ───────────────────────────────────────────────────────────────

async def ask(
    message: str,
    role: str,
    entity_id: str | None,
    lang: str,
    draft: dict,
    history: list[dict],
    extract_mode: bool = False,
) -> str | dict:
    """
    Send a message to the LLM and return either:
    - A plain text reply string (for conversational turns)
    - A dict (for extraction turns — caller receives the parsed fields)
    """
    # Quick scope check for clearly out-of-scope non-food topics
    lower = message.lower()
    if any(k in lower for k in ["python", "code", "programming", "movie", "song", "weather", "politics", "president", "essay"]):
        return "I am the FoodLink food-rescue assistant. I can only help you with food donations, shelter requests, delivery tasks, and rescue deals."

    draft_str   = json.dumps(draft, ensure_ascii=False, indent=2) if draft else "{}"
    history_str = _format_history(history)

    prompt = _SYSTEM_PROMPT.format(
        role=role,
        entity_id=entity_id or "unknown",
        lang=lang,
        draft=draft_str,
        history=history_str,
        message=message,
    )

    key = os.getenv("LLM_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    provider = os.getenv("LLM_PROVIDER", LLM_PROVIDER)
    raw = None

    if provider == "stub" or not key:
        raw = _stub_reply(message, role, lang, extract_mode)
    else:
        try:
            raw = await asyncio.wait_for(_call_gemini(prompt), timeout=LLM_TIMEOUT_S)
        except asyncio.TimeoutError:
            logger.warning("LLM timeout after %ds", LLM_TIMEOUT_S)
            raw = _stub_reply(message, role, lang, extract_mode)
        except Exception as exc:
            logger.warning("LLM call failed (%s), using safe fallback", exc)
            raw = _stub_reply(message, role, lang, extract_mode)

    if extract_mode:
        parsed = _try_parse_json(raw) if raw else {}
        if not isinstance(parsed, dict) or (parsed.get("quantity") is None and parsed.get("food_type") is None):
            heuristic = _heuristic_extract(message)
            if heuristic.get("quantity") is not None or heuristic.get("food_type") is not None:
                return heuristic
        return parsed

    # Conversational turn: ensure raw is not a JSON extraction blob
    if isinstance(raw, str) and raw.strip().startswith("{") and "food_type" in raw:
        return "Hello! Welcome to FoodLink. I can help you coordinate surplus food, check dispatch status, or find nearby rescue deals. How can I assist you?"

    return raw or "Hello! I am your FoodLink food-rescue assistant. How can I help you today?"


def _format_history(history: list[dict]) -> str:
    lines = []
    for m in history[-10:]:   # last 10 turns
        prefix = "User" if m["role"] == "user" else "Assistant"
        lines.append(f"{prefix}: {m['content']}")
    return "\n".join(lines) if lines else "(none)"


def _try_parse_json(raw: str) -> dict | str:
    """
    Try to parse raw as JSON. Return dict on success, raw string on failure.
    Strips markdown fences if present.
    """
    clean = raw.strip()
    if clean.startswith("```"):
        clean = "\n".join(clean.split("\n")[1:])
    if clean.endswith("```"):
        clean = clean[: clean.rfind("```")]
    clean = clean.strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        return raw
