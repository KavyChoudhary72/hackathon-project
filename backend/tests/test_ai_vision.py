import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_ai_photo_parsing_preset():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/ai/parse-photo", json={"preset_id": "dal_rice_trays"})
        assert response.status_code == 200
        res_json = response.json()
        assert res_json["success"] is True
        data = res_json["data"]
        assert data["food_name"] == "Dal Makhani & Steamed Basmati Rice"
        assert data["quantity_estimate"] == 50
        assert data["is_veg"] is True
        assert len(data["containers"]) == 2
        assert data["confidence"] > 0.90


@pytest.mark.asyncio
async def test_ai_photo_parsing_fallback():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/ai/parse-photo", json={"photo_url": "https://example.com/biryani.jpg"})
        assert response.status_code == 200
        res_json = response.json()
        assert res_json["success"] is True
        data = res_json["data"]
        assert "Biryani" in data["food_name"]
        assert data["quantity_estimate"] == 40
