from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def require_file(relative: str) -> None:
    if not (ROOT / relative).is_file():
        raise SystemExit(f"Missing required file: {relative}")


def patch_settings() -> None:
    path = ROOT / "apps/api/endoora_api/settings/base.py"
    text = path.read_text(encoding="utf-8")
    if '"questions"' in text:
        return
    for anchor in ('    "taxonomy",\n', '    "waitlist",\n'):
        if anchor in text:
            text = text.replace(anchor, anchor + '    "questions",\n', 1)
            path.write_text(text, encoding="utf-8")
            return
    raise SystemExit("Could not find a safe INSTALLED_APPS anchor. No URL patch attempted.")


def patch_urls() -> None:
    path = ROOT / "apps/api/endoora_api/urls.py"
    text = path.read_text(encoding="utf-8")
    route = '    path("api/questions/", include("questions.urls")),\n'
    if route in text:
        return
    anchor = '    path("api/taxonomy/", include("taxonomy.urls")),\n'
    if anchor in text:
        text = text.replace(anchor, anchor + route, 1)
    else:
        close = text.rfind("]")
        if close == -1:
            raise SystemExit("Could not locate urlpatterns safely.")
        text = text[:close] + route + text[close:]
    path.write_text(text, encoding="utf-8")


def patch_inherited_roadmap_status() -> None:
    path = ROOT / "docs/product/ROADMAP_PROGRESS.md"
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    stale = (
        "## Day 11 — Configure Django admin, audit logs, and safe settings\n"
        "Status: implementation staged; acceptance gate pending.\n"
        "Required before completion: database backup, migrations, Django/static/regression tests, "
        "admin/support manual checks, secret scan, Git checkpoint."
    )
    complete = (
        "## Day 11 — Configure Django admin, audit logs, and safe settings\n"
        "Status: complete and inherited by Day 12/Day 13."
    )
    if stale in text:
        path.write_text(text.replace(stale, complete, 1), encoding="utf-8")


def append_once(relative: str, marker: str, block: str) -> None:
    path = ROOT / relative
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    if marker in text:
        return
    path.write_text(text.rstrip() + "\n\n" + block.strip() + "\n", encoding="utf-8")


def patch_roadmap_table() -> None:
    path = ROOT / "docs/product/ROADMAP_PROGRESS.md"
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    stale = "| 11-60 | Remaining roadmap | Not started | Sequential |"
    if stale in text:
        replacement = (
            "| 11 | Django admin, audit logs, and safe settings | Complete | Operations acceptance passed |\n"
            "| 12 | CEFR skill and content taxonomy | Complete | Taxonomy acceptance passed |\n"
            "| 13 | Versioned question bank schema | Implementation applied | Acceptance gate pending |\n"
            "| 14-60 | Remaining roadmap | Not started | Sequential |"
        )
        path.write_text(text.replace(stale, replacement, 1), encoding="utf-8")


def main() -> None:
    for required in (
        "apps/api/taxonomy/models.py",
        "apps/api/taxonomy/migrations/0001_initial.py",
        "data/taxonomy/endoora_core_taxonomy.v1.json",
        "apps/api/questions/models.py",
        "apps/api/questions/migrations/0001_initial.py",
        "apps/api/questions/serializers.py",
        "apps/api/questions/views.py",
        "apps/api/questions/tests.py",
        "apps/web/app/(admin)/content/questions/page.tsx",
        "data/question-schema.json",
        "data/questions/endoora_day13_samples.v1.json",
    ):
        require_file(required)

    patch_settings()
    patch_urls()
    patch_roadmap_table()
    patch_inherited_roadmap_status()

    append_once(
        "docs/product/PROJECT_STATE.md",
        "## Day 13 — Versioned question bank schema (implementation applied; acceptance pending)",
        """
## Day 13 — Versioned question bank schema (implementation applied; acceptance pending)

- Added stable `Question` identities and immutable `QuestionVersion` records.
- Added nine question types, answer normalization, rubrics, media metadata, review events, licensing, and Day 12 objective links.
- Added Persian-first learner-safe preview with English option.
- Added serializer split so protected answer data is absent before submission.
- Added draft-only idempotent JSON import and protected export.
- Database migration required: `questions.0001_initial`.
- Day 13 is not complete until backup, migration, focused/full tests, network answer-key inspection, mobile/desktop bilingual review, secret scan, and Git checkpoint pass.
""",
    )
    append_once(
        "docs/product/CHANGELOG.md",
        "## Day 13 — Versioned question bank implementation applied",
        """
## Day 13 — Versioned question bank implementation applied
- Added `questions` Django domain and `questions.0001_initial`.
- Added immutable versions, review/retirement, copyright metadata, taxonomy objective links, answer normalization, and media metadata.
- Added learner-safe and editor-only APIs.
- Added Persian-first preview with English option and isolated English LTR content.
- Added draft-only JSON import/export, tests, backup/check/finalize scripts, governance, and acceptance gate.
""",
    )
    append_once(
        "docs/product/ROADMAP_PROGRESS.md",
        "## Day 13 implementation checkpoint",
        """
## Day 13 implementation checkpoint

Status: implementation applied; acceptance pending.

Success gate: question bank supports placement and teacher assignment without duplicating content, while published versions stay immutable and learner pre-submission payloads contain no answer keys.
""",
    )
    append_once(
        "docs/quality/TEST_MATRIX.md",
        "## Day 13 question-bank tests",
        """
## Day 13 question-bank tests

- nine question types
- published/retired immutability
- unlicensed publication blocked
- objective-kind enforcement
- answer normalization
- learner answer-key leak prevention
- post-submission explanation
- support/editor negative permission boundary
- retired historical preservation
- draft-only idempotent sample import
""",
    )
    append_once(
        "docs/architecture/API_CONTRACTS.md",
        "## Day 13 question-bank API contracts",
        """
## Day 13 question-bank API contracts

Learner-safe:
- `GET /api/questions/meta/`
- `GET /api/questions/published/`
- `GET /api/questions/published/<question_version_uuid>/`

Authenticated submission:
- `POST /api/questions/published/<question_version_uuid>/check/`

Editor/administrator:
- `/api/questions/editor/*`

Pre-submission learner payloads never contain answer keys, accepted variants, rubrics, or explanations.
""",
    )
    append_once(
        "docs/architecture/DATA_DICTIONARY.md",
        "## Day 13 question-bank data",
        """
## Day 13 question-bank data

- `Question`: stable UUID/slug identity.
- `QuestionVersion`: immutable content snapshot after publication.
- `QuestionObjective`: protected link to a stable Day 12 objective.
- `QuestionMedia`: media metadata/reference; upload pipeline remains later work.
- `QuestionReview`: append-only review/publication/retirement event.
""",
    )

    print("Day 13 patch applied safely.")
    print("NEXT: run python scripts\\check_day13.py")
    print("DO NOT migrate until scripts\\backup_day13.ps1 reports a verified backup.")


if __name__ == "__main__":
    main()
