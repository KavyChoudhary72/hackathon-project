from datetime import datetime, timezone
from app.core.config import settings
from app.engine.tier1 import evaluate_tier1_matching


def test_feature_flags_do_not_alter_tier1_matching(mock_jaipur_donation, mock_jaipur_shelters):
    now_utc = datetime.now(timezone.utc)

    # 1. Evaluate Tier 1 with all features ON
    settings.ENABLE_REWARDS = True
    settings.ENABLE_RESCUE_DEALS = True
    settings.ENABLE_DIVERSION = True
    settings.ENABLE_CHAT = True

    result_on = evaluate_tier1_matching(mock_jaipur_donation, mock_jaipur_shelters, now_utc)

    # 2. Evaluate Tier 1 with all features OFF
    settings.ENABLE_REWARDS = False
    settings.ENABLE_RESCUE_DEALS = False
    settings.ENABLE_DIVERSION = False
    settings.ENABLE_CHAT = False

    result_off = evaluate_tier1_matching(mock_jaipur_donation, mock_jaipur_shelters, now_utc)

    # Tier 1 outputs must be 100% functionally identical!
    assert result_on["selected_candidate"]["shelter_id"] == result_off["selected_candidate"]["shelter_id"]
    assert result_on["selected_candidate"]["score"] == result_off["selected_candidate"]["score"]
    assert result_on["filtered_out_count"] == result_off["filtered_out_count"]
    assert len(result_on["ranked_candidates"]) == len(result_off["ranked_candidates"])
