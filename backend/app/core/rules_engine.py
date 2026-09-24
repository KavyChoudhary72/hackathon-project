import logging
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger("surplus2shelter.rules_engine")

# Type alias for evaluator functions
# Signature: evaluator_fn(context_dict, expected_value) -> bool
EvaluatorFn = Callable[[Dict[str, Any], Any], bool]


def _eval_min_meals(context: Dict[str, Any], target: Any) -> bool:
    return context.get("quantity_meals", 0) >= float(target)


def _eval_has_photo(context: Dict[str, Any], target: Any) -> bool:
    has_photo = bool(context.get("photo_url"))
    return has_photo == bool(target)


def _eval_is_veg(context: Dict[str, Any], target: Any) -> bool:
    return bool(context.get("is_veg")) == bool(target)


def _eval_safe_window_gte(context: Dict[str, Any], target: Any) -> bool:
    return float(context.get("safe_window_minutes", 0)) >= float(target)


def _eval_donor_type(context: Dict[str, Any], target: Any) -> bool:
    return str(context.get("donor_type")).lower() == str(target).lower()


# Condition Registry
CONDITION_REGISTRY: Dict[str, EvaluatorFn] = {
    "min_meals": _eval_min_meals,
    "has_photo": _eval_has_photo,
    "is_veg": _eval_is_veg,
    "safe_window_gte": _eval_safe_window_gte,
    "donor_type": _eval_donor_type,
}


def register_condition(condition_name: str, evaluator: EvaluatorFn) -> None:
    CONDITION_REGISTRY[condition_name] = evaluator
    logger.info(f"Registered condition evaluator '{condition_name}'")


def evaluate_conditions(conditions: Dict[str, Any], context: Dict[str, Any]) -> bool:
    """Evaluates all conditions against context using registered condition functions. NEVER uses eval()."""
    for cond_name, target_val in conditions.items():
        evaluator = CONDITION_REGISTRY.get(cond_name)
        if not evaluator:
            logger.warning(f"Unknown rule condition '{cond_name}'. Skipping condition.")
            continue
        if not evaluator(context, target_val):
            return False
    return True


def calculate_formula_points(formula_type: str, formula_val: float, context: Dict[str, Any]) -> int:
    """Calculates points based on formula type without executing arbitrary code."""
    if formula_type == "fixed":
        return int(formula_val)
    elif formula_type == "per_meal":
        meals = float(context.get("quantity_meals", 0))
        return int(meals * formula_val)
    elif formula_type == "per_kg":
        kg = float(context.get("quantity_kg", context.get("quantity_meals", 0) * 0.4))
        return int(kg * formula_val)
    return 0
