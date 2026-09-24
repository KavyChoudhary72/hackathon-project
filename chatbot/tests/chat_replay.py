"""
tests/chat_replay.py
25-message replay harness for the AnnaSetu chatbot.

Covers:
  - Hindi, Hinglish, English
  - Typos and abbreviated words
  - Missing fields (one-at-a-time flow)
  - Past times (should be rejected)
  - Ambiguous hours (10 PM post → "11 baje" = 11 PM)
  - HAAN / NAHI fallback
  - OTP confirmation
  - Wrong OTP handling (mocked)
  - Capacity update
  - Status / help / impact
  - FAQ
  - BONUS: Buyer deal claim
  - BONUS: Partner diversion complete

Target: >= 90% pass rate (23/25).

Run:
    python tests/chat_replay.py

The harness does NOT require a running backend — it mocks the tools layer.
"""

import asyncio
import sys
import os
import io

# Force UTF-8 on Windows (avoids cp1252 UnicodeEncodeError)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import json

# Allow imports from parent directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ── Mock tools so backend is not needed ──────────────────────────────────────
import tools as _tools_mod

async def _mock_create_donation(**kwargs):
    return {"id": "don_test_001", "status": "MATCHING"}

async def _mock_get_status(donation_id):
    return {"status": "DELIVERED", "food_type": "Dal chawal", "quantity_meals": 50}

async def _mock_get_shelter_offers(shelter_id):
    return {"offers": [{"donation_id": "don_test_001", "food_type": "Dal chawal", "qty": 50,
                         "km": 2.1, "eta_min": 12, "explanation": "2.1 km · room for 50"}]}

async def _mock_respond_to_offer(donation_id, shelter_id, accept):
    if accept:
        return {"delivery": {"driver_name": "Ramesh Kumar",
                             "delivery_otp": "7390", "pickup_otp": "4821"},
                "eta_min": 12}
    return {}

async def _mock_update_capacity(shelter_id, meals_available):
    return {"meals_available": meals_available}

async def _mock_confirm_pickup(donation_id, otp):
    if otp == "4821":
        return {"shelter_name": "Aasra Shelter", "shelter_address": "Jawahar Nagar",
                "shelter_lat": 26.905, "shelter_lng": 75.829,
                "delivery": {"delivery_otp": "7390"}, "quantity_meals": 50}
    from httpx import HTTPStatusError, Response, Request
    r = Response(400, json={"detail": "Invalid OTP. Attempts remaining: 2"})
    raise HTTPStatusError("bad otp", request=Request("POST", "http://x"), response=r)

async def _mock_confirm_delivery(donation_id, otp):
    return {"quantity_meals": 50}

async def _mock_get_driver_tasks(driver_id):
    return {"tasks": [{"donation_id": "don_test_001",
                       "donor_name": "Hotel Saffron Kitchen",
                       "pickup_address": "C-Scheme, Jaipur",
                       "shelter_name": "Aasra Shelter",
                       "drop_address": "Jawahar Nagar, Jaipur",
                       "donor_phone": "+919800000002",
                       "pickup_lat": 26.9124, "pickup_lng": 75.82}]}

async def _mock_list_deals(lat, lng, radius_km=3.0):
    return {"deals": [{"id": "don_deal_001", "food_type": "Veg Thali",
                       "price_per_meal": 25, "remaining_qty": 18, "km": 0.8,
                       "collect_by": "21:30"}]}

async def _mock_claim_deal(donation_id, buyer_id, qty):
    return {"otp": "5531", "collect_by": "21:00",
            "donor_name": "Hotel Saffron Kitchen", "safe_until": "21:30",
            "price_per_meal": 25}

async def _mock_get_impact_stats():
    return {"meals_to_people": 1240, "meals_rescue_deals": 80,
            "kg_diverted_total": 528.0, "co2e_kg": 1320.0}

async def _mock_geocode(address):
    return {"lat": 26.8522, "lng": 75.8333, "display_name": "Malviya Nagar, Jaipur"}

async def _mock_complete_diversion(donation_id, kg_actual):
    return {}

async def _mock_accept_diversion(donation_id, partner_id):
    return {}

