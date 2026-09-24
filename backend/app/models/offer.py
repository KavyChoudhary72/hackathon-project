from datetime import datetime, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class Offer(Document):
    offer_id: Indexed(str, unique=True)
    donation_id: Indexed(str)
    shelter_id: Indexed(str)
    shelter_name: str
    rank: int  # 1-indexed cascade rank
    score: float
    score_breakdown: Dict[str, float]
    explanation: str
    status: Indexed(str) = "PENDING"  # "PENDING", "ACCEPTED", "DECLINED", "TIMED_OUT"
    offered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime

    class Settings:
        name = "offers"
        indexes = [
            [("donation_id", pymongo.ASCENDING), ("shelter_id", pymongo.ASCENDING)],
            [("status", pymongo.ASCENDING)],
            [("expires_at", pymongo.ASCENDING)]
        ]
