import logging
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("surplus2shelter.features")


class FeatureRegistry:
    def __init__(self):
        self._features: Dict[str, Dict[str, Any]] = {
            "rewards": {
                "name": "rewards",
                "enabled": settings.ENABLE_REWARDS,
                "version": "1.0.0",
                "description": "Donor rewards points, badges, levels, and quality report reversals"
            },
            "tier2_deals": {
                "name": "tier2_deals",
                "enabled": settings.ENABLE_RESCUE_DEALS,
                "version": "1.0.0",
                "description": "Tier 2 discounted rescue sales for licensed FSSAI donors"
            },
            "tier3_diversion": {
                "name": "tier3_diversion",
                "enabled": settings.ENABLE_DIVERSION,
                "version": "1.0.0",
                "description": "Tier 3 industrial feed and compost diversion routing"
            },
            "chat": {
                "name": "chat",
                "enabled": settings.ENABLE_CHAT,
                "version": "1.0.0",
                "description": "Chatbot agent integration endpoint and subscriber"
            }
        }

    def is_enabled(self, feature_name: str) -> bool:
        feature = self._features.get(feature_name)
        return feature["enabled"] if feature else False

    def list_features(self) -> List[Dict[str, Any]]:
        return list(self._features.values())

    def register(self, feature_name: str, enabled: bool, version: str, description: str) -> None:
        self._features[feature_name] = {
            "name": feature_name,
            "enabled": enabled,
            "version": version,
            "description": description
        }
        logger.info(f"Registered feature '{feature_name}' (enabled={enabled})")


feature_registry = FeatureRegistry()
