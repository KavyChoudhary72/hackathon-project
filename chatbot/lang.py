"""
lang.py
Per-message language detection for Hindi (Devanagari), Hinglish (Roman-script Hindi)
and English. Also handles session-level language pinning.

Detection priority:
  1. Devanagari Unicode block → "hi"
  2. Hinglish Roman patterns  → "hinglish"
  3. Default                  → "en"

Reply language follows detected language unless the session has a pinned language.
"""

import re

# ─── Unicode ranges ───────────────────────────────────────────────────────────
_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")

# Common Roman-Hindi words (add more as needed)
_HINGLISH_WORDS = {
    "bhai", "yaar", "kya", "hai", "haan", "nahi", "na", "ha", "karo",
    "karein", "beje", "bhejo", "bheji", "bheja", "baja", "baje", "raat",
    "subah", "kal", "aaj", "abhi", "thoda", "bahut", "kitna", "kitne",
    "accha", "theek", "sahi", "galat", "nahi", "nai", "ghante", "ghanta",
    "plate", "khana", "khaana", "dal", "chawal", "roti", "sabzi", "meetha",
    "pahuch", "gaya", "lelo", "lenge", "sakte", "dena", "dijiye", "le",
    "de", "kr", "karo", "hoga", "hua", "ho", "mein", "se", "ko", "ka",
    "ki", "ke", "pe", "par", "wala", "wali", "wale", "toh", "tho",
    "bilkul", "zaroor", "please", "bata", "batao", "puch", "pucho",
    "bhej", "dijiye", "dijie", "ok", "done", "thik", "theek", "shukriya",
    "dhanyavaad", "namaste", "namaskar",
}

_HINGLISH_RE = re.compile(
    r"\b(" + "|".join(re.escape(w) for w in _HINGLISH_WORDS) + r")\b",
    re.IGNORECASE,
)

# ─── Public API ───────────────────────────────────────────────────────────────

SUPPORTED_LANGS = {"en", "hi", "hinglish"}


def detect(text: str) -> str:
    """
    Detect the language of a single message.

    Returns
    -------
    "hi"       — Devanagari script
    "hinglish" — Roman-script Hindi
    "en"       — English (default)
    """
    if _DEVANAGARI_RE.search(text):
        return "hi"
    if len(_HINGLISH_RE.findall(text)) >= 1:
        # Threshold: at least 1 known Hinglish word
        return "hinglish"
    return "en"


def effective_lang(detected: str, pinned: str | None) -> str:
    """
    Return the language to reply in.
    Pinned session language takes priority over per-message detection.
    """
    if pinned and pinned in SUPPORTED_LANGS:
        return pinned
    return detected


def parse_pin_command(text: str) -> str | None:
    """
    Check if the user is explicitly setting a language preference.

    Returns the new pinned language code, or None if no pin command found.

    Examples
    --------
    "language hindi"   → "hi"
    "language english" → "en"
    "hindi mein baat"  → "hi"
    """
    t = text.strip().lower()
    if re.search(r"\b(language\s+hindi|hindi\s+(mein|me|mai))\b", t):
        return "hi"
    if re.search(r"\b(language\s+english|english\s+(mein|me|mai))\b", t):
        return "en"
    if re.search(r"\bhinglish\b", t):
        return "hinglish"
    return None


def greeting(lang: str) -> str:
    """Return a short language-appropriate greeting."""
    if lang == "hi":
        return "नमस्ते! 🌱"
    if lang == "hinglish":
        return "Namaste! 🌱"
    return "Hello! 🌱"


def yes_words() -> set[str]:
    """All accepted affirmative words (lowercase)."""
    return {"haan", "ha", "han", "yes", "y", "ok", "okay", "hna", "acha", "accha",
            "bilkul", "zaroor", "sure", "confirm", "confirmed", "post", "bhejo", "bhej"}


def no_words() -> set[str]:
    """All accepted negative words (lowercase)."""
    return {"nahi", "nai", "na", "no", "n", "nope", "cancel", "mat", "ruko",
            "badlo", "change", "edit", "wapas", "back"}


def is_yes(text: str) -> bool:
    return text.strip().lower() in yes_words()


def is_no(text: str) -> bool:
    return text.strip().lower() in no_words()
