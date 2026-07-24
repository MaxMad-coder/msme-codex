# Quick Reference — Execution Order & Prompts

Copy each prompt into Codex in this exact order. After each session, append to `/codex-logs/CODEX_LOG.md` using the template.

---

## BEFORE YOU START
- [ ] Push README.md + AGENTS.md + PLANNING.md to GitHub
- [ ] Create `/docs` folder locally, add ARCHITECTURE.md + FEATURES.md
- [ ] Create `/codex-logs` folder locally

---

## SESSION 1 — Repo Scaffolding (Day 1, 2 hrs)

**Prompt to Codex:**
```
You are an expert hackathon developer. Read AGENTS.md carefully — it defines how agents in this repo work.

Task: Scaffold a Node/Express backend + React frontend for MSME AI Copilot.

Create these folders:
/frontend (React app, Tailwind CSS)
/backend (Express API)
/backend/agents (empty, agents go here later)
/docs (already has README.md, AGENTS.md)
/codex-logs (create, store session logs here)
/backend/seed (seed data generator)

Create config files:
- backend: .env.example, server.js entry point
- frontend: package.json with React + Tailwind, .gitignore

PLAN your approach first (don't code yet):
1. Folder structure
2. File organization
3. Deployment strategy (Vercel + Render)
4. Dependencies needed

After planning, implement. Then self-review for:
- Correct folder structure
- No hardcoded secrets
- Deploy configs valid
- .gitignore covers node_modules

Target: Empty but deployable app. Both links work, load a hello-world.
```

**After completion:**
- [ ] Git commit: `feat: scaffold frontend + backend structure with deploy config`
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Test both URLs open without errors
- [ ] Log in `/codex-logs/CODEX_LOG.md`: Session 1 planning, what was generated, self-review outcome

---

## SESSION 2 — DB Schema & Seed (Day 1–2, 2 hrs)

**Prompt to Codex:**
```
Read docs/ARCHITECTURE.md — focus on the "Data Model" section.

Task: Create database schema + seed data generator for a kirana store.

Tables needed:
1. products (id, name, category, stock_qty, reorder_threshold, unit_cost, unit_price)
2. sales (id, product_id, qty, date, amount)
3. expenses (id, category, amount, date)
4. suppliers (id, name, product_id, lead_time_days, cost)
5. customers (id, name, balance_due)
6. agent_runs (id, query, agents_invoked array, reasoning_chain array, final_output, confidence 0-1, timestamp)

Create files:
- backend/db/schema.sql (create tables)
- backend/seed/seedData.js (populate realistic kirana store data)

PLAN first:
- What data types for each field?
- Realistic kirana products: rice, lentils, sugar, milk, oil, salt, spices (prices in INR)
- How to make seed idempotent (safe to run multiple times)?
- Which columns need indexes (frequently queried)?

After planning, code schema + seed generator. Self-review:
- No data loss on re-run
- Prices realistic for India
- Timestamps sensible
- Indexes on product_id, date, supplier_id

Test: Run seed twice, confirm no duplicates.
```

**After completion:**
- [ ] Git commit: `feat: create db schema and seed data generator`
- [ ] Push seed script to repo
- [ ] Test locally: `node backend/seed/seedData.js` runs without errors
- [ ] Deploy to Render: confirm seed runs on boot
- [ ] Log session in `/codex-logs/CODEX_LOG.md`

---

## SESSION 3 — Orchestrator Agent (Day 2–3, 2–3 hrs)

**Prompt to Codex:**
```
Read AGENTS.md — Orchestrator Agent spec.

Task: Build the Orchestrator agent.

Orchestrator job:
1. Receive raw user query (text or voice transcript)
2. Classify intent (what business problem is the user asking about?)
3. Decide which sub-agents to call (Inventory? Finance? Sales? GST?)
4. Call them in order (handle dependencies: e.g., Sales before Inventory)
5. Return ordered list of agent outputs + reasoning chain

File: backend/agents/orchestrator.js

PLAN first:
- Intent keywords (inventory/stock, budget/cash, sales/demand, tax/GST, customer/support)
- Agent call order (are there dependencies?)
- How to handle unknown intents (fallback agent?)

Code orchestrator function:
- Input: { query: string }
- Output: { agents_to_call: [], reasoning: string }

Self-review:
- All common queries routed to correct agents
- No hard-coded agent lists in main code (use AGENTS.md spec)
- Error handling for missing context

Test: Try 5 different queries, confirm correct agents selected.
```

**After completion:**
- [ ] Git commit: `feat: build orchestrator agent with intent classification`
- [ ] Test locally, confirm 5 test queries return correct agent lists
- [ ] Log session

