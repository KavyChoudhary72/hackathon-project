"""
core.py
Single handle_message() entry point for all channels.
Both the WhatsApp adapter and the web widget call this function.

Flow:
  1. Resolve session + role from phone/session_id
  2. Detect language; check for language-pin command
  3. Run fallback router (deterministic, no LLM)
  4. If fallback matches → execute the action
  5. Else → call LLM with extraction or conversational mode
  6. Execute LLM-directed action if needed
  7. Return (reply_text, quick_replies)

HARD RULE: safety, matching, eligibility and OTP validity are NEVER decided here.
           Only the backend decides those. We surface backend errors as user messages.
"""

import asyncio
import logging
import re
import time
from typing import Optional

import httpx

from session  import get_or_create, update_session, append_history, get_session
from lang     import detect as detect_lang, effective_lang, parse_pin_command
from fallback import route as fallback_route
from templates import T
import tools
import llm as llm_client
from demo_accounts import get_account_by_phone, get_account_by_id

logger = logging.getLogger(__name__)

# ─── Nominatim rate-limiter (max 1 req/s) ────────────────────────────────────
_last_geocode_time = 0.0
_GEOCODE_INTERVAL  = 1.1   # seconds


async def _geocode_throttled(address: str) -> dict | None:
    global _last_geocode_time
    wait = _GEOCODE_INTERVAL - (time.monotonic() - _last_geocode_time)
    if wait > 0:
        await asyncio.sleep(wait)
    _last_geocode_time = time.monotonic()
    return await tools.geocode(address)


# ─── Donation draft field order ───────────────────────────────────────────────
# We ask for these in sequence, one at a time.
_REQUIRED_FIELDS = [
    ("food_type",  lambda s: T.ask_food_type(s["lang"])),
    ("quantity",   lambda s: T.ask_quantity(s["lang"])),
    ("is_veg",     lambda s: T.ask_veg(s["lang"])),
    ("safe_until", lambda s: T.ask_safe_until(s["lang"])),
    ("address",    lambda s: T.ask_location(s["lang"])),
]

_QUICK_REPLIES: dict[str, list[str]] = {
    "donor":   ["Post donation", "Check status", "View impact", "Help"],
    "shelter": ["View offers", "Update capacity", "Status", "Help"],
    "driver":  ["View tasks", "Confirm OTP", "Status", "Help"],
    "buyer":   ["Deals near me", "Claim deal", "Status", "Help"],
    "partner": ["View diversions", "Status", "Help"],
}


# ─── Public entry point ───────────────────────────────────────────────────────

async def handle_message(
    user_ref:   str,           # phone (WhatsApp) or session_id (web)
    role:       str,           # donor | shelter | driver | buyer | partner
    text:       str,
    image_b64:  Optional[str] = None,
    lat:        Optional[float] = None,
    lng:        Optional[float] = None,
    location_name: Optional[str] = None,
    lang_hint:  str = "en",   # from web widget; WhatsApp derives from session
) -> tuple[str, list[str]]:
    """
    Process one incoming message. Returns (reply_text, quick_replies).
    """
    # ── 1. Resolve session ─────────────────────────────────────────────────────
    session_id, session = get_or_create(user_ref, role, lang_hint)

    # Bind entity if found via phone mapping
    if not session.get("entity_id"):
        account_info = get_account_by_phone(user_ref)
        if account_info:
            update_session(session_id,
                           role=account_info["role"],
                           entity_id=account_info["account"]["id"],
                           lang=account_info["account"].get("lang", "en"))
            session = get_session(session_id)

    role      = session.get("role", role)
    entity_id = session.get("entity_id")

    # ── 2. Language detection ──────────────────────────────────────────────────
    detected = detect_lang(text)
    pin_cmd  = parse_pin_command(text)
    if pin_cmd:
        update_session(session_id, lang=pin_cmd)
        session["lang"] = pin_cmd

    lang = effective_lang(detected, session.get("lang"))
    update_session(session_id, lang=lang)

    # ── 3. Location pin handling ───────────────────────────────────────────────
    if lat is not None and lng is not None:
        reply, qr = await _handle_location(session, session_id, lat, lng,
                                           location_name, lang, role, entity_id)
        _record(session_id, text, reply)
        return reply, qr

    # ── 4. Image handling ──────────────────────────────────────────────────────
    if image_b64:
        reply, qr = await _handle_image(session, session_id, image_b64, lang, role)
        _record(session_id, text, reply)
        return reply, qr

    # ── 5. Fallback router (deterministic — always runs first) ─────────────────
    fb = fallback_route(text, role, lang, session)
    if fb:
        reply, qr = await _execute_fallback(fb, session, session_id,
                                            lang, role, entity_id, text=text)
        _record(session_id, text, reply)
        return reply, qr

    # ── 6. LLM ────────────────────────────────────────────────────────────────
    reply, qr = await _handle_llm(text, session, session_id, lang, role, entity_id)
    _record(session_id, text, reply)
    return reply, qr


