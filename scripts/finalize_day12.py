from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PROJECT_STATE = ROOT / "docs/product/PROJECT_STATE.md"
CHANGELOG = ROOT / "docs/product/CHANGELOG.md"
ROADMAP = ROOT / "docs/product/ROADMAP_PROGRESS.md"
TEST_MATRIX = ROOT / "docs/quality/TEST_MATRIX.md"

BACKUP_PATH = (
    r"E:\0\Work\Website\The General Website\Endoora"
    r"\PRIVATE_DO_NOT_COPY_TO_GIT\backups\day12\20260820-000631"
    r"\endoora-pre-day12.dump"
)

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def write(path: Path, text: str) -> None:
    path.write_text(text.rstrip() + "\n", encoding="utf-8")

def replace_once(text: str, old: str, new: str) -> str:
    if old in text:
        return text.replace(old, new, 1)
    return text

def append_once(text: str, marker: str, block: str) -> str:
    if marker in text:
        return text
    return text.rstrip() + "\n\n" + block.strip() + "\n"

def finalize_project_state() -> None:
    text = read(PROJECT_STATE)

    current = """## Current checkpoint
- **Roadmap day completed:** Day 12 — Build the CEFR skill and content taxonomy
- **Day 12 status:** Local acceptance complete; final repository gate is commit/push to `origin/main`
- **Inherited state:** Days 01–11 remain in place, including Persian-first RTL/English-LTR application foundations and Endoora Operations
- **Schema version:** Day 12 adds `taxonomy.0001_initial`; prior account/profile/core/audit schema remains in place
- **Frontend/UI package version:** `0.4.0`
- **Backend:** Django 5.2.17 / Django REST Framework 3.18.0
- **Frontend:** Next.js 16.3.1 / React 19
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran
- **Default product locale:** Persian (`fa`) / RTL
- **Optional product locale:** English (`en`) / LTR
"""

    text = re.sub(
        r"## Current checkpoint\n.*?(?=## Features working through Day 10)",
        current + "\n",
        text,
        count=1,
        flags=re.S,
    )
    text = replace_once(
        text,
        "## Features working through Day 10",
        "## Features working through Day 12",
    )

    text = replace_once(
        text,
        "## Day 11 — Operations implementation staged",
        "## Day 11 — Operations completed",
    )
    text = replace_once(
        text,
        "- Day 11 source files are installed but this section does not claim acceptance yet.",
        "- Day 11 operations/admin/audit work was completed and pushed before Day 12 began.",
    )
    text = replace_once(
        text,
        "- Day 11 becomes complete only after backup, migrate, automated tests, manual admin/support journey, secret scan, regression checks, commit and push.",
        "- Day 11 acceptance passed before the Day 12 taxonomy migration was started.",
    )

    text = replace_once(
        text,
        "## Day 12 — CEFR skill and content taxonomy (implementation applied; acceptance pending)",
        "## Day 12 — CEFR skill and content taxonomy (complete locally)",
    )
    text = replace_once(
        text,
        "- Day 12 is not complete until the verified pre-Day-12 backup, migration, idempotent import, backend tests, manual admin/API journey, secret scan, and Git checkpoint pass.",
        "- Day 12 local acceptance passed: verified backup, migration, idempotent import, backend tests, Persian/English API checks, admin checks, frontend regression, 360 px/desktop review, secret scan, and diff check.",
    )

    evidence = f"""## Day 12 verification evidence

### Database and taxonomy
- Pre-Day-12 PostgreSQL backup verified: `{BACKUP_PATH}`
- Backup size: `69383` bytes; backup remains outside Git
- `taxonomy.0001_initial` — applied successfully
- Taxonomy release: `day12-v1`
- Imported nodes: `62`
- Node revisions: `62`
- Active prerequisite relationships: `9`
- Second import produced zero creates/updates/revisions/prerequisite changes, proving idempotency
- `python manage.py makemigrations --check --dry-run` — PASS; no changes detected

### Backend
- `python manage.py check` — PASS
- `python manage.py test taxonomy` — PASS, 10 tests
- `python manage.py test` — PASS, 80 tests
- `python scripts/check_day12.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### API/admin/manual
- Persian taxonomy labels are the API default — PASS
- Explicit English taxonomy labels (`lang=en`) — PASS
- Django admin taxonomy protections — PASS
- Stable slug/UUID behavior — PASS
- Desktop manual regression — PASS
- 360 px manual regression — PASS
- Persian RTL / English LTR regression — PASS

### Frontend
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS

## Git checkpoint

This file is part of the Day 12 Git checkpoint. The commit hash is intentionally not hardcoded inside the commit that creates it.

Planned commit message:

`Day 12: Build the CEFR skill and content taxonomy`

## Exact next day

**Day 13 — Build the versioned question bank schema.**

Do not begin Day 13 until the Day 12 commit is pushed successfully and `git status --short --branch` shows `main` synchronized with `origin/main` and no unintended working-tree changes.
"""
    text = append_once(text, "## Day 12 verification evidence", evidence)
    write(PROJECT_STATE, text)

