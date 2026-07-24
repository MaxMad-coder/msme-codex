# Tech Stack & Folder Structure

## Recommended Stack (Pick One Option)

### Option A — Node/Express + React (Recommended)
```
Frontend:
- React 18+ (create-react-app or Vite)
- Tailwind CSS (styling)
- recharts (charts/graphs)
- axios (API calls)

Backend:
- Node.js + Express
- SQLite (development) or Postgres (production on Render)
- OpenAI SDK (API calls)
- dotenv (env vars)

Deployment:
- Frontend: Vercel
- Backend: Render (free tier fine for this)
```

### Option B — Python/FastAPI + React
```
Frontend: Same as Option A

Backend:
- Python 3.10+
- FastAPI (lightweight, fast)
- SQLAlchemy (ORM, works with SQLite/Postgres)
- openai (API client)
- uvicorn (server)

Deployment:
- Frontend: Vercel
- Backend: Render
```

**Recommendation:** Use Option A (Node/Express) if you're faster with JS. Use Option B if you prefer Python. Both equally competitive. Pick the one you code faster in — speed > perfect tech choice.

---

## Folder Structure (Complete)

```
msme-copilot/
├── README.md                          # Project overview
├── AGENTS.md                          # Codex repo convention file
├── .gitignore                         # Exclude node_modules, .env, etc.
├── .github/
│   └── workflows/
│       └── deploy.yml                 # Optional: CI/CD (if time permits)
│
├── docs/                              # Build-time reference docs
│   ├── ARCHITECTURE.md
│   ├── PLANNING.md
│   ├── FEATURES.md
│   ├── EVALUATION_CHECKLIST.md
│   ├── DEMO_SCRIPT.md
│   └── CODEX_LOG_TEMPLATE.md
│
├── codex-logs/
│   └── CODEX_LOG.md                   # Sessions 1–20, manually appended
│
├── frontend/                          # React app
│   ├── package.json
│   ├── .env.example                   # REACT_APP_API_URL=http://localhost:3001
│   ├── vite.config.js                 # or next.config.js if using Next
│   ├── tailwind.config.js
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.css                  # Tailwind imports
│   │   ├── App.jsx                    # Main component
│   │   ├── i18n/
│   │   │   └── strings.json           # English + Hindi strings
│   │   ├── hooks/
│   │   │   ├── useLanguage.js         # Language toggle hook
│   │   │   └── useApi.js              # Fetch wrapper
│   │   └── components/
│   │       ├── Dashboard.jsx          # Main layout
│   │       ├── BusinessHealthScore.jsx
│   │       ├── QueryInput.jsx
│   │       ├── ReasoningChain.jsx
│   │       ├── Recommendation.jsx
│   │       ├── ExplainabilityModal.jsx
│   │       ├── CodexTimeline.jsx
│   │       ├── ReportGenerator.jsx
│   │       ├── VoiceAssistant.jsx     # Optional
│   │       └── DarkModeToggle.jsx
│   └── vercel.json                    # Vercel deploy config
│
└── backend/                           # Node/Express API
    ├── package.json
    ├── .env.example                   # DB_URL, OPENAI_API_KEY, PORT
    ├── .env                           # (gitignored, create locally)
    ├── server.js                      # Entry point
    ├── middleware/
    │   └── errorHandler.js
    ├── db/
    │   ├── schema.sql                 # Create tables
    │   ├── index.js                   # DB connection
    │   └── migrations/                # Optional versioning
    ├── seed/
    │   ├── seedData.js                # Main seed script (idempotent)
    │   └── kirianaProducts.json       # SKU list, prices
    ├── agents/
    │   ├── orchestrator.js            # Session 3
    │   ├── inventoryAgent.js          # Session 4
    │   ├── financeAgent.js            # Session 5
    │   ├── salesAgent.js              # Session 6
    │   ├── gstAgent.js                # Session 7
    │   ├── supportAgent.js            # Session 8
    │   ├── synthesizer.js             # Session 9
    │   └── nlQueryAgent.js            # Session 17 (P1)
    ├── routes/
    │   ├── ask.js                     # POST /api/ask (Sessions 10)
    │   ├── codex-logs.js              # GET /api/codex-logs (Session 15)
    │   ├── report.js                  # GET /api/report/weekly (Session 16)
    │   └── health.js                  # GET /api/health
    ├── services/
    │   └── openai.js                  # OpenAI API wrapper
    └── render.yaml                    # Render deploy config
```

---

## Dependencies (package.json Quick Reference)

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0",
    "recharts": "^2.7.0",
    "web-vitals": "^3.3.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "dotenv": "^16.0.3",
    "openai": "^3.3.0",
    "uuid": "^9.0.0",
    "pdfkit": "^0.13.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_KEY=xxx              # Only if you add auth later
```

### Backend (.env)
```
# Database
DB_TYPE=sqlite                     # or postgres
DB_PATH=./data/msme.db             # SQLite only
DATABASE_URL=postgres://user:pass@host:5432/msme   # Postgres only

# OpenAI
OPENAI_API_KEY=sk-...             # Your actual key

# Server
PORT=3001
NODE_ENV=development              # or production

# Logging
LOG_LEVEL=info

# CORS
FRONTEND_URL=http://localhost:3000   # Dev; Vercel URL in prod
```

---

## Deploy Configs

### Vercel (Frontend) — vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@api_url_prod"
  }
}
```

