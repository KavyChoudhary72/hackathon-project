import math
from typing import Tuple, List

EARTH_RADIUS_KM = 6371.0
AVERAGE_URBAN_SPEED_KMH = 25.0
PICKUP_BUFFER_MINUTES = 5.0


def calculate_haversine_distance(coord1: List[float], coord2: List[float]) -> float:
    """
    Calculates Haversine distance in kilometers between two GeoJSON points [lng, lat].
    Strictly expects coordinates in format [lng, lat].
    """
    lng1, lat1 = coord1[0], coord1[1]
    lng2, lat2 = coord2[0], coord2[1]

    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)

    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance_km = EARTH_RADIUS_KM * c
    return round(distance_km, 2)


def calculate_eta_minutes(distance_km: float) -> float:
    """Calculates ETA in minutes based on distance and average urban speed + buffer."""
    travel_time_hours = distance_km / AVERAGE_URBAN_SPEED_KMH
    travel_time_minutes = travel_time_hours * 60.0
    total_eta = travel_time_minutes + PICKUP_BUFFER_MINUTES
    return round(total_eta, 1)
