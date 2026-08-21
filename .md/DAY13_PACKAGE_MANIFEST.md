# Endoora Day 13 Package Manifest

## Day 13 — Build the versioned question bank schema

This package is designed for the current Endoora repository after the Day 12 taxonomy checkpoint.

### Objective

Create one copyright-safe, versioned question bank that can later be reused by placement, practice,
teacher assignments, and IELTS-like simulations without copying questions into separate domains.

### NEW — backend question-bank domain

- `apps/api/questions/__init__.py`
- `apps/api/questions/apps.py`
- `apps/api/questions/models.py`
- `apps/api/questions/permissions.py`
- `apps/api/questions/normalization.py`
- `apps/api/questions/grading.py`
- `apps/api/questions/serializers.py`
- `apps/api/questions/services.py`
- `apps/api/questions/views.py`
- `apps/api/questions/urls.py`
- `apps/api/questions/admin.py`
- `apps/api/questions/tests.py`
- `apps/api/questions/management/commands/import_questions.py`
- `apps/api/questions/management/commands/export_questions.py`
- `apps/api/questions/migrations/0001_initial.py`

### NEW — Persian-first preview

- `apps/web/app/(admin)/content/questions/page.tsx`
- `apps/web/app/(admin)/content/questions/QuestionBankPreview.tsx`
- `apps/web/app/(admin)/content/questions/question-bank.module.css`

The preview defaults to Persian/RTL and keeps English learning content isolated LTR. It includes an English interface option.

### NEW — data, governance, and safety files

- `data/question-schema.json`
- `data/questions/endoora_day13_samples.v1.json`
- `docs/content/question-bank-governance.md`
- `docs/operations/DAY_13_ACCEPTANCE_GATE.md`
- `scripts/apply_day13.py`
- `scripts/check_day13.py`
- `scripts/backup_day13.ps1`
- `scripts/finalize_day13.py`

### PATCHED SAFELY BY `scripts/apply_day13.py`

- `apps/api/endoora_api/settings/base.py` — adds `questions`
- `apps/api/endoora_api/urls.py` — adds `/api/questions/`
- project-memory/API/data-dictionary docs — append Day 13 notes without deleting earlier history

### Question types

MCQ, multi-select, gap fill, matching, ordering, short answer, long writing, audio prompt, speaking prompt.

### Safety properties

- Published/retired versions are immutable.
- Published objective/media links are immutable.
- Learner pre-submission payloads exclude answer keys, accepted variants, rubrics, and explanations.
- The full published-bank list is editor/administrator-only; anonymous users cannot enumerate assessment items.
- Publishing is blocked without author, reviewer, source/license, CEFR level, and a taxonomy objective.
- JSON import is draft-only and idempotent for identical slug/version content.
- Editor APIs are role protected; Support is not an editor.
- Retired versions remain stored for later historical attempts.
- No new secret or provider credential is required.

### Database risk

Day 13 creates database tables and starts referencing Day 12 taxonomy objective IDs.
Create and verify a PostgreSQL backup before `python manage.py migrate`.

### Rollback boundary

Before Day 14 creates placement attempts referencing Day 13 version IDs:

1. stop API/web;
2. restore the verified pre-Day-13 database backup;
3. revert the Day 13 Git commit/files.

Do not casually run `migrate questions zero` after later attempts or assignments reference these versions.
