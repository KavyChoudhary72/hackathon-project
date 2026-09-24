"""
adapters/web.py
Web chat widget adapter.

Thin wrapper that converts the HTTP request/response format used by the widget
into the same shape as the WhatsApp adapter so core.handle_message() is identical.
"""

from pydantic import BaseModel
from typing import Optional


class WebChatRequest(BaseModel):
    session_id:  Optional[str] = None
    role:        str            = "donor"
    entity_id:   Optional[str] = None
    text:        str
    image_b64:   Optional[str] = None
    lang:        str            = "en"


class WebChatResponse(BaseModel):
    session_id:    str
    reply:         str
    quick_replies: list[str] = []
