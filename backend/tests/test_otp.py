import pytest
from fastapi import HTTPException
from app.core.otp import generate_otp, verify_otp_hash, MAX_OTP_ATTEMPTS


def test_otp_generation_and_verification():
    raw_otp, otp_hash = generate_otp()
    assert len(raw_otp) == 4
    assert raw_otp.isdigit()

    # Correct OTP verification
    valid, attempts, locked = verify_otp_hash(raw_otp, otp_hash, current_attempts=0)
    assert valid is True
    assert attempts == 1
    assert locked is False


def test_otp_5_attempts_lockout():
    raw_otp, otp_hash = generate_otp()

    # Fail 4 attempts
    attempts = 0
    for i in range(4):
        valid, attempts, locked = verify_otp_hash("0000", otp_hash, current_attempts=attempts)
        assert valid is False
        assert locked is False

    # 5th failed attempt locks out
    valid, attempts, locked = verify_otp_hash("0000", otp_hash, current_attempts=attempts)
    assert valid is False
    assert attempts == 5
    assert locked is True

    # 6th attempt raises HTTP 423 Locked
    with pytest.raises(HTTPException) as exc_info:
        verify_otp_hash("0000", otp_hash, current_attempts=attempts)

    assert exc_info.value.status_code == 423
    assert exc_info.value.detail["code"] == "OTP_LOCKED"
