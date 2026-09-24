import pytest
from fastapi import HTTPException
from app.core.status_machine import validate_transition, ALLOWED_TRANSITIONS


def test_allowed_status_transitions():
    # Valid transitions
    validate_transition("POSTED", "MATCHING")
    validate_transition("MATCHING", "MATCHED")
    validate_transition("MATCHED", "DRIVER_ASSIGNED")
    validate_transition("DRIVER_ASSIGNED", "PICKED_UP")
    validate_transition("PICKED_UP", "DELIVERED")


def test_illegal_status_transition_raises_409():
    with pytest.raises(HTTPException) as exc_info:
        validate_transition("PICKED_UP", "MATCHING")

    assert exc_info.value.status_code == 409
    assert exc_info.value.detail["code"] == "ILLEGAL_STATUS_TRANSITION"
