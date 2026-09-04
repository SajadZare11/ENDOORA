from __future__ import annotations

import json
import py_compile
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    raise SystemExit(f"Day 15 static check FAILED: {message}")


def need(relative: str, *markers: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        fail(f"missing {relative}")
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            fail(f"{relative} missing marker: {marker}")
    return text


def main() -> None:
    # 1. Base settings and URL wiring
    need("apps/api/endoora_api/settings/base.py", '"placement"', '"assessment"')
    need("apps/api/endoora_api/urls.py", '"api/placement/"', 'include("placement.urls")')

    # 2. Content fixtures: core-items.json
    items_path = ROOT / "data" / "placement" / "core-items.json"
    if not items_path.is_file():
        fail("missing data/placement/core-items.json")
    try:
        items = json.loads(items_path.read_text(encoding="utf-8-sig"))
    except Exception as exc:
        fail(f"Invalid core-items.json: {exc}")

    sections_found = set()
    for itm in items:
        sec = itm.get("section")
        diff = itm.get("difficulty")
        cefr = itm.get("cefr_level")
        if not sec or not diff or not cefr:
            fail(f"Item {itm.get('id')} missing section, difficulty, or cefr_level")
        if diff not in ("easy", "medium", "hard"):
            fail(f"Item {itm.get('id')} difficulty must be easy/medium/hard, got {diff}")
        if cefr not in ("A1", "A2", "B1", "B2", "C1", "C2"):
            fail(f"Item {itm.get('id')} cefr_level invalid: {cefr}")
        sections_found.add(sec)

    for req_sec in ("grammar", "vocabulary", "reading"):
        if req_sec not in sections_found:
            fail(f"core-items.json missing required Day 15 section: {req_sec}")

    # 3. Assessment services and management command
    need(
        "apps/api/assessment/services.py",
        "class PlacementSectionResult:",
        "def item_key_to_uuid",
        "def calculate_section_result",
        "def evaluate_placement_answers",
        "مدرک رسمی یا نهایی CEFR محسوب نمی‌شود",
    )
    need(
        "apps/api/assessment/management/commands/seed_placement_sections.py",
        "class Command(BaseCommand):",
        "core-items.json",
        "Validated",
    )

    # 4. Placement views & summary endpoint
    views = need(
        "apps/api/placement/views.py",
        "class PlacementSessionSummaryView(APIView):",
        "evaluate_placement_answers",
        "PlacementResponse.objects.update_or_create",
        "PlacementSessionSummarySerializer",
        "encoding=\"utf-8-sig\"",
    )

    # Pre-submission anti-leak protection check
    q_view_block = views.split("class PlacementQuestionsView", 1)[1]
    for forbidden in (
        '"correct_option"',
        '"answer_key"',
        '"accepted_variants"',
        '"rubric"',
        '"solution"',
    ):
        if forbidden in q_view_block:
            fail(f"PlacementQuestionsView exposes forbidden key: {forbidden}")

    # 5. Serializers and URLs
    need(
        "apps/api/placement/serializers.py",
        "class PlacementSectionSummaryItemSerializer",
        "class PlacementSessionSummarySerializer",
    )
    need(
        "apps/api/placement/urls.py",
        'path("sessions/<uuid:session_pk>/summary/",',
    )

    # 6. Test suites
    need(
        "apps/api/assessment/tests.py",
        "class AssessmentServicesTests",
        "test_item_key_to_uuid_is_deterministic",
        "test_calculate_section_result",
        "test_evaluate_placement_answers_all_sections",
        "test_seed_placement_sections_command",
    )
    need(
        "apps/api/placement/tests.py",
        "test_questions_filtered_by_section_grammar_vocab_reading",
        "test_session_summary_endpoint_user_isolation",
        "test_session_summary_active_and_submitted_evaluation",
    )

    # 7. Frontend PlacementRunner and Report
    need(
        "apps/web/components/placement/PlacementRunner.tsx",
        "sectionNav",
        "sectionPill",
        "autosaveBadge",
        'dir="ltr"',
    )
    need(
        "apps/web/app/(learner)/placement/report/page.tsx",
        "SessionSummaryData",
        "/api/placement/sessions/current/",
        "/summary/",
        "reportGrid",
        "sectionCard",
        "honestDisclaimer",
    )

    # 8. Stylesheet tokens check (zero raw hex colors)
    for css_rel in [
        "apps/web/components/placement/placement.module.css",
        "apps/web/app/(learner)/placement/placement.module.css",
    ]:
        css_text = need(css_rel, "var(--color-surface)")
        hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_text)
        if hex_matches:
            fail(f"{css_rel} contains raw hex colors: {hex_matches}")

    # 9. Acceptance Gate
    need(
        "docs/operations/DAY_15_ACCEPTANCE_GATE.md",
        "- [x] Day 14 is committed/pushed.",
        "- [x] Grammar, Vocabulary, and Reading placement sections implemented.",
        "- [x] Item difficulty separated from CEFR labels.",
        "- [x] Server-side deterministic scoring and evidence recording.",
        "- [x] Pre-submission question payload contains no answer keys",
        "- [x] No premature or certified CEFR claims made.",
        "- [x] User isolation strictly enforced on session summary",
    )

    # 10. Python compilation check
    py_files = [
        "apps/api/assessment/models.py",
        "apps/api/assessment/services.py",
        "apps/api/assessment/management/commands/seed_placement_sections.py",
        "apps/api/assessment/tests.py",
        "apps/api/placement/models.py",
        "apps/api/placement/serializers.py",
        "apps/api/placement/views.py",
        "apps/api/placement/urls.py",
        "apps/api/placement/tests.py",
    ]
    for rel in py_files:
        py_compile.compile(str(ROOT / rel), doraise=True)

    print(
        "Day 15 static checks passed: Grammar, Vocabulary, Reading placement sections, "
        "deterministic scoring, evidence collection, no premature CEFR claims, "
        "anti-leak protection, session summary API, user isolation, frontend report polish, "
        "tokenized CSS, and Python syntax."
    )


if __name__ == "__main__":
    main()