---

## SESSION 4 — Inventory Agent (Day 3, 2–3 hrs)

**Prompt to Codex:**
```
Read AGENTS.md — Inventory Agent spec.

Task: Build Inventory Agent.

Spec from AGENTS.md:
- Input: product context, recent sales velocity
- Output: { finding, recommendation, confidence, reasoning }
- Job: current stock, predicted depletion date, reorder qty + supplier suggestion

File: backend/agents/inventoryAgent.js

PLAN first:
- Query products from DB, compute sales velocity (last 7-30 days)
- Calculate days-to-depletion: stock_qty / daily_sales_avg
- Edge cases: zero sales history (fallback to reorder_threshold), new products
- Reorder qty logic: order enough to cover lead_time + buffer

Implement. Self-review:
- Handles edge cases (zero sales, new products)
- Confidence score reflects certainty (0-1)
- Reasoning explains the math plainly

Test: 3 scenarios (low stock, new product, high sales). Confirm output JSON structure.
```

**After completion:**
- [ ] Git commit: `feat: build inventory agent with depletion prediction`
- [ ] Write smoke test
- [ ] Log session

---

## SESSION 5 — Finance Agent (Day 3–4, 1–2 hrs)

**Prompt to Codex:**
```
Read AGENTS.md — Finance Agent spec.

Task: Build Finance Agent.

Spec:
- Input: expenses, current cash position, pending dues
- Output: { finding, recommendation, confidence, reasoning }
- Job: check if a recommended action (e.g., reorder ₹5000) is affordable

File: backend/agents/financeAgent.js

PLAN:
- Query total cash (sum of all income - expenses)
- Query pending dues from customers
- Compute available budget: cash - pending_obligations
- Verdict: can afford or cannot afford proposed action

Implement. Self-review:
- Math is correct (no off-by-one, currency handling)
- Confidence reflects data freshness

Test: 3 scenarios (healthy cash, tight cash, negative balance).
```

**After completion:**
- [ ] Git commit: `feat: build finance agent with affordability check`
- [ ] Log session

---

## SESSION 6 — Sales Agent (Day 4, 1–2 hrs)

**Prompt to Codex:**
```
Read AGENTS.md — Sales Agent spec.

Task: Build Sales Agent.

Spec:
- Input: sales history for a product/category
- Output: { finding, recommendation, confidence, reasoning }
- Job: trend detection (up/down %), demand forecast for next period

File: backend/agents/salesAgent.js

PLAN:
- Query sales data last 30 days
- Compute daily average, % change week-over-week
- Forecast next 7 days based on trend
- Identify factors (day of week patterns? seasonal hints?)

Implement. Self-review:
- Handles sparse data gracefully
- Confidence lower if few data points

Test: 3 scenarios (stable sales, growing, declining).
```

**After completion:**
- [ ] Git commit: `feat: build sales agent with trend detection`
- [ ] Log session

---

## SESSION 7 — GST Agent (Day 4, 1 hr)

**Prompt to Codex:**
```
Read AGENTS.md — GST Agent spec.

Task: Build GST Agent.

Spec:
- Input: transaction/product tax category
- Output: { finding, recommendation, confidence, reasoning }
- Job: compute tax impact of a recommended action

File: backend/agents/gstAgent.js

PLAN:
- Most Indian kirana items: 5% GST (basic foods exempt or low-tax)
- Luxury items: 18-28% GST
- Compute tax on proposed reorder cost

Implement. Self-review.

Test: 3 scenarios (basic food, luxury item, multiple items).
```

**After completion:**
- [ ] Git commit: `feat: build gst agent with tax calculator`
- [ ] Log session

---

## SESSION 8 — Support Agent (Day 4–5, 1 hr)

**Prompt to Codex:**
```
Read AGENTS.md — Support Agent spec.

Task: Build Support Agent.

Spec:
- Input: customer context, situation (order ready, payment due)
- Output: { finding, recommendation, confidence, reasoning }
- Job: draft WhatsApp-style messages

File: backend/agents/supportAgent.js

PLAN:
- Message templates: order ready, payment reminder, thank you
- Customer name personalization
- Bilingual ready (store in strings)

Implement. Self-review.

Test: 3 message types.
```

**After completion:**
- [ ] Git commit: `feat: build support agent with message templates`
- [ ] Log session

---

## SESSION 9 — Synthesizer (Day 5, 2 hrs)

