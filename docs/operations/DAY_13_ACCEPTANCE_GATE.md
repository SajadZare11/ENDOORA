# Day 13 Acceptance Gate — Versioned Question Bank

## Protect
- [x] Day 12 is committed/pushed.
- [x] Working tree reviewed.
- [x] Verified pre-Day-13 PostgreSQL backup exists outside Git.

## Database
- [x] `questions.0001_initial` applies.
- [x] `python manage.py check` passes.
- [x] `makemigrations --check --dry-run` reports no changes.

## Question bank
- [x] All nine question types exist.
- [x] Parent Question and immutable QuestionVersion are separate.
- [x] Published content cannot be edited.
- [x] Published objective/media links cannot change.
- [x] Unlicensed content cannot publish.
- [x] Author/reviewer/CEFR/objective are required.
- [x] Auto-scored types require an answer key.
- [x] Writing/speaking require a rubric.
- [x] Retired versions remain stored.

## Answer-key security
- [x] Pre-submission payload contains no `answer_key`.
- [x] No `accepted_variants`.
- [x] No `rubric`.
- [x] No explanation.
- [x] Support gets 403 from editor API.
- [x] Editor/administrator can use editor API.
- [x] Authenticated submission returns result/explanation without raw answer key.

## Import/export
- [x] First sample import creates two drafts.
- [x] Second identical import creates zero and skips two.
- [x] Conflicting same slug/version is rejected.
- [x] Unknown/non-objective taxonomy slug is rejected.

## Persian / English / accessibility
- [x] `/content/questions` defaults to Persian RTL.
- [x] English switch works.
- [x] English learning text is isolated LTR.
- [x] 360 px has no horizontal overflow.
- [x] Desktop is readable.
- [x] Loading/empty/error/retry states work.
- [x] Keyboard/focus behavior works.

## Automated gates

Repository root:
- [x] `python scripts\check_day13.py`
- [x] `python scripts\scan_secrets.py`
- [x] `git diff --check`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test questions`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`

## End-of-day demo
- [x] Create/import original item.
- [x] Link stable objective.
- [x] Publish it.
- [x] Open learner-safe preview.
- [x] Inspect Network response: protected fields absent.
- [x] Submit learner answer and see explanation.
- [x] Attempt published edit: blocked.
- [x] Retire version: row remains.

## Success gate

**Question bank supports placement and teacher assignment without duplicating content.**