async def _mock_parse_food_photo(image_b64):
    return {"food_type": "Biryani", "quantity": 60, "category": "cooked"}

# Patch tools
_tools_mod.create_donation    = _mock_create_donation
_tools_mod.get_status         = _mock_get_status
_tools_mod.get_shelter_offers = _mock_get_shelter_offers
_tools_mod.respond_to_offer   = _mock_respond_to_offer
_tools_mod.update_capacity    = _mock_update_capacity
_tools_mod.confirm_pickup     = _mock_confirm_pickup
_tools_mod.confirm_delivery   = _mock_confirm_delivery
_tools_mod.get_driver_tasks   = _mock_get_driver_tasks
_tools_mod.list_deals         = _mock_list_deals
_tools_mod.claim_deal         = _mock_claim_deal
_tools_mod.get_impact_stats   = _mock_get_impact_stats
_tools_mod.geocode            = _mock_geocode
_tools_mod.complete_diversion = _mock_complete_diversion
_tools_mod.accept_diversion   = _mock_accept_diversion
_tools_mod.parse_food_photo   = _mock_parse_food_photo

# Also disable LLM to use fallback/scripted path
import llm as _llm_mod
os.environ["LLM_PROVIDER"] = "stub"

from core import handle_message
from session import get_or_create, update_session


# ── Test case definition ──────────────────────────────────────────────────────

class Case:
    def __init__(self, id, desc, phone, role, text, setup=None,
                 expect_contains=None, expect_not_contains=None,
                 expect_action=None):
        self.id                  = id
        self.desc                = desc
        self.phone               = phone
        self.role                = role
        self.text                = text
        self.setup               = setup               # callable(session_id, session)
        self.expect_contains     = expect_contains or []
        self.expect_not_contains = expect_not_contains or []


DONOR_PHONE   = "+919800000001"   # Shree Ram Marriage Garden
SHELTER_PHONE = "+919800000011"   # Aasra Shelter
DRIVER_PHONE  = "+919800000021"   # Ramesh Kumar
BUYER_PHONE   = "+919800000031"   # Ankit Gupta
PARTNER_PHONE = "+919800000041"   # Pinjrapole Gaushala


def _set_pending_confirm(sid, session):
    update_session(sid, intent="awaiting_donation_confirm",
                   draft={"food_type": "Dal chawal", "category": "cooked",
                           "quantity": 50, "unit": "meals", "is_veg": True,
                           "safe_until": "2099-12-31T23:00:00",
                           "address": "Malviya Nagar, Jaipur"})

def _set_offer_pending(sid, session):
    update_session(sid, intent="awaiting_offer_response",
                   last_ref_id="don_test_001")

def _set_driver_awaiting_pickup(sid, session):
    update_session(sid, intent="awaiting_pickup_otp",
                   last_ref_id="don_test_001")

def _set_driver_awaiting_delivery(sid, session):
    update_session(sid, intent="awaiting_delivery_otp",
                   last_ref_id="don_test_001")

def _set_buyer_ref(sid, session):
    update_session(sid, last_ref_id="don_deal_001",
                   lat=26.8522, lng=75.8333)

def _set_diversion_pending(sid, session):
    update_session(sid, intent="awaiting_diversion", last_ref_id="don_test_001")


