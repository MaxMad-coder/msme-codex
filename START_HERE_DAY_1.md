# START HERE — DAY 1 WALKTHROUGH

Today: Set up everything so you can start coding tomorrow. **Takes ~3 hours.**

---

## Step 0: Before You Begin
Have open:
- GitHub account (create if you don't have one)
- Vercel account (sign up with GitHub, free)
- Render account (sign up with GitHub, free)
- OpenAI API key (from platform.openai.com, save it safely)
- This folder of docs (README, AGENTS, ARCHITECTURE, PLANNING, etc.)

---

## Step 1: Create GitHub Repo (10 min)

1. Go to github.com → click + → New repository
2. Name: `msme-copilot` (or similar)
3. Description: "Multi-agent AI copilot for Indian kirana stores. Built with OpenAI Codex for ChatGPT Codex India Hackathon 2026."
4. Public (judges need to see it)
5. Add .gitignore template: Node
6. Create repo
7. Clone locally: `git clone https://github.com/[your-username]/msme-copilot.git && cd msme-copilot`

---

## Step 2: Create Folder Structure (15 min)

Copy-paste into terminal:
```bash
# From msme-copilot/ directory

# Folders
mkdir -p frontend backend/agents backend/db backend/seed backend/routes backend/services backend/middleware
mkdir -p docs codex-logs

# Root files
touch README.md AGENTS.md .gitignore

# docs files
touch docs/ARCHITECTURE.md docs/PLANNING.md docs/FEATURES.md
touch docs/EVALUATION_CHECKLIST.md docs/DEMO_SCRIPT.md docs/CODEX_LOG_TEMPLATE.md

# codex-logs file
touch codex-logs/CODEX_LOG.md

# Echo .gitignore content
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "dist/" >> .gitignore
echo "build/" >> .gitignore
echo "*.sqlite" >> .gitignore
echo "data/" >> .gitignore
```

---

## Step 3: Copy Docs Into Your Repo (10 min)

You have 8 docs in `/outputs`. Copy their **content** into the files you just created:

- `README.md` (copy from outputs)
- `AGENTS.md` (copy from outputs)
- `docs/ARCHITECTURE.md` (copy from outputs)
- `docs/PLANNING.md` (copy from outputs)
- `docs/FEATURES.md` (copy from outputs)
- `docs/EVALUATION_CHECKLIST.md` (copy from outputs)
- `docs/DEMO_SCRIPT.md` (copy from outputs)
- `docs/CODEX_LOG_TEMPLATE.md` (copy from outputs)

**Why?** AGENTS.md is a Codex convention file — Codex reads it every session. Keep it in repo root, up to date, and always pushed.

---

## Step 4: Create Backend package.json (15 min)

File: `backend/package.json`

```json
{
  "name": "msme-copilot-api",
  "version": "1.0.0",
  "description": "Backend API for MSME AI Copilot",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed/seedData.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "dotenv": "^16.0.3",
    "openai": "^3.3.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

Run:
```bash
cd backend
npm install
```

This takes ~2–3 min, let it run.

---

## Step 5: Create Backend .env.example (5 min)

File: `backend/.env.example`

```
# Database
DB_TYPE=sqlite
DB_PATH=./data/msme.db

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

**Copy this to `.env` locally (don't commit .env):**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env, replace OPENAI_API_KEY with your actual key
```

---

## Step 6: Create Frontend package.json (15 min)

File: `frontend/package.json`

```json
{
  "name": "msme-copilot-web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14"
  }
}
```

Run:
```bash
cd frontend
npm install
```

---

## Step 7: Create Frontend .env.example (5 min)

File: `frontend/.env.example`

```
VITE_API_URL=http://localhost:3001
```

Copy to local:
```bash
cp frontend/.env.example frontend/.env
```

---

## Step 8: Create Minimal Server (15 min)

File: `backend/server.js`

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MSME AI Copilot API running',
    timestamp: new Date().toISOString(),
  });
});

// Placeholder for /api/ask endpoint (will implement after agents are built)
app.post('/api/ask', (req, res) => {
  res.json({
    message: 'Endpoint not yet implemented. Build agents first.',
    status: 'pending',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## Step 9: Create Minimal React App (15 min)

File: `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MSME AI Copilot</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

File: `frontend/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

File: `frontend/src/App.jsx`

```javascript
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800">MSME AI Copilot</h1>
        <p className="text-gray-600 mt-2">Building multi-agent intelligence for Indian kirana stores...</p>
        <p className="text-sm text-gray-500 mt-4">API Status: Checking...</p>
      </div>
    </div>
  );
}
```

File: `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

File: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

File: `frontend/tailwind.config.js`

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