**Prompt to Codex:**
```
Read AGENTS.md — Recommendation Synthesizer spec.

Task: Build Synthesizer.

Spec:
- Input: { agents_outputs: [ Inventory, Finance, Sales, GST, Support outputs ] }
- Output: { final_answer, confidence, reasoning_chain }
- Job: merge agent outputs into one plain-language recommendation

File: backend/agents/synthesizer.js

PLAN:
- Merge findings into summary
- Extract recommendations from all agents
- Compute overall confidence: average or weighted?
- Build reasoning_chain (list of each agent's step for "Why?" button)

Implement. Self-review.

Test: Wire Orchestrator → Agents → Synthesizer, run end-to-end with test query.
```

**After completion:**
- [ ] Git commit: `feat: build synthesizer, completes agent chain`
- [ ] Log session

---

## SESSION 10 — Wire Agents + API Endpoint (Day 5–6, 3 hrs)

**Prompt to Codex:**
```
Read docs/ARCHITECTURE.md.

All agents (Orchestrator, Inventory, Finance, Sales, GST, Support, Synthesizer) are built.

Task: Wire them together into a single API endpoint.

File: backend/routes/ask.js

Endpoint: POST /api/ask
Input: { query: string }
Output: { reasoning_chain: [...], final_answer: string, confidence: number, agent_runs_id: uuid }

Flow:
1. Orchestrator(query) → agent list
2. For each agent: call it, get output, store in reasoning_chain
3. Synthesizer(reasoning_chain) → final answer
4. Store in agent_runs table
5. Return to frontend

PLAN:
- Error handling (what if agent times out?)
- Logging (log every agent call)
- Fallback (if agent fails, continue with partial data)

Implement. Self-review:
- All agents called correctly
- Reasoning chain stored completely
- No unhandled errors
- Correct JSON response

Test end-to-end: POST /api/ask with test query, confirm live output matches expected.
```

**After completion:**
- [ ] Git commit: `feat: wire all agents, create /api/ask endpoint`
- [ ] Deploy to Render
- [ ] Test with curl/Postman against live backend
- [ ] Log session

---

## SESSION 11 — Frontend Dashboard (Day 6–7, 3 hrs)

**Prompt to Codex:**
```
Read AGENTS.md.

Task: Build React dashboard UI.

Components:
1. Header: app title, settings button
2. Business Health Score card: score (0-100), breakdown (inventory/cash/sales/expenses)
3. Query input: text input + "Ask" button + optional "Voice" button
4. Reasoning chain display: timeline of each agent's output
5. Final recommendation card: answer text, confidence score, "Why?" button
6. "Why?" modal: expand reasoning_chain into plain English
7. Undo button: revert last action

Files: frontend/src/components/Dashboard.jsx, frontend/src/components/ReasoningChain.jsx, frontend/src/components/Recommendation.jsx

PLAN:
- State management: useState for query, reasoning_chain, final_answer
- API call: fetch POST /api/ask
- Loading state: show spinner while waiting for response
- Styling: use Tailwind, dark mode ready

Implement. Self-review:
- No console errors
- Responsive (mobile-friendly)
- Reasoning chain displays in readable timeline format
- "Why?" button actually shows reasoning

Test end-to-end: Ask a question on deployed frontend, confirm reasoning chain shows and answer displays.
```

**After completion:**
- [ ] Git commit: `feat: build dashboard UI with reasoning chain visualization`
- [ ] Deploy to Vercel
- [ ] Test end-to-end live
- [ ] Log session

---

## SESSION 12 — P1 Feature: "Why?" Button (Day 7–8, 1 hr)

**Prompt to Codex:**
```
The "Why?" button is already in the UI.

Task: Implement the modal that renders reasoning_chain in plain English.

File: frontend/src/components/ExplainabilityModal.jsx

Input: reasoning_chain (array of agent outputs)
Output: Modal text that explains each step plainly.

Example:
  Inventory Agent found: "18 units, depletes in 2 days"
  Finance Agent found: "Cash available: ₹25,000"
  Sales Agent found: "Demand trend: +15% week-over-week"
  GST Agent found: "Reorder cost incl. GST: ₹5,200"
  Recommendation: "Order 50 units" (80% confidence)

Plain English:
  "Your milk stock of 18 units will run out in 2 days based on recent sales.
   You have ₹25,000 cash available, which covers the ₹5,200 reorder cost.
   Demand is growing 15% week-over-week, so ordering more is smart.
   Recommendation: Order 50 units. Confidence: 80%."

Implement. Self-review: No LLM call needed, just text rendering. Test.
```

**After completion:**
- [ ] Git commit: `feat: add explainability modal for 'Why?' button`
- [ ] Log session

---

## SESSION 13 — P1 Feature: Confidence Score + Undo (Day 8, 1 hr)