# ─── Location flow ────────────────────────────────────────────────────────────

async def _handle_location(
    session, session_id, lat, lng, location_name, lang, role, entity_id
) -> tuple[str, list[str]]:
    draft = session.get("draft", {})
    draft["lat"]     = lat
    draft["lng"]     = lng
    draft["address"] = location_name or f"{lat:.4f},{lng:.4f}"

    display = location_name or draft["address"]
    update_session(session_id, draft=draft, intent="awaiting_location_confirm")
    reply = T.confirm_location(lang, display)
    return reply, [_pick(lang, "हाँ ✅", "Haan ✅", "Yes ✅"),
                   _pick(lang, "बदलो ✏️", "Badlo ✏️", "Change ✏️")]


# ─── Image / photo flow ───────────────────────────────────────────────────────

async def _handle_image(
    session, session_id, image_b64, lang, role
) -> tuple[str, list[str]]:
    if role != "donor":
        return T.error_generic(lang), _quick_replies(role)
    try:
        result = await tools.parse_food_photo(image_b64)
        food     = result.get("food_type", "?")
        qty      = result.get("quantity", "?")
        category = result.get("category", "?")
        # Pre-fill draft but do NOT set intent to confirm yet — ask user
        draft = session.get("draft", {})
        draft.update({k: v for k, v in result.items() if v is not None})
        update_session(session_id, draft=draft)
        reply = T.photo_suggestion(lang, food, str(qty), category)
        return reply, [_pick(lang, "हाँ ✅", "Haan ✅", "Yes ✅"),
                       _pick(lang, "बदलो ✏️", "Badlo ✏️", "Edit ✏️")]
    except Exception as exc:
        logger.warning("Photo parse failed: %s", exc)
        return T.error_generic(lang), _quick_replies(role)


# ─── Fallback action executor ─────────────────────────────────────────────────

