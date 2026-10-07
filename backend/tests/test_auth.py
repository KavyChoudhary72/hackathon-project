import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_auth_login_kavy_super_admin():
    """Verifies official Super Admin Kavy Choudhary credentials and JWT token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "kavychoudhary27@gmail.com",
            "password": "Superadmin@12345"
        })
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["user"]["role"] == "SUPER_ADMIN"
        assert res["data"]["user"]["email"] == "kavychoudhary27@gmail.com"
        assert "token" in res["data"]
        token = res["data"]["token"]
        assert len(token.split(".")) == 3  # Valid JWT format header.payload.signature

        # Test authenticated /me endpoint with Bearer token
        me_res = await ac.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        me_json = me_res.json()
        assert me_json["data"]["email"] == "kavychoudhary27@gmail.com"
        assert me_json["data"]["role"] == "SUPER_ADMIN"


@pytest.mark.asyncio
async def test_auth_login_mess_mnit():
    """Verifies separate Mess role authentication."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "mess.mnit@jaipur.ac.in",
            "password": "Mess@12345"
        })
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["user"]["role"] == "MESS"
        assert res["data"]["user"]["fssai_licence"] == "FSSAI-222230000045"


@pytest.mark.asyncio
async def test_auth_login_super_admin_legacy():
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


@pytest.mark.asyncio
async def test_auth_register_new_shelter():
    """Tests registration with PBKDF2 hashing, database persistence, and JWT token issuance."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        reg_response = await ac.post("/api/auth/register", json={
            "name": "Nayi Umeed Night Shelter",
            "email": "nayi.umeed@jaipur.org",
            "password": "SecurePassword@123",
            "role": "SHELTER",
            "organization_name": "Nayi Umeed Welfare Society",
            "capacity_meals": 120,
            "dietary_type": "veg_only"
        })
        assert reg_response.status_code == 200
        reg_json = reg_response.json()
        assert reg_json["success"] is True
        assert reg_json["data"]["user"]["role"] == "SHELTER"
        token = reg_json["data"]["token"]

        # Validate login with newly created user credentials
        login_response = await ac.post("/api/auth/login", json={
            "email": "nayi.umeed@jaipur.org",
            "password": "SecurePassword@123"
        })
        assert login_response.status_code == 200
        assert login_response.json()["success"] is True


@pytest.mark.asyncio
async def test_auth_invalid_credentials_rejected():
    """Verifies that invalid password returns 401 Unauthorized."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "kavychoudhary27@gmail.com",
            "password": "WrongPassword999!"
        })
        assert response.status_code == 401
