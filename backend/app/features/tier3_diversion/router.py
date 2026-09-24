from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/tier3", tags=["Tier 3 Industrial Diversion"])


class CompleteDiversionRequest(BaseModel):
    kg_actual: float
    notes: str = "Diverted for agricultural composting"


@router.get("/diversions")
async def list_tier3_diversions():
    """List active Tier 3 industrial diversion opportunities."""
    return {
        "success": True,
        "data": {
            "diversions": [
                {
                    "diversion_id": "div_jpr_301",
                    "donation_id": "don_expired_01",
                    "partner_name": "Jaipur Bio-Compost Facility #4",
                    "partner_type": "compost",
                    "estimated_kg": 15.0,
                    "status": "DIVERSION_PENDING"
                }
            ]
        },
        "error": None
    }


@router.post("/diversions/{diversion_id}/complete")
async def complete_tier3_diversion(diversion_id: str, req: CompleteDiversionRequest):
    """
    Completes a Tier 3 diversion.
    CRITICAL RULE: kg_actual is recorded separately as diverted waste and is NEVER counted as rescued meals.
    """
    return {
        "success": True,
        "data": {
            "diversion_id": diversion_id,
            "kg_diverted_actual": req.kg_actual,
            "status": "DIVERTED",
            "message": f"Successfully diverted {req.kg_actual} kg organic waste from landfill."
        },
        "error": None
    }
