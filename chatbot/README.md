# 🤖 Chatbot Module — AnnaSetu

A FastAPI-based chatbot module powered by **Gemini Flash (free tier)** with tool-calling support.  
Acts as a unified assistant for **Donors, Shelters, Drivers, and Buyers**.

---

## Architecture

```
chatbot/
├── main.py              # FastAPI app entry point
├── router.py            # /chat route definitions
├── agent.py             # Gemini Flash agent + tool calling
├── tools.py             # Tool definitions (backend API calls)
├── session.py           # In-memory session management (24h TTL)
├── demo_accounts.py     # Hard-coded demo accounts (no real login)
├── requirements.txt     # Dependencies
├── .env.example         # Environment variable template
└── widget/
    ├── chat-widget.html  # Standalone embeddable widget
    ├── chat-widget.js    # Widget JS (drop into any page)
    └── chat-widget.css   # Widget CSS
```

---

## Setup

```bash
cd chatbot
pip install -r requirements.txt
cp .env.example .env
# Fill in GEMINI_API_KEY and BACKEND_URL in .env
uvicorn main:app --reload --port 8001
```

---

## Integration

### Embedding the widget in any HTML page

```html
<!-- Add before </body> -->
<link rel="stylesheet" href="/widget/chat-widget.css" />
<script>
  window.ANNASETUCHAT_CONFIG = {
    backendUrl: "https://your-backend.railway.app",
    defaultRole: "donor",   // donor | shelter | driver | buyer
    lang: "en"              // en | hi
  };
</script>
<script src="/widget/chat-widget.js"></script>
```

### API

`POST /chat/message`
```json
{
  "session_id": "uuid-v4",
  "role": "donor",
  "text": "I want to donate 50 meals",
  "image_b64": null
}
```
Returns:
```json
{
  "reply": "...",
  "quick_replies": ["View status", "Cancel donation"]
}
```

---

## Roles & Capabilities

| Role    | Can Do                                                                 |
|---------|------------------------------------------------------------------------|
| Donor   | Create donation, check status, get pickup OTP, view impact             |
| Shelter | View pending offers, accept/decline, update capacity                   |
| Driver  | View assigned tasks, confirm pickup/delivery OTPs                      |
| Buyer   | Browse rescue deals nearby, claim a deal, get pickup OTP               |

---

## Connecting to WhatsApp

Set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID` in `.env`.  
Meta webhook routes live at:
- `GET  /chat/whatsapp/webhook`  (verification)
- `POST /chat/whatsapp/webhook`  (inbound messages)