**Prompt to Codex:**
```
Task: Add confidence score badge + Undo button to recommendations.

Files: Update Recommendation.jsx

1. Confidence badge: display score as % or gauge (visual indicator, e.g., green if >80%, yellow if 50-80%, red if <50%)
2. Undo button: revert to previous state, or show "action undone" toast

Store action history in state: previousStates array, each state = {reasoning_chain, final_answer}

PLAN:
- Confidence score already in API response
- Undo = pop previous state, restore UI
- History depth: last 5 actions

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add confidence score badge and undo button`
- [ ] Log session

---

## SESSION 14 — P1 Feature: Business Health Score (Day 8, 2 hrs)

**Prompt to Codex:**
```
Task: Build Business Health Score component.

File: frontend/src/components/HealthScore.jsx

Score calculation (backend):
- Inventory health: % of products above reorder threshold (higher = better)
- Cash health: cash_position / monthly_expenses (higher = better, target >3x)
- Sales health: growth trend in last 30 days
- Expense health: expenses / income ratio (lower = better)

Overall: weighted average (or geometric mean), display as 0-100.

UI:
- Big number at top: total score
- 4 mini cards: inventory score, cash score, sales score, expense score
- Color coding: green/yellow/red
- Trend indicators: up/down arrows

PLAN:
- Query DB for all data
- Compute each component score
- Combine into overall score
- Create visualization

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add business health score component`
- [ ] Log session

---

## SESSION 15 — P1 Feature: Codex Activity Timeline (Day 9, 2 hrs)

**Prompt to Codex:**
```
Task: Build page showing Codex development history.

File: frontend/src/components/CodexTimeline.jsx, backend/routes/codex-logs.js

Data source: /codex-logs/CODEX_LOG.md (you manually maintained this)

Parse CODEX_LOG.md:
- Extract each session (## Session [N])
- Goal, Planning steps, Generation summary, Self-Review, Testing, Deployment

UI: Timeline card for each session
- Session N — [goal]
- Planning: [steps]
- Generation: [files changed]
- Self-Review: [issues found]
- Testing: [result]

Endpoint: GET /api/codex-logs → returns parsed log array

Frontend: Render timeline, show how Codex was used progressively.

This demonstrates Codex usage depth (15% score).

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add codex activity timeline page`
- [ ] Ensure CODEX_LOG.md is well-maintained (go back and add entries if missing)
- [ ] Log session

---

## SESSION 16 — P1 Feature: Report Generator (Day 9–10, 2 hrs)

**Prompt to Codex:**
```
Task: Build AI Report Generator (weekly summary + PDF export).

File: backend/routes/report.js, frontend/src/components/ReportGenerator.jsx

Endpoint: GET /api/report/weekly
Output: JSON with sections:
- Sales (total, top products, trend)
- Expenses (total, breakdown by category)
- Inventory (low-stock alerts, suppliers to contact)
- Predictions (expected profit, demand forecast)
- Recommendations (from AI agents)

Frontend button: "Generate Report" → calls endpoint → fetch PDF → download

Use a library like pdfkit or html2pdf.

PLAN:
- Query DB for weekly data
- Compute summaries
- Generate PDF
- Stream to user

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add report generator with PDF export`
- [ ] Log session

---

## SESSION 17 — P1 Feature: Natural Language Queries (Day 10, 2 hrs)

**Prompt to Codex:**
```
Task: Allow users to query DB via natural language.

File: backend/agents/nlQueryAgent.js

Examples:
- "Who owes me money?" → query customers with balance_due > 0
- "Show profit last month" → compute income - expenses for last 30 days
- "Which supplier is cheapest for rice?" → find supplier with lowest cost

PLAN:
- Intent classification (profit, debtors, inventory, sales, suppliers)
- Convert intent → SQL query
- Execute, return in plain English

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add natural language database query agent`
- [ ] Log session

---

## SESSION 18 — P2 Feature: Multilingual (Day 10–11, 1 hr)

**Prompt to Codex:**
```
Task: Add Hindi/English toggle.

Files: frontend/src/i18n/strings.json, frontend/src/hooks/useLanguage.js

Create i18n file with all UI strings in English + Hindi.
Add language toggle button in header.
Update all components to use translated strings.

PLAN:
- Extract all hardcoded strings
- Create translation JSON
- Create useLanguage hook
- Add toggle

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add multilingual support (English/Hindi)`
- [ ] Log session

---

## SESSION 19 — P2 Feature: Voice Assistant (Day 11, 2 hrs) [OPTIONAL]

