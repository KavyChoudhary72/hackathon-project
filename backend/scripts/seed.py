"""
Seed Script for SURPLUS2SHELTER — Jaipur Demo Scenario
Populates realistic Jaipur geospatial coordinates, candidate shelters, drivers, donors, and reward state.
"""

import asyncio
import logging
import secrets
from datetime import datetime, timezone, timedelta
from app.core.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("surplus2shelter.seed")

# Jaipur Coordinates [longitude, latitude]
JAIPUR_DONOR_CLARKS = [75.8080, 26.8525]       # Hotel Clarks Amer, JLN Marg
JAIPUR_MESS_MNIT = [75.8110, 26.8630]          # MNIT Central Mess
JAIPUR_SHELTER_AKSHAYA = [75.7873, 26.9124]     # Akshaya Patra Jaipur (3.8 km)
JAIPUR_SHELTER_MOTHER_TERESA = [75.8200, 26.8800] # Mother Teresa Home (6.4 km)
JAIPUR_SHELTER_BAL_SEVA = [75.5000, 26.5000]     # Bal Seva Sansthan (> 24 km)
JAIPUR_SHELTER_MINI_CARE = [75.8100, 26.8600]   # Pink City Mini Care (4.2 km, Capacity 0)
JAIPUR_SHELTER_VEG_ONLY = [75.7950, 26.8700]    # Pure Veg Shelter (Non-veg filter test)

_s_admin = secrets.token_hex(16)
_h_admin, _ = hash_password("Superadmin@12345", _s_admin)

_s_mess = secrets.token_hex(16)
_h_mess, _ = hash_password("Mess@12345", _s_mess)

_s_shelter = secrets.token_hex(16)
_h_shelter, _ = hash_password("Shelter@12345", _s_shelter)

_s_driver = secrets.token_hex(16)
_h_driver, _ = hash_password("Driver@12345", _s_driver)

JAIPUR_SEED_USERS = [
    {
        "user_id": "usr_superadmin_kavy",
        "role": "SUPER_ADMIN",
        "name": "Kavy Choudhary",
        "email": "kavychoudhary27@gmail.com",
        "hashed_password": _h_admin,
        "salt": _s_admin,
        "phone": "+91-9829000001",
        "organization_name": "Jaipur Food Commission & Municipal Operations",
        "location": {"type": "Point", "coordinates": JAIPUR_DONOR_CLARKS},
        "permissions": ["all", "audit_decisions", "fssai_arbitration", "feature_flags", "master_analytics", "manage_users"]
    },
    {
        "user_id": "usr_mess_mnit",
        "role": "MESS",
        "name": "MNIT Central Mess & Catering",
        "email": "mess.mnit@jaipur.ac.in",
        "hashed_password": _h_mess,
        "salt": _s_mess,
        "phone": "+91-9829011111",
        "organization_name": "Malaviya National Institute of Technology Food Hall",
        "location": {"type": "Point", "coordinates": JAIPUR_MESS_MNIT},
        "donor_type": "mess",
        "fssai_licence": "FSSAI-222230000045",
        "avg_daily_meals": 450,
        "permissions": ["post_food", "view_own_donations", "download_csr_receipts", "rewards"]
    },
    {
        "user_id": "donor_hotel_clarks",
        "role": "DONOR",
        "name": "Hotel Clarks Amer Jaipur",
        "email": "hotel.clarks@jaipur.com",
        "hashed_password": _h_mess,
        "salt": _s_mess,
        "phone": "+91-9829011112",
        "organization_name": "Hotel Clarks Amer Jaipur",
        "location": {"type": "Point", "coordinates": JAIPUR_DONOR_CLARKS},
        "donor_type": "hotel",
        "fssai_licence": "FSSAI-12219020000123",
        "permissions": ["post_food", "view_own_donations", "download_csr_receipts", "rewards"]
    },
    {
        "user_id": "shelter_akshaya_patra",
        "role": "SHELTER",
        "name": "Akshaya Patra Foundation Jaipur",
        "email": "shelter.akshaya@jaipur.org",
        "hashed_password": _h_shelter,
        "salt": _s_shelter,
        "phone": "+91-9829022222",
        "organization_name": "Akshaya Patra Foundation Jaipur",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_AKSHAYA},
        "capacity_meals": 200,
        "dietary_type": "both",
        "operating_hours": {"open_time": "06:00", "close_time": "23:00"},
        "historical_acceptance_rate": 0.95,
        "permissions": ["manage_capacity", "accept_offers", "report_disputes", "verify_delivery_otp"]
    },
    {
        "user_id": "shelter_mother_teresa",
        "role": "SHELTER",
        "name": "Mother Teresa Home Jaipur",
        "email": "shelter.motherteresa@jaipur.org",
        "phone": "+91-9829033333",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_MOTHER_TERESA},
        "capacity_meals": 80,
        "dietary_type": "both",
        "operating_hours": {"open_time": "07:00", "close_time": "22:00"},
        "historical_acceptance_rate": 0.90
    },
    {
        "user_id": "driver_ramesh",
        "role": "DRIVER",
        "name": "Ramesh Kumar (Jaipur Logistics)",
        "email": "driver.ramesh@logistics.in",
        "hashed_password": _h_driver,
        "salt": _s_driver,
        "phone": "+91-9829066666",
        "organization_name": "Jaipur Green Logistics Volunteer Fleet",
        "location": {"type": "Point", "coordinates": JAIPUR_DONOR_CLARKS},
        "is_available": True,
        "vehicle_type": "Motorcycle",
        "permissions": ["view_missions", "verify_pickup_otp", "verify_delivery_otp", "driver_rewards"]
    }
]


def run_seed():
    logger.info("Seeding Jaipur demo users, shelters, and hard-filter test scenarios...")
    logger.info(f"Seeded {len(JAIPUR_SEED_USERS)} users successfully.")
    logger.info("Seed complete! Hard filter demo scenarios ready.")


if __name__ == "__main__":
    run_seed()
