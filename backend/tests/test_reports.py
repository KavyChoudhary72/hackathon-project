import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_csr_invoice_json_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/reports/csr?donor_id=donor_hotel_clarks&format=json")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        res = data["data"]
        assert res["invoice_type"] == "CSR_TAX_EXEMPTION_AND_DONATION_INVOICE"
        assert "CSR-INV-2026-" in res["invoice_number"]
        assert res["statutory_compliance"]["income_tax_act_section"] == "Section 80G(5)(vi)"
        assert res["statutory_compliance"]["80g_registration_number"] == "AAATJ1234EF20261"
        assert res["donor"]["donor_name"] == "Hotel Clarks Amer Jaipur"
        assert res["invoice_summary"]["total_in_kind_valuation_inr"] > 0
        assert res["invoice_summary"]["tax_deductible_eligible_amount_inr"] > 0
        assert len(res["line_items"]) >= 1


@pytest.mark.asyncio
async def test_csr_invoice_csv_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/reports/csr?donor_id=donor_hotel_clarks&format=csv")
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/csv")
        assert "attachment; filename=csr_tax_invoice_" in response.headers["content-disposition"]
        csv_text = response.text
        assert "Invoice Number,Item No,Donation ID,Date,Food Type" in csv_text
        assert "Fair In-Kind Value (INR)" in csv_text
        assert "CSR-INV-2026-" in csv_text