### Render (Backend) — render.yaml
```yaml
services:
  - type: web
    name: msme-copilot-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: OPENAI_API_KEY
        scope: build,runtime
      - key: DATABASE_URL
        scope: build,runtime
      - key: NODE_ENV
        value: production
```

---

## Key Commands

### Frontend
```bash
# Dev
npm run dev            # Vite dev server, localhost:5173

# Build
npm run build          # Production bundle to /dist
npm run preview        # Preview production build locally

# Deploy
# (Auto-deploys on git push to main if you connect Vercel)
```

### Backend
```bash
# Install
npm install

# Dev
npm run dev            # Runs with nodemon, watches changes

# Seed database
npm run seed           # Runs seed script (idempotent)

# Start production
npm start              # NODE_ENV=production

# Test agent
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "I am low on rice"}'
```

---

## Database Schema (SQLite)

```sql
-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  stock_qty INTEGER DEFAULT 0,
  reorder_threshold INTEGER DEFAULT 10,
  unit_cost REAL,
  unit_price REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales (transactions)
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  qty INTEGER,
  amount REAL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Expenses
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  category TEXT,
  amount REAL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE suppliers (
  id TEXT PRIMARY KEY,
  name TEXT,
  product_id TEXT,
  lead_time_days INTEGER,
  cost REAL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Customers (with dues)
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT,
  balance_due REAL DEFAULT 0
);

-- Agent runs (for reasoning chain storage + "Why?" explainability)
CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  query TEXT,
  agents_invoked TEXT,           -- JSON array stringified
  reasoning_chain TEXT,          -- JSON array stringified
  final_output TEXT,
  confidence REAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_product_stock ON products(stock_qty);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_agent_runs_timestamp ON agent_runs(timestamp);
```

---

## Typical API Response Examples

### POST /api/ask
```json
{
  "agent_runs_id": "uuid-123",
  "reasoning_chain": [
    {
      "agent": "Inventory",
      "finding": "Rice: 18 units, depletes in 2 days",
      "recommendation": "Reorder 50 units",
      "confidence": 0.85
    },
    {
      "agent": "Finance",
      "finding": "Cash available: ₹25,000",
      "recommendation": "Affordable",
      "confidence": 0.95
    },
    {
      "agent": "Sales",
      "finding": "Demand trend: +15% week-over-week",
      "recommendation": "Increase order qty by 20%",
      "confidence": 0.72
    },
    {
      "agent": "GST",
      "finding": "Reorder cost incl. GST: ₹5,200",
      "recommendation": "Budget this cost",
      "confidence": 1.0
    }
  ],
  "final_answer": "Order 50 units of rice now. You have sufficient cash (₹25,000), demand is growing, and stock will run out in 2 days. Tax impact: ₹200. Confidence: 83%.",
  "overall_confidence": 0.83
}
```

### GET /api/health
```json
{
  "status": "ok",
  "db": "connected",
  "openai": "available",
  "timestamp": "2026-07-25T10:30:00Z"
}
```

---

## Deployment Checklist

### Before Deploying to Vercel
- [ ] `npm run build` succeeds without errors
- [ ] `npm run preview` works locally, UI loads
- [ ] .env.example added to repo (no secrets!)
- [ ] `REACT_APP_API_URL` points to deployed backend URL
- [ ] Connected GitHub repo to Vercel, auto-deploy on push enabled

### Before Deploying to Render
- [ ] `npm install` succeeds
- [ ] `npm run seed` populates DB
- [ ] `npm start` server starts, listens on PORT
- [ ] Environment variables added in Render dashboard
- [ ] Database URL (if Postgres) is set
- [ ] `GET /api/health` returns 200 OK

### After First Deploy
- [ ] Test deployed backend with `curl -X GET https://[backend-url]/api/health`
- [ ] Test deployed frontend by visiting Vercel URL
- [ ] Frontend makes API calls to deployed backend (check network tab)
- [ ] Seed data visible in deployed DB
- [ ] Ask a test question end-to-end, confirm reasoning chain appears

---

## Quick Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error in browser console | Backend CORS not configured | Add `express.cors()` middleware in server.js, set `FRONTEND_URL` in .env |
| API times out (>30s) | OpenAI API call slow | Add timeout handling, cache responses, return fallback |
| Seed script fails on re-run | Not idempotent (duplicates) | Add `DELETE FROM products WHERE ...` before insert, or use UPSERT |
| Deployed frontend loads but blank | Frontend can't reach backend | Check `REACT_APP_API_URL` in deployed env, confirm backend URL is live |
| "Cannot find module" error | Missing dependency | `npm install [package]` in correct directory |
| Database locked (SQLite) | Multiple writes at once | Use Postgres in production, or add mutex lock to seed |

---

## Summary

1. **Start with Option A (Node/Express + React)** — fastest to build.
2. **Deploy shell (empty) on Day 1** — both Vercel + Render, confirm URLs work.
3. **Seed data matters** — realistic kirana store data makes judges believe your AI works.
4. **API contracts first** — define `/api/ask` input/output before building agents.
5. **Test end-to-end daily** — every deploy, run a full query through all agents.
6. **Never commit secrets** — use .env, .env.example (no keys in repo).
7. **Logs are gold** — keep CODEX_LOG.md up to date, it's 15% of your score.

You're ready to build. Let Codex handle the implementation. You handle the deployment + integration + logging.
