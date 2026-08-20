from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_STATE = ROOT / "docs/product/PROJECT_STATE.md"
CHANGELOG = ROOT / "docs/product/CHANGELOG.md"
ROADMAP = ROOT / "docs/product/ROADMAP_PROGRESS.md"
TEST_MATRIX = ROOT / "docs/quality/TEST_MATRIX.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_file(path: Path, text: str) -> None:
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def append_once(text: str, marker: str, block: str) -> str:
    if marker in text:
        return text
    return text.rstrip() + "\n\n" + block.strip() + "\n"


def finalize_project_state(backup_path: str) -> None:
    text = read(PROJECT_STATE)
    current = """## Current checkpoint
- **Roadmap day completed:** Day 13 — Build the versioned question bank schema
- **Day 13 status:** Local acceptance complete; final repository gate is commit/push to `origin/main`
- **Inherited state:** Days 01–12 remain in place, including Persian-first RTL/English-LTR foundations, Endoora Operations, and stable CEFR taxonomy
- **Schema version:** Day 13 adds `questions.0001_initial` on top of `taxonomy.0001_initial`
- **Frontend/UI package version:** `0.4.0`
- **Backend:** Django 5.2.17 / Django REST Framework 3.18.0
- **Frontend:** Next.js 16.3.1 / React 19
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran
- **Default product locale:** Persian (`fa`) / RTL
- **Optional product locale:** English (`en`) / LTR
"""
    text = re.sub(
        r"## Current checkpoint\n.*?(?=## Features working through Day (?:10|12|13))",
        current + "\n",
        text,
        count=1,
        flags=re.S,
    )
    text = text.replace("## Features working through Day 12", "## Features working through Day 13", 1)

    evidence = f"""## Day 13 verification evidence

### Database and question bank
- Pre-Day-13 PostgreSQL backup verified: `{backup_path}`
- `questions.0001_initial` applied successfully
- Question versions reference stable Day 12 taxonomy objectives
- Sample import is draft-only and idempotent
- Published/retired content and links are immutable
- Retired versions remain stored for historical references

### Backend/security
- `python manage.py check` — PASS
- `python manage.py test questions` — PASS
- `python manage.py test` — PASS
- `python manage.py makemigrations --check --dry-run` — PASS
- pre-submission learner payload contains no answer keys/accepted variants/rubrics/explanations
- support/editor negative permission boundary — PASS
- `python scripts/check_day13.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### Frontend/manual
- Persian-first RTL question preview — PASS
- English interface option — PASS
- English learning content isolated LTR — PASS
- 360 px and desktop — PASS
- loading/empty/error/retry/permission states — PASS
- publish -> learner-safe preview -> submit -> explanation -> retire journey — PASS

## Git checkpoint

Planned commit message:

`Day 13: Build the versioned question bank schema`

## Exact next day

**Day 14 — Build the multi-stage placement-test session engine.**

Do not begin Day 14 until the Day 13 commit is pushed and `git status --short --branch`
shows `main` synchronized with `origin/main` and no unintended changes.
"""
    text = append_once(text, "## Day 13 verification evidence", evidence)
    write_file(PROJECT_STATE, text)


def finalize_changelog() -> None:
    text = read(CHANGELOG)
    block = """## Day 13 verification
- Applied `questions.0001_initial`.
- Verified nine question types and stable parent/version separation.
- Verified immutable published/retired content and publication rights requirements.
- Verified learner answer-key redaction and editor/support permission separation.
- Verified conservative normalization and post-submission explanation flow.
- Verified draft-only idempotent JSON import.
- Verified Persian-first RTL preview, English option, and English LTR isolation.
- Backend regression, frontend lint/typecheck/build, secret scan, and diff gate passed.
"""
    write_file(CHANGELOG, append_once(text, "## Day 13 verification", block))


def finalize_roadmap() -> None:
    text = read(ROADMAP)
    text = text.replace(
        "| 13 | Versioned question bank schema | Implementation applied | Acceptance gate pending |",
        "| 13 | Versioned question bank schema | Complete* | Question-bank acceptance passed; final Git push remains |",
        1,
    )
    block = """## Day 13 — Build the versioned question bank schema

Status: local acceptance complete; final Git push remains.

- [x] verified pre-Day-13 PostgreSQL backup
- [x] `questions.0001_initial`
- [x] nine question types
- [x] immutable published/retired versions
- [x] source/license/reviewer publication gate
- [x] stable taxonomy objective links
- [x] safe answer normalization
- [x] learner answer-key redaction
- [x] support/editor permission boundary
- [x] draft-only idempotent JSON import
- [x] Persian-first RTL + English option
- [x] 360 px + desktop
- [x] backend/frontend regression
- [x] secret scan + diff gate

**Success gate:** question bank supports placement and teacher assignment without duplicating content.

**Next day after Git push:** Day 14 — Build the multi-stage placement-test session engine.
"""
    write_file(
        ROADMAP,
        append_once(text, "## Day 13 — Build the versioned question bank schema", block),
    )


def finalize_test_matrix() -> None:
    text = read(TEST_MATRIX)
    block = """## Day 13 question-bank acceptance

| Layer | Status | Evidence |
|---|---|---|
| Pre-migration backup | PASS | Verified private PostgreSQL custom-format backup |
| Django migration | PASS | `questions.0001_initial` |
| Nine question types | PASS | model/static/unit tests |
| Published immutability | PASS | backend test + manual admin attempt |
| Copyright publication gate | PASS | unlicensed publication rejected |
| Taxonomy objective links | PASS | wrong-kind link rejected |
| Answer normalization | PASS | backend fixture |
| Learner answer-key redaction | PASS | serializer/network regression |
| Support/editor permissions | PASS | 403 support / editor allowed |
| Retired historical record | PASS | stored; public endpoint hides it |
| JSON import | PASS | draft-only; second identical import skips |
| Django system check | PASS | `python manage.py check` |
| Question tests | PASS | `python manage.py test questions` |
| Full backend regression | PASS | `python manage.py test` |
| Migration drift | PASS | `makemigrations --check --dry-run` |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js build | PASS | `npm run build` |
| Persian RTL / English LTR | PASS | manual preview |
| 360 px / desktop | PASS | manual preview |
| Secret scan | PASS | `python scripts/scan_secrets.py` |
| Whitespace diff | PASS | `git diff --check` |
"""
    write_file(
        TEST_MATRIX,
        append_once(text, "## Day 13 question-bank acceptance", block),
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backup-path", required=True)
    args = parser.parse_args()

    for path in (PROJECT_STATE, CHANGELOG, ROADMAP, TEST_MATRIX):
        if not path.is_file():
            raise SystemExit(f"Missing required project-memory file: {path}")

    backup = Path(args.backup_path.strip('"'))
    if not backup.is_file() or backup.stat().st_size < 1024:
        raise SystemExit(
            "The supplied --backup-path is missing or too small. Do not finalize Day 13."
        )

    finalize_project_state(str(backup))
    finalize_changelog()
    finalize_roadmap()
    finalize_test_matrix()

    print("Day 13 documentation finalized.")
    print("NEXT: rerun checks, review git status, then commit/push.")


if __name__ == "__main__":
    main()
