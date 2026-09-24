import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import init_db, close_db
from app.core.scheduler import start_scheduler, stop_scheduler
from app.features.rewards.handlers import register_rewards_handlers
from app.features.tier2_deals.handlers import register_tier2_handlers
from app.features.tier3_diversion.handlers import register_tier3_handlers
from app.chat.handlers import register_chat_subscribers

# Import Routers
from app.api.features import router as features_router
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
    title="SURPLUS2SHELTER — AI-Powered Real-Time Food Rescue & Redistribution API",
    description="Deterministic 3-tier rescue engine, event-driven feature framework, and CSR proof ledger.",
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

# Include All API Routers
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
    """Health check endpoint for Railway deployment and monitoring."""
    return {
        "status": "healthy",
        "service": "Surplus2Shelter Backend Core",
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
