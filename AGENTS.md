# AGENTS.md

This file is read by Codex as repo-level convention. Keep it accurate — it's also judge-facing evidence of "genuine agentic usage: planning and self-review."

## Working Agreement for Codex in This Repo
- Before writing code for a new feature: state a short plan (files touched, approach, risks) in the PR/commit description or in `/codex-logs/CODEX_LOG.md`.
- After generating code: self-review for — unused imports, missing error handling, hardcoded secrets, and whether it matches ARCHITECTURE.md's agent pattern.
- Write/run a smoke test for any new agent function before marking it done.
- One agent = one file under `/backend/agents/`. Don't let agents call each other directly — only the Orchestrator calls agents.
- Every agent function returns `{ finding, recommendation, confidence, reasoning }` — no exceptions, keeps Synthesizer generic.
- Log every non-trivial Codex session as an entry in `/codex-logs/CODEX_LOG.md` using CODEX_LOG_TEMPLATE.md format.

## Product Agents (business logic — what the app itself contains)

### Orchestrator Agent
Input: raw user query (text/voice transcript)
Job: classify intent, select sub-agents + call order, pass minimal relevant context to each
Output: ordered reasoning chain → handed to Synthesizer

### Inventory Agent
Input: product context, recent sales velocity
Job: current stock, predicted depletion date, reorder qty + supplier suggestion
Output: `{ finding: "18 units, 2 days to depletion", recommendation: "reorder 50 units", confidence: 0.8, reasoning: [...] }`

### Finance Agent
Input: expenses, current cash position, pending dues
Job: check if a recommended action (e.g., reorder) is affordable now
Output: budget verdict + cash flow note

### Sales Agent
Input: sales history for product/category
Job: trend detection (up/down %), demand forecast for next period
Output: trend %, forecast qty, contributing factors if inferable (season, day-of-week)

### GST Agent
Input: transaction/product tax category
Job: compute tax impact of a recommended action (e.g., reorder cost incl. GST)
Output: tax amount, filing-relevant note if applicable

### Support Agent
Input: customer context, situation (order ready, payment due)
Job: draft a WhatsApp-style message (bilingual if toggle on)
Output: message draft text

### Recommendation Synthesizer
Input: all invoked agents' outputs
Job: merge into one plain-language recommendation + overall confidence score
Output: final answer shown to user, plus stored reasoning chain for "Why?"

## Non-Goals (keep scope tight)
- No real payment processing
- No real WhatsApp API send (draft-only unless time permits)
- No multi-shop / multi-tenant support — single demo shop is enough
