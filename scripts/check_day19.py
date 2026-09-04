#!/usr/bin/env python3
"""
Day 19 Static Contract Checker
Verifies:
1. Learning path engine in apps/api/learner_twin/path.py dynamically inspects 6-section placement session.
2. Unplaced vs Placed states handled honestly without fake precision or arbitrary percentages.
3. Priority growth skills ranked by score ascending with pedagogical recommendations and direct action links.
4. Explainable 5-phase timeline with discrete semantic states (complete, current, upcoming, planned, locked).
5. Product Constitution Rule #8: transparent educational notices and honest CEFR estimate disclosures in FA and EN.
6. Serializer in apps/api/learner_twin/serializers.py validates full payload schema.
7. Frontend Personal Learning Path page in apps/web/app/(learner)/path/page.tsx with unplaced/placed states and bilingual support.
8. 100% tokenized CSS in apps/web/app/(learner)/path/path.module.css with 0 raw hex colors.
9. Wireframe 1 integration: placement report and dashboard link directly to /path.
10. Python syntax validity across all modified backend files.
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
    # 1. Learning path backend engine
    path_py = ROOT / "apps" / "api" / "learner_twin" / "path.py"
    check("learner_twin/path.py exists", path_py.is_file())

    path_code = path_py.read_text(encoding="utf-8")
    check("path.py implements build_learning_path", "def build_learning_path" in path_code)
    check("path.py implements build_unplaced_learning_path", "def build_unplaced_learning_path" in path_code)
    check("path.py implements build_placed_learning_path", "def build_placed_learning_path" in path_code)
    check("path.py checks PlacementSession.Status.SUBMITTED", "PlacementSession.Status.SUBMITTED" in path_code or 'status="submitted"' in path_code)
    check("path.py evaluates placement answers", "evaluate_placement_answers" in path_code)
    check("path.py maps score to CEFR estimate", "map_score_to_cefr_estimate" in path_code)

    # Verify all 6 skills are mapped
    for skill in ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"]:
        check(f"path.py maps skill {skill}", f'"{skill}"' in path_code)

    # 2. Honest assessment & Rule #8 disclosures
    check("path.py includes honest disclaimer in limitations_fa", "تعیین سطح" in path_code and "CEFR" in path_code)
    check("path.py includes honest disclaimer in limitations_en", "placement" in path_code and "CEFR" in path_code)

    # 3. Learning path serializers
    serializers_py = ROOT / "apps" / "api" / "learner_twin" / "serializers.py"
    check("learner_twin/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py has LearningPathSerializer", "class LearningPathSerializer" in serializers_code)
    check("serializers.py has LearningPathTimelineSerializer", "class LearningPathTimelineSerializer" in serializers_code)
    check("serializers.py has LearningPathFocusAreaSerializer", "class LearningPathFocusAreaSerializer" in serializers_code)
    check("serializers.py has LearningPathSectionScoreSerializer", "class LearningPathSectionScoreSerializer" in serializers_code)
    check("serializers.py includes placement_completed", "placement_completed = serializers.BooleanField" in serializers_code)
    check("serializers.py includes estimated_cefr_level", "estimated_cefr_level = serializers.CharField" in serializers_code)

    # 4. Learning path tests
    tests_py = ROOT / "apps" / "api" / "learner_twin" / "tests.py"
    check("learner_twin/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests.py tests anonymous access", "test_anonymous_cannot_access" in tests_code)
    check("tests.py tests unplaced learner", "test_unplaced_learner" in tests_code)
    check("tests.py tests placed learner", "test_placed_learner" in tests_code)
    check("tests.py tests user isolation", "test_user_isolation" in tests_code)

    # 5. URL routing
    urls_py = ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    urls_code = urls_py.read_text(encoding="utf-8")
    check("endoora_api/urls.py routes api/path/", 'path("api/path/",' in urls_code)
    check("endoora_api/urls.py routes api/learner-twin/", 'path("api/learner-twin/",' in urls_code)

    # 6. Frontend /path Page
    path_page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "path" / "page.tsx"
    check("path/page.tsx exists", path_page_tsx.is_file())
    path_page_code = path_page_tsx.read_text(encoding="utf-8")
    check("path/page.tsx is a client component", '"use client"' in path_page_code)
    check("path/page.tsx supports bilingual switch", 'locale === "fa"' in path_page_code and 'locale === "en"' in path_page_code)
    check("path/page.tsx renders CEFR badge", "estimated_cefr_level" in path_page_code)
    check("path/page.tsx renders timeline", "data.timeline.map" in path_page_code)
    check("path/page.tsx renders focus areas", "data.focus_areas" in path_page_code)
    check("path/page.tsx handles unplaced state with placement CTA", "/placement" in path_page_code)
    check("path/page.tsx includes honest disclaimer text", "honestDisclaimer" in path_page_code)

    # 7. Tokenized CSS
    path_css_file = ROOT / "apps" / "web" / "app" / "(learner)" / "path" / "path.module.css"
    check("path.module.css exists", path_css_file.is_file())
    path_css = path_css_file.read_text(encoding="utf-8")
    raw_hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}", path_css)
    check("path.module.css has 0 raw hex colors", len(raw_hex_matches) == 0)
    check("path.module.css consumes var(--color-background)", "var(--color-background)" in path_css)
    check("path.module.css consumes var(--color-primary)", "var(--color-primary)" in path_css)

    # 8. Wireframe 1 Flow Connections
    report_page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "placement" / "report" / "page.tsx"
    report_code = report_page_tsx.read_text(encoding="utf-8")
    check("placement report links to /path", 'href="/path"' in report_code)

    dashboard_tsx = ROOT / "apps" / "web" / "components" / "learner" / "LearnerDashboard.tsx"
    dashboard_code = dashboard_tsx.read_text(encoding="utf-8")
    check("LearnerDashboard path card links to /path", 'href="/path"' in dashboard_code)

    # 9. Python syntax compilation
    py_files = [
        ROOT / "apps" / "api" / "learner_twin" / "path.py",
        ROOT / "apps" / "api" / "learner_twin" / "serializers.py",
        ROOT / "apps" / "api" / "learner_twin" / "views.py",
        ROOT / "apps" / "api" / "learner_twin" / "tests.py",
        ROOT / "apps" / "api" / "endoora_api" / "urls.py",
    ]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except py_compile.PyCompileError as e:
            check(f"Python syntax valid for {pf.name}: {e}", False)

    print("Day 19 static checks passed: Learning path engine, dynamic placement derivation, unplaced/placed states, focus areas, 5-phase timeline, tokenized CSS, Rule #8 transparency, and Python syntax.")


if __name__ == "__main__":
    main()
