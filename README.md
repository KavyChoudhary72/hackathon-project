# 🍲 FoodLink — AI-Powered Surplus Food Rescue & CSR Redistribution Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**FoodLink** is an enterprise-grade, deterministic food rescue and redistribution platform designed to bridge the gap between commercial surplus food (hotels, banquet gardens, restaurants, university messes) and verified beneficiary shelters in real time. 

Powered by an explainable **3-Tier Cascade Engine**, **Dual-OTP Cryptographic Handover Protocol**, **Multimodal AI Food Vision Verification**, and statutory **Section 80G CSR Tax Exemption & In-Kind Invoice Generation**, FoodLink eliminates food waste while creating audit-verifiable corporate ESG compliance.

---

## 🌟 Core System Highlights & Architecture

### 1. ⚙️ Deterministic 3-Tier Rescue Engine
- **Tier 1: High-Priority Shelter Cascade**
  - **Geospatial Discovery**: Evaluates shelters within a 20 km radial buffer in Jaipur (JLN Marg, Malviya Nagar, Mansarovar, C-Scheme).
  - **Hard Filtering**: Enforces 4 non-negotiable gates: Maximum Distance, Available Meal Capacity, Dietary Compatibility (Veg/Non-Veg), and Active Operating Hours.
  - **Explainable Scoring**: Ranks valid shelters using transparent weights: $0.45 \times \text{ETA} + 0.35 \times \text{Capacity} + 0.20 \times \text{Historical Acceptance Rate}$.
  - **Time-Decay Cascade**: Automatically cascades unmatched offers to candidate #2 if unaccepted within a safety countdown window (180 mins default).
- **Tier 2: Dynamic Rescue Deals**
  - Near-expiry edible food not matched to Tier 1 shelters is routed at dynamic subsidized discounts to FSSAI-licensed local buyers.
- **Tier 3: Industrial Biomass & Composting Diversion**
  - Organic non-edible food waste is routed to Gaushalas and bio-methanation composters.
  - **Enforced Accounting Rule**: Diverted non-human kilograms are strictly segregated from human meal counts in all ledgers.

---

### 2. 🧾 Statutory CSR Tax Invoicing & 80G Exemption Ledger
- **Section 80G(5)(vi) Compliance**: Generates official Tax Invoices for corporate donors (`Hotel Clarks Amer`, `ITC Rajputana`, `MNIT Mess`, `Shree Ram Garden`).
- **CSR Schedule VII (Item i)**: Compliant with MCA mandate for hunger eradication and malnutrition mitigation.
- **Fair In-Kind Valuation**: Normalizes meals at statutory standard valuation of **₹40.00 / meal**.
- **Environmental ESG Credits**: Automatically computes greenhouse gas emissions avoided ($1 \text{ kg food diverted} = 2.5 \text{ kg CO}_2\text{e avoided}$).
- **Printable & Verifiable**: Built-in `window.print()` PDF generation with cryptographic dual-OTP verification hashes and live QR codes.

---

### 3. 🔐 Dual-OTP Verification Protocol
- Eliminates "ghost donations" and fraudulent drop-offs.
- **Pickup Verification**: Donor confirms volunteer arrival with a 4-digit pickup OTP (`4829`).
- **Delivery Verification**: Recipient shelter verifies handover with a unique delivery OTP (`7193`).
- **Audit Event Ledger**: Emits immutable audit event records (`evt_9941a802-83b4`) logged for municipal audit inspections.

---

### 4. 👁️ AI Vision Inspection & Multimodal Assistant
- **AI Camera Scanner**: Donors scan prepared dishes via live camera; Gemini multimodal vision analyzes dish types, portion sizing, and safe consumption windows.
- **AI Rescue Copilot**: Floating interactive chatbot assisting donors, shelters, and drivers with live rescue tracking, ETA lookups, and FSSAI safe surplus donation guidelines.

---

### 5. 👥 Multi-Role Portals & Governance Command Center
| Role | Portal Capabilities |
|---|---|
| 🏨 **Corporate Donor** | <30s surplus posting, live camera AI scanner, active delivery stepper, real-time OTP tracking, CSR Tax Invoices. |
| 🏠 **Shelter NGO** | Live meal offer intake, accept/decline countdown timers, capacity management, incoming delivery OTP. |
| 🛵 **Volunteer Driver** | Mission dispatch cards, route maps to donor & shelter, pickup/delivery OTP verification forms. |
| 👑 **Super Admin** | Decision audits, candidate score breakdowns, dispute queues, partner verifications, points & rules configuration, ESG municipal ledger. |

