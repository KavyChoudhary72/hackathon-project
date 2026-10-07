import os
import json
import time
import hmac
import hashlib
import base64
import secrets
from typing import Optional, Dict, Any, Union
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# Security Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "foodlink-enterprise-production-jwt-secret-key-2026-v1")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 15 * 60  # 15 minutes maximum session duration

security_bearer = HTTPBearer(auto_error=False)


# --- Cryptographic Password Hashing (PBKDF2-HMAC-SHA256) ---
def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """
    Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations.
    Returns (hashed_password_hex, salt_hex).
    Standard library, zero-dependency, FIPS-compliant.
    """
    if not salt:
        salt = secrets.token_hex(16)
    
    salt_bytes = bytes.fromhex(salt)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt_bytes,
        100000,
        dklen=32
    )
    return key.hex(), salt


def verify_password(plain_password: str, hashed_password: str, salt: str) -> bool:
    """
    Verifies a plain password against the stored hash and salt in constant time.
    """
    try:
        expected_hash, _ = hash_password(plain_password, salt)
        return hmac.compare_digest(expected_hash, hashed_password)
    except Exception:
        return False


# --- RFC 7519 JSON Web Token (JWT) Implementation ---
def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')


def _base64url_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4)) if len(data_str) % 4 != 0 else ''
    return base64.urlsafe_b64decode((data_str + padding).encode('utf-8'))


def create_access_token(data: Dict[str, Any], expires_delta: Optional[int] = None) -> str:
    """
    Generates a secure, signed JWT token with HS256 signature.
    """
    to_encode = data.copy()
    now = int(time.time())
    expire = now + (expires_delta if expires_delta is not None else ACCESS_TOKEN_EXPIRE_SECONDS)
    
    to_encode.update({
        "iat": now,
        "exp": expire,
        "iss": "foodlink-auth-service"
    })
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _base64url_encode(json.dumps(to_encode, separators=(',', ':')).encode('utf-8'))
    
    signature_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(JWT_SECRET_KEY.encode('utf-8'), signature_input, hashlib.sha256).digest()
    signature_b64 = _base64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Validates and decodes a JWT token. Raises HTTPException if expired or invalid.
    """
    try:
        parts = token.strip().split('.')
        if len(parts) != 3:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signature_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = _base64url_encode(
            hmac.new(JWT_SECRET_KEY.encode('utf-8'), signature_input, hashlib.sha256).digest()
        )
        
        if not hmac.compare_digest(expected_sig, signature_b64):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token signature",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Decode payload
        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Check expiration
        exp = payload.get("exp")
        if exp and int(time.time()) > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"}
            )
            
        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication token verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )
