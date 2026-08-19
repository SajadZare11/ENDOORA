# Day 12 Package Manifest

## Day 12 — Build the CEFR skill and content taxonomy

This package is designed to apply **after Day 11** without overwriting Day 11 audit/admin work.

### NEW — backend taxonomy domain

- `apps/api/taxonomy/__init__.py`
- `apps/api/taxonomy/apps.py`
- `apps/api/taxonomy/models.py`
- `apps/api/taxonomy/serializers.py`
- `apps/api/taxonomy/views.py`
- `apps/api/taxonomy/urls.py`
- `apps/api/taxonomy/admin.py`
- `apps/api/taxonomy/tests.py`
- `apps/api/taxonomy/management/__init__.py`
- `apps/api/taxonomy/management/commands/__init__.py`
- `apps/api/taxonomy/management/commands/import_taxonomy.py`
- `apps/api/taxonomy/migrations/__init__.py`
- `apps/api/taxonomy/migrations/0001_initial.py`

### NEW — reviewed seed data

- `data/taxonomy/endoora_core_taxonomy.v1.json`

### NEW — documentation

- `docs/content/taxonomy-governance.md`

### NEW — safety/check scripts

- `scripts/check_day12.py`
- `scripts/backup_day12.ps1`

### PATCHED SAFELY BY `scripts/apply_day12.py`

- `apps/api/endoora_api/settings/base.py`
  - adds `taxonomy` to `INSTALLED_APPS`
  - preserves existing Day 11 `audit`/core settings
- `apps/api/endoora_api/urls.py`
  - adds `/api/taxonomy/`
  - preserves existing API routes
- project-memory documents receive a Day 12 implementation-pending note only; they are not falsely marked accepted before verification.

## Data risk

Day 12 adds database tables and seed records. A verified PostgreSQL backup is required
before `python manage.py migrate` or `python manage.py import_taxonomy`.

## Rollback boundary

Before real Day 13 content references taxonomy IDs, rollback is straightforward:

1. stop API/web;
2. restore the verified pre-Day-12 database backup;
3. revert the Day 12 Git commit/files.

Do not use `migrate taxonomy zero` as the first recovery method on a database containing
later content references.
