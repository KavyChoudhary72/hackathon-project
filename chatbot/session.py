"""
session.py
In-memory chat session management with 24-hour TTL.
Stores per-user conversation context so the agent remembers
what role/entity the user is, their language preference,
and any ongoing donation draft.
"""

import time
import uuid
from threading import Lock
from typing import Optional

_sessions: dict[str, dict] = {}
_lock = Lock()

SESSION_TTL_SECONDS = 24 * 3600  # 24 hours


def _purge_expired() -> None:
    """Remove sessions older than TTL (called on every access, lazy purge)."""
    now = time.time()
    expired = [sid for sid, s in _sessions.items() if now - s["updated_at"] > SESSION_TTL_SECONDS]
    for sid in expired:
        del _sessions[sid]


def get_or_create(session_id: Optional[str], role: str, lang: str = "en") -> tuple[str, dict]:
    """
    Return (session_id, session_dict).
    Creates a new session if session_id is None or not found.
    """
    with _lock:
        _purge_expired()
        if session_id and session_id in _sessions:
            session = _sessions[session_id]
            session["updated_at"] = time.time()
            # Update role/lang if provided
            if role:
                session["role"] = role
            if lang:
                session["lang"] = lang
            return session_id, session

        # Create new session
        sid = session_id or str(uuid.uuid4())
        session = {
            "session_id": sid,
            "role": role,
            "entity_id": None,   # Set when user "logs in" with a demo account
            "lang": lang,
            "intent": None,      # Current intent being resolved
            "draft": {},         # Partial donation / form data
            "last_ref_id": None, # Last donation/deal/task ID referenced
            "history": [],       # List of {role: user|assistant, content: str}
            "updated_at": time.time(),
        }
        _sessions[sid] = session
        return sid, session


def update_session(session_id: str, **kwargs) -> None:
    """Update arbitrary fields on a session."""
    with _lock:
        if session_id in _sessions:
            _sessions[session_id].update(kwargs)
            _sessions[session_id]["updated_at"] = time.time()


def append_history(session_id: str, role: str, content: str) -> None:
    """Append a message to the session history (kept to last 20 turns)."""
    with _lock:
        if session_id in _sessions:
            _sessions[session_id]["history"].append({"role": role, "content": content})
            # Keep last 20 messages (10 turns)
            _sessions[session_id]["history"] = _sessions[session_id]["history"][-20:]
            _sessions[session_id]["updated_at"] = time.time()


def get_session(session_id: str) -> Optional[dict]:
    """Return the session dict or None."""
    with _lock:
        return _sessions.get(session_id)
