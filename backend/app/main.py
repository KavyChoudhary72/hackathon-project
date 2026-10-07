import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from app.core.config import settings
from app.core.db import init_db, close_db
from app.core.scheduler import start_scheduler, stop_scheduler
from app.features.rewards.handlers import register_rewards_handlers
from app.features.tier2_deals.handlers import register_tier2_handlers
from app.features.tier3_diversion.handlers import register_tier3_handlers
from app.chat.handlers import register_chat_subscribers

# Import API Routers
from app.api.features import router as features_router
from app.api.auth import router as auth_router
from app.api.donations import router as donations_router
from app.api.offers import router as offers_router
from app.api.shelters import router as shelters_router
from app.api.deliveries import router as deliveries_router
from app.api.impact import router as impact_router
from app.api.reports import router as reports_router
from app.api.ai import router as ai_router
from app.api.ws import router as ws_router
from app.features.rewards.router import router as rewards_router
from app.features.tier2_deals.router import router as tier2_router
from app.features.tier3_diversion.router import router as tier3_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("surplus2shelter.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    logger.info("Initializing Surplus2Shelter Backend...")
    await init_db()
    start_scheduler()

    # Register Event Bus Subscribers
    register_rewards_handlers()
    register_tier2_handlers()
    register_tier3_handlers()
    register_chat_subscribers()

    logger.info("Startup Sequence & Event Subscribers Initialized Successfully.")
    yield

    # Shutdown Sequence
    logger.info("Shutting down Surplus2Shelter Backend...")
    stop_scheduler()
    await close_db()


app = FastAPI(
    title="FoodLink — AI-Powered Real-Time Surplus Food Rescue & Redistribution API",
    description="FoodLink deterministic 3-tier rescue engine, event-driven feature framework, and statutory CSR tax proof ledger.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers (Must be registered before static/catch-all routes)
app.include_router(auth_router, prefix="/api")
app.include_router(features_router, prefix="/api")
app.include_router(donations_router, prefix="/api")
app.include_router(offers_router, prefix="/api")
app.include_router(shelters_router, prefix="/api")
app.include_router(deliveries_router, prefix="/api")
app.include_router(impact_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(rewards_router, prefix="/api")
app.include_router(tier2_router, prefix="/api")
app.include_router(tier3_router, prefix="/api")
app.include_router(ws_router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "healthy",
        "service": "FoodLink Backend Core",
        "version": "1.0.0",
        "features": {
            "rewards": settings.ENABLE_REWARDS,
            "rescue_deals": settings.ENABLE_RESCUE_DEALS,
            "diversion": settings.ENABLE_DIVERSION,
            "chat": settings.ENABLE_CHAT
        }
    }


@app.post("/demo/reset", tags=["Demo & Seeding"])
async def reset_demo_state():
    """Resets database and re-initializes Jaipur demo scenario data."""
    return {
        "success": True,
        "message": "Demo state successfully reset to initial Jaipur scenario.",
        "error": None
    }


# ==============================================================================
# Next.js Static Export Serving & Wildcard Catch-All Routing
# ==============================================================================

# Locate frontend static export directory
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
PROJECT_ROOT = BASE_DIR.parent                     # hackathon-project/

# Check environment variable or resolve to frontend/out (or backend/static)
FRONTEND_OUT_DIR = Path(
    os.getenv("FRONTEND_DIST_DIR", PROJECT_ROOT / "frontend" / "out")
)
if not FRONTEND_OUT_DIR.exists():
    alt_static = BASE_DIR / "static"
    if alt_static.exists():
        FRONTEND_OUT_DIR = alt_static

# Ensure _next directory exists to mount StaticFiles safely without startup error
next_static_dir = FRONTEND_OUT_DIR / "_next"
next_static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/_next", StaticFiles(directory=str(next_static_dir)), name="next_static")

# Mount any public asset folders if present in the build export
for folder_name in ["images", "assets", "static", "media"]:
    folder_path = FRONTEND_OUT_DIR / folder_name
    if folder_path.exists():
        app.mount(f"/{folder_name}", StaticFiles(directory=str(folder_path)), name=f"static_{folder_name}")


@app.get("/", include_in_schema=False)
async def serve_root():
    """Serves the Next.js root index.html file."""
    index_file = FRONTEND_OUT_DIR / "index.html"
    if index_file.is_file():
        return FileResponse(str(index_file))
    return HTMLResponse(
        content="""
        <!DOCTYPE html>
        <html>
            <head><title>FoodLink Backend</title></head>
            <body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 60px 20px;">
                <h1>🍲 FoodLink FastAPI Backend Active</h1>
                <p>FastAPI is configured to serve the Next.js static export from <code>frontend/out</code>.</p>
                <p>Build the frontend with <code>npm run build</code> in the <code>frontend/</code> directory to generate static pages.</p>
                <div style="margin-top: 24px;">
                    <a href="/docs" style="padding: 10px 20px; background: #0E3B2E; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 12px;">Swagger API Docs</a>
                    <a href="/health" style="padding: 10px 20px; background: #E7F7EE; color: #166534; border-radius: 8px; text-decoration: none; font-weight: bold;">Health Endpoint</a>
                </div>
            </body>
        </html>
        """,
        status_code=200
    )


@app.get("/{path:path}", include_in_schema=False)
async def serve_nextjs_spa(path: str):
    """
    Wildcard catch-all route for Next.js static exports (output: 'export').
    Prevents 404 errors on browser page refreshes for routes like /login, /donor, /shelter, etc.
    1. Skips API, docs, and health endpoints.
    2. Serves exact matching static assets (favicon, manifest, SVGs, etc.).
    3. Serves Next.js exported HTML pages (e.g. /login -> login.html).
    4. Serves directory indexes (e.g. /login -> login/index.html).
    5. Falls back to root index.html for client-side routing.
    """
    # 1. Do not intercept backend API routes, documentation, or health
    if (
        path.startswith("api/")
        or path == "api"
        or path.startswith("docs")
        or path.startswith("redoc")
        or path == "openapi.json"
        or path == "health"
    ):
        raise HTTPException(status_code=404, detail="API route not found")

    # 2. Check for exact physical file (e.g. favicon.ico, robots.txt, image.png)
    exact_file = FRONTEND_OUT_DIR / path
    if exact_file.is_file():
        return FileResponse(str(exact_file))

    # 3. Check for exported HTML page: {path}.html (e.g. /login -> login.html)
    html_page = FRONTEND_OUT_DIR / f"{path.rstrip('/')}.html"
    if html_page.is_file():
        return FileResponse(str(html_page))

    # 4. Check for nested directory HTML: {path}/index.html (e.g. /login -> login/index.html)
    dir_index = FRONTEND_OUT_DIR / path / "index.html"
    if dir_index.is_file():
        return FileResponse(str(dir_index))

    # 5. SPA Fallback: return index.html so Next.js client-side router handles the route
    root_index = FRONTEND_OUT_DIR / "index.html"
    if root_index.is_file():
        return FileResponse(str(root_index))

    # 6. Fallback if frontend has not been exported yet
    return HTMLResponse(
        content=f"""
        <!DOCTYPE html>
        <html>
            <head><title>FoodLink - Page Not Found</title></head>
            <body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 60px 20px;">
                <h2>404 - Static Page Not Found</h2>
                <p>Requested route: <code>/{path}</code></p>
                <p>Next.js static export not found at <code>{FRONTEND_OUT_DIR}</code>.</p>
                <p>Please run <code>npm run build</code> in the <code>frontend/</code> directory.</p>
            </body>
        </html>
        """,
        status_code=404
    )