---

### 6. 🌐 100% Bilingual Support (Hindi & English)
Instant toggling between English and Hindi (**हिंदी**) across all dashboards, labels, forms, invoice receipts, and metric cards.

---

## 📁 Repository Directory Structure

```
hackathon-project/
├── frontend/                          # Next.js 14 App Router Web Application
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── admin/                 # Super Admin Governance Portals
│   │   │   │   ├── donations/         # Rescue Engine Decisions & Audit Trail
│   │   │   │   ├── impact/            # CSR Tax Invoices & ESG Analytics Ledger
│   │   │   │   ├── quality-reports/   # FSSAI Dispute & Spoilage Queue
│   │   │   │   ├── rules/             # Gamification & Point Configuration Matrix
│   │   │   │   └── verifications/     # Partner FSSAI & Shelter Verifications
│   │   │   ├── certificate/           # Official Donor Appreciation Certificate Hub
│   │   │   ├── deals/                 # Tier 2 Dynamic Rescue Deals Marketplace
│   │   │   ├── donor/                 # Donor Dashboard & <30s Surplus Posting
│   │   │   ├── driver/                # Volunteer Driver Missions & OTP Verification
│   │   │   ├── rewards/               # Seva Sathi Gamification & Badges
│   │   │   └── shelter/               # Shelter Ingestion & Real-Time Intake Queue
│   │   ├── (marketing)/               # Public Landing Page, Story Sequence & Login
│   │   ├── globals.css                # Custom UI Tokens, Badges & Print Rules
│   │   └── layout.tsx                 # Root Layout & Global Context Providers
│   ├── components/
│   │   ├── app/                       # Sidebar, AppNavbar, ChatWidget, DemoBar
│   │   ├── donor/                     # CSRInvoiceModal, DonorCertificateModal, LiveCameraScannerModal
│   │   └── marketing/                 # Landing Page Hero, ImpactStory, AboutSection
│   ├── lib/
│   │   ├── api/                       # Typed Fetch Clients & Backend Adapters
│   │   ├── auth/                      # Role-Based Authentication Context
│   │   ├── i18n/                      # Bilingual Localization Engine (EN / HI)
│   │   ├── images.ts                  # High-Resolution Verified Imagery Store
│   │   └── mock/                      # Offline Mock Engine & Seed Fixtures
│   └── messages/                      # Translation Catalogs (en.json, hi.json)
│
├── backend/                           # FastAPI Python High-Performance Backend
│   ├── app/
│   │   ├── api/                       # REST Routers (donations, shelters, reports, auth, ai, ws)
│   │   ├── core/                      # Config, DB connections, Event Bus, Scheduler
│   │   ├── features/                  # Tier 2 Deals, Tier 3 Diversion, Rewards Handlers
│   │   ├── matching/                  # Deterministic Scoring & Hard Filter Engine
│   │   ├── models/                    # Pydantic Schemas & MongoDB Domain Entities
│   │   └── main.py                    # Application Entrypoint & Lifespan Hooks
│   ├── scripts/
│   │   ├── demo_run.py                # End-to-End CLI Demo Pitch Runner
│   │   ├── generate_csr_invoice.py    # Standalone CSR Tax Invoice Generator CLI
│   │   ├── download_images.py         # Static Asset Fetcher
│   │   └── seed.py                    # Jaipur Seed Coordinate & Scenario Fixture
│   ├── tests/                         # Pytest Automated Test Suite (20 passing tests)
│   ├── requirements.txt               # Backend Python Dependencies
│   └── pytest.ini                     # Backend Pytest Configuration
│
├── package.json                       # Root Orchestration Scripts
└── README.md                          # Comprehensive Master Documentation
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI & Styling**: Tailwind CSS, Vanilla CSS Design System, Outfit & Inter Typography
- **Icons & Visuals**: Lucide React Icons, Canvas Confetti
- **QR & Verification**: `qrcode.react` (Cryptographic SVG QRs)
- **State & Data**: SWR (Stale-While-Revalidate), React 18 Context API
- **Internationalization**: Custom zero-dependency bilingual router (`en` / `hi`)

### Backend
- **Framework**: FastAPI (Python 3.10+ / 3.14)
- **Server**: Uvicorn (ASGI)
- **Data Validation**: Pydantic v2
- **Database**: MongoDB with Motor Async Driver (includes in-memory fallback for instant setup)
- **Task Scheduling**: APScheduler (Background timeout monitors & cascade expiry)
- **Testing**: Pytest, Pytest-Asyncio, HTTPX

### AI & Multimodal Intelligence
- **Engine**: Google Gemini 1.5 / 2.0 via Google GenAI SDK
- **Capabilities**: Multimodal dish recognition, portion weight estimation, freshness decay estimation, conversational context copilot.

---

## ⚡ Quick Start & Development Setup

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (Python 3.14 compatible)
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/KavyChoudhary72/hackathon-project.git
cd hackathon-project
```

