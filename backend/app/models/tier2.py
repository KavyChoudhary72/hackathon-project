from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class Tier2Deal(Document):
    deal_id: Indexed(str, unique=True)
    donation_id: Indexed(str)
    donor_id: str
    fssai_licence: str
    price_per_meal: float
    original_quantity_meals: int
    remaining_quantity_meals: int
    claim_deadline: datetime
    status: Indexed(str) = "DEAL_LISTED"  # "DEAL_LISTED", "DEAL_CLAIMED", "DEAL_COLLECTED", "EXPIRED"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "tier2_deals"
        indexes = [
            [("donation_id", pymongo.ASCENDING)],
            [("status", pymongo.ASCENDING)]
        ]


class Tier2Claim(Document):
    claim_id: Indexed(str, unique=True)
    deal_id: Indexed(str)
    buyer_id: str
    buyer_name: str
    quantity_meals: int
    total_price: float
    buyer_otp_hash: str
    otp_attempts: int = 0
    is_collected: bool = False
    claimed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    collected_at: Optional[datetime] = None

    class Settings:
        name = "tier2_claims"
        indexes = [
            [("deal_id", pymongo.ASCENDING)],
            [("buyer_id", pymongo.ASCENDING)]
        ]