async def _execute_fallback(
    fb, session, session_id, lang, role, entity_id, text: str = ""
) -> tuple[str, list[str]]:
    action = fb.action
    params = fb.params
    qr     = fb.quick_replies or _quick_replies(role)

    if fb.reply and not action:
        return fb.reply, qr

    try:
        if action == "create_donation":
            return await _do_create_donation(session, session_id, lang, entity_id)

        elif action == "reset_draft":
            update_session(session_id, draft={}, intent=None)
            return fb.reply or T.help_menu(lang, role), qr

        elif action == "accept_offer":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            shelter_id  = entity_id
            r = await tools.respond_to_offer(donation_id, shelter_id, accept=True)
            update_session(session_id, intent=None)
            # Extract driver + OTP from response
            driver = r.get("delivery", {}).get("driver_name", "a driver")
            otp    = r.get("delivery", {}).get("delivery_otp", "----")
            eta    = r.get("eta_min", 15)
            return T.offer_accepted(lang, driver, eta, otp), qr

        elif action == "decline_offer":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            shelter_id  = entity_id
            await tools.respond_to_offer(donation_id, shelter_id, accept=False)
            update_session(session_id, intent=None)
            return T.offer_declined(lang), qr

        elif action == "update_capacity":
            meals = params.get("meals", 0)
            await tools.update_capacity(entity_id, meals)
            return T.capacity_updated(lang, meals), qr

        elif action == "confirm_pickup":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            otp         = params.get("otp", "")
            r = await tools.confirm_pickup(donation_id, otp)
            drop_name = r.get("shelter_name", "shelter")
            drop_addr = r.get("shelter_address", "")
            del_otp   = r.get("delivery", {}).get("delivery_otp", "----")
            drop_lat  = r.get("shelter_lat")
            drop_lng  = r.get("shelter_lng")
            maps_link = tools.google_maps_link(drop_lat, drop_lng) if drop_lat else ""
            update_session(session_id, intent="awaiting_delivery_otp")
            return T.pickup_confirmed(lang, drop_name, maps_link, del_otp), qr

        elif action == "confirm_delivery":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            otp         = params.get("otp", "")
            r = await tools.confirm_delivery(donation_id, otp)
            qty = r.get("quantity_meals", 0)
            update_session(session_id, intent=None)
            return T.delivery_confirmed(lang, qty), qr

        elif action == "get_driver_tasks":
            r = await tools.get_driver_tasks(entity_id)
            tasks = r.get("tasks", [])
            if not tasks:
                return _pick(lang, "कोई task नहीं है अभी।",
                             "Koi task nahi hai abhi.", "No tasks assigned yet."), qr
            t = tasks[0]
            maps_link = tools.google_maps_link(
                t["pickup_lat"], t["pickup_lng"]
            ) if t.get("pickup_lat") else ""
            update_session(session_id, last_ref_id=t.get("donation_id"),
                           intent="awaiting_pickup_otp")
            return T.task_alert(
                lang,
                t.get("donor_name", "Donor"), t.get("pickup_address", ""),
                t.get("shelter_name", "Shelter"), t.get("drop_address", ""),
                t.get("donor_phone", "N/A"),
                maps_link,
            ), qr

        elif action == "get_rescue_deals":
            lat = session.get("lat")
            lng = session.get("lng")
            loc_name = session.get("location_name")

            # Check if text specifies a Jaipur locality or pin code
            t_low = (text or "").lower()
            if "malviya" in t_low or "maviya" in t_low or "302020" in t_low:
                lat, lng, loc_name = 26.8522, 75.8333, "Malviya Nagar"
            elif "raja park" in t_low or "302004" in t_low:
                lat, lng, loc_name = 26.8967, 75.8272, "Raja Park"
            elif "mansarovar" in t_low:
                lat, lng, loc_name = 26.8580, 75.7650, "Mansarovar"
            elif "vaishali" in t_low or "302021" in t_low:
                lat, lng, loc_name = 26.9077, 75.7396, "Vaishali Nagar"
            elif "c-scheme" in t_low or "302001" in t_low:
                lat, lng, loc_name = 26.9089, 75.8056, "C-Scheme"
            elif not lat:
                lat, lng, loc_name = 26.8522, 75.8333, "Malviya Nagar"

            update_session(session_id, lat=lat, lng=lng, location_name=loc_name)
            session["lat"] = lat
            session["lng"] = lng
            session["location_name"] = loc_name

            r = await tools.list_deals(lat, lng)
            deals = r.get("deals", [])[:3]
            if not deals:
                return _pick(lang, f"{loc_name} ke paas abhi koi rescue deal nahi hai.",
                             f"{loc_name} ke paas abhi koi rescue deal nahi hai.",
                             f"No Rescue Deals near {loc_name} right now."), qr

            header = _pick(lang, f"🍱 *FoodLink Rescue Deals ({loc_name})*:",
                           f"🍱 *FoodLink Rescue Deals ({loc_name})*:",
                           f"🍱 *FoodLink Rescue Deals near {loc_name}*:")
            lines = [header, ""]
            for i, d in enumerate(deals, 1):
                donor = d.get('donor_name', 'Partner Kitchen')
                food = d.get('food_type', 'Surplus Meal')
                price = d.get('price_per_meal', 30)
                rem = d.get('remaining_qty', 10)
                dist = d.get('km', 1.0)
                time_s = d.get('safe_until', 'Tonight')
                lines.append(f"{i}. *{donor}* · {food}")
                lines.append(f"   💰 ₹{price}/meal · {rem} left · {dist:.1f} km (Safe until {time_s})")

            lines.append("")
            lines.append(_pick(lang, "Reserve karne ke liye 'Claim 1' ya 'Claim 2' likhein.",
                               "Reserve karne ke liye 'Claim 1' ya 'Claim 2' likhein.",
                               "Reply 'Claim 1' or 'Claim 2' to reserve with instant pickup OTP."))

            update_session(session_id, last_ref_id=deals[0].get("id"))
            return "\n".join(lines), ["Claim 1", "Claim 2", "Claim 3"]

        elif action == "claim_rescue_deal":
            donation_id = params.get("donation_id") or session.get("last_ref_id") or "don_deal_001"
            qty         = params.get("qty", 1)
            r = await tools.claim_deal(donation_id, entity_id or "buyer_demo", qty)
            otp        = r.get("otp", "7392")
            collect_by = r.get("collect_by", "11:30 PM tonight")
            donor      = r.get("donor_name", "Shree Ram Marriage Garden")
            safe_until = r.get("safe_until", "Tonight 11:30 PM")
            total      = r.get("price_per_meal", 30) * qty
            return T.deal_claimed(lang, qty, total, otp, collect_by, donor, safe_until), ["Deals near me", "Status", "Help"]

        elif action == "collect_deal":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            otp         = params.get("otp", "")
            r = await tools.collect_deal(donation_id, otp)
            return T.deal_collected(lang, r.get("qty", 0)), qr

        elif action == "accept_diversion":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            r = await tools.accept_diversion(donation_id, entity_id)
            update_session(session_id, intent="awaiting_diversion_complete")
            return T.diversion_accepted(lang), qr

        elif action == "complete_diversion":
            donation_id = params.get("donation_id") or session.get("last_ref_id")
            kg          = params.get("kg_actual", 0.0)
            await tools.complete_diversion(donation_id, kg)
            return T.diversion_completed(lang, kg), qr

        elif action == "get_status":
            ref = session.get("last_ref_id")
            if not ref:
                return _pick(lang, "Koi recent donation/task nahi mili.",
                             "Koi recent donation/task nahi mili.",
                             "No recent donation or task found."), qr
            r = await tools.get_status(ref)
            status = r.get("status", "unknown")
            food   = r.get("food_type", "")
            qty    = r.get("quantity_meals", r.get("quantity", "?"))
            return _pick(lang,
                         f"📊 Status: *{status}*\n{qty} {food}",
                         f"📊 Status: *{status}*\n{qty} {food}",
                         f"📊 Status: *{status}*\n{qty} meals · {food}"), qr

        elif action == "get_impact_stats":
            r = await tools.get_impact_stats()
            return T.impact_stats(
                lang,
                r.get("meals_to_people", 0),
                r.get("meals_rescue_deals", 0),
                r.get("kg_diverted_total", 0.0),
                r.get("co2e_kg", 0.0),
            ), qr

        elif action == "location_confirmed":
            # User confirmed geocoded address — continue with next missing field
            session = get_session(session_id)
            return await _next_donation_field(session, session_id, lang), qr

    except httpx.HTTPStatusError as exc:
        # Surface backend error message to user
        try:
            detail = exc.response.json().get("detail", str(exc))
        except Exception:
            detail = str(exc)
        if exc.response.status_code == 400 and "otp" in detail.lower():
            attempts = _parse_attempts(detail)
            return T.wrong_otp(lang, attempts), qr
        logger.warning("Backend error: %d %s", exc.response.status_code, detail)
        return f"❌ {detail}", qr

    except Exception as exc:
        logger.exception("Action %s failed: %s", action, exc)
        return T.error_generic(lang), qr

    return fb.reply or T.help_menu(lang, role), qr


