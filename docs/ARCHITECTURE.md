# Architecture — MSME AI Copilot

## System Overview
```
User (owner)
   │  text / voice query
   ▼
Orchestrator Agent
   │  parses intent, decides which sub-agents to call, in what order
   ├──► Inventory Agent   → stock levels, depletion forecast
   ├──► Finance Agent     → budget, cash flow
   ├──► Sales Agent       → demand trend, forecast
   ├──► GST Agent         → tax impact
   └──► Support Agent     → customer replies, WhatsApp message drafts
   │
   ▼
Recommendation Synthesizer
   │  merges agent outputs into one plain-language answer + confidence score
   ▼
UI: reasoning chain (each agent's step shown) → final recommendation → "Why?" → Undo
```

## Data Model (minimum viable)
- `products` (id, name, category, stock_qty, reorder_threshold, unit_cost, unit_price)
- `sales` (id, product_id, qty, date, amount)
- `expenses` (id, category, amount, date)
- `suppliers` (id, name, product_id, lead_time_days, cost)
- `customers` (id, name, balance_due)
- `agent_runs` (id, query, agents_invoked[], reasoning_chain, final_output, confidence, timestamp) — powers both explainability and the Codex Activity Timeline / eval dashboard

## Agent Design Pattern
Each agent = single-responsibility function/module that:
1. Receives structured context (relevant DB slice, not full DB)
2. Returns structured JSON: `{ finding, recommendation, confidence, reasoning }`
3. Never talks to the user directly — only to the Orchestrator/Synthesizer

This keeps agents testable in isolation (important for "Building Evals" adjacent scoring) and keeps Codex's job scoped per file.

## Orchestrator Logic
- Intent classification (simple keyword/embedding match or LLM call) → list of agents to invoke
- Sequential or parallel invocation depending on dependency (e.g., Sales → Inventory needs sales trend first)
- Timeout + fallback: if an agent fails, Synthesizer still returns partial answer, flagged as such

## Explainability
`agent_runs.reasoning_chain` stores each agent's intermediate output. "Why?" button just renders this chain in plain language — no extra LLM call needed at click time (cheaper, faster, more reliable for demo).

## Deployment
- Frontend: Vercel (static/SSR)
- Backend: Render (API + agent orchestration)
- DB: hosted Postgres (Render/Supabase) or SQLite file if backend is single-instance
- No auth wall for judges — public demo login or auto-seeded guest account

## Failure Modes to Guard Against (viability gate risk)
- Cold-start backend timeout on first request after idle → add a keep-alive ping or accept the delay and mention it in demo
- LLM API rate limit mid-demo → cache/mock a fallback response path
- DB reset on redeploy → seed script must be idempotent and run on boot
