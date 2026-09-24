from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter(prefix="/shelters", tags=["Shelters"])


class UpdateCapacityRequest(BaseModel):
    capacity: int


@router.get("")
async def get_all_shelters():
    """Returns list of all registered shelters with their current capacity and status."""
    return {
        "success": True,
        "data": [
            {
                "shelter_id": "shelter_akshaya_patra",
                "name": "Akshaya Patra Foundation Jaipur",
                "phone": "+91-9829022222",
                "location": {"type": "Point", "coordinates": [75.7873, 26.9124]},
                "capacity_meals": 200,
                "dietary_type": "both",
                "operating_hours": {"open_time": "06:00", "close_time": "23:00"},
                "is_open": True,
                "distance_km": 3.8
            },
            {
                "shelter_id": "shelter_mother_teresa",
                "name": "Mother Teresa Home Jaipur",
                "phone": "+91-9829033333",
                "location": {"type": "Point", "coordinates": [75.8200, 26.8800]},
                "capacity_meals": 80,
                "dietary_type": "both",
                "operating_hours": {"open_time": "07:00", "close_time": "22:00"},
                "is_open": True,
                "distance_km": 6.4
            }
        ],
        "error": None
    }


@router.get("/{shelter_id}")
async def get_shelter_by_id(shelter_id: str):
    """Get detailed shelter information by ID."""
    return {
        "success": True,
        "data": {
            "shelter_id": shelter_id,
            "name": "Akshaya Patra Foundation Jaipur",
            "phone": "+91-9829022222",
            "location": {"type": "Point", "coordinates": [75.7873, 26.9124]},
            "capacity_meals": 200,
            "dietary_type": "both",
            "operating_hours": {"open_time": "06:00", "close_time": "23:00"},
            "is_open": True,
            "historical_acceptance_rate": 0.95
        },
        "error": None
    }


@router.patch("/{shelter_id}/capacity")
async def update_shelter_capacity(shelter_id: str, req: UpdateCapacityRequest):
    """Update shelter's current capacity."""
    return {
        "success": True,
        "data": {
            "shelter_id": shelter_id,
            "capacity_meals": req.capacity,
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        "error": None
    }
