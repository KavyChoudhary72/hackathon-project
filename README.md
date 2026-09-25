# FoodLink - Surplus Food Redistribution Platform

FoodLink connects surplus food from banquets, caterers, and restaurants with verified shelters and community kitchens in real time using a deterministic 3-tier rescue engine, event-driven architecture, and AI-powered assistant.

---

## 📁 Project Structure

```
├── frontend/             # Next.js 14 Web Application (App Router, Tailwind CSS, Lucide icons, GSAP, Leaflet)
│   ├── app/              # Next.js App Router pages (Donor, Shelter, Driver, Deals, Impact, Rewards)
│   ├── components/       # UI components and interactive modules
│   ├── lib/              # API clients, mock engine, types, state stores
│   └── public/           # Static assets
│
├── backend/              # FastAPI Python Backend Services & AI Engine
│   ├── app/              # Application core, API routes, models, matching engine, features
│   ├── scripts/          # Seed data and demo simulation scripts
│   ├── tests/            # Pytest test suite (Tier 1-3 engines, OTP, rewards, state machine)
│   └── venv/             # Python virtual environment
│
├── package.json          # Root scripts for running frontend, backend, tests, and seed tasks
└── pytest.ini            # Root pytest configuration
```

---

## 🚀 Quick Start & Development Commands

### 1. Run Frontend Dev Server
```bash
npm run dev
# Or: npm --prefix frontend run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Backend API Server
```bash
npm run dev:backend
# Or from backend/: venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
- API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Run Backend Tests
```bash
npm run test:backend
# Or: backend\venv\Scripts\pytest.exe
```

### 4. Build Frontend for Production
```bash
npm run build
```

### 5. Seed Demo Scenario Data
```bash
npm run seed:backend
```

---

## ⚙️ Environment Configuration

- **Backend**: Configured in [backend/.env](file:///backend/.env) (refer to [backend/.env.example](file:///backend/.env.example) for defaults). Supports MongoDB Atlas or in-memory fallback.
- **Frontend**: Configured in [frontend/.env.example](file:///frontend/.env.example). `NEXT_PUBLIC_USE_MOCK=true` enables instant standalone prototyping, while `false` connects to the FastAPI backend.
