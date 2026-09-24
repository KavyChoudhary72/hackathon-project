"""
fallback.py
Deterministic regex-based keyword router.
Runs BEFORE the LLM call, and also as the fallback if the LLM times out (6s).

This ensures the demo survives a complete LLM outage:
  HAAN / NAHI / OTP / capacity / status / help / deals / claim → always work.

Returns None if no pattern matches (caller should then try the LLM).
"""

import re
import logging
from typing import Optional

from lang import is_yes, is_no
from templates import T

logger = logging.getLogger(__name__)

# ─── OTP pattern ──────────────────────────────────────────────────────────────
_OTP_RE      = re.compile(r"^\s*(\d{4,6})\s*$")
_CAPACITY_RE = re.compile(r"\bcapacity\s+(\d+)\b|\b(\d+)\s*(meals?|le\s+sakte|le\s*skte)\b", re.IGNORECASE)
_STATUS_RE   = re.compile(r"\b(status|sthiti|kahan|kahan\s+hai|track)\b", re.IGNORECASE)
_HELP_RE     = re.compile(r"\b(help|madad|menu|options|kya\s+kar\s+sakta|kya\s+kar\s+sakte)\b", re.IGNORECASE)
_IMPACT_RE   = re.compile(r"\b(impact|meals?\s+saved|co2|carbon|diverted|kitne\s+meals|stats?)\b", re.IGNORECASE)
_DEALS_RE    = re.compile(
    r"\b(deals?|rescue\s+deal|khaana\s+sasta|sasta\s+khaana|deals?\s+near\s+me|"
    r"hotel|hotels|restaurant|restaurants|food|khana|khaana|sasta|cheap|near\s*me|nearby|"
    r"malviya|maviya|raja\s*park|mansarovar|vaishali|c-?scheme|bani\s*park|tonk\s*road|"
    r"jagatpura|sitapura|sodala|302020|302004|302017|302015|302001)\b",
    re.IGNORECASE,
)
_CLAIM_RE    = re.compile(
    r"\b(?:claim|order|book|reserve|buy|get)\s*(\d+)?\b|"
    r"^\s*([1-3])\s*$|"
    r"\b(\d+)\s*(?:plate|plates|meals?|thali|deal)\b",
    re.IGNORECASE,
)
_COLLECT_RE  = re.compile(r"\bcollect\s+(\d{4,6})\b", re.IGNORECASE)
_DONE_KG_RE  = re.compile(r"\b(done|ho\s+gaya|complete|khatam)\s+(\d+(?:\.\d+)?)\s*(kg|kilo|kilogram)\b", re.IGNORECASE)
_ACCEPT_RE   = re.compile(r"\b(accept|le\s+lenge|le\s+lete\s+hain)\b", re.IGNORECASE)
_PICKUP_RE   = re.compile(r"\b(pahuch\s+gaya|pahuncha|pahuchi|reached|pickup\s+done|picked|aagaya|aa\s+gaya)\b", re.IGNORECASE)
_TASK_RE     = re.compile(r"\b(tasks?|mera\s+kaam|assignments?|kya\s+karna\s+hai)\b", re.IGNORECASE)


class FallbackResult:
    """Container returned by the fallback router."""

    def __init__(
        self,
        intent: str,
        reply: str | None = None,
        action: str | None = None,
        params: dict | None = None,
        quick_replies: list[str] | None = None,
    ):
        self.intent        = intent
        self.reply         = reply
        self.action        = action       # action tag for core.py to execute
        self.params        = params or {}
        self.quick_replies = quick_replies or []


