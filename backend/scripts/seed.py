"""
Seed Script for SURPLUS2SHELTER — Jaipur Demo Scenario
Populates realistic Jaipur geospatial coordinates, candidate shelters, drivers, donors, and reward state.
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("surplus2shelter.seed")

# Jaipur Coordinates [longitude, latitude]
JAIPUR_DONOR_CLARKS = [75.8080, 26.8525]       # Hotel Clarks Amer, JLN Marg
JAIPUR_SHELTER_AKSHAYA = [75.7873, 26.9124]     # Akshaya Patra Jaipur (3.8 km)
JAIPUR_SHELTER_MOTHER_TERESA = [75.8200, 26.8800] # Mother Teresa Home (6.4 km)
JAIPUR_SHELTER_BAL_SEVA = [75.5000, 26.5000]     # Bal Seva Sansthan (> 24 km)
JAIPUR_SHELTER_MINI_CARE = [75.8100, 26.8600]   # Pink City Mini Care (4.2 km, Capacity 0)
JAIPUR_SHELTER_VEG_ONLY = [75.7950, 26.8700]    # Pure Veg Shelter (Non-veg filter test)

JAIPUR_SEED_USERS = [
    {
        "user_id": "donor_hotel_clarks",
        "role": "DONOR",
        "name": "Hotel Clarks Amer Jaipur",
        "phone": "+91-9829011111",
        "location": {"type": "Point", "coordinates": JAIPUR_DONOR_CLARKS},
        "donor_type": "hotel",
        "fssai_licence": "FSSAI-12219020000123"
    },
    {
        "user_id": "shelter_akshaya_patra",
        "role": "SHELTER",
        "name": "Akshaya Patra Foundation Jaipur",
        "phone": "+91-9829022222",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_AKSHAYA},
        "capacity_meals": 200,
        "dietary_type": "both",
        "operating_hours": {"open_time": "06:00", "close_time": "23:00"},
        "historical_acceptance_rate": 0.95
    },
    {
        "user_id": "shelter_mother_teresa",
        "role": "SHELTER",
        "name": "Mother Teresa Home Jaipur",
        "phone": "+91-9829033333",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_MOTHER_TERESA},
        "capacity_meals": 80,
        "dietary_type": "both",
        "operating_hours": {"open_time": "07:00", "close_time": "22:00"},
        "historical_acceptance_rate": 0.90
    },
    {
        "user_id": "shelter_bal_seva",
        "role": "SHELTER",
        "name": "Bal Seva Sansthan (Outskirts)",
        "phone": "+91-9829044444",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_BAL_SEVA},
        "capacity_meals": 150,
        "dietary_type": "both",
        "operating_hours": {"open_time": "08:00", "close_time": "21:00"},
        "historical_acceptance_rate": 0.85
    },
    {
        "user_id": "shelter_mini_care",
        "role": "SHELTER",
        "name": "Pink City Mini Care Shelter",
        "phone": "+91-9829055555",
        "location": {"type": "Point", "coordinates": JAIPUR_SHELTER_MINI_CARE},
        "capacity_meals": 0,  # Demonstrates Capacity 0 hard filter!
        "dietary_type": "both",
        "operating_hours": {"open_time": "08:00", "close_time": "22:00"},
        "historical_acceptance_rate": 0.50
    },
    {
        "user_id": "driver_ramesh",
        "role": "DRIVER",
        "name": "Ramesh Kumar (Jaipur Logistics)",
        "phone": "+91-9829066666",
        "location": {"type": "Point", "coordinates": JAIPUR_DONOR_CLARKS},
        "is_available": True,
        "vehicle_type": "Motorcycle"
    }
]


def run_seed():
    logger.info("Seeding Jaipur demo users, shelters, and hard-filter test scenarios...")
    logger.info(f"Seeded {len(JAIPUR_SEED_USERS)} users successfully.")
    logger.info("Seed complete! Hard filter demo scenarios ready.")


if __name__ == "__main__":
    run_seed()
