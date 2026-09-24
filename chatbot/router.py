"""
router.py
FastAPI router for all /chat endpoints.

Routes:
  GET  /chat/whatsapp/webhook   — Meta verification handshake
  POST /chat/whatsapp/webhook   — inbound WhatsApp messages (200 fast, process async)
  POST /chat/message            — web widget
  GET  /chat/demo/accounts      — demo account list for the widget role picker
  GET  /health                  — (also in main.py; duplicated for Railway health checks)
"""

import asyncio
import logging
import os
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query, Request, Response
from pydantic import BaseModel

from adapters.web      import WebChatRequest, WebChatResponse
from adapters.whatsapp import (
    extract_message,
    is_duplicate,
    send_text,
    verify_signature,
)
from core              import handle_message
from demo_accounts     import DEMO_ACCOUNTS

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

WA_VERIFY_TOKEN = os.getenv("WA_VERIFY_TOKEN", "annasetudemo")

# ─────────────────────────────────────────────────────────────────────────────
# WhatsApp webhook — GET (Meta verification handshake)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/whatsapp/webhook")
async def whatsapp_verify(
    hub_mode:         str = Query(alias="hub.mode",          default=""),
    hub_verify_token: str = Query(alias="hub.verify_token",  default=""),
    hub_challenge:    str = Query(alias="hub.challenge",     default=""),
):
    if hub_mode == "subscribe" and hub_verify_token == WA_VERIFY_TOKEN:
        return Response(content=hub_challenge, media_type="text/plain")
    raise HTTPException(status_code=403, detail="Webhook verification failed")


# ─────────────────────────────────────────────────────────────────────────────
# WhatsApp webhook — POST (inbound messages)
# Always return 200 immediately; process in a background task.
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/whatsapp/webhook")
async def whatsapp_inbound(
    request:          Request,
    background_tasks: BackgroundTasks,
):
    raw_body = await request.body()

    # Signature verification
    sig = request.headers.get("X-Hub-Signature-256", "")
    if not verify_signature(raw_body, sig):
        logger.warning("WhatsApp signature verification failed")
        raise HTTPException(status_code=403, detail="Bad signature")

    try:
        payload = await request.json()
    except Exception:
        return {"status": "ok"}   # always 200

    background_tasks.add_task(_process_whatsapp, payload)
    return {"status": "ok"}


async def _process_whatsapp(payload: dict) -> None:
    """Background: extract the inbound message and drive handle_message()."""
    msg = extract_message(payload)
    if msg is None:
        return   # status update or empty — ignore

    # Deduplication
    if is_duplicate(msg.message_id):
        logger.debug("Duplicate WA message %s — skipped", msg.message_id)
        return

    # Resolve role from phone mapping (handle_message does this too, but we
    # need it for the send_text call on unhandled unknown users)
    from demo_accounts import get_account_by_phone
    account_info = get_account_by_phone(msg.from_phone)
    role = account_info["role"] if account_info else "donor"
    lang = account_info["account"].get("lang", "en") if account_info else "en"

    try:
        reply, _qr = await handle_message(
            user_ref      = msg.from_phone,
            role          = role,
            text          = msg.text,
            image_b64     = msg.image_b64,
            lat           = msg.lat,
            lng           = msg.lng,
            location_name = msg.location_name,
            lang_hint     = lang,
        )
    except Exception as exc:
        logger.exception("handle_message error for %s: %s", msg.from_phone, exc)
        reply = "❌ Something went wrong. Please try again in a moment."

    # Append numbered quick replies to WhatsApp text (buttons are only sent
    # from notify_handler for structured flows; chat replies use plain text QRs)
    if _qr:
        reply = reply + "\n\n" + "\n".join(f"{i+1}. {q}" for i, q in enumerate(_qr))

    await send_text(msg.from_phone, reply)


# ─────────────────────────────────────────────────────────────────────────────
# Web widget — POST /chat/message
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/message", response_model=WebChatResponse)
async def chat_message(req: WebChatRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")

    # Use session_id as user_ref for web users (no phone)
    user_ref = req.session_id or f"web_{req.role}_{id(req)}"

    reply, quick_replies = await handle_message(
        user_ref  = user_ref,
        role      = req.role,
        text      = req.text,
        image_b64 = req.image_b64,
        lang_hint = req.lang,
    )

    # Retrieve the session_id that was created / reused inside handle_message
    from session import _sessions   # peek at internal state for the response
    # Find by user_ref
    sid = req.session_id
    for s_id, s in _sessions.items():
        if s_id == user_ref or s.get("session_id") == user_ref:
            sid = s_id
            break

    return WebChatResponse(
        session_id    = sid or user_ref,
        reply         = reply,
        quick_replies = quick_replies,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Demo accounts (for widget role picker)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/demo/accounts")
async def demo_accounts():
    return {
        "donors":   [{"id": d["id"], "name": d["name"], "address": d["address"]}
                     for d in DEMO_ACCOUNTS["donors"]],
        "shelters": [{"id": s["id"], "name": s["name"], "address": s["address"]}
                     for s in DEMO_ACCOUNTS["shelters"]],
        "drivers":  [{"id": d["id"], "name": d["name"], "vehicle": d["vehicle"]}
                     for d in DEMO_ACCOUNTS["drivers"]],
        "buyers":   [{"id": b["id"], "name": b["name"], "address": b["address"]}
                     for b in DEMO_ACCOUNTS["buyers"]],
        "partners": [{"id": p["id"], "name": p["name"], "type": p["type"]}
                     for p in DEMO_ACCOUNTS["partners"]],
    }
