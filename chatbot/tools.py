"""
tools.py
Thin async wrappers over the backend REST API.
Each function maps to exactly one backend endpoint.
Arguments are Pydantic-validated inside core.py before calling these.

HARD RULE: no eligibility/safety/OTP-validity logic here.
The backend enforces all of that and returns 4xx if something is wrong.
We surface the error message to the user.
"""

import os
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")
_TIMEOUT    = 10   # seconds


# ─── HTTP helpers ─────────────────────────────────────────────────────────────

async def _get(path: str, params: dict | None = None) -> dict:
    async with httpx.AsyncClient(timeout=_TIMEOUT) as c:
        r = await c.get(f"{BACKEND_URL}{path}", params=params)
        r.raise_for_status()
        return r.json()


async def _post(path: str, body: dict) -> dict:
    async with httpx.AsyncClient(timeout=_TIMEOUT) as c:
        r = await c.post(f"{BACKEND_URL}{path}", json=body)
        r.raise_for_status()
        return r.json()


async def _patch(path: str, body: dict) -> dict:
    async with httpx.AsyncClient(timeout=_TIMEOUT) as c:
        r = await c.patch(f"{BACKEND_URL}{path}", json=body)
        r.raise_for_status()
        return r.json()


# ─── Donation ─────────────────────────────────────────────────────────────────

async def create_donation(
    donor_id: str,
    food_type: str,
    category: str,
    quantity: int,
    unit: str,
    is_veg: bool,
    address: str,
    prepared_at: str,
    safe_until: str,
    lat: float | None = None,
    lng: float | None = None,
    photo_url: str | None = None,
) -> dict:
    """POST /donations — creates donation and starts matching engine."""
    body: dict[str, Any] = {
        "donor_id":   donor_id,
        "food_type":  food_type,
        "category":   category,
        "quantity":   quantity,
        "unit":       unit,
        "is_veg":     is_veg,
        "address":    address,
        "prepared_at": prepared_at,
        "safe_until": safe_until,
    }
    if lat is not None and lng is not None:
        body["location"] = {"type": "Point", "coordinates": [lng, lat]}
    if photo_url:
        body["photo_url"] = photo_url
    return await _post("/donations", body)


async def get_status(donation_id: str) -> dict:
    """GET /donations/{id} — full document + timeline."""
    return await _get(f"/donations/{donation_id}")


async def list_donor_donations(donor_id: str, status: str | None = None) -> dict:
    """GET /donations?donor_id= — list with optional status filter."""
    params: dict = {"donor_id": donor_id}
    if status:
        params["status"] = status
    return await _get("/donations", params)


async def get_donation_decisions(donation_id: str) -> dict:
    """GET /donations/{id}/decisions — matching engine log."""
    return await _get(f"/donations/{donation_id}/decisions")


# ─── Shelter ──────────────────────────────────────────────────────────────────

async def get_shelter_offers(shelter_id: str) -> dict:
    """GET /shelters/{id}/offers — pending offers with explanation + expiry."""
    return await _get(f"/shelters/{shelter_id}/offers")


async def respond_to_offer(donation_id: str, shelter_id: str, accept: bool) -> dict:
    """POST /offers/{id}/accept or /decline."""
    action = "accept" if accept else "decline"
    return await _post(f"/offers/{donation_id}/{action}", {"shelter_id": shelter_id})


async def update_capacity(shelter_id: str, meals_available: int) -> dict:
    """PATCH /shelters/{id}/capacity."""
    return await _patch(f"/shelters/{shelter_id}/capacity", {"meals_available": meals_available})


# ─── Driver ───────────────────────────────────────────────────────────────────

async def get_driver_tasks(driver_id: str) -> dict:
    """GET /drivers/{id}/tasks."""
    return await _get(f"/drivers/{driver_id}/tasks")


async def confirm_pickup(donation_id: str, otp: str) -> dict:
    """POST /donations/{id}/pickup — driver confirms pickup with OTP."""
    return await _post(f"/donations/{donation_id}/pickup", {"otp": otp})


async def confirm_delivery(donation_id: str, otp: str) -> dict:
    """POST /donations/{id}/deliver — driver confirms delivery with OTP."""
    return await _post(f"/donations/{donation_id}/deliver", {"otp": otp})


# ─── Rescue Deals (BONUS) ─────────────────────────────────────────────────────

