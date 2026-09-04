# Day 20 — Adaptive Daily Mission Engine & Wireframe 2 Interactive Experience

## Overview
Day 20 delivers the full implementation of the **Daily Mission** journey specified in **Wireframe 2** (`docs/product/wireframes/daily-mission.md`) and the **Product Constitution** (Rule #2 Explainable Next Action, Rule #8 Transparent Educational Claims).

## Core Principles
1. **Explainable & Evidence-Driven**:
   The daily mission is dynamically derived from real learner evidence:
   - For learners who have completed the 6-section placement test, the engine identifies the lowest-performing skill (Grammar, Vocabulary, Reading, Listening, Writing, Speaking) and builds 3 targeted micro-tasks.
   - For learners who have not yet taken placement, the engine generates an introductory readiness mission that familiarizes them with Endoora's interactive format, ending with a clear CTA to `/placement`.
2. **Wireframe 2 User Flow**:
   `Learner Home` (`/dashboard`)
   → dominant **Continue today's mission**
   → `Mission overview`
   → `Task 1` → `Feedback 1`
   → `Task 2` → `Feedback 2`
   → `Task 3` → `Feedback 3`
   → `Mission complete`
   → `Next best action` (`/placement`, `/review`, or `/path`)
3. **Pre-Submission Payload Protection**:
   Answer keys (`correct_option_id`) and detailed explanations are stripped from `GET /api/missions/today/` until the learner submits an answer via `POST /api/missions/today/submit-step/`.
4. **Product Constitution Rule #8**:
   Zero arbitrary XP, fake fluency points, or premature CEFR claims. Transparent educational acknowledgment that practice is recorded into the learner model to guide subsequent steps.
5. **100% Tokenized CSS**:
   Built using design system tokens (`var(--surface-*)`, `var(--text-*)`, `var(--color-*)`, etc.) with zero raw hex colors and strict English LTR isolation (`unicode-bidi: isolate; direction: ltr;`).

## API Contract
- `GET /api/missions/today/`: Returns today's mission with stripped answer keys for uncompleted tasks.
- `POST /api/missions/today/start/`: Transitions mission status from `ready` to `in_progress`.
- `POST /api/missions/today/submit-step/`: Submits `task_id` and `selected_option_id`, returns instant evaluation, explanation, and next step.
- `POST /api/missions/today/reset/`: Resets tasks for learner re-practice.