def route(
    text: str,
    role: str,
    lang: str,
    session: dict,
) -> Optional[FallbackResult]:
    """
    Try to match text against known patterns.

    Returns FallbackResult if matched, None if the LLM should handle it.
    """
    t = text.strip()
    tl = t.lower()

    # ── HAAN / NAHI (affirmative / negative) ──────────────────────────────────
    if is_yes(tl):
        intent = session.get("intent")
        if intent == "awaiting_donation_confirm":
            return FallbackResult("confirm_donation", action="create_donation",
                                  quick_replies=["Check status", "View impact"])
        if intent == "awaiting_offer_response" and role == "shelter":
            return FallbackResult("accept_offer", action="accept_offer",
                                  params={"donation_id": session.get("last_ref_id")},
                                  reply=None)
        if intent == "awaiting_diversion" and role == "partner":
            return FallbackResult("accept_diversion", action="accept_diversion",
                                  params={"donation_id": session.get("last_ref_id")})
        if intent == "awaiting_location_confirm":
            return FallbackResult("location_confirmed", action="location_confirmed")
        # Generic yes with no pending intent
        return FallbackResult("generic_yes",
                              reply=T.help_menu(lang, role),
                              quick_replies=_qr(role))

    if is_no(tl):
        intent = session.get("intent")
        if intent == "awaiting_donation_confirm":
            return FallbackResult("cancel_donation", action="reset_draft",
                                  reply=_pick(lang, "Theek hai, draft clear kar diya. Dobara shuru karein.",
                                              "Theek hai, draft clear kar diya. Dobara shuru karein.",
                                              "Ok, draft cleared. Let's start over."))
        if intent == "awaiting_offer_response" and role == "shelter":
            return FallbackResult("decline_offer", action="decline_offer",
                                  params={"donation_id": session.get("last_ref_id")})
        return FallbackResult("generic_no",
                              reply=T.help_menu(lang, role),
                              quick_replies=_qr(role))

    # ── OTP (4–6 digits alone) ────────────────────────────────────────────────
    m = _OTP_RE.match(t)
    if m:
        otp = m.group(1)
        intent = session.get("intent", "")
        if role == "driver":
            if "pickup" in intent or not intent:
                return FallbackResult("otp_pickup", action="confirm_pickup",
                                      params={"otp": otp,
                                              "donation_id": session.get("last_ref_id")})
            return FallbackResult("otp_delivery", action="confirm_delivery",
                                  params={"otp": otp,
                                          "donation_id": session.get("last_ref_id")})
        # Shelter receiving delivery OTP from driver
        if role == "shelter":
            return FallbackResult("otp_delivery_verify", action="confirm_delivery",
                                  params={"otp": otp,
                                          "donation_id": session.get("last_ref_id")})
        return None   # other roles: let LLM decide

    # ── "collect XXXX" (donor collecting rescue deal) ─────────────────────────
    m = _COLLECT_RE.search(tl)
    if m and role == "donor":
        return FallbackResult("collect_deal", action="collect_deal",
                              params={"otp": m.group(1),
                                      "donation_id": session.get("last_ref_id")})

    # ── "done X kg" (partner completing diversion) ────────────────────────────
    m = _DONE_KG_RE.search(tl)
    if m and role == "partner":
        kg = float(m.group(2))
        return FallbackResult("complete_diversion", action="complete_diversion",
                              params={"kg_actual": kg,
                                      "donation_id": session.get("last_ref_id")})

    # ── Capacity update (shelter) ─────────────────────────────────────────────
    m = _CAPACITY_RE.search(tl)
    if m and role == "shelter":
        meals = int(m.group(1) or m.group(2))
        return FallbackResult("update_capacity", action="update_capacity",
                              params={"meals": meals})

    # ── "accept" keyword (shelter / partner, not HAAN) ───────────────────────
    if _ACCEPT_RE.search(tl):
        if role == "shelter" and session.get("intent") == "awaiting_offer_response":
            return FallbackResult("accept_offer", action="accept_offer",
                                  params={"donation_id": session.get("last_ref_id")})
        if role == "partner" and session.get("intent") == "awaiting_diversion":
            return FallbackResult("accept_diversion", action="accept_diversion",
                                  params={"donation_id": session.get("last_ref_id")})

    # ── "pahuch gaya" / pickup keywords (driver) ─────────────────────────────
    if _PICKUP_RE.search(tl) and role == "driver":
        return FallbackResult("arrived_pickup", action=None,
                              reply=_pick(lang,
                                          "Donor se Pickup OTP lein aur bhejein.",
                                          "Donor se Pickup OTP lein aur bhejein.",
                                          "Ask the donor for the Pickup OTP and send it here."))

    # ── tasks (driver) ────────────────────────────────────────────────────────
    if _TASK_RE.search(tl) and role == "driver":
        return FallbackResult("get_tasks", action="get_driver_tasks")

    # ── claim (buyer) ─────────────────────────────────────────────────────────
    m = _CLAIM_RE.search(tl)
    if m and role == "buyer":
        raw_qty = next((g for g in m.groups() if g is not None), "1")
        try:
            qty = int(raw_qty)
        except Exception:
            qty = 1
        return FallbackResult("claim_deal", action="claim_rescue_deal",
                              params={"qty": qty,
                                      "donation_id": session.get("last_ref_id")})

    # ── deals near me / locality search (buyer) ───────────────────────────────
    if _DEALS_RE.search(tl) or (role == "buyer" and len(tl) < 35 and not tl.startswith("/")):
        return FallbackResult("list_deals", action="get_rescue_deals")

    # ── status ────────────────────────────────────────────────────────────────
    if _STATUS_RE.search(tl):
        return FallbackResult("status", action="get_status")

    # ── impact ────────────────────────────────────────────────────────────────
    if _IMPACT_RE.search(tl):
        return FallbackResult("impact", action="get_impact_stats")

    # ── help ─────────────────────────────────────────────────────────────────
    if _HELP_RE.search(tl):
        return FallbackResult("help",
                              reply=T.help_menu(lang, role),
                              quick_replies=_qr(role))

    # ── No pattern matched ────────────────────────────────────────────────────
    return None


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _pick(lang: str, hi: str, hinglish: str, en: str) -> str:
    if lang == "hi":
        return hi
    if lang == "hinglish":
        return hinglish
    return en


def _qr(role: str) -> list[str]:
    qrs = {
        "donor":   ["Post donation", "Check status", "View impact"],
        "shelter": ["View offers", "Update capacity", "Status"],
        "driver":  ["View tasks", "Confirm OTP"],
        "buyer":   ["Deals near me", "Claim deal"],
        "partner": ["View diversions", "Status"],
    }
    return qrs.get(role, qrs["donor"])
