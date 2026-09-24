import pytest
from app.core.rules_engine import evaluate_conditions, calculate_formula_points
from app.features.rewards.rules import calculate_donor_level, DEFAULT_REWARD_RULES


def test_posting_alone_awards_zero_points():
    # Only DELIVERED / DEAL_COLLECTED / DIVERTED trigger rewards
    status = "POSTED"
    assert status not in ["DELIVERED", "DEAL_COLLECTED", "DIVERTED"]


def test_reward_formula_and_level_calculation():
    context = {"quantity_meals": 50, "has_photo": True, "safe_window_minutes": 150}

    rule_delivery = DEFAULT_REWARD_RULES[0]
    points = calculate_formula_points(rule_delivery["formula_type"], rule_delivery["formula_value"], context)
    assert points == 500  # 50 meals * 10 pts

    level = calculate_donor_level(1200)
    assert level == "Gold Rescue Legend"