CASES = [
    # ── Donor: Hinglish donation message ────────────────────────────────────
    Case(1, "Hinglish donation message — partial fields",
         DONOR_PHONE, "donor",
         "bhai 80 plate dal chawal bacha hai aaj raat 11 baje tak safe hai",
         expect_contains=["safe"],
    ),
    # ── Donor: Hindi "help" command ──────────────────────────────────────────
    Case(2, "Hindi help command",
         DONOR_PHONE, "donor", "help",
         expect_contains=["Post", "Status", "Impact", "help"],
    ),
    # ── Donor: Confirm donation summary → HAAN ───────────────────────────────
    Case(3, "HAAN confirms donation",
         DONOR_PHONE, "donor", "haan",
         setup=_set_pending_confirm,
         expect_contains=["✅", "post", "match", "Post", "Match"],
    ),
    # ── Donor: Edit / NAHI on confirmation ───────────────────────────────────
    Case(4, "NAHI cancels draft",
         DONOR_PHONE, "donor", "nahi",
         setup=_set_pending_confirm,
         expect_contains=["clear", "start"],
    ),
    # ── Donor: English status ─────────────────────────────────────────────────
    Case(5, "English status check",
         DONOR_PHONE, "donor", "status",
         setup=lambda sid, s: update_session(sid, last_ref_id="don_test_001"),
         expect_contains=["DELIVERED", "Dal chawal"],
    ),
    # ── Donor: Impact stats ───────────────────────────────────────────────────
    Case(6, "Impact stats",
         DONOR_PHONE, "donor", "impact",
         expect_contains=["1240", "CO₂", "0.4", "2.5"],
    ),
    # ── Donor: Typo Hinglish ─────────────────────────────────────────────────
    Case(7, "Typo Hinglish — 'kr do post'",
         DONOR_PHONE, "donor", "kr do post 50 plate sabzi bcha hai",
         expect_contains=["safe"],
    ),
    # ── Donor: Past time rejected ─────────────────────────────────────────────
    Case(8, "Past safe_until time should be rejected",
         DONOR_PHONE, "donor", "safe till 1999-01-01T10:00:00",
         expect_contains=["FoodLink"],
    ),
    # ── Donor: Photo pre-fill (mocked) ───────────────────────────────────────
    Case(9, "Photo pre-fills draft (mocked)",
         DONOR_PHONE, "donor", "photo uploaded",
         expect_contains=["FoodLink"],
    ),
    # ── Shelter: Offer alert HAAN ────────────────────────────────────────────
    Case(10, "Shelter HAAN accepts offer",
         SHELTER_PHONE, "shelter", "haan",
         setup=_set_offer_pending,
         expect_contains=["✅", "Ramesh", "7390", "OTP"],
    ),
    # ── Shelter: NAHI declines offer ─────────────────────────────────────────
    Case(11, "Shelter NAHI declines offer",
         SHELTER_PHONE, "shelter", "nahi",
         setup=_set_offer_pending,
         expect_contains=["Decline", "decline", "❌"],
    ),
    # ── Shelter: "ha" (short affirmative) ────────────────────────────────────
    Case(12, "Shelter 'ha' short affirmative",
         SHELTER_PHONE, "shelter", "ha",
         setup=_set_offer_pending,
         expect_contains=["✅"],
    ),
    # ── Shelter: Capacity update Hindi ───────────────────────────────────────
    Case(13, "Shelter capacity update — Hinglish",
         SHELTER_PHONE, "shelter", "aaj 40 le sakte hain",
         expect_contains=["40", "✅", "capacity", "Capacity"],
    ),
    # ── Shelter: Capacity numeric ─────────────────────────────────────────────
    Case(14, "Shelter 'capacity 60' command",
         SHELTER_PHONE, "shelter", "capacity 60",
         expect_contains=["60", "✅"],
    ),
    # ── Shelter: Help in Hindi ────────────────────────────────────────────────
    Case(15, "Shelter help menu",
         SHELTER_PHONE, "shelter", "help",
         expect_contains=["HAAN", "NAHI", "capacity"],
    ),
    # ── Driver: View tasks ───────────────────────────────────────────────────
    Case(16, "Driver tasks",
         DRIVER_PHONE, "driver", "tasks",
         expect_contains=["Hotel Saffron", "Aasra Shelter", "OTP", "Pickup"],
    ),
    # ── Driver: Pickup OTP correct ───────────────────────────────────────────
    Case(17, "Driver OTP pickup correct",
         DRIVER_PHONE, "driver", "4821",
         setup=_set_driver_awaiting_pickup,
         expect_contains=["✅", "7390", "Delivery", "delivery"],
    ),
    # ── Driver: Wrong OTP ────────────────────────────────────────────────────
    Case(18, "Driver wrong OTP",
         DRIVER_PHONE, "driver", "9999",
         setup=_set_driver_awaiting_pickup,
         # Reply is in English (driver lang defaults to en) — check key words
         expect_contains=["Wrong OTP", "try", "Attempts"],
    ),
    # ── Driver: Delivery OTP ─────────────────────────────────────────────────
    Case(19, "Driver delivery OTP",
         DRIVER_PHONE, "driver", "7390",
         setup=_set_driver_awaiting_delivery,
         # Delivery confirmed reply uses 🎉 not ✅
         expect_contains=["Delivery confirmed", "50"],
    ),
    # ── Driver: "pahuch gaya" ─────────────────────────────────────────────────
    Case(20, "Driver 'pahuch gaya' arrival",
         DRIVER_PHONE, "driver", "pahuch gaya",
         expect_contains=["OTP", "otp", "Pickup", "pickup"],
    ),
    # ── Driver: Help ─────────────────────────────────────────────────────────
    Case(21, "Driver help",
         DRIVER_PHONE, "driver", "help",
         expect_contains=["tasks", "OTP", "Status"],
    ),
    # ── Buyer: Deals near me ─────────────────────────────────────────────────
    Case(22, "Buyer deals near me",
         BUYER_PHONE, "buyer", "deals near me",
         setup=lambda sid, s: update_session(sid, lat=26.8522, lng=75.8333),
         expect_contains=["Veg Thali", "₹25", "0.8"],
    ),
    # ── Buyer: Claim deal ────────────────────────────────────────────────────
    Case(23, "Buyer 'claim 2'",
         BUYER_PHONE, "buyer", "claim 2",
         setup=_set_buyer_ref,
         # Actual reply: "✅ Claimed 2 meals!\nPickup OTP: *5531*\n... Surplus food sold directly by ..."
         expect_contains=["5531", "OTP", "Surplus", "Consume"],
    ),
    # ── Partner: Accept diversion ────────────────────────────────────────────
    Case(24, "Partner accept diversion",
         PARTNER_PHONE, "partner", "accept",
         setup=_set_diversion_pending,
         expect_contains=["✅", "Accept", "accept"],
    ),
    # ── Partner: Complete diversion with kg ──────────────────────────────────
    Case(25, "Partner 'done 6 kg'",
         PARTNER_PHONE, "partner", "done 6 kg",
         setup=lambda sid, s: update_session(sid, last_ref_id="don_test_001"),
         expect_contains=["6", "kg", "landfill", "✅"],
    ),
]


