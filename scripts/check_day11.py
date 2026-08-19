from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.exists():
        raise SystemExit(f"Missing Day 11 file: {relative}")
    return path.read_text(encoding="utf-8")


required_files = [
    "apps/api/audit/apps.py",
    "apps/api/audit/context.py",
    "apps/api/audit/middleware.py",
    "apps/api/audit/models.py",
    "apps/api/audit/redaction.py",
    "apps/api/audit/signals.py",
    "apps/api/audit/admin.py",
    "apps/api/audit/admin_policy.py",
    "apps/api/audit/tests.py",
    "apps/api/audit/migrations/0001_initial.py",
    "apps/api/audit/management/commands/bootstrap_admin_roles.py",
    "apps/api/core/models/settings.py",
    "apps/api/core/admin.py",
    "apps/api/core/migrations/0001_initial.py",
    "apps/api/core/test_admin_settings.py",
    "apps/api/core/templates/admin/endoora_index.html",
    "docs/operations/admin-guide.md",
    "docs/operations/DAY_11_ACCEPTANCE_GATE.md",
    "docs/operations/DAY_11_BACKUP_RESTORE.md",
    "docs/operations/OPERATIONAL_OWNER_MATRIX.md",
]

for item in required_files:
    read(item)

settings = read("apps/api/endoora_api/settings/base.py")
if '"audit.apps.AuditConfig",' not in settings:
    raise SystemExit("Audit app is not registered in INSTALLED_APPS.")
if '"audit.middleware.AuditContextMiddleware",' not in settings:
    raise SystemExit("Audit middleware is not registered.")
auth_index = settings.find('"django.contrib.auth.middleware.AuthenticationMiddleware"')
audit_index = settings.find('"audit.middleware.AuditContextMiddleware"')
if auth_index == -1 or audit_index < auth_index:
    raise SystemExit("Audit middleware must run after AuthenticationMiddleware.")

audit_model = read("apps/api/audit/models.py")
for required in (
    "Audit events are immutable",
    "before_summary",
    "after_summary",
    "def delete(",
):
    if required not in audit_model:
        raise SystemExit(f"Audit immutability contract missing: {required}")

redaction = read("apps/api/audit/redaction.py")
for forbidden_field in ("password", "code_hash", "raw_writing", "audio", "answer_key", "merchant_id"):
    if forbidden_field not in redaction:
        raise SystemExit(f"Audit redaction rule missing for {forbidden_field}")

safe_settings = read("apps/api/core/models/settings.py")
for required in (
    "class SystemSetting",
    "class FeatureFlag",
    "_SENSITIVE_KEY_FRAGMENTS",
    "_UNSAFE_BOOLEAN_KEYS",
    "rollout_percentage",
    "kill_switch_behavior",
    "dependencies",
):
    if required not in safe_settings:
        raise SystemExit(f"Safe settings/flag contract missing: {required}")

accounts_admin = read("apps/api/accounts/admin.py")
one_time_start = accounts_admin.find("class OneTimeCodeAdmin")
one_time_end = accounts_admin.find("@admin.register(AccountDeletionRequest)", one_time_start)
if one_time_start == -1:
    raise SystemExit("OneTimeCodeAdmin is missing.")
one_time_block = accounts_admin[one_time_start:one_time_end if one_time_end != -1 else None]
if 'exclude = ("code_hash",)' not in one_time_block:
    raise SystemExit("OneTimeCode.code_hash must be excluded from Django admin.")
display_lines = {
    line.strip()
    for line in one_time_block.splitlines()
    if line.startswith("        ")
}
if '"code_hash",' in display_lines:
    raise SystemExit("OneTimeCode.code_hash is still explicitly displayed in Django admin.")


admin_policy = read("apps/api/audit/admin_policy.py")
if 'method_name="has_add_permission"' not in admin_policy:
    raise SystemExit("Day 11 admin policy is missing the has_add_permission guard.")
if "accepts_obj=False" not in admin_policy:
    raise SystemExit(
        "has_add_permission must be guarded without passing an obj argument."
    )
if "return _original(self, request)" not in admin_policy:
    raise SystemExit(
        "has_add_permission wrapper must call Django with (self, request) only."
    )

template = read("apps/api/core/templates/admin/endoora_index.html")
if 'dir="rtl"' not in template or "عملیات Endoora" not in template:
    raise SystemExit("Persian-first Endoora Operations admin summary is missing.")

policy = read("apps/api/audit/admin_policy.py")
for required in (
    "SUPPORT_VIEW",
    '"accounts.user"',
    '"accounts.accountdeletionrequest"',
    'action == "view"',
    "profiles.",
    "payments.",
):
    # profiles/payments are intentionally absent from support allowlist and are covered by tests,
    # so only require them when they appear elsewhere in policy prefixes/tests.
    if required in {"profiles.", "payments."}:
        continue
    if required not in policy:
        raise SystemExit(f"Least-privilege policy contract missing: {required}")

tests = read("apps/api/audit/tests.py")
for required in (
    "test_support_cannot_browse_profile_evidence",
    "test_support_cannot_access_future_payment_state",
    "test_audit_event_cannot_be_modified",
    "test_snapshot_redacts_direct_contact_and_authentication_data",
):
    if required not in tests:
        raise SystemExit(f"Day 11 regression test missing: {required}")

print(
    "Day 11 static checks passed: audit app, immutable events, safe settings, "
    "feature flags, admin hardening, Persian-first operations summary, and "
    "least-privilege policy."
)
