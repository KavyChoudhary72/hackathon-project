"""
demo_accounts.py
Hard-coded demo accounts — no real login required.
These mirror the seed data in the main backend.
"""

DEMO_ACCOUNTS = {
    "donors": [
        {
            "id": "donor_001",
            "name": "Shree Ram Marriage Garden",
            "type": "wedding_hall",
            "phone": "+919800000001",
            "address": "Malviya Nagar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8333, 26.8522]},
            "fssai_license_no": "12345678901234",
            "lang": "hi",
        },
        {
            "id": "donor_002",
            "name": "Hotel Saffron Kitchen",
            "type": "restaurant",
            "phone": "+919800000002",
            "address": "C-Scheme, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8200, 26.9124]},
            "fssai_license_no": "98765432109876",
            "lang": "en",
        },
        {
            "id": "donor_003",
            "name": "MNIT Campus Mess",
            "type": "mess",
            "phone": "+919800000003",
            "address": "MNIT Campus, JLN Marg, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8145, 26.8652]},
            "fssai_license_no": "11223344556677",
            "lang": "en",
        },
        {
            "id": "donor_004",
            "name": "Chokhi Dhani Resort Caterer",
            "type": "caterer",
            "phone": "+919800000004",
            "address": "Tonk Road, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8410, 26.7880]},
            "fssai_license_no": "55667788990011",
            "lang": "hi",
        },
        {
            "id": "donor_005",
            "name": "Annapurna Dhaba",
            "type": "restaurant",
            "phone": "+919800000005",
            "address": "Vaishali Nagar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.7490, 26.9185]},
            "fssai_license_no": "22334455667788",
            "lang": "en",
        },
    ],
    "shelters": [
        {
            "id": "shelter_001",
            "name": "Aasra Shelter Home",
            "phone": "+919800000011",
            "address": "Jawahar Nagar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8290, 26.9050]},
            "capacity_meals": 80,
            "accepts_veg": True,
            "accepts_nonveg": False,
            "accepted_categories": ["cooked", "packaged"],
            "open_from": "07:00",
            "open_to": "22:00",
            "lang": "hi",
        },
        {
            "id": "shelter_002",
            "name": "Nav Jeevan Sewa Kendra",
            "phone": "+919800000012",
            "address": "Sodala, Jaipur",
            "location": {"type": "Point", "coordinates": [75.7780, 26.9220]},
            "capacity_meals": 120,
            "accepts_veg": True,
            "accepts_nonveg": True,
            "accepted_categories": ["cooked", "raw", "packaged", "bakery"],
            "open_from": "06:00",
            "open_to": "23:00",
            "lang": "hi",
        },
        {
            "id": "shelter_003",
            "name": "Umeed Foundation",
            "phone": "+919800000013",
            "address": "Mansarovar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.7520, 26.8780]},
            "capacity_meals": 60,
            "accepts_veg": True,
            "accepts_nonveg": False,
            "accepted_categories": ["cooked", "bakery"],
            "open_from": "08:00",
            "open_to": "20:00",
            "lang": "en",
        },
    ],
    "drivers": [
        {
            "id": "driver_001",
            "name": "Ramesh Kumar",
            "phone": "+919800000021",
            "vehicle": "bike",
            "available": True,
            "location": {"type": "Point", "coordinates": [75.8200, 26.9050]},
        },
        {
            "id": "driver_002",
            "name": "Sunil Sharma",
            "phone": "+919800000022",
            "vehicle": "car",
            "available": True,
            "location": {"type": "Point", "coordinates": [75.8150, 26.8900]},
        },
        {
            "id": "driver_003",
            "name": "Priya Verma",
            "phone": "+919800000023",
            "vehicle": "bike",
            "available": False,
            "location": {"type": "Point", "coordinates": [75.7900, 26.9100]},
        },
        {
            "id": "driver_004",
            "name": "Anil Meena",
            "phone": "+919800000024",
            "vehicle": "car",
            "available": True,
            "location": {"type": "Point", "coordinates": [75.8350, 26.8800]},
        },
    ],
    "buyers": [
        {
            "id": "buyer_001",
            "name": "Ankit Gupta",
            "phone": "+919800000031",
            "address": "Malviya Nagar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8300, 26.8530]},
            "lang": "en",
        },
        {
            "id": "buyer_002",
            "name": "Neha Joshi",
            "phone": "+919800000032",
            "address": "C-Scheme, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8190, 26.9110]},
            "lang": "en",
        },
        {
            "id": "buyer_003",
            "name": "Vikram Singh",
            "phone": "+919800000033",
            "address": "Vaishali Nagar, Jaipur",
            "location": {"type": "Point", "coordinates": [75.7510, 26.9200]},
            "lang": "hi",
        },
    ],
    "partners": [
        {
            "id": "partner_001",
            "name": "Pinjrapole Gaushala",
            "type": "animal_feed",
            "phone": "+919800000041",
            "address": "Galta Gate, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8620, 26.9350]},
            "accepted_categories": ["cooked", "raw"],
            "accepts_expired": False,
        },
        {
            "id": "partner_002",
            "name": "Green Jaipur Biogas",
            "type": "biogas",
            "phone": "+919800000042",
            "address": "Sanganer, Jaipur",
            "location": {"type": "Point", "coordinates": [75.8090, 26.8140]},
            "accepted_categories": ["cooked", "raw", "packaged", "bakery"],
            "accepts_expired": True,
        },
    ],
}

# Phone → account mapping (for WhatsApp identification)
PHONE_TO_ACCOUNT: dict[str, dict] = {}
for role, accounts in DEMO_ACCOUNTS.items():
    for account in accounts:
        PHONE_TO_ACCOUNT[account["phone"]] = {"role": role.rstrip("s"), "account": account}


def get_account_by_phone(phone: str) -> dict | None:
    """Look up a demo account by phone number."""
    return PHONE_TO_ACCOUNT.get(phone)


def get_account_by_id(role: str, entity_id: str) -> dict | None:
    """Look up a demo account by role and entity ID."""
    key = f"{role}s"
    for account in DEMO_ACCOUNTS.get(key, []):
        if account["id"] == entity_id:
            return account
    return None
