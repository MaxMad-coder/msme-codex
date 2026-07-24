# MASTER INDEX — Complete Guide Map

Start here. This document tells you what to read, when, and why.

---

## 📚 Document Index (7 files)

| Document | Purpose | Read When | Duration |
|----------|---------|-----------|----------|
| **00_MASTER_INDEX.md** (this) | Navigation hub | Now | 5 min |
| **START_HERE_DAY_1.md** | Day 1 walkthrough (setup only) | Day 1 morning | 1 hour |
| **PROJECT_FLOWCHART.md** | Complete visual flow + phases | Day 1 after setup | 15 min |
| **EXECUTION_QUICK_REFERENCE.md** | Session-by-session prompts for Codex | Days 2–14 (before each session) | Varies |
| **TECH_STACK_AND_STRUCTURE.md** | Stack choices, folder structure, dependencies | Day 1 before setup | 20 min |
| **README.md** | Project overview, scope | At the start, add to repo root | 5 min |
| **AGENTS.md** | Codex system convention file (repo root) | Day 1 setup, stay in sync | 10 min |
| **ARCHITECTURE.md** | Data model, system design | Day 2 before DB session | 10 min |
| **PLANNING.md** | Day-by-day schedule | Print & check off daily | 5 min |
| **FEATURES.md** | Prioritized feature list (P0/P1/P2) | Ongoing, reference for scope | 3 min |
| **EVALUATION_CHECKLIST.md** | Judge rubric + self-score | Day 12 before final QA | 10 min |
| **DEMO_SCRIPT.md** | 3-minute video script | Day 13 before recording | 5 min |
| **CODEX_LOG_TEMPLATE.md** | Template for session logs | Every session (Days 2–11) | 2 min |

---

## 🗓️ Day-by-Day Reading Guide

### Day 1 (Today) — Setup & Deploy
1. Read: **START_HERE_DAY_1.md** (follow step-by-step)
2. Read: **TECH_STACK_AND_STRUCTURE.md** (confirm choices)
3. Read: **ARCHITECTURE.md** data model section (understand DB)
4. ✅ Deliver: Empty shell deployed, both URLs live

### Day 2 — DB + Seed
1. Read: **EXECUTION_QUICK_REFERENCE.md** Session 2
2. Prompt Codex (follow template)
3. Test locally + deploy
4. Log session in CODEX_LOG.md

### Days 3–5 — Build Agents (Orchestrator → GST)
1. Each morning: Read **EXECUTION_QUICK_REFERENCE.md** for that session
2. Prompt Codex (one agent per session)
3. Test + deploy
4. Log session

### Day 6–7 (Mentor 25th) — Wire + Frontend
1. Session 10: Wire all agents (read EXECUTION_QUICK_REFERENCE.md Session 10)
2. Session 11: Build React UI (read EXECUTION_QUICK_REFERENCE.md Session 11)
3. Deploy both days, test end-to-end
4. Attend Mentor Session 25th, apply feedback same day

### Days 8–10 — P1 Features
1. Continue Sessions 12–17 (EXECUTION_QUICK_REFERENCE.md)
2. One feature per session, same pattern
3. Check **FEATURES.md** for priority order
4. Daily: test deployed link end-to-end

### Day 11 — P2 Features (optional, only if P0+P1 done)
1. Sessions 18–20 (Voice, Multilingual, Beautiful Dashboard)
2. Cut if behind — no broken features shipped

### Day 12 — QA Pass
1. Read: **EVALUATION_CHECKLIST.md**
2. Test: Fresh browser, full end-to-end flow
3. Fix: All console errors, broken buttons
4. Confirm: Deployed links live, repo clean

### Day 13 — Demo + Docs
1. Read: **DEMO_SCRIPT.md**
2. Record: 3-minute video (3 takes, pick best)
3. Write: Google Doc (project description, track, tech stack)
4. Ensure: Google Doc sharing = "anyone with link"

### Day 14 — Final Check
1. Read: **EVALUATION_CHECKLIST.md** again
2. Score yourself: Technical (50%), Impact (20%), Codex usage (15%), Creativity (10%), Completeness (5%)
3. Fix any gaps before submission

