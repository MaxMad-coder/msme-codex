# Planning — MSME AI Copilot

Deadline: **3rd Aug**. Mentor session: **25th**. Today: **24th July** (per this doc's baseline — adjust dates to your actual start).

Rule: something deployed and clickable by end of Day 2, no exceptions. A live broken-looking app beats a perfect local one.

## Day 1 (Today)
- Finalize scope: kirana store, 5 agents (Inventory, Finance, Sales, GST, Orchestrator/Recommendation)
- Scaffold repo: frontend + backend skeleton, deploy hello-world to Vercel/Render immediately
- Define DB schema (products, sales, expenses, suppliers, customers)
- Write seed data generator (realistic Indian kirana SKUs, ₹ prices)
- Start CODEX_LOG.md — log this session

## Day 2
- Build Orchestrator agent: routes natural-language query → relevant sub-agents
- Build Inventory Agent (stock check, depletion prediction)
- Build Finance Agent (budget check, cash flow)
- Wire basic dashboard UI showing agent chain output
- Deploy update — confirm core flow (ask question → get multi-agent answer) works live

## Day 3
- Sales Agent (demand prediction, trend detection)
- GST Agent (tax impact calc)
- "Why?" explainability button per recommendation
- Business Health Score computation + display

## Day 4 (Mentor Session — 25th)
- Bring specific Codex-strategy questions: multi-agent orchestration patterns, prompt chaining, self-review loops
- Apply feedback same day
- AI Invoice Scanner (OCR) — stretch, start if on schedule

## Day 5
- Natural language DB queries ("who owes me money?")
- Undo/override on agent actions
- Confidence score per recommendation
- Bug pass on core flow

## Day 6
- AI Report Generator (PDF export)
- Codex Activity Timeline page (pull from CODEX_LOG.md entries)
- Multilingual toggle (Hindi/English strings)

## Day 7
- Beautiful dashboard pass: charts, dark mode, agent status cards, animations
- Voice assistant (Web Speech API) if time
- Cut list check — anything half-built gets removed, not left broken

## Day 8
- Full QA pass: fresh browser, fresh account, run entire flow end-to-end
- Fix all console errors, broken links, dead buttons
- Confirm repo commit history is clean and matches deployed app

## Day 9
- Record demo video (script in DEMO_SCRIPT.md), 3 takes max, pick best
- Write Project Description Google Doc (track, problem, tech stack)
- Set Google Doc sharing to "anyone with link"

## Day 10 (Buffer / Submission Day)
- Re-run EVALUATION_CHECKLIST.md against live deployed link
- Submit via BlockseBlock: Create Project → track → links → toggle notes → **Final Submit**
- Verify "My Projects" shows Submitted (not draft)

## Non-negotiables
- Never leave deployed link down overnight
- Every commit message describes what Codex did, not just "update"
- Don't add a feature after Day 7 unless Day 8 QA is already clean
