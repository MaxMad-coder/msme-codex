# Features — Prioritized

## P0 — Core (must ship, viability gate depends on these)
- [ ] Multi-agent orchestration (Orchestrator + Inventory + Finance + Sales + GST agents)
- [ ] Reasoning chain UI (shows each agent's step)
- [ ] Recommendation Synthesizer + final answer
- [ ] Seeded demo data (products, sales, expenses, suppliers, customers)
- [ ] Deployed, publicly accessible, no login wall
- [ ] Business Health Score (score + component breakdown)

## P1 — High judge-impact, build if P0 done by Day 5
- [ ] "Why?" explainability per recommendation
- [ ] Confidence score per recommendation
- [ ] Undo/override button on agent actions
- [ ] Natural language DB queries ("who owes me money?")
- [ ] Codex Activity Timeline page (planning → generation → review → test → deploy, sourced from CODEX_LOG.md)
- [ ] AI Report Generator (PDF export of weekly report)

## P2 — Strong polish, build if P0+P1 done by Day 7
- [ ] AI Invoice Scanner (OCR → auto-add inventory)
- [ ] Multilingual toggle (Hindi/English)
- [ ] Voice assistant (ask/answer by speech)
- [ ] Beautiful dashboard: charts, dark mode, animated metrics, agent status cards
- [ ] Offline-first / low-connectivity queued-sync indicator
- [ ] Cost/latency badge per agent call

## P3 — Cut-first-if-behind
- [ ] AI Meeting Mode (record → summary → action items)
- [ ] AI Risk Detector (proactive warnings)
- [ ] Daily Business Digest (morning summary)
- [ ] WhatsApp real-send integration (vs draft-only)

## Cut Rule
If a P2/P3 item isn't fully working by end of Day 7, remove it from the UI entirely rather than ship it half-broken. A missing feature costs less than a broken one at the viability gate.
