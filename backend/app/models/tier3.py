from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class Tier3Diversion(Document):
    diversion_id: Indexed(str, unique=True)
    donation_id: Indexed(str)
    partner_id: Optional[str] = None
    partner_name: Optional[str] = None
    partner_type: Optional[str] = None  # "biogas", "compost", "animal_feed"
    kg_diverted_actual: float = 0.0
    status: Indexed(str) = "DIVERSION_PENDING"  # "DIVERSION_PENDING", "DIVERSION_ASSIGNED", "DIVERTED", "EXPIRED"
    offered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

    class Settings:
        name = "tier3_diversions"
        indexes = [
            [("donation_id", pymongo.ASCENDING)],
            [("status", pymongo.ASCENDING)]
        ]