**Prompt to Codex:**
```
Task: Add voice input/output via Web Speech API.

File: frontend/src/components/VoiceAssistant.jsx

- Mic button: click to record query
- Speech-to-text: convert audio to text
- Feed text to /api/ask
- Text-to-speech: read recommendation aloud

PLAN:
- Use Web Speech API (Chrome/Edge native)
- Fallback for unsupported browsers
- Handle errors gracefully

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: add voice assistant with speech-to-text and text-to-speech`
- [ ] Log session

---

## SESSION 20 — P2 Feature: Beautiful Dashboard (Day 11–12, 2 hrs) [OPTIONAL]

**Prompt to Codex:**
```
Task: Polish UI with charts, animations, dark mode.

Files: Update components with Tailwind + animation libraries

Features:
- Charts: sales trend, expense breakdown (use recharts)
- Dark mode toggle
- Animations: fade-in, slide-up on load
- Agent status cards: visual cards showing each agent's status (planning/running/done)
- Responsive: looks good on mobile

PLAN:
- Add recharts for visualization
- Add Tailwind animation classes
- Add dark mode class toggle

Implement. Self-review. Test.
```

**After completion:**
- [ ] Git commit: `feat: beautify dashboard with charts, animations, dark mode`
- [ ] Log session

---

## DAY 12 — QA PASS

**Checklist:**
- [ ] Fresh browser, fresh account (or guest demo mode)
- [ ] Ask 5 different questions, confirm all work
- [ ] Test "Why?" button, confidence score, undo
- [ ] Test Business Health Score calculation
- [ ] Test Codex Timeline page
- [ ] Test Report Generator
- [ ] Test NL queries
- [ ] Test multilingual toggle (if added)
- [ ] Check console for errors — fix all
- [ ] Check responsive on mobile
- [ ] Deployed backend + frontend links confirmed live
- [ ] Git repo clean, no uncommitted changes

**Fix any broken buttons/features found.** If a feature is half-broken, remove it entirely rather than ship broken.

---

## DAY 13 — DEMO + DOCS

**Record demo video (3 min max):**
```
- Use DEMO_SCRIPT.md
- Record 3 takes, pick best
- Show core flow + Codex usage evidence (Timeline page)
- Clear audio, no background noise
```

**Write Google Doc:**
```
- Track: Theme 6 — AI Agents for Bharat's Businesses
- Problem: MSMEs run on gut feel, no forecasting
- Solution: Multi-agent copilot for kirana stores
- Tech stack: React + Express + SQLite/Postgres + OpenAI API
- Link to GitHub repo
- Link to deployed app
- Screenshots
- Share: "anyone with link"
```

---

## DAY 14 — FINAL CHECK

**Run EVALUATION_CHECKLIST.md:**
- [ ] Viability gate: link opens, core flow works, repo matches demo
- [ ] Technical Execution (50%): code quality, architecture, Codex usage visible
- [ ] Impact & Problem Fit (20%): real problem, meaningful solution
- [ ] Use of Codex (15%): planning, multi-step, self-review, logged in CODEX_LOG.md
- [ ] Creativity (10%): at least one standout feature
- [ ] Completeness (5%): usable end-to-end, demo clear
- [ ] Submission mechanics: all links work, docs public, repo public

**Self-score:** Be honest. If you're weak on any criterion, fix it now.

---

## DAY 15 (AUG 3) — SUBMIT

**BlockseBlock submission:**
1. Go to https://blockseblock.com/dashboard
2. Click "Create Project"
3. Project Name: [your project name]
4. Track: **Theme 6 — AI Agents for Bharat's Businesses**
5. Click "Save & Next"
6. Enter mandatory links:
   - Deployed Application Link: [Vercel/Render live link]
   - GitHub Repository Link: [public repo]
   - Demo Video: [YouTube/drive link, ≤3 min, publicly accessible]
   - Project Description: [Google Doc link, public]
7. Click "Submit Now"
8. Toggle both notes: YES
9. Click "Continue"
10. Click "**Final Submit**" (CRITICAL — drafts don't count)
11. Verify "My Projects" shows status = **Submitted**

**You're done.** Submit early (Aug 1–2) if you can, gives buffer for tech issues.

---

## Key Discipline Rules

1. **Never skip Session 1** — deployed shell first, everything else after.
2. **One agent per Codex session** — don't batch. Plan → Code → Self-Review → Test.
3. **Log every session** — CODEX_LOG.md is 15% of your score.
4. **Deploy daily** — don't let your link go down after Day 2.
5. **Cut broken features** — a missing feature costs 0 points. A broken feature can cost the viability gate.
6. **Demo works > features exist** — judges will try your live link. Make it unbreakable.

---

**Copy this checklist. Print it. Check off every item as you go. You win hackathons by following process, not by guessing.**
