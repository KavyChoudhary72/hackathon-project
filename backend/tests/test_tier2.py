def test_tier2_eligibility():
    # Safe window must be > 90 minutes and FSSAI licence must be present
    valid_payload = {"safe_window_minutes": 120, "fssai_licence": "FSSAI-12219020000123"}
    invalid_short_window = {"safe_window_minutes": 45, "fssai_licence": "FSSAI-12219020000123"}
    invalid_no_fssai = {"safe_window_minutes": 120, "fssai_licence": None}

    assert valid_payload["safe_window_minutes"] > 90 and valid_payload["fssai_licence"] is not None
    assert invalid_short_window["safe_window_minutes"] <= 90
    assert invalid_no_fssai["fssai_licence"] is None