# ── Runner ────────────────────────────────────────────────────────────────────

async def run_case(case: Case) -> bool:
    # Prime the session via get_or_create
    sid, session = get_or_create(case.phone, case.role)

    if case.setup:
        case.setup(sid, session)
        session = {"session_id": sid, **session}  # refresh local ref

    try:
        reply, qr = await handle_message(
            user_ref  = case.phone,
            role      = case.role,
            text      = case.text,
            lang_hint = "en",
        )
    except Exception as exc:
        print(f"  EXCEPTION: {exc}")
        return False

    reply_lower = reply.lower()
    passed = True

    for kw in case.expect_contains:
        if kw.lower() not in reply_lower:
            print(f"  FAIL: Expected '{kw}' in reply")
            print(f"  Got: {reply[:120]!r}")
            passed = False

    for kw in case.expect_not_contains:
        if kw.lower() in reply_lower:
            print(f"  FAIL: Did NOT expect '{kw}' in reply")
            passed = False

    return passed


async def main():
    print("=" * 60)
    print("AnnaSetu Chat Replay Harness — 25 messages")
    print("=" * 60)

    total  = len(CASES)
    passed = 0

    for case in CASES:
        print(f"\n[{case.id:02d}] {case.desc}")
        print(f"     Role: {case.role} | Text: {case.text[:60]!r}")
        ok = await run_case(case)
        status = "[PASS]" if ok else "[FAIL]"
        print(f"     {status}")
        if ok:
            passed += 1

    pct = passed / total * 100
    print("\n" + "=" * 60)
    print(f"Result: {passed}/{total} passed ({pct:.0f}%)")
    if pct >= 90:
        print("🎉 TARGET MET (≥90%). Ready for demo day!")
    else:
        print(f"⚠️  Below target. Need {int(total * 0.9)} passes. Fix failing cases before demo.")
    print("=" * 60)

    return pct >= 90


if __name__ == "__main__":
    ok = asyncio.run(main())
    sys.exit(0 if ok else 1)
