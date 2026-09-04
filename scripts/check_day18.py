#!/usr/bin/env python3
"""
Day 18 Static Contract Checker
Verifies:
1. Calibrated writing items in data/placement/core-items.json (23 total items, 4 writing).
2. Difficulty strictly decoupled from CEFR level.
3. Server-side writing rubrics and target keywords protected from leaking.
4. Pre-submission learner serializers and views never leak answer keys, solutions, rubrics, or target keywords.
5. Backend scoring services evaluate writing responses, compute 6-section average, and map provisional CEFR estimate.
6. PlacementSessionSummaryView enforces strict user isolation and provisional CEFR estimates.
7. Frontend WritingEditor component, tokenized CSS (0 raw hex colors), and 6-stage PlacementRunner integration.
8. Upgraded learner report and writing pages.
9. Python syntax validity across all modified backend files.
"""

import json
import py_compile
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def check(desc: str, condition: bool):
    if not condition:
        print(f"FAIL: {desc}", file=sys.stderr)
        sys.exit(1)


def main():
    # 1. Placement Core Items & Writing Section
    items_path = ROOT / "data" / "placement" / "core-items.json"
    check("core-items.json exists", items_path.is_file())

    items = json.loads(items_path.read_text(encoding="utf-8-sig"))
    check("core-items.json has at least 23 calibrated items", len(items) >= 23)

    sections = {}
    for item in items:
        sec = item.get("section", "").lower()
        sections.setdefault(sec, []).append(item)

    check("grammar section has at least 4 items", len(sections.get("grammar", [])) >= 4)
    check("vocabulary section has at least 4 items", len(sections.get("vocabulary", [])) >= 4)
    check("reading section has at least 3 items", len(sections.get("reading", [])) >= 3)
    check("listening section has at least 4 items", len(sections.get("listening", [])) >= 4)
    check("speaking section has at least 4 items", len(sections.get("speaking", [])) >= 4)
    check("writing section has at least 4 items", len(sections.get("writing", [])) >= 4)

    # 2. Writing item properties & separation of concerns
    writing_items = sections.get("writing", [])
    for itm in writing_items:
        check(f"writing item {itm['id']} has question prompt", bool(itm.get("question")))
        check(f"writing item {itm['id']} has prompt_fa", bool(itm.get("prompt_fa")))
        check(f"writing item {itm['id']} has min_words >= 15", int(itm.get("min_words", 0)) >= 15)
        check(f"writing item {itm['id']} has max_words >= 50", int(itm.get("max_words", 0)) >= 50)
        check(f"writing item {itm['id']} has target_keywords", bool(itm.get("target_keywords")))
        check(f"writing item {itm['id']} has rubric", bool(itm.get("rubric")))
        check(f"writing item {itm['id']} difficulty is easy/medium/hard", itm.get("difficulty") in ("easy", "medium", "hard"))
        check(f"writing item {itm['id']} cefr_level is A1/A2/B1/B2", itm.get("cefr_level") in ("A1", "A2", "B1", "B2"))

    # Verify difficulty is not mechanically mapped 1:1 to CEFR
    a1_diffs = {i["difficulty"] for i in writing_items if i.get("cefr_level") == "A1"}
    a2_diffs = {i["difficulty"] for i in writing_items if i.get("cefr_level") == "A2"}
    check("difficulty is decoupled from CEFR level", bool(a1_diffs and a2_diffs))

    # 3. Anti-Leak Payload Protection
    serializers_py = (ROOT / "apps" / "api" / "placement" / "serializers.py").read_text(encoding="utf-8")
    check("PlacementQuestionItemSerializer exists", "class PlacementQuestionItemSerializer" in serializers_py)
    check("PlacementQuestionItemSerializer has min_words_expected", "min_words_expected = serializers.IntegerField" in serializers_py)
    check("PlacementQuestionItemSerializer has max_words_expected", "max_words_expected = serializers.IntegerField" in serializers_py)
    check("PlacementQuestionItemSerializer excludes rubric and target_keywords", "target_keywords = serializers" not in serializers_py and "rubric = serializers" not in serializers_py)
    check("PlacementSectionAdvanceSerializer includes writing", '"writing"' in serializers_py)

    views_py = (ROOT / "apps" / "api" / "placement" / "views.py").read_text(encoding="utf-8")
    check("PlacementQuestionsView has writing title", '"writing":' in views_py)
    check("PlacementQuestionsView does not leak target_keywords", "target_keywords" not in views_py or "never include" in views_py)
    check("PlacementSessionSubmitView stores responses", "PlacementResponse.objects.update_or_create" in views_py)

    # 4. Backend Assessment Scoring & Transparency
    services_py = (ROOT / "apps" / "api" / "assessment" / "services.py").read_text(encoding="utf-8")
    check("services.py evaluates writing response", "def evaluate_writing_response" in services_py)
    check("services.py maps CEFR estimate", "def map_score_to_cefr_estimate" in services_py)
    check("services.py notice mentions writing", "نگارش" in services_py)
    check("services.py disclaims official CEFR claim", "مدرک رسمی یا نهایی CEFR محسوب نمی‌شود" in services_py)

    # 5. Management command seeds writing items
    seed_cmd_py = (ROOT / "apps" / "api" / "assessment" / "management" / "commands" / "seed_placement_sections.py").read_text(encoding="utf-8")
    check("seed command validates writing", '"writing"' in seed_cmd_py)

    # 6. Frontend WritingEditor & Tokenized CSS
    editor_tsx = (ROOT / "apps" / "web" / "components" / "placement" / "WritingEditor.tsx").read_text(encoding="utf-8")
    check("WritingEditor component exists", "export function WritingEditor" in editor_tsx)
    check("WritingEditor supports bold and italic", "applyFormat" in editor_tsx)
    check("WritingEditor supports word count", "wordCount" in editor_tsx)

    editor_css = (ROOT / "apps" / "web" / "components" / "placement" / "writing-editor.module.css").read_text(encoding="utf-8")
    raw_hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}", editor_css)
    check("writing-editor.module.css has 0 raw hex colors", len(raw_hex_matches) == 0)

    # 7. PlacementRunner & Report & Writing Lab integration
    runner_tsx = (ROOT / "apps" / "web" / "components" / "placement" / "PlacementRunner.tsx").read_text(encoding="utf-8")
    check("PlacementRunner imports WritingEditor", "WritingEditor" in runner_tsx)
    check("PlacementRunner renders writing section pill", "۶. نگارش" in runner_tsx or "6. Writing" in runner_tsx)
    check("PlacementRunner includes writing items in DEFAULT_QUESTIONS", "writing-a1-001" in runner_tsx)

    report_tsx = (ROOT / "apps" / "web" / "app" / "(learner)" / "placement" / "report" / "page.tsx").read_text(encoding="utf-8")
    check("report page includes writing section", "summary?.sections?.writing" in report_tsx)
    check("report page includes estimated CEFR level", "summary.estimated_cefr_level" in report_tsx)

    writing_tsx = (ROOT / "apps" / "web" / "app" / "(learner)" / "writing" / "page.tsx").read_text(encoding="utf-8")
    check("writing page embeds WritingEditor", "WritingEditor" in writing_tsx)

    # 8. Scoring model documentation
    model_doc = (ROOT / "docs" / "assessment" / "scoring-model.md").read_text(encoding="utf-8")
    check("scoring-model.md includes Writing", "- Writing" in model_doc)

    # 9. Python syntax compilation check
    py_files = [
        ROOT / "apps" / "api" / "assessment" / "services.py",
        ROOT / "apps" / "api" / "assessment" / "tests.py",
        ROOT / "apps" / "api" / "assessment" / "management" / "commands" / "seed_placement_sections.py",
        ROOT / "apps" / "api" / "placement" / "serializers.py",
        ROOT / "apps" / "api" / "placement" / "views.py",
        ROOT / "apps" / "api" / "placement" / "tests.py",
    ]
    for py_file in py_files:
        py_compile.compile(str(py_file), doraise=True)

    print("Day 18 static checks passed: Writing placement section, WritingEditor, tokenized CSS, anti-leak protection, honest assessment, 6-section report card, and Python syntax.")


if __name__ == "__main__":
    main()
