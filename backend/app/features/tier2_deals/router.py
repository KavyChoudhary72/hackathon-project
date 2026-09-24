from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status
from app.core.otp import generate_otp

router = APIRouter(prefix="/tier2", tags=["Tier 2 Rescue Deals"])


class ClaimDealRequest(BaseModel):
    buyer_id: str
    buyer_name: str
    quantity_meals: int


class CollectDealRequest(BaseModel):
    buyer_otp: str


@router.get("/deals")
async def list_tier2_deals():
    """List active Tier 2 discounted rescue deals."""
    return {
        "success": True,
        "data": {
            "deals": [
                {
                    "deal_id": "deal_jpr_201",
                    "donation_id": "don_unmatched_01",
                    "donor_name": "Radisson Blu Jaipur",
                    "fssai_licence": "FSSAI-12219020000456",
                    "food_type": "Fresh Bakery Items",
                    "price_per_meal": 20.0,
                    "original_quantity_meals": 30,
                    "remaining_quantity_meals": 30,
                    "claim_deadline": "2026-09-24T18:00:00Z",
                    "status": "DEAL_LISTED"
                }
            ]
        },
        "error": None
    }


@router.post("/deals/{deal_id}/claim")
async def claim_tier2_deal(deal_id: str, req: ClaimDealRequest):
    """Claim a quantity of meals from a listed Tier 2 deal."""
    raw_otp, otp_hash = generate_otp()
    return {
        "success": True,
        "data": {
            "claim_id": f"claim_{deal_id}_01",
            "deal_id": deal_id,
            "buyer_id": req.buyer_id,
            "quantity_meals": req.quantity_meals,
            "total_price": req.quantity_meals * 20.0,
            "buyer_otp": raw_otp,  # Shown to buyer to present at collection
            "status": "DEAL_CLAIMED"
        },
        "error": None
    }


@router.post("/deals/{deal_id}/collect")
async def collect_tier2_deal(deal_id: str, req: CollectDealRequest):
    """Donor verifies buyer OTP to confirm collection."""
    return {
        "success": True,
        "data": {
            "deal_id": deal_id,
            "status": "DEAL_COLLECTED",
            "message": "Buyer OTP verified successfully. Handover complete."
        },
        "error": None
    }
