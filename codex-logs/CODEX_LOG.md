## Session 1 — Day 1, Setup

**Goal:** Scaffold the frontend and backend empty shells and verify local development.

**Planning:**
- Add Express backend configuration, environment template, and health endpoint.
- Add Vite/React/Tailwind frontend skeleton and environment template.
- Install dependencies and smoke-test the API and production frontend build.
- Risk: hosted deployment requires the repository owner's authenticated GitHub, Render, and Vercel accounts.

**Generation:**
- Files: backend/package.json, backend/.env.example, backend/server.js
- Files: frontend/package.json, frontend/.env.example, frontend/index.html, frontend/src/*, and Vite/Tailwind configs

**Self-Review:**
- No unused imports found.
- The empty-shell routes have no fallible domain operation; error middleware will be added with the first database/agent routes.
- No hardcoded secrets; `.env` and build outputs are ignored, and API configuration is documented in `.env.example`.
- No product-agent function has been added. Future agent work will follow the Architecture/AGENTS orchestrator-only pattern.

**Testing:**
- `npm install` in `backend/` — pass.
- `npm install` in `frontend/` — pass.
- `curl --fail --silent --show-error http://localhost:3001/api/health` — pass.
- `npm run build` in `frontend/` — pass.

**Deployment:**
- Backend: https://msme-codex.onrender.com
- Frontend: https://msme-codex-cvmkvay10-laingdao-saeng.vercel.app
- Verified `GET /api/health` returns `status: ok` and the frontend returns HTTP 200.
- Verified API CORS permits the deployed frontend origin (`Access-Control-Allow-Origin: *`).

**Day 1 reference review:**
- Confirmed the selected stack: React/Vite/Tailwind frontend on Vercel; Node/Express API with SQLite/OpenAI configuration on Render.
- Reviewed the Day 2 data model: products, sales, expenses, suppliers, customers, and agent_runs.
- Reviewed the project flow: database and idempotent seed first, then one independently tested agent per session, followed by orchestration and UI wiring.

**Status:** ✅ Empty shell deployed and live.

## Session 2 — Database Schema & Seed

**Goal:** Create an idempotent SQLite schema and realistic kirana-store seed dataset.

**Planning:**
- Use SQLite text IDs, integer quantities, REAL INR amounts, ISO dates, and JSON-as-text fields for agent-run arrays.
- Preserve existing data using `CREATE TABLE IF NOT EXISTS` and fixed-ID `INSERT OR IGNORE` statements.
- Index common product, sales-date, supplier, and product-supplier lookups.
- Seed realistic products, suppliers, customers, expenses, and recent sales; initialize the seed safely on startup for Render's ephemeral filesystem.

**Generation:**
- Files: backend/db/schema.sql, backend/seed/seedData.js
- Updated backend/server.js to initialize the database safely at startup.

**Self-Review:**
- Re-runs preserve existing records through fixed IDs and `INSERT OR IGNORE`; schema creation is non-destructive.
- Seeded INR prices and quantities are representative of a small kirana store.
- Dates are ISO-formatted and relative to the current date; agent-run timestamps are reserved for runtime writes.
- Added indexes for sales by product/date, suppliers by product, products by supplier, expenses by date, and agent-run history by timestamp.
- Corrected duplicate supplier IDs found during the first seed verification.

**Testing:**
- Ran `npm run seed` twice against a clean temporary SQLite database — pass; row counts stayed at 10 products, 10 suppliers, 280 sales, 5 expenses, and 5 customers.
- Started the API against a new temporary database — pass; startup created and seeded the database, `/api/health` returned OK, and the products table contained 10 rows.

**Deployment:**
- Pushed commit `3bf793d` to GitHub, triggering the connected Render deployment.
- Verified the live `/api/health` endpoint remains available after the push.
- The server invokes the idempotent seed at startup, so Render recreates demo data after an instance restart or redeploy.

**Status:** ✅ Schema and seed generator complete, deployed through the existing Render pipeline.

**Post-completion audit:**
- Removed one unused import from the seed script.
- Re-seeded a fresh database twice; confirmed expected counts, no foreign-key violations, no duplicate or missing product-sales groups, and no sales-price mismatches.
- Confirmed required product/sales/supplier indexes exist and scanned committed history for project-style API keys.

## Session 3 — Orchestrator Agent

**Goal:** Classify a shop-owner query and return the minimum ordered set of agents needed to answer it.

**Planning:**
- Add `backend/agents/orchestrator.js` and an isolated smoke test.
- Match inventory, finance, sales, GST, and support vocabulary; use Sales before Inventory when both are required.
- Treat blank input as invalid and unknown queries as a generic sales/inventory fallback.
- Do not import or call other agents: integration belongs exclusively to the Session 10 API route.

**Generation:**
- Files: backend/agents/orchestrator.js, backend/agents/orchestrator.test.js
- Added the `test:orchestrator` npm script.

**Self-Review:**
- Returns the shared finding/recommendation/confidence/reasoning contract, with `agents_to_call` for the later route.
- Has no unused imports, hardcoded secrets, or direct agent-to-agent calls.
- Rejects blank input and uses a low-confidence sales/inventory fallback for unknown intent.

**Testing:**
- `npm run test:orchestrator` — pass: inventory, finance, sales, GST, support, unknown, and blank-query scenarios.

**Status:** ✅ Complete and isolated; Session 10 will integrate it.

## Session 5 — Finance Agent

**Goal:** Assess whether a proposed purchase is affordable from seeded sales, expenses, and customer dues.

**Planning:**
- Add an isolated SQLite-backed finance agent and smoke test.
- Calculate cash position as recorded sales less expenses; subtract pending customer dues for a conservative available budget.
- Return the shared result contract for healthy, tight, and negative-balance scenarios.

**Generation:**
- Files: backend/agents/financeAgent.js, backend/agents/financeAgent.test.js
- Added the `test:finance` npm script.

**Self-Review:**
- Uses sales, expenses, and customer dues only; it does not call another agent.
- Rejects invalid costs, uses INR arithmetic consistently, and reserves outstanding dues conservatively.
- No unused imports or secrets; every outcome returns the shared result contract.

**Testing:**
- `npm run test:finance` — pass: healthy cash, unaffordable/tight cash, and invalid-cost scenarios.

**Status:** ✅ Complete and isolated; Session 10 will integrate it.

## Session 4 — Inventory Agent

**Goal:** Produce an evidence-based stock finding, depletion forecast, reorder quantity, and supplier suggestion.

**Planning:**
- Add `backend/agents/inventoryAgent.js` and an isolated smoke test.
- Read only the requested product, its supplier, and its last 30 days of sales from SQLite.
- Compute daily velocity and days to depletion; use the reorder threshold as the safe fallback when there is no sales history.
- Suggest stock covering supplier lead time plus a seven-day buffer; report lower confidence for sparse data.

**Generation:**
- Files: backend/agents/inventoryAgent.js, backend/agents/inventoryAgent.test.js
- Added the `test:inventory` npm script.

**Self-Review:**
- Returns the required shared agent result contract and reads only product, supplier, and sales data.
- Handles invalid/missing products and zero-sales products without division by zero.
- Uses a 30-day velocity, supplier lead time, and a 7-day buffer; sparse history lowers confidence.
- No unused imports, secrets, or direct calls to other agents.

**Testing:**
- `npm run test:inventory` — pass: low-stock, new-product/no-sales, and high-sales scenarios.

**Status:** ✅ Complete and isolated; Session 10 will integrate it.
