# Endoora Day 11 — Changed-files package

Day 11 objective: **Configure Django admin, audit logs, and safe settings.**

This package is intentionally additive. It does **not** replace the Day 10 teacher dashboard, learner dashboard, profiles, authentication, or public site.

## New files

### Audit application
- `apps/api/audit/__init__.py`
- `apps/api/audit/apps.py`
- `apps/api/audit/context.py`
- `apps/api/audit/middleware.py`
- `apps/api/audit/models.py`
- `apps/api/audit/redaction.py`
- `apps/api/audit/signals.py`
- `apps/api/audit/admin.py`
- `apps/api/audit/admin_policy.py`
- `apps/api/audit/tests.py`
- `apps/api/audit/migrations/__init__.py`
- `apps/api/audit/migrations/0001_initial.py`
- `apps/api/audit/management/__init__.py`
- `apps/api/audit/management/commands/__init__.py`
- `apps/api/audit/management/commands/bootstrap_admin_roles.py`

### Core operations models/admin
- `apps/api/core/models/__init__.py`
- `apps/api/core/models/settings.py`
- `apps/api/core/admin.py`
- `apps/api/core/migrations/__init__.py`
- `apps/api/core/migrations/0001_initial.py`
- `apps/api/core/test_admin_settings.py`
- `apps/api/core/templates/admin/endoora_index.html`

### Operations documentation
- `docs/operations/admin-guide.md`
- `docs/operations/DAY_11_ACCEPTANCE_GATE.md`
- `docs/operations/DAY_11_BACKUP_RESTORE.md`
- `docs/operations/OPERATIONAL_OWNER_MATRIX.md`

### Scripts
- `scripts/apply_day11.py`
- `scripts/check_day11.py`

## Files patched by `scripts/apply_day11.py`

The installer makes narrow, idempotent edits to existing files instead of replacing them:

- `apps/api/endoora_api/settings/base.py`
  - registers `audit.apps.AuditConfig`
  - installs `audit.middleware.AuditContextMiddleware` after AuthenticationMiddleware
- `apps/api/accounts/admin.py`
  - hides `OneTimeCode.code_hash` from Django admin
- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`
- `docs/product/ROADMAP_PROGRESS.md`
- `docs/quality/TEST_MATRIX.md`

The documentation entries say **Day 11 staged/pending acceptance**. They do not falsely mark Day 11 complete.

## Database migration

Day 11 creates two operational tables:

- `core_systemsetting`
- `core_featureflag`
- `audit_auditevent`

A database backup is required before `python manage.py migrate`.

## Safety properties

- Audit events are append-only through the ORM and read-only in Django admin.
- Audit snapshots redact secrets, authentication material, private learner content, direct contact data, and payment credentials.
- `SystemSetting` rejects secret-like keys and unsafe bypass settings.
- `FeatureFlag` validates rollout percentage, allowed environments, dependencies, and kill-switch behavior.
- Support/editor/finance/moderator access is allow-listed rather than inheriting unrestricted staff access.
- Support cannot edit user roles/capabilities or browse profile evidence.
- One-time-code hashes are not displayed in Django admin.
- No payment state editor is introduced.
- The operations dashboard is branded **Endoora Operations** and includes Persian-first operational guidance.

## Install destination

Extract this ZIP into the **repository root**:

`E:\0\Work\Website\The General Website\Endoora`

Then run the installer from the repository root:

`python scripts\apply_day11.py`

Do not run migrations until you have made the database backup described in `docs/operations/DAY_11_BACKUP_RESTORE.md`.
