from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class GeoJSONPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(default_factory=lambda: [75.8080, 26.8525])  # [lng, lat] strictly!


class OperatingHours(BaseModel):
    open_time: str = "08:00"  # "HH:MM" 24h
    close_time: str = "22:00"  # "HH:MM" 24h


class User(Document):
    user_id: Indexed(str, unique=True)
    role: Indexed(str)  # "SUPER_ADMIN", "MESS", "DONOR", "SHELTER", "DRIVER", "BUYER", "PARTNER"
    name: str
    phone: Indexed(str)
    email: Indexed(str, unique=True)
    hashed_password: Optional[str] = None
    salt: Optional[str] = None
    organization_name: Optional[str] = None
    location_city: Optional[str] = "Jaipur, Rajasthan"
    location: GeoJSONPoint = Field(default_factory=GeoJSONPoint)
    permissions: List[str] = Field(default_factory=list)
    avatar_url: Optional[str] = None
    is_active: bool = True

    # Mess / Donor Specific
    donor_type: Optional[str] = None  # "mess", "hotel", "caterer", "restaurant", "individual"
    fssai_licence: Optional[str] = None
    gst_number: Optional[str] = None
    avg_daily_meals: Optional[int] = 0

    # Shelter Specific
    capacity_meals: Optional[int] = 0
    dietary_type: Optional[str] = "both"  # "veg_only", "non_veg", "both"
    operating_hours: Optional[OperatingHours] = Field(default_factory=OperatingHours)
    historical_acceptance_rate: Optional[float] = 0.95

    # Driver Specific
    is_available: Optional[bool] = True
    vehicle_type: Optional[str] = "motorcycle"  # "motorcycle", "van", "auto", "e-rickshaw"
    vehicle_number: Optional[str] = None

    # Partner Specific (Tier 3)
    accepts_expired: Optional[bool] = False
    accepted_categories: List[str] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            [("location", pymongo.GEOSPHERE)],
            [("role", pymongo.ASCENDING)],
            [("phone", pymongo.ASCENDING)],
            [("email", pymongo.ASCENDING)]
        ]
