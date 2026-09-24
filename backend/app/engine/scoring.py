from typing import Dict, Any, Tuple


def calculate_candidate_score(
    distance_km: float,
    eta_minutes: float,
    shelter_capacity: int,
    required_meals: int,
    historical_acceptance_rate: float,
    remaining_safe_minutes: float,
    total_safe_window_minutes: float
) -> Tuple[float, Dict[str, float], str]:
    """
    Calculates normalized score [0.0 - 1.0] and detailed score breakdown for a surviving candidate.
    Weights:
    - ETA Score: 0.35 (Lower ETA -> Higher Score)
    - Capacity Score: 0.25 (Exact/Sufficient capacity fit)
    - Acceptance History Score: 0.20 (Historical shelter reliability)
    - Expiry Urgency Score: 0.20 (Optimal rescue timing)
    """
    # 1. ETA Factor (Normalized 0 to 60 mins)
    s_eta = max(0.0, 1.0 - (eta_minutes / 60.0))

    # 2. Capacity Fit Factor
    capacity_ratio = shelter_capacity / max(1, required_meals)
    if 1.0 <= capacity_ratio <= 3.0:
        s_capacity = 1.0
    elif capacity_ratio > 3.0:
        s_capacity = max(0.5, 1.0 - (capacity_ratio - 3.0) * 0.1)
    else:
        s_capacity = max(0.0, capacity_ratio)

    # 3. Acceptance History Factor
    s_acceptance = min(1.0, max(0.0, historical_acceptance_rate))

    # 4. Expiry Feasibility Factor (Higher remaining safe window -> Higher feasibility score)
    urgency_ratio = remaining_safe_minutes / max(1.0, total_safe_window_minutes)
    s_urgency = max(0.2, min(1.0, urgency_ratio))

    w_eta, w_capacity, w_acceptance, w_urgency = 0.35, 0.25, 0.20, 0.20

    total_score = round(
        (w_eta * s_eta) +
        (w_capacity * s_capacity) +
        (w_acceptance * s_acceptance) +
        (w_urgency * s_urgency),
        3
    )

    breakdown = {
        "s_eta": round(s_eta, 3),
        "s_capacity": round(s_capacity, 3),
        "s_acceptance": round(s_acceptance, 3),
        "s_urgency": round(s_urgency, 3),
        "weighted_total": total_score
    }

    explanation = (
        f"Selected candidate (Score: {total_score:.2f}) - "
        f"ETA is {int(eta_minutes)} mins, "
        f"sufficient capacity ({shelter_capacity} meals), "
        f"acceptance reliability {int(s_acceptance * 100)}%, "
        f"currently open and compatible food type."
    )

    return total_score, breakdown, explanation
