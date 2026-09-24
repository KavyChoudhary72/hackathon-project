"""
notify_handler.py
Listens to the backend's WebSocket /ws/live event stream and fans out
chat notifications to the appropriate user(s) via the WhatsApp adapter.

Events handled:
  match.offered      → shelter offer alert with [HAAN][NAHI] buttons
  match.accepted     → donor: "Matched with X"
  driver.assigned    → donor: pickup OTP; driver: task alert
  status.changed     → relevant user's status update
  donation.unmatched → donor: unmatched notice
  deal.listed        → buyers within 3 km: deal alert
  deal.claimed       → donor: claim notification
  diversion.offered  → partner: diversion offer with [ACCEPT]
  impact.updated     → (no chat notification; dashboard only)

This module starts a background task when the FastAPI app starts.
"""

import asyncio
import json
import logging
import os

import httpx
import websockets

from adapters.whatsapp import send_text, send_buttons
from demo_accounts     import DEMO_ACCOUNTS
from session           import update_session, get_or_create
from templates         import T
import tools

logger = logging.getLogger(__name__)

BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://localhost:8000/ws/live")

# ─── Phone lookup helpers ─────────────────────────────────────────────────────

def _donor_phone(donor_id: str) -> str | None:
    for d in DEMO_ACCOUNTS["donors"]:
        if d["id"] == donor_id:
            return d["phone"]
    return None


def _shelter_phone(shelter_id: str) -> str | None:
    for s in DEMO_ACCOUNTS["shelters"]:
        if s["id"] == shelter_id:
            return s["phone"]
    return None


def _driver_phone(driver_id: str) -> str | None:
    for d in DEMO_ACCOUNTS["drivers"]:
        if d["id"] == driver_id:
            return d["phone"]
    return None


def _buyer_phones_near(lat: float, lng: float, radius_km: float = 3.0) -> list[str]:
    """Return phones of buyers within radius_km (simple Euclidean approx for demo)."""
    import math
    phones = []
    for b in DEMO_ACCOUNTS["buyers"]:
        blat = b["location"]["coordinates"][1]
        blng = b["location"]["coordinates"][0]
        dist = math.sqrt((blat - lat) ** 2 + (blng - lng) ** 2) * 111
        if dist <= radius_km:
            phones.append(b["phone"])
    return phones


def _partner_phone(partner_id: str) -> str | None:
    for p in DEMO_ACCOUNTS["partners"]:
        if p["id"] == partner_id:
            return p["phone"]
    return None


# ─── Event dispatcher ─────────────────────────────────────────────────────────

async def dispatch(event: dict) -> None:
    """Route a single backend event to the right WhatsApp notification(s)."""
    etype       = event.get("event", "")
    donation_id = event.get("donation_id")
    data        = event.get("data", {})

    logger.info("Notify event: %s | donation=%s", etype, donation_id)

    try:
        if etype == "match.offered":
            await _on_match_offered(donation_id, data)

        elif etype == "match.accepted":
            await _on_match_accepted(donation_id, data)

        elif etype == "driver.assigned":
            await _on_driver_assigned(donation_id, data)

        elif etype == "status.changed":
            await _on_status_changed(donation_id, data)

        elif etype == "donation.unmatched":
            await _on_unmatched(donation_id, data)

        elif etype == "deal.listed":
            await _on_deal_listed(donation_id, data)

        elif etype == "deal.claimed":
            await _on_deal_claimed(donation_id, data)

        elif etype == "diversion.offered":
            await _on_diversion_offered(donation_id, data)

    except Exception as exc:
        logger.exception("Notify dispatch failed for %s: %s", etype, exc)


async def _on_match_offered(donation_id, data):
    shelter_id = data.get("shelter_id")
    phone      = _shelter_phone(shelter_id)
    if not phone:
        return

    # Find shelter's language
    lang = "hi"
    for s in DEMO_ACCOUNTS["shelters"]:
        if s["id"] == shelter_id:
            lang = s.get("lang", "hi")
            cap  = s.get("capacity_meals", 0)
            break

    qty      = data.get("quantity_meals", 0)
    food     = data.get("food_type", "")
    is_veg   = data.get("is_veg", True)
    km       = data.get("km", 0.0)
    eta_min  = data.get("eta_min", 15)
    seconds  = data.get("expires_in_seconds", 30)

    body = T.offer_alert(lang, qty, food, is_veg, km, eta_min, cap, seconds)

    # Set session intent so HAAN/NAHI fallback knows what to do
    _, session = get_or_create(phone, "shelter", lang)
    update_session(session["session_id"],
                   intent="awaiting_offer_response",
                   last_ref_id=donation_id)

    await send_buttons(phone, body, [
        {"id": f"accept_{donation_id}", "title": "HAAN ✅"},
        {"id": f"decline_{donation_id}", "title": "NAHI ❌"},
    ])


async def _on_match_accepted(donation_id, data):
    donor_id = data.get("donor_id")
    phone    = _donor_phone(donor_id)
    if not phone:
        return
    lang     = _donor_lang(donor_id)
    shelter  = data.get("shelter_name", "Shelter")
    km       = data.get("km", 0.0)
    eta_min  = data.get("eta_min", 15)
    await send_text(phone, T.matched(lang, shelter, km, eta_min))


