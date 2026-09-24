from fastapi import APIRouter
from app.core.features import feature_registry

router = APIRouter(prefix="", tags=["Feature Registry"])


@router.get("/features")
async def list_registered_features():
    """Returns dynamic status of all backend feature flags."""
    return {
        "success": True,
        "data": {
            "features": feature_registry.list_features()
        },
        "error": None
    }
