# Day 14 Acceptance Gate — Multi-Stage Placement Session Engine

## Protect
- [x] Day 13 is committed/pushed.
- [x] Working tree reviewed.
- [x] Verified pre-Day-14 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`).

## Database & Models
- [x] `PlacementSession` and `PlacementAnswer` models exist.
- [x] `placement.0001_initial` and `placement.0002_alter_placementanswer_options_and_more` apply cleanly.
- [x] `python manage.py check` passes with 0 issues.
- [x] `makemigrations --check --dry-run` reports no uncommitted changes.
- [x] `QuestionVersion` relation exists on `PlacementAnswer` for historical attempt traceability.

## Placement Session Engine
- [x] Resumable sessions: POST to `/api/placement/sessions/` resumes active unexpired session.
- [x] Session status lifecycle (`active`, `submitted`, `expired`) functions correctly.
- [x] Session expiration timestamp (`expires_at`, 2 hours default) is set server-side.
- [x] Expired sessions cannot accept new answers or section changes.
- [x] Session submission finalizes status to `submitted` and locks answers against subsequent modification.

## Security, Ownership & Anti-Leak Safeguards
- [x] Anonymous access to sessions or questions is rejected (401/403).
- [x] Another user cannot access or submit to a session (object-level query scoping by `user=request.user` returns 404).
- [x] Pre-submission question payload contains no answer keys, correct options, rubrics, solutions, or explanations.
- [x] Idempotency keys prevent duplicate answer rows upon client network retries.
- [x] Updating an answer for the same question within the session updates the existing record with a server timestamp.

## Persian / English / Accessibility & UI
- [x] Placement runner defaults to Persian RTL with English switch.
- [x] English learning prompts, passages, and options are isolated as LTR (`unicode-bidi: isolate`).
- [x] Responsive layout at 360 px has no horizontal overflow.
- [x] Stylesheets use centralized CSS design tokens with zero raw hex colors.
- [x] Network disconnection displays reassuring offline indicator without discarding answers.
- [x] Expired session displays clear recovery state with restart action.

## Automated Gates

Repository root:
- [x] `python scripts\check_day14.py`
- [x] `python scripts\check_day13.py`
- [x] `python scripts\check_day12.py`
- [x] `python scripts\check_day11.py`
- [x] `python scripts\check_day09.py`
- [x] `node scripts\check-public-site.mjs`
- [x] `node scripts\check-day10.mjs`
- [x] `node scripts\check-day01-10.mjs`
- [x] `node scripts\check-components.mjs`
- [x] `node scripts\check-design-tokens.mjs`
- [x] `python scripts\scan_secrets.py`
- [x] `git diff --check`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test placement`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`

## Success Gate

**Multi-stage placement session engine provides secure, resumable, and idempotent test sessions linked to versioned content.**
