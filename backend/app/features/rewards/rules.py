from typing import List, Dict, Any

DEFAULT_REWARD_RULES = [
    {
        "rule_id": "rule_verified_delivery",
        "name": "Verified Rescue Delivery",
        "description": "Earned when a surplus food donation is successfully delivered and verified by recipient OTP",
        "label_hi": "सत्यापित भोजन बचाव वितरण",
        "conditions": {
            "min_meals": 1
        },
        "formula_type": "per_meal",
        "formula_value": 10.0  # 10 points per rescued meal
    },
    {
        "rule_id": "rule_photo_bonus",
        "name": "Photo Verification Bonus",
        "description": "Bonus points for providing a verified photo of surplus food",
        "label_hi": "फ़ोटो सत्यापन बोनस",
        "conditions": {
            "has_photo": True
        },
        "formula_type": "fixed",
        "formula_value": 25.0
    },
    {
        "rule_id": "rule_early_post_bonus",
        "name": "Early Rescue Window Bonus",
        "description": "Bonus for posting food with > 120 minutes remaining safe window",
        "label_hi": "प्रारंभिक सूचना बोनस",
        "conditions": {
            "safe_window_gte": 120
        },
        "formula_type": "fixed",
        "formula_value": 50.0
    }
]

LEVEL_THRESHOLDS = [
    {"level": "Bronze Rescue Partner", "min_points": 0},
    {"level": "Silver Rescue Hero", "min_points": 250},
    {"level": "Gold Rescue Legend", "min_points": 1000},
    {"level": "Platinum Surplus Champion", "min_points": 2500},
]


def calculate_donor_level(lifetime_points: int) -> str:
    current_level = LEVEL_THRESHOLDS[0]["level"]
    for threshold in LEVEL_THRESHOLDS:
        if lifetime_points >= threshold["min_points"]:
            current_level = threshold["level"]
    return current_level
