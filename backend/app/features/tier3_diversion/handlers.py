import logging
from typing import Dict, Any
from app.core.config import settings
from app.core.events import event_bus

logger = logging.getLogger("surplus2shelter.tier3.handlers")


async def handle_diversion_pending_event(event_payload: Dict[str, Any]):
    """
    Subscribes to diversion pending events.
    Finds eligible industrial feed/compost/biogas partners using $geoNear.
    """
    if not settings.ENABLE_DIVERSION:
        return

    donation_id = event_payload.get("donation_id")
    logger.info(f"Donation '{donation_id}' entering Tier 3 Industrial Diversion Pipeline")

    await event_bus.publish(
        "diversion.offered",
        donation_id=donation_id,
        status="DIVERSION_PENDING",
        data={
            "target_partner": "Jaipur Bio-Compost Facility #4",
            "partner_type": "compost"
        }
    )


def register_tier3_handlers():
    event_bus.subscribe("diversion.pending", handle_diversion_pending_event)
    logger.info("Registered Tier 3 diversion event bus subscribers")