# ─── LLM handler ─────────────────────────────────────────────────────────────

async def _handle_llm(
    text, session, session_id, lang, role, entity_id
) -> tuple[str, list[str]]:
    qr = _quick_replies(role)

    try:
        # Decide whether we're in extraction mode (donor posting)
        intent = session.get("intent") or ""
        draft  = session.get("draft") or {}
        extract_mode = (
            role == "donor"
            and intent in ("", "collecting_donation_fields")
            and _looks_like_donation(text)
        )

        result = await llm_client.ask(
            message=text,
            role=role,
            entity_id=entity_id,
            lang=lang,
            draft=draft,
            history=session.get("history", []),
            extract_mode=extract_mode,
        )

    except asyncio.TimeoutError:
        logger.warning("LLM timed out — using scripted fallback")
        return T.llm_timeout(lang), qr
    except Exception as exc:
        logger.exception("LLM error: %s", exc)
        return T.error_generic(lang), qr

    # ── LLM returned JSON extraction ──────────────────────────────────────────
    if isinstance(result, dict):
        return await _merge_draft_and_ask(result, session, session_id, lang, role, entity_id)

    # ── LLM returned plain text ───────────────────────────────────────────────
    return result, qr


async def _merge_draft_and_ask(
    fields: dict, session, session_id, lang, role, entity_id
) -> tuple[str, list[str]]:
    """
    Merge extracted fields into the draft, then ask for the next missing field
    or show the confirmation card.
    """
    draft = session.get("draft", {})
    # Merge only non-None extracted fields
    for k, v in fields.items():
        if v is not None:
            draft[k] = v

    # Parse time fields if they're strings
    if isinstance(draft.get("safe_until"), str):
        try:
            from timeparse import parse_time, format_ist
            dt = parse_time(draft["safe_until"])
            draft["safe_until"] = dt.isoformat()
            draft["safe_until_display"] = format_ist(dt)
        except ValueError as exc:
            update_session(session_id, draft=draft, intent="collecting_donation_fields")
            return str(exc), ["Try again"]

    update_session(session_id, draft=draft, intent="collecting_donation_fields")
    session["draft"] = draft
    return await _next_donation_field(session, session_id, lang), _quick_replies(role)


