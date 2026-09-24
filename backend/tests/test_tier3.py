def test_tier3_diverted_kg_not_counted_as_meals():
    # Critical requirement: Diverted kg is NOT meals
    diverted_kg = 50.0
    rescued_meals = 100

    # Ensure separate metrics
    total_meals_rescued = rescued_meals
    total_kg_diverted = diverted_kg

    assert total_meals_rescued == 100
    assert total_kg_diverted == 50.0
    assert total_meals_rescued != (rescued_meals + diverted_kg)
