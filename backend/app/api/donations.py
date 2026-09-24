from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status
from app.core.config import settings

router = APIRouter(prefix="/donations", tags=["Donations"])


class CreateDonationRequest(BaseModel):
    donor_id: str = "donor_hotel_clarks"
    donor_name: str = "Hotel Clarks Amer Jaipur"
    food_type: str = "Dal Makhani & Shahi Paneer with Naan"
    category: str = "cooked_meal"
    is_veg: bool = True
    quantity: float = 50.0
    unit: str = "meals"
    pickup_address: str = "JLJN Marg, Malviya Nagar, Jaipur, Rajasthan 302017"
    pickup_location: Dict[str, Any] = Field(
        default_factory=lambda: {
            "type": "Point",
            "coordinates": [75.8080, 26.8525]  # [lng, lat] Jaipur Clarks Amer
        }
    )
    safe_window_minutes: int = 180
    photo_url: Optional[str] = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"


@router.get("")
async def get_all_donations():
    """List all recent surplus food donations."""
    now_utc = datetime.now(timezone.utc)
    return {
        "success": True,
        "data": [
            {
                "donation_id": "don_jpr_101",
                "donor_id": "donor_hotel_clarks",
                "donor_name": "Hotel Clarks Amer Jaipur",
                "food_type": "Dal Makhani & Shahi Paneer with Naan",
                "category": "cooked_meal",
                "is_veg": True,
                "quantity": 50.0,
                "unit": "meals",
                "quantity_meals": 50,
                "pickup_address": "JLJN Marg, Malviya Nagar, Jaipur, Rajasthan 302017",
                "pickup_location": {"type": "Point", "coordinates": [75.8080, 26.8525]},
                "prepared_at": (now_utc - timedelta(minutes=45)).isoformat(),
                "safe_until": (now_utc + timedelta(minutes=135)).isoformat(),
                "safe_window_minutes": 135,
                "status": "MATCHED",
                "tier": 1,
                "matched_shelter_id": "shelter_akshaya_patra",
                "matched_shelter_name": "Akshaya Patra Foundation Jaipur",
                "assigned_driver_id": "driver_ramesh",
                "assigned_driver_name": "Ramesh Kumar (Jaipur Logistics)",
                "pickup_otp": "4829",
                "delivery_otp": "7193",
                "photo_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                "created_at": (now_utc - timedelta(minutes=45)).isoformat()
            }
        ],
        "error": None
    }


@router.post("")
async def create_donation(req: CreateDonationRequest):
    """Post a new surplus food donation."""
    now_utc = datetime.now(timezone.utc)
    safe_until = now_utc + timedelta(minutes=req.safe_window_minutes)

    quantity_meals = int(req.quantity) if req.unit == "meals" else int(round(req.quantity / settings.MEAL_KG))

    donation_id = f"don_jpr_{int(now_utc.timestamp())}"

    mock_donation = {
        "donation_id": donation_id,
        "donor_id": req.donor_id,
        "donor_name": req.donor_name,
        "food_type": req.food_type,
        "category": req.category,
        "is_veg": req.is_veg,
        "quantity": req.quantity,
        "unit": req.unit,
        "quantity_meals": quantity_meals,
        "pickup_address": req.pickup_address,
        "pickup_location": req.pickup_location,
        "prepared_at": now_utc.isoformat(),
        "safe_until": safe_until.isoformat(),
        "safe_window_minutes": req.safe_window_minutes,
        "status": "POSTED",
        "photo_url": req.photo_url,
        "created_at": now_utc.isoformat()
    }

    return {
        "success": True,
        "data": mock_donation,
        "error": None
    }


