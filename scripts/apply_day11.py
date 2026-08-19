from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SETTINGS = ROOT / "apps/api/endoora_api/settings/base.py"
ACCOUNTS_ADMIN = ROOT / "apps/api/accounts/admin.py"

DOC_TARGETS = {
    ROOT / "docs/product/PROJECT_STATE.md": """
## Day 11 — Operations implementation staged
- Day 11 source files are installed but this section does not claim acceptance yet.
- Added append-only privileged-change audit events with secret/private-content redaction.
- Added typed SystemSetting and FeatureFlag models with validation and operational ownership metadata.
- Added Endoora Operations admin branding, Persian-first operational summary, least-privilege staff policy, and role bootstrap command.
- Database migration required: core.0001_initial and audit.0001_initial.
- Day 11 becomes complete only after backup, migrate, automated tests, manual admin/support journey, secret scan, regression checks, commit and push.
""",
    ROOT / "docs/product/CHANGELOG.md": """
## Day 11 — staged, pending acceptance
- Added Endoora Operations Django-admin foundation.
- Added immutable audit trail with sensitive-field redaction.
- Added typed system settings and feature flags.
- Added least-privilege operational role policy and support restrictions.
- No payment state editor or secret database setting was introduced.
""",
    ROOT / "docs/product/ROADMAP_PROGRESS.md": """
## Day 11 — Configure Django admin, audit logs, and safe settings
Status: implementation staged; acceptance gate pending.
Required before completion: database backup, migrations, Django/static/regression tests, admin/support manual checks, secret scan, Git checkpoint.
""",
    ROOT / "docs/quality/TEST_MATRIX.md": """
## Day 11 operations coverage
- Audit event creation for privileged changes — automated
- Audit ORM immutability — automated
- Sensitive snapshot redaction — automated
- SystemSetting type/secret/bypass validation — automated
- FeatureFlag environment/rollout/dependency validation — automated
- Support cross-domain/profile restriction — automated policy test + manual admin check
- OneTimeCode hash hidden in admin — static + manual
- Endoora Operations mobile/Persian summary — manual 360 px
- Day 10 regression — `node scripts\\check-day10.mjs`
""",
}


def require_file(path: Path) -> str:
    if not path.exists():
        raise SystemExit(f"Required existing file is missing: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def write_if_changed(path: Path, text: str) -> bool:
    old = path.read_text(encoding="utf-8") if path.exists() else ""
    if old == text:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return True


def patch_settings() -> bool:
    text = require_file(SETTINGS)
    original = text

    if "audit.apps.AuditConfig" not in text:
        anchors = [
            '    "core",\n',
            '    "core.apps.CoreConfig",\n',
        ]
        for anchor in anchors:
            if anchor in text:
                text = text.replace(anchor, anchor + '    "audit.apps.AuditConfig",\n', 1)
                break
        else:
            raise SystemExit(
                "Could not find the core app registration in base.py. "
                "No settings change was made."
            )

    middleware_line = '    "audit.middleware.AuditContextMiddleware",\n'
    if "audit.middleware.AuditContextMiddleware" not in text:
        anchor = '    "django.contrib.auth.middleware.AuthenticationMiddleware",\n'
        if anchor not in text:
            raise SystemExit(
                "Could not find AuthenticationMiddleware in base.py. "
                "No middleware change was made."
            )
        text = text.replace(anchor, anchor + middleware_line, 1)

    return write_if_changed(SETTINGS, text) if text != original else False


def patch_accounts_admin() -> bool:
    text = require_file(ACCOUNTS_ADMIN)
    original = text

    class_marker = "class OneTimeCodeAdmin(admin.ModelAdmin):"
    if class_marker not in text:
        raise SystemExit("OneTimeCodeAdmin was not found; refusing to guess a patch.")

    if 'exclude = ("code_hash",)' not in text:
        text = text.replace(
            class_marker,
            class_marker + '\n    exclude = ("code_hash",)',
            1,
        )

    # Remove the code_hash entry only from the OneTimeCodeAdmin class body.
    start = text.index(class_marker)
    next_class = text.find("@admin.register(AccountDeletionRequest)", start)
    if next_class == -1:
        next_class = len(text)

    before = text[:start]
    block = text[start:next_class]
    after = text[next_class:]
    block = block.replace('        "code_hash",\n', "")
    block = block.replace('    "code_hash",\n', "")
    text = before + block + after

    return write_if_changed(ACCOUNTS_ADMIN, text) if text != original else False


def append_doc(path: Path, section: str) -> bool:
    text = require_file(path)
    heading = section.strip().splitlines()[0]
    if heading in text:
        return False
    if not text.endswith("\n"):
        text += "\n"
    text += "\n" + section.strip() + "\n"
    return write_if_changed(path, text)


def main():
    # Guard against installing Day 11 on a repository that has not received Day 10.
    day10_required = [
        ROOT / "scripts/check-day10.mjs",
        ROOT / "apps/api/teachers/dashboard.py",
        ROOT / "apps/web/components/teacher/TeacherShell.tsx",
    ]
    missing = [str(path.relative_to(ROOT)) for path in day10_required if not path.exists()]
    if missing:
        raise SystemExit(
            "Day 10 prerequisite file(s) missing:\n- " + "\n- ".join(missing)
        )

    changes = []
    if patch_settings():
        changes.append("apps/api/endoora_api/settings/base.py")
    if patch_accounts_admin():
        changes.append("apps/api/accounts/admin.py")

    for path, section in DOC_TARGETS.items():
        if append_doc(path, section):
            changes.append(str(path.relative_to(ROOT)))

    print("Day 11 patch applied safely.")
    if changes:
        print("Changed existing files:")
        for item in changes:
            print(f"- {item}")
    else:
        print("No existing file needed another change; patch is already applied.")
    print("NEXT: run python scripts\\check_day11.py")
    print("DO NOT migrate until the pre-Day-11 database backup is verified.")


if __name__ == "__main__":
    main()
