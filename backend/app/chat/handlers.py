import logging
from typing import Dict, Any
from app.core.config import settings
from app.core.events import event_bus

logger = logging.getLogger("surplus2shelter.chat.subscriber")

CHAT_SUBSCRIBED_EVENTS = [
    "match.offered",
    "driver.assigned",
    "status.changed",
    "deal.listed",
    "deal.claimed",
    "diversion.offered",
    "reward.level_up",
    "reward.badge_unlocked"
]


async def handle_chat_bus_event(event_payload: Dict[str, Any]):
    """Event subscriber logging backend events for chatbot agent notification context."""
    if not settings.ENABLE_CHAT:
        return

    event_name = event_payload.get("event")
    donation_id = event_payload.get("donation_id")
    logger.info(f"[Chatbot Subscriber] Event '{event_name}' received for donation '{donation_id}'. Context logged for chat.")


def register_chat_subscribers():
    for event_name in CHAT_SUBSCRIBED_EVENTS:
        event_bus.subscribe(event_name, handle_chat_bus_event)
    logger.info("Registered chatbot event bus subscribers")
