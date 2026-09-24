from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from beanie import Document, Indexed
import pymongo


class CandidateFilterResult(BaseModel):
    shelter_id: str
    shelter_name: str
    passed_all_filters: bool
    filter_reasons: List[str] = Field(default_factory=list)  # E.g., "ETA 48 min > safe window 35 min", "capacity 0"
    distance_km: float
    eta_minutes: float
    score: Optional[float] = None
    score_breakdown: Optional[Dict[str, float]] = None
    explanation: Optional[str] = None


class CandidateEvaluationLog(Document):
    donation_id: Indexed(str)
    evaluated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total_candidates_found: int
    passed_candidates_count: int
    results: List[CandidateFilterResult] = Field(default_factory=list)

    class Settings:
        name = "candidate_evaluations"
        indexes = [
            [("donation_id", pymongo.ASCENDING)]
        ]
