import hashlib
import logging
import secrets
from datetime import datetime, timezone
from typing import Dict, Tuple
from fastapi import HTTPException, status

logger = logging.getLogger("surplus2shelter.otp")

MAX_OTP_ATTEMPTS = 5


def generate_otp() -> Tuple[str, str]:
    """
    Generates a cryptographically secure 4-digit OTP using secrets.randbelow.
    Returns a tuple of (raw_otp_string, sha256_hash_string).
    """
    raw_number = secrets.randbelow(10000)
    raw_otp = f"{raw_number:04d}"
    otp_hash = hashlib.sha256(raw_otp.encode("utf-8")).hexdigest()
    return raw_otp, otp_hash


def verify_otp_hash(
    input_otp: str,
    stored_hash: str,
    current_attempts: int
) -> Tuple[bool, int, bool]:
    """
    Verifies input OTP against stored SHA256 hash.
    Enforces maximum 5 attempts lockout.
    Returns tuple: (is_valid, new_attempt_count, is_locked)
    """
    if current_attempts >= MAX_OTP_ATTEMPTS:
        logger.warning("OTP verification attempt on locked OTP")
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail={
                "code": "OTP_LOCKED",
                "message": f"OTP locked after exceeding maximum allowed attempts ({MAX_OTP_ATTEMPTS})."
            }
        )

    new_attempts = current_attempts + 1
    input_hash = hashlib.sha256(input_otp.encode("utf-8")).hexdigest()

    if input_hash == stored_hash:
        return True, new_attempts, False

    is_locked = (new_attempts >= MAX_OTP_ATTEMPTS)
    if is_locked:
        logger.error(f"OTP locked out after {new_attempts} failed attempts")

    return False, new_attempts, is_locked