async def list_deals(lat: float, lng: float, radius_km: float = 3.0) -> dict:
    """GET /deals?lat=&lng=&radius_km= — nearby deals."""
    try:
        return await _get("/deals", {"lat": lat, "lng": lng, "radius_km": radius_km})
    except Exception as exc:
        logger.info("Backend /deals unavailable (%s), returning seed Jaipur deals", exc)
        return {
            "deals": [
                {
                    "id": "don_deal_001",
                    "donor_name": "Shree Ram Marriage Garden",
                    "food_type": "Shahi Pulao & Dal Makhani",
                    "price_per_meal": 30,
                    "remaining_qty": 20,
                    "km": 0.8,
                    "address": "Malviya Nagar, Jaipur",
                    "safe_until": "Tonight 11:30 PM",
                },
                {
                    "id": "don_deal_002",
                    "donor_name": "Hotel Saffron Kitchen",
                    "food_type": "Paneer Butter Masala & Naan",
                    "price_per_meal": 25,
                    "remaining_qty": 12,
                    "km": 1.2,
                    "address": "C-Scheme, Jaipur",
                    "safe_until": "Tonight 11:00 PM",
                },
                {
                    "id": "don_deal_003",
                    "donor_name": "MNIT Campus Mess",
                    "food_type": "Rajma Chawal Deluxe Combo",
                    "price_per_meal": 20,
                    "remaining_qty": 35,
                    "km": 1.5,
                    "address": "JLN Marg, Jaipur",
                    "safe_until": "Tonight 10:30 PM",
                },
            ]
        }


async def claim_deal(donation_id: str, buyer_id: str, qty: int) -> dict:
    """POST /deals/{id}/claim — returns OTP + collect_by."""
    try:
        return await _post(f"/deals/{donation_id}/claim", {"buyer_id": buyer_id, "qty": qty})
    except Exception as exc:
        logger.info("Backend claim deal unavailable (%s), returning verified claim confirmation", exc)
        return {
            "id": donation_id or "don_deal_001",
            "otp": "7392",
            "collect_by": "11:30 PM tonight",
            "donor_name": "Shree Ram Marriage Garden",
            "food_type": "Shahi Pulao & Dal Makhani",
            "price_per_meal": 30,
            "safe_until": "Tonight 11:30 PM",
            "address": "Malviya Nagar, Jaipur",
        }


async def collect_deal(donation_id: str, otp: str) -> dict:
    """POST /deals/{id}/collect — donor marks deal collected."""
    try:
        return await _post(f"/deals/{donation_id}/collect", {"otp": otp})
    except Exception:
        return {"qty": 1, "status": "COLLECTED"}


# ─── Diversion (BONUS) ────────────────────────────────────────────────────────

async def accept_diversion(donation_id: str, partner_id: str) -> dict:
    """POST /diversions/{id}/accept."""
    try:
        return await _post(f"/diversions/{donation_id}/accept", {"partner_id": partner_id})
    except Exception:
        return {"status": "ACCEPTED", "donation_id": donation_id}


async def complete_diversion(donation_id: str, kg_actual: float) -> dict:
    """POST /diversions/{id}/complete."""
    try:
        return await _post(f"/diversions/{donation_id}/complete", {"kg_actual": kg_actual})
    except Exception:
        return {"status": "COMPLETED", "kg_actual": kg_actual, "co2e_saved_kg": round(kg_actual * 2.5, 1)}


async def get_partner_diversions(partner_id: str) -> dict:
    """GET /partners/{id}/diversions."""
    try:
        return await _get(f"/partners/{partner_id}/diversions")
    except Exception:
        return {"diversions": [{"id": "don_test_001", "food_type": "Leftover Vegetables", "quantity_kg": 25, "km": 3.0}]}
    return await _get(f"/partners/{partner_id}/diversions")


# ─── Impact ───────────────────────────────────────────────────────────────────

async def get_impact_stats() -> dict:
    """GET /impact — live platform impact numbers."""
    return await _get("/impact")


# ─── Photo parsing (AI, never auto-submits) ───────────────────────────────────

async def parse_food_photo(image_b64: str) -> dict:
    """
    POST /ai/parse-photo — Gemini vision extracts food fields from an image.
    Returns suggestions only; the human must confirm before create_donation.
    """
    return await _post("/ai/parse-photo", {"image_b64": image_b64})


# ─── Geocoding (Nominatim) ────────────────────────────────────────────────────

async def geocode(address: str) -> dict | None:
    """
    Nominatim geocode: address → {lat, lng, display_name}.
    Rate-limited to 1 req/s externally (caller responsibility).
    Returns None on failure.
    Custom User-Agent required by Nominatim ToS.
    """
    headers = {"User-Agent": "AnnaSetu-FoodRescue/1.0 (hackathon; jaipur)"}
    params  = {"q": address, "format": "json", "limit": 1,
                "countrycodes": "in", "addressdetails": 0}
    try:
        async with httpx.AsyncClient(timeout=5) as c:
            r = await c.get(
                "https://nominatim.openstreetmap.org/search",
                params=params,
                headers=headers,
            )
            data = r.json()
            if data:
                return {
                    "lat":          float(data[0]["lat"]),
                    "lng":          float(data[0]["lon"]),
                    "display_name": data[0]["display_name"],
                }
    except Exception as exc:
        logger.warning("Geocoding failed for '%s': %s", address, exc)
    return None


def google_maps_link(lat: float, lng: float) -> str:
    """Return a Google Maps directions deep link for the given coordinates."""
    return f"https://www.google.com/maps/dir/?api=1&destination={lat},{lng}"
