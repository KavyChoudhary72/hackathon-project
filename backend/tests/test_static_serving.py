import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_not_intercepted_by_catchall():
    """Confirms API endpoints and health routes take precedence over catch-all."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_api_routes_not_intercepted_by_catchall():
    """Confirms non-existent API routes return 404 JSON, not HTML index."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/non-existent-route-999")
        assert res.status_code == 404
        assert res.headers["content-type"].startswith("application/json")


@pytest.mark.asyncio
async def test_catchall_frontend_route():
    """Tests the wildcard catch-all route for frontend URLs like /login."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/login")
        # Either 200 (if built out/ exists) or 404 HTML fallback message
        assert res.status_code in [200, 404]
        assert "text/html" in res.headers["content-type"]
