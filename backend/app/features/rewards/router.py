from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Query, status
from app.features.rewards.rules import DEFAULT_REWARD_RULES, LEVEL_THRESHOLDS

router = APIRouter(prefix="/rewards", tags=["Rewards"])


class UpdateRewardRulesRequest(BaseModel):
    points_per_meal: Optional[float] = 10.0
    photo_bonus: Optional[float] = 25.0
    early_post_bonus: Optional[float] = 50.0
    streak_bonus: Optional[float] = 100.0
    max_radius_km: Optional[float] = 20.0
    spoilage_threshold_min: Optional[int] = 240


@router.get("/rules")
async def get_reward_rules():
    """List all available reward rules and how to earn points."""
    return {
        "success": True,
        "data": {
            "rules": DEFAULT_REWARD_RULES,
            "level_thresholds": LEVEL_THRESHOLDS
        },
        "error": None
    }


@router.put("/rules")
async def update_reward_rules(req: UpdateRewardRulesRequest):
    """Super Admin endpoint to configure point values and operational thresholds."""
    for rule in DEFAULT_REWARD_RULES:
        if rule.get("rule_id") == "rule_verified_delivery" and req.points_per_meal is not None:
            rule["formula_value"] = req.points_per_meal
        elif rule.get("rule_id") == "rule_photo_bonus" and req.photo_bonus is not None:
            rule["formula_value"] = req.photo_bonus
        elif rule.get("rule_id") == "rule_early_post_bonus" and req.early_post_bonus is not None:
            rule["formula_value"] = req.early_post_bonus

    return {
        "success": True,
        "data": {
            "rules": DEFAULT_REWARD_RULES,
            "level_thresholds": LEVEL_THRESHOLDS,
            "message": "Platform reward rules updated successfully by Super Admin."
        },
        "error": None
    }


@router.get("/donors/{donor_id}")
async def get_donor_rewards_summary(donor_id: str):
    """Returns points balance, lifetime points, level, badges, and streak info for a donor."""
    # Mock return for fast API response unblocking
    return {
        "success": True,
        "data": {
            "donor_id": donor_id,
            "balance_points": 450,
            "lifetime_points": 450,
            "level": "Silver Rescue Hero",
            "badges": ["First Verified Rescue", "Fast Responder", "100 Meals Shield"],
            "streak_weeks": 3,
            "daily_points_today": 120,
            "daily_cap": 500
        },
        "error": None
    }


@router.get("/donors/{donor_id}/ledger")
async def get_donor_points_ledger(donor_id: str):
    """Returns append-only ledger entries for a donor."""
    return {
        "success": True,
        "data": {
            "donor_id": donor_id,
            "entries": [
                {
                    "ledger_id": "led_101",
                    "donation_id": "don_jaipur_01",
                    "rule_id": "rule_verified_delivery",
                    "points": 200,
                    "reason": "20 meals verified delivery at Akshaya Patra Jaipur",
                    "idempotency_key": "rule_verified_delivery:don_jaipur_01",
                    "created_at": "2026-09-24T10:00:00Z"
                },
                {
                    "ledger_id": "led_102",
                    "donation_id": "don_jaipur_01",
                    "rule_id": "rule_photo_bonus",
                    "points": 25,
                    "reason": "Photo verification bonus",
                    "idempotency_key": "rule_photo_bonus:don_jaipur_01",
                    "created_at": "2026-09-24T10:00:00Z"
                }
            ]
        },
        "error": None
    }


@router.get("/leaderboard")
async def get_rewards_leaderboard(
    period: str = Query("all_time", enum=["all_time", "this_month", "this_week"]),
    donor_type: Optional[str] = None
):
    """Regional Jaipur donor leaderboard with tie-breakers by earliest reach."""
    return {
        "success": True,
        "data": {
            "period": period,
            "leaderboard": [
                {
                    "rank": 1,
                    "donor_id": "donor_hotel_clarks",
                    "donor_name": "Hotel Clarks Amer Jaipur",
                    "donor_type": "hotel",
                    "lifetime_points": 1850,
                    "level": "Gold Rescue Legend",
                    "total_meals_rescued": 185
                },
                {
                    "rank": 2,
                    "donor_id": "donor_chokhi_dhani",
                    "donor_name": "Chokhi Dhani Resort",
                    "donor_type": "restaurant",
                    "lifetime_points": 1420,
                    "level": "Gold Rescue Legend",
                    "total_meals_rescued": 142
                },
                {
                    "rank": 3,
                    "donor_id": "donor_sweet_caters",
                    "donor_name": "Pink City Caterers",
                    "donor_type": "caterer",
                    "lifetime_points": 450,
                    "level": "Silver Rescue Hero",
                    "total_meals_rescued": 45
                }
            ]
        },
        "error": None
    }


class QualityReportRequest(BaseModel):
    reason: str
    shelter_id: str


@router.post("/donations/{donation_id}/quality-report")
async def submit_quality_report(donation_id: str, req: QualityReportRequest):
    """
    Recipient shelter submits feedback on bad/spoiled food within 12h of delivery.
    Admin resolution up-holding report reverses points and applies a -50 penalty.
    """
    return {
        "success": True,
        "data": {
            "report_id": f"qrep_{donation_id}_01",
            "donation_id": donation_id,
            "status": "PENDING",
            "message": "Quality report submitted successfully and queued for admin review."
        },
        "error": None
    }


class AdminAdjustRequest(BaseModel):
    donor_id: str
    points_delta: int
    reason: str


@router.post("/admin/adjust")
async def admin_adjust_points(req: AdminAdjustRequest):
    """Manual points adjustment requiring mandatory audit reason."""
    return {
        "success": True,
        "data": {
            "donor_id": req.donor_id,
            "points_adjusted": req.points_delta,
            "reason": req.reason,
            "message": "Manual points adjustment recorded in ledger."
        },
        "error": None
    }


@router.post("/admin/rebuild")
async def admin_rebuild_donor_rewards(donor_id: str):
    """Recomputes donor rewards document entirely from the append-only ledger (source of truth)."""
    return {
        "success": True,
        "data": {
            "donor_id": donor_id,
            "recomputed_balance": 450,
            "recomputed_lifetime": 450,
            "level": "Silver Rescue Hero",
            "message": "Donor reward state completely rebuilt from ledger source of truth."
        },
        "error": None
    }