def finalize_changelog() -> None:
    text = read(CHANGELOG)
    text = replace_once(
        text,
        "## Day 11 — staged, pending acceptance",
        "## Day 11 — Configure Django admin, audit logs, and safe settings",
    )
    text = replace_once(
        text,
        "## Day 12 — Taxonomy implementation applied (verification pending)",
        "## Day 12 — CEFR skill and content taxonomy",
    )

    block = """## Day 12 verification
- Applied `taxonomy.0001_initial`.
- Imported `day12-v1`: 62 nodes, 62 revisions, 9 active prerequisite relationships.
- Verified idempotent re-import with zero duplicate changes.
- `python manage.py test taxonomy` — PASS, 10 tests.
- `python manage.py test` — PASS, 80 tests.
- `npm run lint`, `npm run typecheck`, and `npm run build` — PASS.
- Persian-default and explicit-English taxonomy API checks — PASS.
- Django admin protection checks — PASS.
- 360 px and desktop regression checks — PASS.
- Secret scan and `git diff --check` — PASS.
"""
    text = append_once(text, "## Day 12 verification", block)
    write(CHANGELOG, text)

def finalize_roadmap() -> None:
    text = read(ROADMAP)
    text = replace_once(
        text,
        "| 11-60 | Remaining roadmap | Not started | Sequential |",
        "| 11 | Django admin, audit logs, and safe settings | Complete | Operations acceptance passed |\n"
        "| 12 | CEFR skill and content taxonomy | Complete* | Taxonomy acceptance passed; final Git push remains |\n"
        "| 13-60 | Remaining roadmap | Not started | Sequential |",
    )
    text = replace_once(
        text,
        "## Day 11 — Configure Django admin, audit logs, and safe settings\nStatus: implementation staged; acceptance gate pending.\nRequired before completion: database backup, migrations, Django/static/regression tests, admin/support manual checks, secret scan, Git checkpoint.",
        "## Day 11 — Configure Django admin, audit logs, and safe settings\nStatus: complete and inherited by Day 12.",
    )
    text = replace_once(
        text,
        "## Day 12 implementation checkpoint\n\nStatus: Implementation applied; acceptance pending.\n\nSuccess gate remains: a content editor can select one stable objective ID while Persian/English wording can evolve without changing that identifier.",
        """## Day 12 — CEFR skill and content taxonomy

Status: local acceptance complete; final Git push remains.

- [x] verified pre-Day-12 PostgreSQL backup
- [x] `taxonomy.0001_initial` applied
- [x] 62 nodes / 62 revisions / 9 active prerequisites
- [x] idempotent second import
- [x] taxonomy tests — 10 PASS
- [x] full backend suite — 80 PASS
- [x] migration drift check
- [x] Persian-default API
- [x] English API option
- [x] Django admin protection
- [x] frontend lint/typecheck/build
- [x] 360 px + desktop
- [x] Persian RTL + English LTR
- [x] secret scan
- [x] `git diff --check`

**Success gate:** a content editor can select a stable objective ID while Persian/English wording can evolve without changing that identifier.

**Next day after Git push:** Day 13 — Build the versioned question bank schema.""",
    )
    write(ROADMAP, text)

def finalize_test_matrix() -> None:
    text = read(TEST_MATRIX)
    block = """## Day 12 taxonomy acceptance
| Layer | Status | Evidence |
|---|---|---|
| Pre-migration backup | PASS | 69,383-byte PostgreSQL custom-format backup verified and Git-ignored |
| Django migration | PASS | `taxonomy.0001_initial` |
| Dry-run import | PASS | 62 nodes / 62 revisions / 9 prerequisites; transaction rolled back |
| Real import | PASS | `day12-v1` imported |
| Idempotent re-import | PASS | 0 creates / 0 updates / 0 revisions / 0 prerequisite changes |
| Database counts | PASS | 1 release / 62 nodes / 62 revisions / 9 active prerequisites |
| Taxonomy-focused tests | PASS | `python manage.py test taxonomy` — 10 tests |
| Full backend regression | PASS | `python manage.py test` — 80 tests |
| Migration drift | PASS | `makemigrations --check --dry-run` — no changes |
| Static Day 12 gate | PASS | `python scripts/check_day12.py` |
| Persian-default API | PASS | manual API verification |
| Explicit English API | PASS | manual `lang=en` verification |
| Django admin protections | PASS | stable identifiers/read-only protections verified |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js production build | PASS | `npm run build` |
| 360 px browser | PASS | manual regression |
| Desktop browser | PASS | manual regression |
| Persian RTL | PASS | manual regression |
| English LTR | PASS | manual regression |
| Secret scan | PASS | `python scripts/scan_secrets.py` |
| Whitespace diff gate | PASS | `git diff --check` |
"""
    text = append_once(text, "## Day 12 taxonomy acceptance", block)
    write(TEST_MATRIX, text)

def main() -> None:
    for path in (PROJECT_STATE, CHANGELOG, ROADMAP, TEST_MATRIX):
        if not path.exists():
            raise SystemExit(f"Missing required file: {path}")

    finalize_project_state()
    finalize_changelog()
    finalize_roadmap()
    finalize_test_matrix()

    print("Day 12 documentation finalized.")
    print("Updated:")
    print("- docs/product/PROJECT_STATE.md")
    print("- docs/product/CHANGELOG.md")
    print("- docs/product/ROADMAP_PROGRESS.md")
    print("- docs/quality/TEST_MATRIX.md")
    print("NEXT: run python scripts/check_day12.py and git diff --check")

if __name__ == "__main__":
    main()
