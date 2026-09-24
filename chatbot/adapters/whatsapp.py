"""
adapters/whatsapp.py
Meta WhatsApp Cloud API adapter.

Responsibilities:
  - X-Hub-Signature-256 verification (uses WA_APP_SECRET)
  - send_text()      — plain text reply (≤4096 chars)
  - send_buttons()   — interactive reply buttons (max 3)
  - Deduplication of inbound message IDs (Meta retries webhooks)
  - Thin extraction of phone, text, media, and location from inbound payload
"""

import hashlib
import hmac
import logging
import os
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

WA_TOKEN        = os.getenv("WA_TOKEN", "")
WA_PHONE_NUMBER_ID = os.getenv("WA_PHONE_NUMBER_ID", "")
WA_APP_SECRET   = os.getenv("WA_APP_SECRET", "")

_GRAPH_BASE = "https://graph.facebook.com/v19.0"

# ─── Message deduplication ────────────────────────────────────────────────────
# Meta can deliver the same webhook payload multiple times; we drop duplicates.

_seen_message_ids: set[str] = set()
_MAX_SEEN = 10_000   # memory guard

def is_duplicate(message_id: str) -> bool:
    if message_id in _seen_message_ids:
        return True
    _seen_message_ids.add(message_id)
    if len(_seen_message_ids) > _MAX_SEEN:
        # Evict the oldest ~half (simple set, order not guaranteed but fine here)
        to_remove = list(_seen_message_ids)[:_MAX_SEEN // 2]
        for mid in to_remove:
            _seen_message_ids.discard(mid)
    return False


# ─── Signature verification ───────────────────────────────────────────────────

def verify_signature(raw_body: bytes, signature_header: str) -> bool:
    """
    Return True if X-Hub-Signature-256 header matches HMAC-SHA256 of the body.
    Always returns True if WA_APP_SECRET is not set (dev mode).
    """
    if not WA_APP_SECRET:
        logger.warning("WA_APP_SECRET not set — skipping signature verification (dev mode).")
        return True
    if not signature_header.startswith("sha256="):
        return False
    expected = hmac.new(
        WA_APP_SECRET.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    received = signature_header.removeprefix("sha256=")
    return hmac.compare_digest(expected, received)


# ─── Inbound payload extraction ──────────────────────────────────────────────

class InboundMessage:
    """Normalized representation of an inbound WhatsApp message."""
    __slots__ = ("message_id", "from_phone", "type", "text",
                 "image_b64", "lat", "lng", "location_name")

    def __init__(self):
        self.message_id:    str = ""
        self.from_phone:    str = ""
        self.type:          str = "text"
        self.text:          str = ""
        self.image_b64:     Optional[str] = None
        self.lat:           Optional[float] = None
        self.lng:           Optional[float] = None
        self.location_name: Optional[str] = None


def extract_message(payload: dict) -> Optional[InboundMessage]:
    """
    Extract a single InboundMessage from a Meta webhook payload dict.
    Returns None if the payload contains no user message (e.g. status updates).
    """
    try:
        entry   = payload["entry"][0]
        changes = entry["changes"][0]["value"]
        messages = changes.get("messages")
        if not messages:
            return None

        raw = messages[0]
        msg = InboundMessage()
        msg.message_id = raw.get("id", "")
        msg.from_phone = f"+{raw['from']}"
        msg.type       = raw.get("type", "text")

        if msg.type == "text":
            msg.text = raw.get("text", {}).get("body", "")

        elif msg.type == "image":
            # Image media — we download and base64-encode for /ai/parse-photo
            media_id = raw.get("image", {}).get("id")
            if media_id:
                msg.image_b64 = _download_media_b64(media_id)
            msg.text = raw.get("image", {}).get("caption", "")

        elif msg.type == "location":
            loc = raw.get("location", {})
            msg.lat           = loc.get("latitude")
            msg.lng           = loc.get("longitude")
            msg.location_name = loc.get("name") or loc.get("address", "")
            msg.text          = f"[location pin: {msg.lat},{msg.lng}]"

        elif msg.type == "interactive":
            # Button reply
            reply = raw.get("interactive", {}).get("button_reply", {})
            msg.text = reply.get("id", "") or reply.get("title", "")

        elif msg.type == "audio":
            # Voice notes — roadmap; treat as empty for now
            msg.text = "[voice note — coming soon]"

        else:
            msg.text = ""

        return msg

    except (KeyError, IndexError, TypeError) as exc:
        logger.warning("Could not extract message from payload: %s", exc)
        return None


def _download_media_b64(media_id: str) -> Optional[str]:
    """
    Download a WhatsApp media object and return it as a base64 string.
    Returns None on any error.
    """
    import base64
    if not WA_TOKEN:
        return None
    try:
        headers = {"Authorization": f"Bearer {WA_TOKEN}"}
        # Step 1: get the media URL
        with httpx.Client(timeout=10) as c:
            r = c.get(f"{_GRAPH_BASE}/{media_id}", headers=headers)
            r.raise_for_status()
            url = r.json().get("url")
            if not url:
                return None
            # Step 2: download binary
            r2 = c.get(url, headers=headers)
            r2.raise_for_status()
            return base64.b64encode(r2.content).decode()
    except Exception as exc:
        logger.warning("Media download failed for %s: %s", media_id, exc)
        return None


# ─── Outbound messaging ───────────────────────────────────────────────────────

async def send_text(to: str, text: str) -> bool:
    """
    Send a plain text message. Truncates to 4096 chars (WhatsApp limit).
    Returns True on success.
    """
    if not WA_TOKEN or not WA_PHONE_NUMBER_ID:
        logger.warning("WhatsApp credentials missing — message not sent to %s", to)
        return False

    to_num = to.lstrip("+")   # Meta expects digits only
    payload = {
        "messaging_product": "whatsapp",
        "to":   to_num,
        "type": "text",
        "text": {"body": text[:4096]},
    }
    return await _send(payload)


async def send_buttons(to: str, body: str, buttons: list[dict]) -> bool:
    """
    Send an interactive reply-button message.
    buttons: list of {"id": str, "title": str} — max 3 items, title ≤20 chars.

    Falls back to plain text if > 3 buttons or credentials missing.
    """
    if len(buttons) > 3:
        # Fallback: convert to numbered list
        lines = [body] + [f"{i+1}. {b['title']}" for i, b in enumerate(buttons)]
        return await send_text(to, "\n".join(lines))

    if not WA_TOKEN or not WA_PHONE_NUMBER_ID:
        return False

    to_num = to.lstrip("+")
    payload = {
        "messaging_product": "whatsapp",
        "to":   to_num,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": body[:1024]},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": b["id"], "title": b["title"][:20]}}
                    for b in buttons[:3]
                ]
            },
        },
    }
    return await _send(payload)


async def _send(payload: dict) -> bool:
    url     = f"{_GRAPH_BASE}/{WA_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WA_TOKEN}",
        "Content-Type":  "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.post(url, headers=headers, json=payload)
            if r.status_code != 200:
                logger.error("WhatsApp send failed %d: %s", r.status_code, r.text[:300])
                return False
            return True
    except Exception as exc:
        logger.exception("WhatsApp send exception: %s", exc)
        return False
