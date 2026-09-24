"""
main.py
FastAPI application entry point for the AnnaSetu chatbot module.

Run locally:
    uvicorn main:app --reload --port 8001

Production (Railway):
    uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from router import router as chat_router

# ─────────────────────────────────────────
# Logging
# ─────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────
# Lifespan (startup / shutdown)
# ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AnnaSetu Chatbot starting up…")

    # Start the backend WebSocket notification listener
    try:
        from notify_handler import start_notify_listener
        start_notify_listener()
    except Exception as exc:
        logger.warning("Could not start notify listener: %s (backend may not be running)", exc)

    yield

    logger.info("AnnaSetu Chatbot shutting down.")


# ─────────────────────────────────────────
# App
# ─────────────────────────────────────────

app = FastAPI(
    title="AnnaSetu Chatbot",
    description=(
        "Chatbot module for AnnaSetu food-rescue platform. "
        "Powered by Gemini Flash with tool-calling. "
        "Supports Donor, Shelter, Driver, Buyer, and Partner roles. "
        "Primary channel: Meta WhatsApp Cloud API. "
        "Guaranteed fallback: web chat widget (POST /chat/message)."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ─────────────────────────────────────────
# CORS
# ─────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = False,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ─────────────────────────────────────────
# Routes
# ─────────────────────────────────────────

app.include_router(chat_router)

# Serve widget static files (CSS + JS) from /widget
widget_dir = os.path.join(os.path.dirname(__file__), "widget")
if os.path.exists(widget_dir):
    app.mount("/widget", StaticFiles(directory=widget_dir), name="widget")


# ─────────────────────────────────────────
# Health check
# ─────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status":  "ok",
        "service": "annasetuchat",
        "version": "1.0.0",
        "channels": ["whatsapp", "web_widget"],
    }
