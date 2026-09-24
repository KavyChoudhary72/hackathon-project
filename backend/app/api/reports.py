from typing import Optional
from fastapi import APIRouter, Query, Response

router = APIRouter(prefix="/reports", tags=["CSR Audit Reports"])


@router.get("/csr")
async def get_csr_audit_report(
    donor_id: str = Query("donor_hotel_clarks"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    format: str = Query("json", enum=["json", "csv"])
):
    """
    Generates verifiable CSR impact report for corporate donors.
    Supports CSV export for audit compliance.
    """
    sample_records = [
        {
            "donation_id": "don_jaipur_01",
            "date": "2026-09-24T10:00:00Z",
            "food_type": "Dal Makhani & Paneer",
            "quantity_meals": 50,
            "status": "DELIVERED",
            "recipient_shelter": "Akshaya Patra Foundation Jaipur",
            "pickup_otp_audit": "VERIFIED_4829",
            "delivery_otp_audit": "VERIFIED_7193",
            "audit_event_id": "evt_9941a802-83b4"
        },
        {
            "donation_id": "don_jaipur_02",
            "date": "2026-09-23T14:30:00Z",
            "food_type": "Fresh Subzi & Roti",
            "quantity_meals": 80,
            "status": "DELIVERED",
            "recipient_shelter": "Mother Teresa Home Jaipur",
            "pickup_otp_audit": "VERIFIED_1920",
            "delivery_otp_audit": "VERIFIED_8842",
            "audit_event_id": "evt_1120f441-29a7"
        }
    ]

    if format == "csv":
        csv_lines = ["Donation ID,Date,Food Type,Meals,Status,Recipient Shelter,Audit Event ID"]
        for r in sample_records:
            csv_lines.append(
                f"{r['donation_id']},{r['date']},{r['food_type']},{r['quantity_meals']},"
                f"{r['status']},{r['recipient_shelter']},{r['audit_event_id']}"
            )
        csv_content = "\n".join(csv_lines)
        return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=csr_audit_report.csv"})

    return {
        "success": True,
        "data": {
            "donor_id": donor_id,
            "period": {"start_date": start_date or "2026-09-01", "end_date": end_date or "2026-09-24"},
            "donor_summary": {
                "donor_name": "Hotel Clarks Amer Jaipur",
                "level": "Gold Rescue Legend",
                "lifetime_points": 1850,
                "badges": ["First Verified Rescue", "Fast Responder", "100 Meals Shield"],
                "total_verified_meals": 130
            },
            "verified_records": sample_records
        },
        "error": None
    }
