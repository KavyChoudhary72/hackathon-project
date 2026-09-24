import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple
from fastapi import HTTPException, status

logger = logging.getLogger("surplus2shelter.status_machine")

# Authoritative Allowed Transitions Graph
# Key: current status, Value: set of allowed next statuses
ALLOWED_TRANSITIONS: Dict[str, set] = {
    "DRAFT": {"POSTED", "CANCELLED"},
    "POSTED": {"MATCHING", "CANCELLED"},
    "MATCHING": {"MATCHED", "UNMATCHED", "CANCELLED"},
    "MATCHED": {"DRIVER_ASSIGNED", "UNMATCHED", "CANCELLED"},
    "DRIVER_ASSIGNED": {"PICKED_UP", "MATCHING", "CANCELLED"},
    "PICKED_UP": {"DELIVERED", "CANCELLED"},
    "DELIVERED": set(),  # Terminal state
    "UNMATCHED": {"DEAL_LISTED", "DIVERSION_PENDING", "EXPIRED", "CANCELLED"},
    "DEAL_LISTED": {"DEAL_CLAIMED", "DIVERSION_PENDING", "EXPIRED", "CANCELLED"},
    "DEAL_CLAIMED": {"DEAL_COLLECTED", "DIVERSION_PENDING", "EXPIRED", "CANCELLED"},
    "DEAL_COLLECTED": {"DIVERSION_PENDING", "EXPIRED"},
    "DIVERSION_PENDING": {"DIVERSION_ASSIGNED", "EXPIRED", "CANCELLED"},
    "DIVERSION_ASSIGNED": {"DIVERTED", "EXPIRED", "CANCELLED"},
    "DIVERTED": set(),   # Terminal state
    "EXPIRED": set(),    # Terminal state
    "CANCELLED": set(),  # Terminal state
}


def validate_transition(from_status: str, to_status: str) -> None:
    """Validates whether a transition from `from_status` to `to_status` is legal."""
    allowed = ALLOWED_TRANSITIONS.get(from_status, set())
    if to_status not in allowed:
        logger.warning(f"Illegal transition attempted: '{from_status}' -> '{to_status}'")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "ILLEGAL_STATUS_TRANSITION",
                "message": f"Cannot transition donation status from '{from_status}' to '{to_status}'",
                "from_status": from_status,
                "to_status": to_status,
                "allowed_next": list(allowed)
            }
        )


async def transition(
    donation: Any,
    to_status: str,
    actor_id: str,
    actor_role: str,
    note: Optional[str] = None
) -> Tuple[Any, Dict[str, Any]]:
    """
    Authoritative state transition function.
    1. Validates legal transition (or raises HTTP 409)
    2. Mutates donation object status
    3. Records status event log entry data
    4. Returns updated donation and event metadata for event bus publishing
    """
    from_status = getattr(donation, "status", "DRAFT")
    validate_transition(from_status, to_status)

    donation.status = to_status
    donation.updated_at = datetime.now(timezone.utc)

    event_payload_data = {
        "donation_id": str(getattr(donation, "id", getattr(donation, "donation_id", ""))),
        "from_status": from_status,
        "to_status": to_status,
        "actor_id": actor_id,
        "actor_role": actor_role,
        "note": note,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    logger.info(
        f"Status Transition Successful: Donation '{event_payload_data['donation_id']}' "
        f"from '{from_status}' -> '{to_status}' by {actor_role}:{actor_id}"
    )

    return donation, event_payload_data