File: `frontend/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Step 10: Test Locally (15 min)

### Start backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server running on http://localhost:3001
```

### In another terminal, start frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.3.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Test both
- Open http://localhost:3000 → you see "MSME AI Copilot" + loading message
- Open http://localhost:3001/api/health → you see `{"status":"ok",...}`

Both work? **Step 11.**

---

## Step 11: Deploy Empty Shells (30 min)

### Deploy Backend to Render

1. Push your code to GitHub:
```bash
git add .
git commit -m "init: scaffold frontend + backend with deploy configs"
git push origin main
```

2. Go to render.com, sign up with GitHub
3. New → Web Service
4. Connect repository: select `msme-copilot`
5. Settings:
   - Name: `msme-copilot-api`
   - Environment: `Node`
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
   - Add environment variables:
     - `OPENAI_API_KEY`: [paste your key]
     - `DB_TYPE`: `sqlite`
     - `PORT`: `3001`
     - `NODE_ENV`: `production`
6. Create Web Service

Wait ~2–3 min. You'll get a live URL, e.g., `https://msme-copilot-api.onrender.com`.

Test it:
```bash
curl https://msme-copilot-api.onrender.com/api/health
# Should return: {"status":"ok",...}
```

### Deploy Frontend to Vercel

1. Go to vercel.com, sign up with GitHub
2. Import project → select `msme-copilot`
3. Framework: Vite
4. Root directory: `./frontend`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Environment variables:
   - `VITE_API_URL`: [your Render URL, e.g., `https://msme-copilot-api.onrender.com`]
8. Deploy

Wait ~2 min. You'll get a live URL, e.g., `https://msme-copilot.vercel.app`.

Test it: visit the URL in your browser. You should see the "MSME AI Copilot" card + loading message.

---

## Step 12: Update .env Files (5 min)

In your **local** `frontend/.env`, update:
```
VITE_API_URL=https://msme-copilot-api.onrender.com
```

Now `npm run dev` on frontend will talk to your live deployed backend.

---

## Step 13: Commit & Document (10 min)

```bash
git add .
git commit -m "feat: deploy empty shell to Vercel + Render"
git push origin main
```

Create `codex-logs/CODEX_LOG.md` with your first session:

```markdown
## Session 1 — Day 1, Setup

**Goal:** Scaffold repo + deploy empty shells to confirm CI/CD pipeline works

**Planning:**
- Create folder structure and GitHub repo
- Copy docs into /docs
- Create backend (Express) + frontend (React) skeletons
- Deploy both to Render + Vercel

**Generation:**
- Files: server.js, App.jsx, package.json (backend + frontend), deploy configs

**Self-Review:**
- Both deployed links load without errors
- API /api/health returns correct JSON
- Frontend can reach backend

**Testing:**
- curl http://localhost:3001/api/health → pass
- npm run dev (frontend + backend) → both run without errors
- Deployed URLs load in browser → pass

**Deployment:**
- Backend: https://msme-copilot-api.onrender.com
- Frontend: https://msme-copilot.vercel.app

**Status:** ✅ Empty shell deployable and live
```

Push:
```bash
git add codex-logs/CODEX_LOG.md
git commit -m "docs: log session 1 - repo scaffold + deploy"
git push origin main
```

---

## ✅ You're Done with Day 1

**What you have:**
- [ ] GitHub repo with AGENTS.md + docs
- [ ] Frontend deployed on Vercel (live URL)
- [ ] Backend deployed on Render (live URL, API works)
- [ ] Local dev environment working (npm run dev works on both)
- [ ] Session 1 logged in CODEX_LOG.md

**Sanity check:**
- Both URLs open in browser
- Backend responds to API calls
- Git repo is clean, all docs pushed

**Tomorrow:** Start Session 2 (DB Schema + Seed). Follow EXECUTION_QUICK_REFERENCE.md exactly.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Delete node_modules + package-lock.json, retry `npm install` |
| Render deploy fails | Check build command is `cd backend && npm install`. Check .env vars are set. Check PORT=3001. |
| Vercel deploy fails | Check root directory is `./frontend`. Check VITE_API_URL is set. |
| Frontend can't reach backend | Check VITE_API_URL in deployed Vercel env vars points to live Render URL. Check Render backend is live. |
| Local npm run dev fails | Kill any process on port 3000/3001, retry. Check .env files exist. |

---

## Next Steps (Tomorrow)

Read `EXECUTION_QUICK_REFERENCE.md`, **Session 2 — DB Schema & Seed**.

You'll prompt Codex once, it'll generate schema + seed script, you'll deploy + test.

**Good luck. You're building a hackathon winner.** 🚀
