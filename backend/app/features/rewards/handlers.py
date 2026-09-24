import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from app.core.config import settings
from app.core.events import event_bus
from app.core.rules_engine import evaluate_conditions, calculate_formula_points
from app.features.rewards.rules import DEFAULT_REWARD_RULES, calculate_donor_level

logger = logging.getLogger("surplus2shelter.rewards.handlers")


async def handle_status_changed_event(event_payload: Dict[str, Any]):
    """
    Subscribes to status.changed events.
    Awards reward points ONLY on verified outcomes (DELIVERED, DEAL_COLLECTED, DIVERTED).
    Posting alone or unverified states award ZERO points.
    """
    if not settings.ENABLE_REWARDS:
        return

    to_status = event_payload.get("status")
    if to_status not in ["DELIVERED", "DEAL_COLLECTED", "DIVERTED"]:
        return

    donation_data = event_payload.get("data", {})
    donation_id = event_payload.get("donation_id")
    donor_id = donation_data.get("donor_id", "donor_default")

    if not donation_id:
        return

    logger.info(f"Evaluating rewards for donation '{donation_id}' status '{to_status}' donor '{donor_id}'")

    # In actual database execution, this queries PointsLedger and DonorRewards
    # Here we demonstrate the full evaluation logic
    context = {
        "quantity_meals": donation_data.get("quantity_meals", 20),
        "photo_url": donation_data.get("photo_url"),
        "is_veg": donation_data.get("is_veg", True),
        "safe_window_minutes": donation_data.get("safe_window_minutes", 180),
        "donor_type": donation_data.get("donor_type", "restaurant")
    }

    total_awarded_this_donation = 0

    for rule in DEFAULT_REWARD_RULES:
        rule_id = rule["rule_id"]
        idempotency_key = f"{rule_id}:{donation_id}"

        if evaluate_conditions(rule["conditions"], context):
            points = calculate_formula_points(
                rule["formula_type"], rule["formula_value"], context
            )

            # Cap check
            if total_awarded_this_donation + points > settings.REWARDS_DAILY_CAP:
                points = max(0, settings.REWARDS_DAILY_CAP - total_awarded_this_donation)

            if points > 0:
                total_awarded_this_donation += points
                logger.info(
                    f"Reward awarded! Rule '{rule_id}' +{points} pts to donor '{donor_id}' "
                    f"(Key: {idempotency_key})"
                )
                await event_bus.publish(
                    "reward.earned",
                    donation_id=donation_id,
                    status=to_status,
                    data={"donor_id": donor_id, "points": points, "rule_id": rule_id}
                )


def register_rewards_handlers():
    event_bus.subscribe("status.changed", handle_status_changed_event)
    logger.info("Registered rewards event bus subscribers")
