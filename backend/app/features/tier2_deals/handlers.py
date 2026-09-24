import logging
from typing import Dict, Any
from app.core.config import settings
from app.core.events import event_bus

logger = logging.getLogger("surplus2shelter.tier2.handlers")


async def handle_donation_unmatched_event(event_payload: Dict[str, Any]):
    """
    Triggers when donation status transitions to UNMATCHED.
    Eligibility check for Tier 2 Rescue Deals:
    - safe window > 90 minutes
    - donor has verified FSSAI licence number
    """
    if not settings.ENABLE_RESCUE_DEALS:
        return

    donation_id = event_payload.get("donation_id")
    data = event_payload.get("data", {})

    safe_window_minutes = data.get("safe_window_minutes", 120)
    fssai_licence = data.get("fssai_licence")

    if safe_window_minutes <= 90:
        logger.info(f"Donation '{donation_id}' ineligible for Tier 2 (safe window {safe_window_minutes} min <= 90 min)")
        await event_bus.publish("tier2.ineligible", donation_id=donation_id, status="UNMATCHED", data={"reason": "safe_window_too_short"})
        return

    if not fssai_licence:
        logger.info(f"Donation '{donation_id}' ineligible for Tier 2 (Missing required FSSAI licence)")
        await event_bus.publish("tier2.ineligible", donation_id=donation_id, status="UNMATCHED", data={"reason": "missing_fssai_licence"})
        return

    logger.info(f"Donation '{donation_id}' ELIGIBLE for Tier 2 Rescue Deal listing!")
    await event_bus.publish(
        "deal.listed",
        donation_id=donation_id,
        status="DEAL_LISTED",
        data={
            "price_per_meal": 20.0,
            "quantity_meals": data.get("quantity_meals", 20),
            "fssai_licence": fssai_licence
        }
    )


def register_tier2_handlers():
    event_bus.subscribe("donation.unmatched", handle_donation_unmatched_event)
    logger.info("Registered Tier 2 deals event bus subscribers")
