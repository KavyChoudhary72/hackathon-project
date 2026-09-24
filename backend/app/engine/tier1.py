from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.engine.filters import apply_hard_filters
from app.engine.scoring import calculate_candidate_score


def evaluate_tier1_matching(
    donation: Dict[str, Any],
    shelters: List[Dict[str, Any]],
    current_time: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Tier 1 Rescue Engine Matching Function.
    Evaluates shelters through hard filters and explainable scoring.
    Returns audit object with passed candidates ranked by score, and filtered out candidates with reasons.
    """
    if current_time is None:
        current_time = datetime.now(timezone.utc)

    safe_until = donation.get("safe_until")
    if isinstance(safe_until, str):
        safe_until = datetime.fromisoformat(safe_until.replace("Z", "+00:00"))

    total_safe_window = (safe_until - current_time).total_seconds() / 60.0
    remaining_safe_window = max(0.0, total_safe_window)

    filtered_out_candidates: List[Dict[str, Any]] = []
    surviving_candidates: List[Dict[str, Any]] = []

    for shelter in shelters:
        shelter_id = str(shelter.get("user_id", shelter.get("id", "")))
        shelter_name = shelter.get("name", "Unknown Shelter")

        passed, reasons, distance_km, eta_minutes = apply_hard_filters(
            donation, shelter, current_time
        )

        if not passed:
            filtered_out_candidates.append({
                "shelter_id": shelter_id,
                "shelter_name": shelter_name,
                "reasons": reasons,
                "distance_km": distance_km,
                "eta_minutes": eta_minutes
            })
        else:
            required_meals = donation.get("quantity_meals", 0)
            capacity = shelter.get("capacity_meals", 0)
            acceptance_rate = shelter.get("historical_acceptance_rate", 0.95)

            score, breakdown, explanation = calculate_candidate_score(
                distance_km=distance_km,
                eta_minutes=eta_minutes,
                shelter_capacity=capacity,
                required_meals=required_meals,
                historical_acceptance_rate=acceptance_rate,
                remaining_safe_minutes=remaining_safe_window,
                total_safe_window_minutes=total_safe_window
            )

            surviving_candidates.append({
                "shelter_id": shelter_id,
                "shelter_name": shelter_name,
                "distance_km": distance_km,
                "eta_minutes": eta_minutes,
                "score": score,
                "score_breakdown": breakdown,
                "explanation": explanation
            })

    # Sort surviving candidates by score descending
    surviving_candidates.sort(key=lambda x: x["score"], reverse=True)

    # Assign ranks
    for rank, candidate in enumerate(surviving_candidates, start=1):
        candidate["rank"] = rank

    top_candidate = surviving_candidates[0] if surviving_candidates else None

    return {
        "donation_id": str(donation.get("donation_id", donation.get("id", ""))),
        "evaluated_at": current_time.isoformat(),
        "total_shelters_evaluated": len(shelters),
        "filtered_out_count": len(filtered_out_candidates),
        "surviving_count": len(surviving_candidates),
        "filtered_out": filtered_out_candidates,
        "ranked_candidates": surviving_candidates,
        "selected_candidate": top_candidate
    }
