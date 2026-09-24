from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple
from app.engine.eta import calculate_haversine_distance, calculate_eta_minutes
from app.core.config import settings


def is_shelter_currently_open(operating_hours: Dict[str, str], current_utc_time: datetime) -> bool:
    """Checks if current time in Asia/Kolkata falls within shelter operating hours (e.g. '08:00'-'22:00')."""
    if not operating_hours:
        return True
    try:
        # Convert UTC to IST (+5:30) for operating hours check
        ist_offset = timezone(timezone.utc.utcoffset(current_utc_time) or timezone.utc.utcoffset(datetime.now()) or timezone.utc.utcoffset(datetime.now()))
        # Approximate IST offset +5:30
        ist_hour = (current_utc_time.hour + 5) % 24
        ist_minute = (current_utc_time.minute + 30) % 60
        if current_utc_time.minute + 30 >= 60:
            ist_hour = (ist_hour + 1) % 24
        current_time_str = f"{ist_hour:02d}:{ist_minute:02d}"

        open_str = operating_hours.get("open_time", "00:00")
        close_str = operating_hours.get("close_time", "23:59")
        return open_str <= current_time_str <= close_str
    except Exception:
        return True


def apply_hard_filters(
    donation: Dict[str, Any],
    shelter: Dict[str, Any],
    current_time: datetime
) -> Tuple[bool, List[str], float, float]:
    """
    Evaluates candidate shelter against Tier 1 hard filters.
    Returns tuple: (passed_all, list_of_rejection_reasons, distance_km, eta_minutes)
    """
    filter_reasons: List[str] = []

    pickup_coords = donation["pickup_location"]["coordinates"]  # [lng, lat]
    shelter_coords = shelter["location"]["coordinates"]  # [lng, lat]

    # 1. Distance Filter
    distance_km = calculate_haversine_distance(pickup_coords, shelter_coords)
    max_radius = settings.MAX_SEARCH_RADIUS_KM
    if distance_km > max_radius:
        filter_reasons.append(f"Distance {distance_km} km > max radius {max_radius} km")

    # 2. ETA vs Safe Window Filter
    eta_minutes = calculate_eta_minutes(distance_km)
    safe_until = donation["safe_until"]
    if isinstance(safe_until, str):
        safe_until = datetime.fromisoformat(safe_until.replace("Z", "+00:00"))

    remaining_safe_minutes = (safe_until - current_time).total_seconds() / 60.0
    if remaining_safe_minutes <= 0:
        filter_reasons.append("Donation safe rescue window has already expired")
    elif eta_minutes > remaining_safe_minutes:
        filter_reasons.append(
            f"ETA {int(eta_minutes)} min > safe window {int(remaining_safe_minutes)} min"
        )

    # 3. Capacity Filter
    shelter_capacity = shelter.get("capacity_meals", 0)
    required_meals = donation.get("quantity_meals", 0)
    if shelter_capacity <= 0:
        filter_reasons.append("capacity 0")
    elif shelter_capacity < required_meals:
        filter_reasons.append(
            f"Shelter capacity {shelter_capacity} meals < required {required_meals} meals"
        )

    # 4. Dietary Mismatch Filter
    is_veg = donation.get("is_veg", True)
    shelter_diet = shelter.get("dietary_type", "both")
    if not is_veg and shelter_diet == "veg_only":
        filter_reasons.append("no non-veg accepted at this shelter")

    # 5. Operating Hours Filter
    op_hours = shelter.get("operating_hours", {})
    if not is_shelter_currently_open(op_hours, current_time):
        filter_reasons.append(f"closed at current time ({op_hours.get('close_time', 'N/A')})")

    passed_all = len(filter_reasons) == 0
    return passed_all, filter_reasons, distance_km, eta_minutes
