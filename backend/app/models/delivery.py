from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class Delivery(Document):
    delivery_id: Indexed(str, unique=True)
    donation_id: Indexed(str)
    shelter_id: Indexed(str)
    driver_id: Indexed(str)

    pickup_otp_hash: str
    delivery_otp_hash: str

    pickup_attempts: int = 0
    delivery_attempts: int = 0
    is_pickup_locked: bool = False
    is_delivery_locked: bool = False

    picked_up_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "deliveries"
        indexes = [
            [("donation_id", pymongo.ASCENDING)],
            [("driver_id", pymongo.ASCENDING)]
        ]