@router.get("/{donation_id}")
async def get_donation_by_id(donation_id: str):
    """Get detailed information and status of a donation."""
    now_utc = datetime.now(timezone.utc)
    return {
        "success": True,
        "data": {
            "donation_id": donation_id,
            "donor_id": "donor_hotel_clarks",
            "donor_name": "Hotel Clarks Amer Jaipur",
            "food_type": "Dal Makhani & Shahi Paneer with Naan",
            "category": "cooked_meal",
            "is_veg": True,
            "quantity": 50.0,
            "unit": "meals",
            "quantity_meals": 50,
            "pickup_address": "JLJN Marg, Malviya Nagar, Jaipur, Rajasthan 302017",
            "pickup_location": {"type": "Point", "coordinates": [75.8080, 26.8525]},
            "prepared_at": (now_utc - timedelta(minutes=30)).isoformat(),
            "safe_until": (now_utc + timedelta(minutes=150)).isoformat(),
            "safe_window_minutes": 150,
            "status": "MATCHED",
            "matched_shelter_id": "shelter_akshaya_patra",
            "matched_shelter_name": "Akshaya Patra Foundation Jaipur",
            "assigned_driver_id": "driver_ramesh",
            "assigned_driver_name": "Ramesh Kumar (Jaipur Logistics)",
            "photo_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            "created_at": (now_utc - timedelta(minutes=30)).isoformat()
        },
        "error": None
    }


@router.get("/{donation_id}/decisions")
async def get_donation_engine_decisions(donation_id: str):
    """
    Returns full audit trail of engine decisions for the 'SHOW THE HARD PART' demo screen.
    Includes candidate discovery, hard filters, filter reasons, scores, cascade events, and status events.
    """
    now_utc = datetime.now(timezone.utc)
    return {
        "success": True,
        "data": {
            "donation_id": donation_id,
            "evaluated_at": now_utc.isoformat(),
            "candidates_found": 5,
            "filtered_out_candidates": [
                {
                    "shelter_id": "shelter_bal_seva",
                    "shelter_name": "Bal Seva Sansthan Jaipur",
                    "distance_km": 24.5,
                    "reasons": ["Distance 24.5 km > max radius 20.0 km"]
                },
                {
                    "shelter_id": "shelter_veg_only_mini",
                    "shelter_name": "Pink City Mini Care",
                    "distance_km": 4.2,
                    "reasons": ["capacity 0"]
                },
                {
                    "shelter_id": "shelter_night_closed",
                    "shelter_name": "Jaipur Night Care Shelter",
                    "distance_km": 8.1,
                    "reasons": ["closed at current time (20:00)"]
                }
            ],
            "surviving_candidates": [
                {
                    "rank": 1,
                    "shelter_id": "shelter_akshaya_patra",
                    "shelter_name": "Akshaya Patra Foundation Jaipur",
                    "distance_km": 3.8,
                    "eta_minutes": 12.0,
                    "score": 0.895,
                    "score_breakdown": {
                        "s_eta": 0.800,
                        "s_capacity": 1.000,
                        "s_acceptance": 0.950,
                        "s_urgency": 0.833,
                        "weighted_total": 0.895
                    },
                    "explanation": "Selected candidate (Score: 0.90) - ETA is 12 mins, sufficient capacity (200 meals), acceptance reliability 95%, currently open."
                },
                {
                    "rank": 2,
                    "shelter_id": "shelter_mother_teresa",
                    "shelter_name": "Mother Teresa Home Jaipur",
                    "distance_km": 6.4,
                    "eta_minutes": 18.0,
                    "score": 0.760,
                    "score_breakdown": {
                        "s_eta": 0.700,
                        "s_capacity": 0.800,
                        "s_acceptance": 0.900,
                        "s_urgency": 0.833,
                        "weighted_total": 0.760
                    },
                    "explanation": "Backup candidate #2 (Score: 0.76) - ETA is 18 mins, sufficient capacity (80 meals)."
                }
            ],
            "selected_shelter": "Akshaya Patra Foundation Jaipur",
            "cascade_history": [
                {
                    "rank": 1,
                    "shelter_name": "Akshaya Patra Foundation Jaipur",
                    "status": "ACCEPTED",
                    "timestamp": (now_utc - timedelta(minutes=25)).isoformat()
                }
            ]
        },
        "error": None
    }
