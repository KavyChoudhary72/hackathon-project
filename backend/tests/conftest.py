import pytest
from datetime import datetime, timezone, timedelta

@pytest.fixture
def mock_jaipur_donation():
    now_utc = datetime.now(timezone.utc)
    return {
        "donation_id": "don_test_001",
        "donor_id": "donor_hotel_clarks",
        "donor_name": "Hotel Clarks Amer Jaipur",
        "food_type": "Dal Makhani & Naan",
        "category": "cooked_meal",
        "is_veg": True,
        "quantity": 50.0,
        "unit": "meals",
        "quantity_meals": 50,
        "pickup_location": {"type": "Point", "coordinates": [75.8080, 26.8525]},
        "safe_until": (now_utc + timedelta(minutes=180)).isoformat(),
        "status": "POSTED"
    }

@pytest.fixture
def mock_jaipur_shelters():
    return [
        {
            "user_id": "shelter_akshaya_patra",
            "name": "Akshaya Patra Foundation Jaipur",
            "location": {"type": "Point", "coordinates": [75.7873, 26.9124]},
            "capacity_meals": 200,
            "dietary_type": "both",
            "operating_hours": {"open_time": "06:00", "close_time": "23:00"},
            "historical_acceptance_rate": 0.95
        },
        {
            "user_id": "shelter_mini_care",
            "name": "Pink City Mini Care",
            "location": {"type": "Point", "coordinates": [75.8100, 26.8600]},
            "capacity_meals": 0,  # Should fail capacity filter
            "dietary_type": "both",
            "operating_hours": {"open_time": "08:00", "close_time": "22:00"},
            "historical_acceptance_rate": 0.50
        },
        {
            "user_id": "shelter_bal_seva",
            "name": "Bal Seva Sansthan Outskirts",
            "location": {"type": "Point", "coordinates": [75.5000, 26.5000]}, # Distance > 20 km
            "capacity_meals": 150,
            "dietary_type": "both",
            "operating_hours": {"open_time": "08:00", "close_time": "21:00"},
            "historical_acceptance_rate": 0.85
        }
    ]
