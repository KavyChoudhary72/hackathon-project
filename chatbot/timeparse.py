"""
timeparse.py
Asia/Kolkata-aware time parser for natural language food-donation times.

Handles:
  - "11 baje tak"        → same AM/PM context as now
  - "raat 10:30"         → 22:30 today
  - "subah 8"            → 08:00 today (or tomorrow if past)
  - "2 ghante"           → now + 2 hours
  - "kal subah 8"        → tomorrow 08:00
  - "tonight"            → today 23:59
  - "10 PM"              → 22:00 today
  - ISO strings          → pass-through
  - Past times           → raises ValueError with a bilingual message

All output is a timezone-aware datetime in Asia/Kolkata.
"""

import re
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")


def now_ist() -> datetime:
    return datetime.now(tz=IST)


def _today_at(hour: int, minute: int, base: datetime) -> datetime:
    return base.replace(hour=hour, minute=minute, second=0, microsecond=0)


def _tomorrow_at(hour: int, minute: int, base: datetime) -> datetime:
    return _today_at(hour, minute, base) + timedelta(days=1)


def parse_time(text: str, base: datetime | None = None) -> datetime:
    """
    Parse a natural-language time string into a timezone-aware datetime (IST).

    Parameters
    ----------
    text : str
        The user's time expression (Hindi, Hinglish, or English).
    base : datetime | None
        Reference "now". Defaults to the actual current IST time.
        Pass in a fixed datetime for unit testing.

    Returns
    -------
    datetime
        Timezone-aware datetime in Asia/Kolkata.

    Raises
    ------
    ValueError
        If the resulting time is in the past or cannot be parsed.
    """
    if base is None:
        base = now_ist()

    # Ensure base is IST-aware
    if base.tzinfo is None:
        base = base.replace(tzinfo=IST)

    text = text.strip().lower()

    # ── ISO pass-through ──────────────────────────────────────────────────────
    try:
        dt = datetime.fromisoformat(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=IST)
        return _validate(dt, base)
    except ValueError:
        pass

    # ── "kal" / "tomorrow" prefix ────────────────────────────────────────────
    is_tomorrow = bool(re.search(r"\bkal\b|tomorrow", text))
    text_clean = re.sub(r"\bkal\b|tomorrow", "", text).strip()

    # ── Night/morning/evening qualifiers ────────────────────────────────────
    is_raat   = bool(re.search(r"\b(raat|night|raath|rat)\b", text_clean))
    is_subah  = bool(re.search(r"\b(subah|morning|sawere|sube)\b", text_clean))
    is_dopahar = bool(re.search(r"\b(dopahar|afternoon|dupahar)\b", text_clean))
    is_shaam  = bool(re.search(r"\b(shaam|evening|sham)\b", text_clean))

    # ── "tonight" ────────────────────────────────────────────────────────────
    if re.search(r"\btonight\b", text_clean):
        dt = _today_at(23, 59, base)
        if is_tomorrow:
            dt += timedelta(days=1)
        return _validate(dt, base)

    # ── Relative: "X ghante" / "X hours" ────────────────────────────────────
    m = re.search(r"(\d+)\s*(ghante|ghanta|hours?|hr)", text_clean)
    if m:
        hrs = int(m.group(1))
        dt = base + timedelta(hours=hrs)
        return _validate(dt, base)

    # ── Relative: "X minute" ─────────────────────────────────────────────────
    m = re.search(r"(\d+)\s*(min|minute|minutes)", text_clean)
    if m:
        mins = int(m.group(1))
        dt = base + timedelta(minutes=mins)
        return _validate(dt, base)

    # ── HH:MM explicit ───────────────────────────────────────────────────────
    m = re.search(r"(\d{1,2}):(\d{2})", text_clean)
    if m:
        h, mn = int(m.group(1)), int(m.group(2))
        h = _apply_qualifier(h, is_raat, is_subah, is_dopahar, is_shaam, base)
        dt = _today_at(h, mn, base)
        if is_tomorrow:
            dt += timedelta(days=1)
        elif dt <= base:
            dt += timedelta(days=1)
        return _validate(dt, base)

    # ── "X baje" / "X o'clock" / "X pm/am" ──────────────────────────────────
    m = re.search(r"(\d{1,2})\s*(baje|baj|o'?clock|pm|am)?", text_clean)
    if m:
        h = int(m.group(1))
        suffix = (m.group(2) or "").strip()

        if suffix == "pm" and h < 12:
            h += 12
        elif suffix == "am" and h == 12:
            h = 0
        else:
            h = _apply_qualifier(h, is_raat, is_subah, is_dopahar, is_shaam, base)

        dt = _today_at(h, 0, base)
        if is_tomorrow:
            dt += timedelta(days=1)
        elif dt <= base:
            # Ambiguity: "11 baje" when it's 10 PM → must mean 11 PM
            dt += timedelta(hours=12) if (dt + timedelta(hours=12)) > base else timedelta(days=1)
            # Re-clamp if 11+12 > 24
            if dt.hour > 23:
                dt = _today_at(h, 0, base) + timedelta(days=1)
        return _validate(dt, base)

    raise ValueError(
        f"Samay samajh nahi aaya: '{text}'. "
        f"Please try: '11 baje tak', '2 ghante', 'raat 10:30', 'kal subah 8'."
    )


def _apply_qualifier(
    h: int,
    is_raat: bool,
    is_subah: bool,
    is_dopahar: bool,
    is_shaam: bool,
    base: datetime,
) -> int:
    """Convert 12-hour hint to 24-hour based on Hindi qualifier words."""
    if is_raat and h < 12:    # raat = night
        return h + 12
    if is_subah and h == 12:  # subah 12 = noon ambiguity → treat as 0
        return 0
    if is_dopahar and h < 12: # dopahar = afternoon
        return h + 12
    if is_shaam and h < 12:   # shaam = evening (5-8 PM range)
        return h + 12 if h < 8 else h
    # No qualifier: use context from base time
    if h < 12 and base.hour >= 20:
        # It's after 8 PM and user says "11 baje" → must mean 11 PM
        return h + 12
    return h


def _validate(dt: datetime, base: datetime) -> datetime:
    """Raise ValueError with a bilingual message if dt is in the past."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=IST)
    if dt <= base:
        formatted = dt.strftime("%d %b, %I:%M %p")
        raise ValueError(
            f"Yeh time nikal gaya ({formatted} IST). "
            f"Sahi safe_until time batayein jo abhi se aage ho.\n"
            f"(This time has already passed. Please provide a future safe-until time.)"
        )
    return dt


def format_ist(dt: datetime) -> str:
    """Format a datetime for display in WhatsApp messages."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=IST)
    return dt.strftime("%d %b, %I:%M %p IST")