### Day 15 (Aug 3) — Submit
1. Go to blockseblock.com/dashboard
2. Create Project → Theme 6 → fill all links
3. Upload demo video link, Google Doc link
4. **Click Final Submit** (critical — drafts don't count)
5. Verify status = Submitted in My Projects

---

## 🔄 Reading Pattern by Role

### If you're a developer (just code it)
1. **START_HERE_DAY_1.md** → Set up infrastructure
2. **TECH_STACK_AND_STRUCTURE.md** → Confirm stack
3. **EXECUTION_QUICK_REFERENCE.md** → Follow prompts each day
4. **CODEX_LOG_TEMPLATE.md** → Log every session
5. Skip deep reads of ARCHITECTURE/AGENTS unless building from scratch

### If you're a hackathon strategist (plan to win)
1. **00_MASTER_INDEX.md** (this) → High-level plan
2. **PROJECT_FLOWCHART.md** → Visual phases
3. **FEATURES.md** → Understand P0/P1/P2 cuts
4. **EVALUATION_CHECKLIST.md** → Align with judge rubric
5. **PLANNING.md** → Timeline buffer management

### If you're reviewing someone else's project
1. **README.md** → What is this?
2. **ARCHITECTURE.md** → How does it work?
3. **AGENTS.md** → Agent contracts and conventions
4. **CODEX_LOG.md** → Did they actually use Codex? (evidence of planning/review)
5. **EVALUATION_CHECKLIST.md** → Score against rubric

---

## 📌 Key Principles (Read Before You Start)

### 1. Viability Gate First
Judges will click your deployed link. If it doesn't load or the core flow breaks, you score 0 regardless of features. Keep the link live 24/7 after Day 2.

**What this means:** By end of Day 8, have a working question → reasoning chain → recommendation flow. Full stop. Add features only after this core is solid.

### 2. Genuine Codex Usage (15% score)
Judges look for **planning + self-review**, not just code generation. Log every session showing:
- What you planned to build
- What Codex generated
- How you self-reviewed the output
- What you tested

**What this means:** Keep CODEX_LOG.md religiously updated. It's your proof that you used Codex properly.

### 3. One Agent Per Session
Don't batch 3 agents in one Codex prompt. Build Orchestrator, test it, log it, move to Inventory, test it, log it, etc.

**Why:** Scoped sessions make self-review visible and testable.

### 4. Deploy Daily
Push to GitHub + deploy to Render/Vercel every evening. Never let your demo link go down.

**Why:** If judges try your link at 11 PM on Aug 3 and it's offline, you lose. Viability gate > features.

### 5. Cut Broken Features
If a P2 feature is half-built by Day 7, delete it. A missing feature costs 0 points. A broken feature can tank your viability gate.

### 6. No Secrets in Repo
Never commit `.env` or API keys. Use `.env.example`, `.gitignore`, and Render/Vercel env var dashboards.

---

## 🎯 Success Checklist (Before Submission)

- [ ] **Viability Gate**: Deployed link opens, core flow (ask → chain → answer) works, repo matches demo
- [ ] **Technical (50%)**: Code is clean, architecture matches ARCHITECTURE.md, Codex evidently built most of it
- [ ] **Impact (20%)**: Problem is real (MSMEs run on gut feel), solution meaningfully helps (forecasting, health score, automation)
- [ ] **Codex Usage (15%)**: CODEX_LOG.md shows planning → generation → self-review → testing for each session
- [ ] **Creativity (10%)**: At least one feature that judges haven't seen (Business Health Score, invoice OCR, or agent reasoning chain)
- [ ] **Completeness (5%)**: End-to-end usable (can ask a question and get a recommendation), demo clearly shows it working
- [ ] **Submission**: All mandatory links work, Google Doc public, Final Submit clicked (not draft)

---

## ⏱️ Time Estimates (Total ~80–100 hours)

| Phase | Time | Notes |
|-------|------|-------|
| Day 1: Setup | 3–4 hrs | Scaffold, deploy empty shells |
| Days 2–7: Core Build (Sessions 1–10) | 20–25 hrs | 2–3 hrs per agent, 3 hrs wiring, 3 hrs UI |
| Days 8–10: P1 Features (Sessions 11–17) | 15–20 hrs | 1–2 hrs per feature |
| Days 11–12: P2 + QA | 10–15 hrs | Optional features + full end-to-end test |
| Days 13–14: Demo + Submission | 5–8 hrs | Record video, write doc, self-score |
| **Total** | **~80–100 hrs** | Doable if you code 8–10 hrs/day |

---

## 🚀 Quickstart (TLDR)

1. **Today**: Read `START_HERE_DAY_1.md`, follow steps, deploy empty shells
2. **Tomorrow**: Read `EXECUTION_QUICK_REFERENCE.md` Session 2, prompt Codex, test, deploy
3. **Days 3–7**: Same pattern—one session per day, one agent per session, deploy after each
4. **Days 8–12**: Add P1 features, run QA, fix bugs
5. **Days 13–15**: Record demo, write Google Doc, submit before deadline

**Don't overthink. Follow the docs. Keep the link live. You'll win.**

---

## 📞 When to Reference Each Doc

| Scenario | Read This |
|----------|-----------|
| "What do I build first?" | PLANNING.md + FEATURES.md |
| "How do I start coding?" | START_HERE_DAY_1.md + EXECUTION_QUICK_REFERENCE.md |
| "What should the agent return?" | AGENTS.md + ARCHITECTURE.md |
| "What stack should I use?" | TECH_STACK_AND_STRUCTURE.md |
| "How do I know if I'm winning?" | EVALUATION_CHECKLIST.md |
| "Why isn't my deployed link working?" | TECH_STACK_AND_STRUCTURE.md (troubleshooting table) |
| "What goes in CODEX_LOG.md?" | CODEX_LOG_TEMPLATE.md |
| "What does the judge see?" | README.md + EVALUATION_CHECKLIST.md |
| "How should my 3-min demo look?" | DEMO_SCRIPT.md |
| "Show me the complete flow start to finish" | PROJECT_FLOWCHART.md |

---

## 💡 Pro Tips

1. **Print PLANNING.md** — put it on your desk. Check off each day.
2. **Keep CODEX_LOG.md open** — append session notes immediately after asking Codex. Don't batch-write at the end.
3. **Deploy every evening** — even if just pushing code, trigger a new build. Confirms pipeline works.
4. **Test against deployed link** — not localhost. Judges test live.
5. **Record demo early** — by Day 12, not Day 14. Gives buffer for retakes.
6. **Ask Codex to self-review** — include "self-review for..." in every prompt. That's how judges see Codex depth.
7. **Keep Business Health Score simple** — 4 metrics, weighted average, done. Don't overthink the formula.
8. **Make "Why?" button first** — cheap to build (just render reasoning_chain), high perceived polish, judges love it.

---

## ✋ Common Mistakes (Avoid These)

- ❌ Building all agents at once → ✅ One agent per session, test in isolation
- ❌ Hiding secrets in repo → ✅ Use .env.example + .gitignore
- ❌ Forgetting to log Codex sessions → ✅ Update CODEX_LOG.md same day
- ❌ Pushing broken features → ✅ Delete incomplete work before Day 7
- ❌ Testing only on localhost → ✅ Test deployed link daily
- ❌ Recording demo on Day 14 → ✅ Record by Day 12, have 2 days buffer
- ❌ Submitting without running EVALUATION_CHECKLIST.md → ✅ Score yourself first, fix gaps
- ❌ Forgetting to click Final Submit → ✅ Drafts don't count, you must click it

---

## 🎖️ How to Win

1. **Nailed viability gate** (deployed link always works) — 70% of the battle
2. **Solid multi-agent orchestration** (every agent works, reasoning chain visible) — next 20%
3. **Codex logging** (CODEX_LOG.md shows planning + review per session) — next 10%
4. **One standout feature** (invoice OCR, Business Health Score, or reasoning explainability) — wins creativity/originality points
5. **Clean 3-min demo** — judges remember what they see on camera more than what's in code

---

## 📋 Print This Checklist

```
DAILY CHECKPOINT

Day: ___
Session: ___

☐ Read today's EXECUTION_QUICK_REFERENCE.md section
☐ Prompt Codex (copied from doc, no ad-libs)
☐ Code generated, no console errors
☐ Tested locally (npm run dev, test query)
☐ Deployed to Render/Vercel (git push, confirm live URL)
☐ Updated CODEX_LOG.md with session entry
☐ Committed to GitHub (git add . && git commit && git push)
☐ Tested deployed link end-to-end

Result: ✅ Ready for next day
```

---

## Final Thought

You have all the information you need to win. The docs are detailed so you don't have to think — just follow them. Codex is a tool, you're the pilot. Keep sessions small, test everything deployed, log everything, ship nothing broken.

**Day 1 starts now. Read START_HERE_DAY_1.md. Go.** 🚀