async def _on_driver_assigned(donation_id, data):
    # Notify donor with pickup OTP
    donor_id  = data.get("donor_id")
    dphone    = _donor_phone(donor_id)
    driver_id = data.get("driver_id")
    drphone   = _driver_phone(driver_id)

    if dphone:
        lang = _donor_lang(donor_id)
        driver_name = data.get("driver_name", "a driver")
        pickup_otp  = data.get("pickup_otp", "----")
        await send_text(dphone, T.driver_assigned(lang, driver_name, pickup_otp))

    if drphone:
        # Notify driver with task details
        dlang      = _driver_lang(driver_id)
        pickup_lat = data.get("pickup_lat")
        pickup_lng = data.get("pickup_lng")
        maps_link  = tools.google_maps_link(pickup_lat, pickup_lng) if pickup_lat else ""

        _, session = get_or_create(drphone, "driver", dlang)
        update_session(session["session_id"],
                       intent="awaiting_pickup_otp",
                       last_ref_id=donation_id)

        body = T.task_alert(
            dlang,
            data.get("donor_name", "Donor"),    data.get("pickup_address", ""),
            data.get("shelter_name", "Shelter"), data.get("drop_address", ""),
            data.get("donor_phone", "N/A"),
            maps_link,
        )
        await send_text(drphone, body)


async def _on_status_changed(donation_id, data):
    new_status = data.get("status", "")
    donor_id   = data.get("donor_id")
    phone      = _donor_phone(donor_id)
    if not phone:
        return
    lang = _donor_lang(donor_id)

    if new_status == "DELIVERED":
        qty     = data.get("quantity_meals", 0)
        shelter = data.get("shelter_name", "shelter")
        await send_text(phone, T.delivered(lang, shelter, qty))


async def _on_unmatched(donation_id, data):
    donor_id = data.get("donor_id")
    phone    = _donor_phone(donor_id)
    if phone:
        lang = _donor_lang(donor_id)
        await send_text(phone, T.unmatched(lang))


async def _on_deal_listed(donation_id, data):
    # Notify nearby buyers
    lat  = data.get("lat")
    lng  = data.get("lng")
    if lat is None:
        return
    phones = _buyer_phones_near(lat, lng)
    for phone in phones:
        buyer_lang = _buyer_lang(phone)
        body = T.deal_alert(
            buyer_lang,
            data.get("food_type", ""),
            data.get("price_per_meal", 0),
            data.get("remaining_qty", 0),
            data.get("km", 0.0),
            data.get("collect_by", ""),
        )
        _, session = get_or_create(phone, "buyer", buyer_lang)
        update_session(session["session_id"], last_ref_id=donation_id)
        await send_buttons(phone, body, [
            {"id": f"claim_1_{donation_id}", "title": "CLAIM 1"},
            {"id": f"claim_2_{donation_id}", "title": "CLAIM 2"},
            {"id": f"claim_3_{donation_id}", "title": "CLAIM 3"},
        ])


async def _on_deal_claimed(donation_id, data):
    donor_id = data.get("donor_id")
    phone    = _donor_phone(donor_id)
    if phone:
        lang  = _donor_lang(donor_id)
        buyer = data.get("buyer_name", "someone")
        qty   = data.get("qty", 0)
        otp   = data.get("otp", "----")
        await send_text(phone, T.deal_donor_notified(lang, buyer, qty, otp))


async def _on_diversion_offered(donation_id, data):
    partner_id = data.get("partner_id")
    phone      = _partner_phone(partner_id)
    if not phone:
        return
    lang = "hi"
    body = T.diversion_offer(
        lang,
        data.get("qty_kg", 0.0),
        data.get("food_type", ""),
        data.get("pickup_address", ""),
    )
    _, session = get_or_create(phone, "partner", lang)
    update_session(session["session_id"],
                   intent="awaiting_diversion",
                   last_ref_id=donation_id)
    await send_buttons(phone, body, [{"id": f"accept_div_{donation_id}", "title": "ACCEPT ✅"}])


# ─── Language helpers ─────────────────────────────────────────────────────────

def _donor_lang(donor_id: str) -> str:
    for d in DEMO_ACCOUNTS["donors"]:
        if d["id"] == donor_id:
            return d.get("lang", "en")
    return "en"


def _driver_lang(driver_id: str) -> str:
    return "hi"   # drivers default to Hinglish


def _buyer_lang(phone: str) -> str:
    for b in DEMO_ACCOUNTS["buyers"]:
        if b["phone"] == phone:
            return b.get("lang", "en")
    return "en"


# ─── Background WebSocket listener ───────────────────────────────────────────

async def _listen_forever():
    backoff = 2
    while True:
        try:
            logger.info("Connecting to backend WS: %s", BACKEND_WS_URL)
            async with websockets.connect(BACKEND_WS_URL, ping_interval=30) as ws:
                backoff = 2   # reset on successful connect
                async for raw in ws:
                    try:
                        event = json.loads(raw)
                        asyncio.create_task(dispatch(event))
                    except json.JSONDecodeError:
                        logger.warning("Non-JSON WS message: %s", raw[:100])
        except Exception as exc:
            logger.warning("WS disconnected: %s. Retrying in %ds.", exc, backoff)
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, 60)


def start_notify_listener(loop: asyncio.AbstractEventLoop | None = None):
    """
    Schedule the WS listener as a background task.
    Call this from the FastAPI lifespan startup.
    """
    asyncio.create_task(_listen_forever())
    logger.info("Notify listener started.")
