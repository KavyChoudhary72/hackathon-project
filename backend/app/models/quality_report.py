from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class QualityReport(Document):
    report_id: Indexed(str, unique=True)
    donation_id: Indexed(str)
    shelter_id: str
    donor_id: str
    reason: str  # E.g., "Food spoiled on arrival", "Incorrect temperature"
    status: str = "PENDING"  # "PENDING", "UPHELD", "DISMISSED"
    admin_note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None

    class Settings:
        name = "quality_reports"
        indexes = [
            [("donation_id", pymongo.ASCENDING)],
            [("status", pymongo.ASCENDING)]
        ]
