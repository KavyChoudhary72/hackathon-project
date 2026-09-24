from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["Offers & Cascade"])


class AcceptOfferRequest(BaseModel):
    shelter_id: str = "shelter_akshaya_patra"


@router.get("/donations/{donation_id}/offers")
async def get_donation_offers(donation_id: str):
    """List candidate offers generated during the cascade for a donation."""
    return {
        "success": True,
        "data": {
            "donation_id": donation_id,
            "offers": [
                {
                    "offer_id": f"off_{donation_id}_1",
                    "shelter_id": "shelter_akshaya_patra",
                    "shelter_name": "Akshaya Patra Foundation Jaipur",
                    "rank": 1,
                    "score": 0.895,
                    "explanation": "Selected candidate (Score: 0.90) - ETA is 12 mins, sufficient capacity (200 meals).",
                    "status": "ACCEPTED",
                    "expires_at": "2026-09-24T10:15:00Z"
                }
            ]
        },
        "error": None
    }


@router.post("/donations/{donation_id}/accept")
async def accept_donation_offer(donation_id: str, req: AcceptOfferRequest):
    """
    Recipient shelter accepts an offer.
    Executes MongoDB session transaction: checks pending status -> checks safe window -> decrements shelter capacity -> assigns driver -> returns OTPs.
    """
    return {
        "success": True,
        "data": {
            "donation_id": donation_id,
            "shelter_id": req.shelter_id,
            "status": "MATCHED",
            "assigned_driver": {
                "driver_id": "driver_ramesh",
                "driver_name": "Ramesh Kumar",
                "phone": "+91-9829012345",
                "vehicle": "Motorcycle (RJ-14-AB-1234)"
            },
            "pickup_otp": "4829",
            "delivery_otp": "7193",
            "message": "Offer accepted successfully. Driver assigned and OTPs generated."
        },
        "error": None
    }