---

### 2. Frontend Setup & Launch
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 3. Backend Setup & Launch
In a separate terminal:
```bash
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# (Linux / macOS)
# python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### 4. Running Backend Automated Tests
```bash
cd backend
.\venv\Scripts\pytest
```
*All 20 unit tests covering Tier 1 Engine, Tier 2 Deals, Tier 3 Diversion, Status Machine, Rewards, Auth, and CSR Reports will execute and pass.*

---

## 📜 CLI Scripts & Hackathon Demo Tools

### 1. Execute Pitch Demo Runner
Executes the full end-to-end SURPLUS2SHELTER rescue flow and pitch timeline simulation:
```bash
cd backend
python scripts/demo_run.py --url http://localhost:8000
```

### 2. Standalone CSR Tax Invoice Generator
Generate formatted Section 80G CSR Tax Invoices directly in the terminal or export to CSV/JSON:
```bash
cd backend

# Terminal Formatted Table
python scripts/generate_csr_invoice.py --donor "Hotel Clarks Amer Jaipur"

# Export Raw CSV Audit Sheet
python scripts/generate_csr_invoice.py --donor "ITC Rajputana Jaipur" --export-csv csr_tax_invoice.csv

# JSON Output
python scripts/generate_csr_invoice.py --donor "MNIT Campus Central Mess" --format json
```

### 3. Seed Realistic Jaipur Demo Scenario Data
```bash
cd backend
python scripts/seed.py
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check & active feature flags status |
| `POST` | `/api/auth/login` | Role-based login (DONOR, SHELTER, DRIVER, SUPER_ADMIN) |
| `GET` | `/api/features` | Event-driven feature toggle registry |
| `POST` | `/api/donations` | Post surplus food (<30s payload with safety window) |
| `GET` | `/api/donations/{id}` | Real-time rescue progress stepper & status |
| `GET` | `/api/offers/pending` | Active cascade food offers for shelters |
| `POST` | `/api/offers/{id}/accept` | Shelter acceptance (dispatches volunteer driver) |
| `POST` | `/api/offers/{id}/decline` | Shelter decline (triggers instant Tier 1 cascade) |
| `POST` | `/api/deliveries/verify-pickup` | Verify donor pickup OTP |
| `POST` | `/api/deliveries/verify-delivery` | Verify shelter delivery OTP & trigger rewards |
| `GET` | `/api/impact/summary` | Normalized municipal impact metrics (meals vs kg) |
| `GET` | `/api/reports/csr` | **Statutory CSR Tax Exemption Invoice & CSV export** |
| `POST` | `/api/ai/vision-verify` | AI photo parsing & food safety window check |
| `POST` | `/api/ai/chat` | Streaming rescue assistant copilot |

---

## 📐 Statutory Conversion Factors & Impact Math

$$\text{Total Rescued Meals} = \sum \text{Delivered Food Portions (Human)}$$

$$\text{Weight Diverted (kg)} = \text{Human Meals} \times 0.42\text{ kg} + \text{Diverted Waste (kg)}$$

$$\text{CO}_2\text{e Avoided (kg)} = \text{Total Diverted (kg)} \times 2.50\text{ kg CO}_2\text{e}$$

$$\text{Section 80G In-Kind CSR Valuation (₹)} = \text{Human Meals Rescued} \times \text{₹}40.00$$

> [!NOTE]
> All food rescue metrics are verified under FSSAI Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations, 2019 and registered under NITI Aayog NGO Darpan ID `RJ/2026/0319482`.

---

## 🤝 Contributing & License

Contributions are welcome! Please feel free to open issues or submit pull requests.
This project is licensed under the **MIT License**.
