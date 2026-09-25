from datetime import datetime, timezone, timedelta
from app.engine.eta import calculate_haversine_distance, calculate_eta_minutes
from app.engine.scoring import calculate_candidate_score
from app.engine.tier1 import evaluate_tier1_matching


def test_geojson_coordinate_helper():
    # Jaipur Clarks Amer to Akshaya Patra
    coord_clarks = [75.8080, 26.8525]  # [lng, lat]
    coord_akshaya = [75.7873, 26.9124] # [lng, lat]

    # Latitude must be ~ 26.9
    assert round(coord_clarks[1], 1) == 26.9

    distance_km = calculate_haversine_distance(coord_clarks, coord_akshaya)
    assert 3.0 <= distance_km <= 7.0  # Approx 3.8 - 6.8 km


def test_tier1_matching_filters_and_scores(mock_jaipur_donation, mock_jaipur_shelters):
    now_utc = datetime(2026, 9, 25, 10, 0, 0, tzinfo=timezone.utc)
    result = evaluate_tier1_matching(mock_jaipur_donation, mock_jaipur_shelters, now_utc)

    assert result["total_shelters_evaluated"] == 3
    assert result["filtered_out_count"] == 2
    assert result["surviving_count"] == 1

    # Check filtered out candidates have reasons
    filtered = result["filtered_out"]
    filter_reasons_combined = [r for candidate in filtered for r in candidate["reasons"]]

    assert any("max radius" in r for r in filter_reasons_combined)
    assert any("capacity 0" in r for r in filter_reasons_combined)

    # Check top candidate
    top = result["selected_candidate"]
    assert top is not None
    assert top["shelter_id"] == "shelter_akshaya_patra"
    assert top["score"] > 0.70
    assert "score_breakdown" in top
    assert "explanation" in top


def test_expired_food_never_routed(mock_jaipur_donation, mock_jaipur_shelters):
    now_utc = datetime(2026, 9, 25, 10, 0, 0, tzinfo=timezone.utc)
    # Set safe_until in the past
    mock_jaipur_donation["safe_until"] = (now_utc - timedelta(minutes=10)).isoformat()

    result = evaluate_tier1_matching(mock_jaipur_donation, mock_jaipur_shelters, now_utc)

    assert result["surviving_count"] == 0
    assert result["selected_candidate"] is None
    filter_reasons_combined = [r for candidate in result["filtered_out"] for r in candidate["reasons"]]
    assert any("expired" in r for r in filter_reasons_combined)
