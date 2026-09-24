import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Coroutine

logger = logging.getLogger("surplus2shelter.events")


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[..., Coroutine[Any, Any, None]]]] = {}

    def subscribe(self, event_name: str, handler: Callable[..., Coroutine[Any, Any, None]]) -> None:
        """Register an async handler for a specific event or wildcard '*'."""
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        if handler not in self._subscribers[event_name]:
            self._subscribers[event_name].append(handler)
        logger.info(f"Subscribed handler '{handler.__name__}' to event '{event_name}'")

    async def publish(self, event_name: str, donation_id: str, status: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Publish an event asynchronously to all registered subscribers with handler failure isolation."""
        event_payload = {
            "event_id": str(uuid.uuid4()),
            "event": event_name,
            "donation_id": donation_id,
            "status": status,
            "data": data or {},
            "at": datetime.now(timezone.utc).isoformat()
        }

        handlers = list(self._subscribers.get(event_name, []))
        wildcard_handlers = list(self._subscribers.get("*", []))
        all_handlers = handlers + wildcard_handlers

        for handler in all_handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(event_payload)
                else:
                    handler(event_payload)
            except Exception as exc:
                logger.error(
                    f"Error processing handler '{getattr(handler, '__name__', str(handler))}' "
                    f"for event_id '{event_payload['event_id']}': {exc}",
                    exc_info=True
                )

        return event_payload


# Global Event Bus instance
event_bus = EventBus()