async def _next_donation_field(session, session_id, lang) -> str:
    """Ask for the next missing required field, or show the confirmation card."""
    draft = session.get("draft", {})

    for field, ask_fn in _REQUIRED_FIELDS:
        if not draft.get(field):
            update_session(session_id, intent="collecting_donation_fields")
            return ask_fn(session)

    # All fields collected — show confirmation card
    from timeparse import format_ist
    from datetime import datetime, timezone
    from zoneinfo import ZoneInfo

    su_raw = draft.get("safe_until", "")
    try:
        su_dt     = datetime.fromisoformat(su_raw).astimezone(ZoneInfo("Asia/Kolkata"))
        safe_disp = format_ist(su_dt)
    except Exception:
        safe_disp = su_raw

    update_session(session_id, intent="awaiting_donation_confirm")
    return T.donation_summary_card(
        lang,
        qty=draft.get("quantity", 0),
        unit=draft.get("unit", "meals"),
        food=draft.get("food_type", ""),
        is_veg=bool(draft.get("is_veg", True)),
        safe_until=safe_disp,
        address=draft.get("address", ""),
    )


async def _do_create_donation(session, session_id, lang, entity_id) -> tuple[str, list[str]]:
    """Called when the user confirms the summary card."""
    draft = session.get("draft", {})
    try:
        r = await tools.create_donation(
            donor_id   = entity_id,
            food_type  = draft["food_type"],
            category   = draft.get("category", "cooked"),
            quantity   = draft["quantity"],
            unit       = draft.get("unit", "meals"),
            is_veg     = bool(draft.get("is_veg", True)),
            address    = draft["address"],
            prepared_at= draft.get("prepared_at", ""),
            safe_until = draft["safe_until"],
            lat        = draft.get("lat"),
            lng        = draft.get("lng"),
        )
        donation_id = r.get("id") or r.get("_id")
        update_session(session_id, draft={}, intent=None, last_ref_id=donation_id)
        return T.donation_posted(lang), ["Check status", "View impact"]
    except Exception as exc:
        logger.exception("create_donation failed: %s", exc)
        return T.error_generic(lang), ["Try again", "Help"]


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _record(session_id: str, user_text: str, reply: str):
    append_history(session_id, "user", user_text)
    append_history(session_id, "assistant", reply)


def _quick_replies(role: str) -> list[str]:
    return _QUICK_REPLIES.get(role, _QUICK_REPLIES["donor"])


def _pick(lang: str, hi: str, hinglish: str, en: str) -> str:
    if lang == "hi":      return hi
    if lang == "hinglish": return hinglish
    return en


def _looks_like_donation(text: str) -> bool:
    """Heuristic: does this message look like a food donation post?"""
    keywords = r"\b(meal|plate|kg|kilo|khana|khaana|food|dal|roti|sabzi|biryani|donate|donation|bcha|bacha)\b"
    return bool(re.search(keywords, text, re.IGNORECASE))


def _parse_attempts(detail: str) -> int:
    """Extract remaining attempt count from backend error string."""
    m = re.search(r"(\d+)\s*(attempts?|try|tries)", detail, re.IGNORECASE)
    return int(m.group(1)) if m else 2
