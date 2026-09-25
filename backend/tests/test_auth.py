import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_auth_login_super_admin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "admin@surplus2shelter.org",
            "password": "Admin@2026"
        })
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["user"]["role"] == "SUPER_ADMIN"
        assert "all" in res["data"]["user"]["permissions"]


@pytest.mark.asyncio
async def test_auth_login_donor_hotel():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "hotel.clarks@jaipur.com",
            "password": "Donor@2026"
        })
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["user"]["role"] == "DONOR"
        assert res["data"]["user"]["organization_name"] == "Hotel Clarks Amer Jaipur"


@pytest.mark.asyncio
async def test_auth_login_role_shortcut():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "",
            "role_shortcut": "SHELTER"
        })
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["user"]["role"] == "SHELTER"
