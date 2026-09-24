from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class PointsLedger(Document):
    ledger_id: Indexed(str, unique=True)
    donor_id: Indexed(str)
    donation_id: str
    rule_id: str
    points: int
    reason: str
    idempotency_key: Indexed(str, unique=True)  # rule_id:donation_id or rule_id:donor_id:iso_week
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "points_ledger"
        indexes = [
            [("idempotency_key", pymongo.ASCENDING)],
            [("donor_id", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)]
        ]


class DonorRewards(Document):
    donor_id: Indexed(str, unique=True)
    balance_points: int = 0
    lifetime_points: int = 0
    level: str = "Bronze Donor"  # "Bronze Donor", "Silver Rescue Hero", "Gold Rescue Legend", "Platinum Surplus Champion"
    badges: List[str] = Field(default_factory=list)
    streak_weeks: int = 0
    last_streak_iso_week: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "donor_rewards"
        indexes = [
            [("donor_id", pymongo.ASCENDING)],
            [("lifetime_points", pymongo.DESCENDING)]
        ]
