from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from beanie import Document, Indexed
import pymongo
from app.models.user import GeoJSONPoint
from app.core.config import settings


class Donation(Document):
    donation_id: Indexed(str, unique=True)
    donor_id: Indexed(str)
    donor_name: str
    food_type: str
    category: str  # "cooked_meal", "bakery", "packaged", "raw_produce"
    is_veg: bool = True
    quantity: float
    unit: str = "meals"  # "meals" | "kg"
    quantity_meals: int

    pickup_location: GeoJSONPoint
    pickup_address: str

    prepared_at: datetime
    safe_until: Indexed(datetime)
    safe_window_minutes: int

    status: Indexed(str) = "POSTED"  # POSTED, MATCHING, MATCHED, DRIVER_ASSIGNED, PICKED_UP, DELIVERED, UNMATCHED, DEAL_LISTED, etc.
    photo_url: Optional[str] = None
    ai_parsed_confidence: Optional[float] = None

    matched_shelter_id: Optional[str] = None
    assigned_driver_id: Optional[str] = None

    filtered_out_candidates: List[Dict[str, Any]] = Field(default_factory=list)
    score_breakdown: Optional[Dict[str, Any]] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("pickup_location")
    @classmethod
    def check_geojson_coordinates(cls, v: GeoJSONPoint) -> GeoJSONPoint:
        if not v.coordinates or len(v.coordinates) != 2:
            raise ValueError("GeoJSON coordinates must be [longitude, latitude]")
        lng, lat = v.coordinates[0], v.coordinates[1]
        # Validate latitude and longitude range for India / general validity
        if not (-180.0 <= lng <= 180.0 and -90.0 <= lat <= 90.0):
            raise ValueError(f"Invalid coordinates: [{lng}, {lat}]")
        return v

    class Settings:
        name = "donations"
        indexes = [
            [("pickup_location", pymongo.GEOSPHERE)],
            [("status", pymongo.ASCENDING), ("safe_until", pymongo.ASCENDING)],
            [("donor_id", pymongo.ASCENDING)],
            [("created_at", pymongo.DESCENDING)]
        ]
