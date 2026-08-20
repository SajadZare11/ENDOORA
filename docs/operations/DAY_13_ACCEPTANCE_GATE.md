# Day 13 Acceptance Gate — Versioned Question Bank

## Protect
- [ ] Day 12 is committed/pushed.
- [ ] Working tree reviewed.
- [ ] Verified pre-Day-13 PostgreSQL backup exists outside Git.

## Database
- [ ] `questions.0001_initial` applies.
- [ ] `python manage.py check` passes.
- [ ] `makemigrations --check --dry-run` reports no changes.

## Question bank
- [ ] All nine question types exist.
- [ ] Parent Question and immutable QuestionVersion are separate.
- [ ] Published content cannot be edited.
- [ ] Published objective/media links cannot change.
- [ ] Unlicensed content cannot publish.
- [ ] Author/reviewer/CEFR/objective are required.
- [ ] Auto-scored types require an answer key.
- [ ] Writing/speaking require a rubric.
- [ ] Retired versions remain stored.

## Answer-key security
- [ ] Pre-submission payload contains no `answer_key`.
- [ ] No `accepted_variants`.
- [ ] No `rubric`.
- [ ] No explanation.
- [ ] Support gets 403 from editor API.
- [ ] Editor/administrator can use editor API.
- [ ] Authenticated submission returns result/explanation without raw answer key.

## Import/export
- [ ] First sample import creates two drafts.
- [ ] Second identical import creates zero and skips two.
- [ ] Conflicting same slug/version is rejected.
- [ ] Unknown/non-objective taxonomy slug is rejected.

## Persian / English / accessibility
- [ ] `/content/questions` defaults to Persian RTL.
- [ ] English switch works.
- [ ] English learning text is isolated LTR.
- [ ] 360 px has no horizontal overflow.
- [ ] Desktop is readable.
- [ ] Loading/empty/error/retry states work.
- [ ] Keyboard/focus behavior works.

## Automated gates

Repository root:
- [ ] `python scripts\check_day13.py`
- [ ] `python scripts\scan_secrets.py`
- [ ] `git diff --check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`

Backend:
- [ ] `python manage.py test questions`
- [ ] `python manage.py test`
- [ ] `python manage.py makemigrations --check --dry-run`

## End-of-day demo
- [ ] Create/import original item.
- [ ] Link stable objective.
- [ ] Publish it.
- [ ] Open learner-safe preview.
- [ ] Inspect Network response: protected fields absent.
- [ ] Submit learner answer and see explanation.
- [ ] Attempt published edit: blocked.
- [ ] Retire version: row remains.

## Success gate

**Question bank supports placement and teacher assignment without duplicating content.**
