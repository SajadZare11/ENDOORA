# Day 10 acceptance gate — Teacher application shell

Status: **COMPLETE — implementation, automated checks, and local browser acceptance passed.**

Day 10 follows the roadmap priority order `verification > next session > unanswered request > grading`, gives teachers a separate role workspace, and keeps unavailable future domains explicit rather than fabricating data.

## Delivered experience

- [x] Dedicated Persian-first teacher shell; the public marketing shell is not reused.
- [x] Exactly five teacher destinations on desktop and mobile: Home, Teach, Teacher marketplace, Resources, and Account.
- [x] One dominant action selected by the aggregated dashboard service.
- [x] Verified and unverified teachers receive different, server-derived capability states.
- [x] Classes, learners, Learn Now requests, grading, and schedule use honest operational empty states.
- [x] First-class journey, question-bank shortcut, and capability-gated fixed-class shortcut are visible without claiming unfinished functionality.
- [x] Earnings, billing, settings, and support remain under Account.
- [x] Raw learner writing, audio, transcripts, AI conversations, answers, and private messages are excluded from the summary contract.
- [x] Loading, unauthenticated, wrong-role, offline, API-error, retry, empty, and verified states are handled.
- [x] Persian/English preference persists through the authenticated profile endpoint and rolls back on failure.
- [x] Keyboard focus, reduced motion, tokenized contrast, RTL/LTR logical layout, and 360 px behavior are covered.

## Automated evidence

Run from the repository root unless noted otherwise.

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; 106 static pages generated and teacher routes included |
| `npm run check:day10` | Pass |
| `npm run check:design` | Pass; 14 AA pairs plus focus, reduced motion, logical CSS, and centralized colors |
| `npm run check:day09` | Pass; learner shell regression covered |
| `npm run check:ia` | Pass; exact five-item role navigation covered |
| Django `check` with isolated SQLite | Pass; no issues |
| Django `makemigrations --check --dry-run` with isolated SQLite | Pass; no changes detected |
| Full Django suite with isolated SQLite | Pass; 103 tests |
| `python -m unittest scripts.test_scan_secrets` | Pass; 5 tests |
| `python scripts/scan_secrets.py` | Pass |
| `git diff --check` | Pass; line-ending notices only |

The isolated SQLite override is local test infrastructure only. Production database settings were not changed.

## Browser acceptance evidence

Tested through the in-app browser against the real Next.js and Django applications.

- [x] Anonymous dashboard request returns HTTP 401 and displays the sign-in gate.
- [x] Fresh unverified teacher sees identity verification as the single primary action.
- [x] Primary verification action reaches `/account/profile`.
- [x] Locked fixed-class capability cannot be opened by an unverified teacher.
- [x] A controlled locally verified teacher receives the verified state and can open `/teacher/fixed-classes/new`.
- [x] The fixed-class route clearly states that Day 10 creates no price, capacity, schedule, or class record.
- [x] Question-bank shortcut reaches its honest foundation route without invented questions.
- [x] English selection persists after reload; Persian remains the default for the final state.
- [x] `POST /api/teachers/dashboard/events/` returns HTTP 204 for instrumented actions.
- [x] Browser console contains no warnings or errors; Django log contains no traceback or sensitive payload.
- [x] Desktop accepted at 1440 × 900.
- [x] Mobile accepted at 360 × 844 with five usable destinations and no horizontal overflow (`345 px` client and scroll width inside the scrollbar viewport).

## Privacy and query contract

- [x] API tests enforce teacher-only access and 401/403 boundaries.
- [x] Sensitive learner-evidence keys are rejected from the serialized payload.
- [x] Dashboard aggregation has a bounded service query count.
- [x] Capabilities come from verified account state, not client assumptions.
- [x] Dashboard actions use an allowlisted event contract.

## Deliberately deferred after Day 10

Real class rosters, requests, assignment/grading queues, schedules, earnings ledgers, and teacher-development intelligence require their roadmap domain models. Their present states are explicit, non-clickable where appropriate, and are not Day 10 blockers.

## Success gate

- [x] The teacher can identify the most urgent next action immediately.
- [x] Unverified capabilities stay locked.
- [x] Dashboard summaries expose no raw learner evidence.
- [x] Responsive, localization, permission, empty, error, and retry states pass.
- [x] Automated, browser, security, and repository checks pass.
