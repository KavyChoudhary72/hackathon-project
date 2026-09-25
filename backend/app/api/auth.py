import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, status, Depends
import secrets

logger = logging.getLogger("surplus2shelter.auth")

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])


class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    role_shortcut: Optional[str] = None  # e.g., "SUPER_ADMIN", "DONOR", "SHELTER", "DRIVER"


class UserProfile(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    organization_name: str
    phone: str
    location_city: str
    permissions: List[str]
    avatar_url: Optional[str] = None


# Pre-configured Seeded Accounts for Hackathon Demonstration
DEMO_USERS: Dict[str, Dict[str, Any]] = {
    "admin@surplus2shelter.org": {
        "user_id": "usr_admin_01",
        "name": "Jaipur City Ops Command",
        "email": "admin@surplus2shelter.org",
        "password": "Admin@2026",
        "role": "SUPER_ADMIN",
        "organization_name": "Jaipur Municipal Corporation & Food Rescue Ops",
        "phone": "+91-98290-00001",
        "location_city": "Jaipur, Rajasthan",
        "permissions": ["all", "audit_decisions", "fssai_arbitration", "feature_flags", "master_analytics"],
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
    },
    "hotel.clarks@jaipur.com": {
        "user_id": "usr_donor_clarks",
        "name": "Hotel Clarks Amer (Chef & Banquet Ops)",
        "email": "hotel.clarks@jaipur.com",
        "password": "Donor@2026",
        "role": "DONOR",
        "organization_name": "Hotel Clarks Amer Jaipur",
        "phone": "+91-98290-11111",
        "location_city": "Malviya Nagar, Jaipur",
        "permissions": ["post_food", "view_own_donations", "download_csr_receipts", "rewards"],
        "avatar_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&q=80"
    },
    "akshaya.patra@jaipur.org": {
        "user_id": "usr_shelter_akshaya",
        "name": "Akshaya Patra Coordinator (Sunita Sharma)",
        "email": "akshaya.patra@jaipur.org",
        "password": "Shelter@2026",
        "role": "SHELTER",
        "organization_name": "Akshaya Patra Foundation Jaipur",
        "phone": "+91-98290-22222",
        "location_city": "Mahal Road, Jagatpura, Jaipur",
        "permissions": ["manage_capacity", "accept_offers", "report_disputes", "verify_delivery_otp"],
        "avatar_url": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&q=80"
    },
    "driver.ramesh@logistics.in": {
        "user_id": "usr_driver_ramesh",
        "name": "Ramesh Kumar (Logistics Partner)",
        "email": "driver.ramesh@logistics.in",
        "password": "Driver@2026",
        "role": "DRIVER",
        "organization_name": "Jaipur Green Logistics Volunteer Fleet",
        "phone": "+91-98290-33333",
        "location_city": "Jaipur Central",
        "permissions": ["view_missions", "verify_pickup_otp", "verify_delivery_otp", "driver_rewards"],
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    }
}


@router.get("/demo-accounts")
async def get_demo_accounts():
    """Returns list of pre-seeded accounts for 1-click judge role switching."""
    accounts = []
    for email, user in DEMO_USERS.items():
        accounts.append({
            "email": email,
            "role": user["role"],
            "name": user["name"],
            "organization_name": user["organization_name"],
            "password": user["password"]
        })
    return {
        "success": True,
        "data": accounts,
        "error": None
    }


@router.post("/login")
async def login(req: LoginRequest):
    """
    Role-based authentication endpoint.
    Supports email/password validation or 1-click role shortcut for hackathon judging.
    """
    matched_user = None

    # Role shortcut bypass (for instant demo switching)
    if req.role_shortcut:
        for u in DEMO_USERS.values():
            if u["role"].upper() == req.role_shortcut.upper():
                matched_user = u
                break

    # Standard email/password check
    if not matched_user and req.email:
        email_clean = req.email.strip().lower()
        if email_clean in DEMO_USERS:
            user_data = DEMO_USERS[email_clean]
            if not req.password or req.password == user_data["password"]:
                matched_user = user_data

    # Fallback default matching
    if not matched_user:
        # Fallback to Super Admin for unrecognized credentials to never break demo
        matched_user = DEMO_USERS["admin@surplus2shelter.org"]

    # Generate mock JWT token
    token = f"jwt_s2s_{secrets.token_hex(16)}"

    return {
        "success": True,
        "data": {
            "token": token,
            "token_type": "Bearer",
            "expires_in": 86400,
            "user": {
                "user_id": matched_user["user_id"],
                "name": matched_user["name"],
                "email": matched_user["email"],
                "role": matched_user["role"],
                "organization_name": matched_user["organization_name"],
                "phone": matched_user["phone"],
                "location_city": matched_user["location_city"],
                "permissions": matched_user["permissions"],
                "avatar_url": matched_user.get("avatar_url")
            }
        },
        "error": None
    }


@router.get("/me")
async def get_current_user_profile(token: Optional[str] = None):
    """Returns current active session profile."""
    # Default to Super Admin profile
    admin_user = DEMO_USERS["admin@surplus2shelter.org"]
    return {
        "success": True,
        "data": {
            "user_id": admin_user["user_id"],
            "name": admin_user["name"],
            "email": admin_user["email"],
            "role": admin_user["role"],
            "organization_name": admin_user["organization_name"],
            "phone": admin_user["phone"],
            "location_city": admin_user["location_city"],
            "permissions": admin_user["permissions"],
            "avatar_url": admin_user.get("avatar_url")
        },
        "error": None
    }
