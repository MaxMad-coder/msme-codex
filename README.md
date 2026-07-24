# MSME AI Copilot

Multi-agent business copilot for Indian kirana / small retail shops. Built primarily with OpenAI Codex for the **ChatGPT Codex India Hackathon 2026** — Theme 6: AI Agents for Bharat's Businesses.

## Problem
MSMEs run on gut feel — no forecasting, no reconciled books, no early warning on stock or cash. Owners can't afford a data team or an ERP. They need one WhatsApp-simple copilot that thinks for them.

## Solution
A single shop dashboard backed by 5-6 specialized AI agents (inventory, finance, sales, GST, support) that collaborate on real questions like "I'm low on rice, what should I do?" — showing their reasoning chain, not just an answer.

## Tech Stack
- Frontend: React + Tailwind (see `/mnt/skills/public/frontend-design` conventions)
- Backend: Node/Express or FastAPI (pick one, keep consistent)
- DB: SQLite/Postgres, seeded with realistic demo data
- LLM: OpenAI API (agents), Codex for build process itself
- Deploy: Vercel (frontend) + Render (backend), or single Vercel monorepo
- Optional: Whisper/Web Speech API for voice mode

## Core Flow (must work end-to-end for viability gate)
1. Owner logs in → sees Business Health Score dashboard
2. Owner asks a question (text or voice) → Orchestrator routes to relevant agents
3. Agents respond in sequence, visible as a reasoning chain → final recommendation
4. Owner can click "Why?" on any recommendation → plain-language explanation
5. Action can be undone/overridden

## Repo Structure
```
/frontend
/backend
  /agents        <- one file per agent
  /orchestrator
/docs            <- this folder
/codex-logs      <- CODEX_LOG.md entries per session
```

## Links (fill before submission)
- Deployed app:
- GitHub repo:
- Demo video:
- Project doc (Google Doc, public):

## Docs in this folder
- PLANNING.md — day-by-day build plan to Aug 3 deadline
- ARCHITECTURE.md — system design, agent orchestration
- AGENTS.md — Codex agent conventions + per-agent spec (read by Codex as repo convention)
- FEATURES.md — prioritized feature list (core / stretch / cut-if-behind)
- EVALUATION_CHECKLIST.md — self-score against judge rubric before submitting
- DEMO_SCRIPT.md — 3-minute demo video script
- CODEX_LOG_TEMPLATE.md — session log template, doubles as in-app "Codex Activity Timeline" data
