from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class StatusEvent(Document):
    donation_id: Indexed(str)
    from_status: str
    to_status: str
    actor_id: str
    actor_role: str
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "status_events"
        indexes = [
            [("donation_id", pymongo.ASCENDING)],
            [("created_at", pymongo.DESCENDING)]
        ]
