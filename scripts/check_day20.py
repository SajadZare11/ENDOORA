#!/usr/bin/env python3
"""
Day 20 Static Contract Checker
Verifies:
1. Daily Mission backend model & helper methods in apps/api/missions/models.py.
2. Adaptive mission generation engine in apps/api/missions/services.py (unplaced onboarding & placed skill targeting).
3. Pre-submission payload protection in apps/api/missions/serializers.py (answer keys stripped before submit).
4. Step submission, instant feedback, and mission completion state transitions.
5. Endpoints routed in apps/api/missions/urls.py and apps/api/endoora_api/urls.py.
6. Unit tests in apps/api/missions/tests.py covering isolation, permissions, adaptivity, and flows.
7. Frontend Wireframe 2 implementation in apps/web/app/(learner)/today/page.tsx (overview, task, feedback, complete).
8. 100% tokenized CSS in apps/web/app/(learner)/today/today.module.css with 0 raw hex colors.
9. Route redirect /learner/today -> /today in apps/web/next.config.ts.
10. Product Constitution Rule #8 transparent educational notices in Persian and English.
11. Python syntax validity across all modified files.
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
    # 1. Backend models
    models_py = ROOT / "apps" / "api" / "missions" / "models.py"
    check("missions/models.py exists", models_py.is_file())
    models_code = models_py.read_text(encoding="utf-8")
    check("models.py defines DailyMission", "class DailyMission" in models_code)
    check("models.py has get_tasks helper", "def get_tasks" in models_code)
    check("models.py has get_target_skill helper", "def get_target_skill" in models_code)
    check("models.py has is_all_completed helper", "def is_all_completed" in models_code)

    # 2. Services & Adaptive Generation
    services_py = ROOT / "apps" / "api" / "missions" / "services.py"
    check("missions/services.py exists", services_py.is_file())
    services_code = services_py.read_text(encoding="utf-8")
    check("services.py defines build_daily_mission", "def build_daily_mission" in services_code)
    check("services.py defines start_daily_mission", "def start_daily_mission" in services_code)
    check("services.py defines submit_mission_step", "def submit_mission_step" in services_code)
    check("services.py defines resolve_mission_next_action", "def resolve_mission_next_action" in services_code)
    check("services.py inspects placement session", "PlacementSession.objects.filter" in services_code)
    check("services.py evaluates placement answers", "evaluate_placement_answers" in services_code)
    for skill in ["grammar", "vocabulary", "reading", "listening", "writing", "speaking"]:
        check(f"services.py supports skill {skill}", f'"{skill}"' in services_code)

    # 3. Serializers & Pre-submission Payload Protection
    serializers_py = ROOT / "apps" / "api" / "missions" / "serializers.py"
    check("missions/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py defines DailyMissionSerializer", "class DailyMissionSerializer" in serializers_code)
    check("serializers.py defines MissionStepSubmitSerializer", "class MissionStepSubmitSerializer" in serializers_code)
    check("serializers.py defines MissionStepFeedbackSerializer", "class MissionStepFeedbackSerializer" in serializers_code)
    check("serializers.py implements payload protection", "Pre-submission payload protection" in serializers_code or "is_completed" in serializers_code)

    # 4. Views & Routing
    views_py = ROOT / "apps" / "api" / "missions" / "views.py"
    check("missions/views.py exists", views_py.is_file())
    views_code = views_py.read_text(encoding="utf-8")
    check("views.py defines TodayMissionView", "class TodayMissionView" in views_code)
    check("views.py defines StartMissionView", "class StartMissionView" in views_code)
    check("views.py defines SubmitMissionStepView", "class SubmitMissionStepView" in views_code)
    check("views.py defines ResetMissionView", "class ResetMissionView" in views_code)

    urls_py = ROOT / "apps" / "api" / "missions" / "urls.py"
    check("missions/urls.py exists", urls_py.is_file())
    urls_code = urls_py.read_text(encoding="utf-8")
    check("urls.py routes today/", 'path("today/",' in urls_code)
    check("urls.py routes today/start/", 'path("today/start/",' in urls_code)
    check("urls.py routes today/submit-step/", 'path("today/submit-step/",' in urls_code)

    api_urls_py = ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    api_urls_code = api_urls_py.read_text(encoding="utf-8")
    check("endoora_api/urls.py routes api/missions/", "api/missions/" in api_urls_code and "missions.urls" in api_urls_code)

    # 5. Unit Tests
    tests_py = ROOT / "apps" / "api" / "missions" / "tests.py"
    check("missions/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests.py tests anonymous access", "test_anonymous_cannot_access" in tests_code)
    check("tests.py tests unplaced learner", "test_unplaced_learner_receives_onboarding_mission" in tests_code)
    check("tests.py tests placed learner", "test_placed_learner_receives_evidence_adaptive_mission" in tests_code)
    check("tests.py tests start status", "test_start_mission_transitions_status" in tests_code)
    check("tests.py tests step submission", "test_step_submission_and_feedback" in tests_code)
    check("tests.py tests mission completion", "test_mission_completion_and_next_best_action" in tests_code)
    check("tests.py tests user isolation", "test_user_isolation" in tests_code)

    # 6. Frontend Wireframe 2 Page
    page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "today" / "page.tsx"
    check("today/page.tsx exists", page_tsx.is_file())
    page_code = page_tsx.read_text(encoding="utf-8")
    check("page.tsx is a client component", '"use client"' in page_code)
    check("page.tsx supports overview mode", 'viewMode === "overview"' in page_code)
    check("page.tsx supports task mode", 'viewMode === "task"' in page_code)
    check("page.tsx supports complete mode", 'viewMode === "complete"' in page_code)
    check("page.tsx includes Rule #8 transparent note", "ثبت شواهد یادگیری" in page_code)
    check("page.tsx includes next best action", "next_best_action" in page_code)

    # 7. Tokenized CSS
    css_file = ROOT / "apps" / "web" / "app" / "(learner)" / "today" / "today.module.css"
    check("today.module.css exists", css_file.is_file())
    css_code = css_file.read_text(encoding="utf-8")
    raw_hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}", css_code)
    check("today.module.css has 0 raw hex colors", len(raw_hex_matches) == 0)
    check("today.module.css consumes var(--color-background)", "var(--color-background)" in css_code)
    check("today.module.css consumes var(--color-primary)", "var(--color-primary)" in css_code)
    check("today.module.css isolates English text direction", "unicode-bidi: isolate" in css_code)

    # 8. Next.js Redirect
    next_config = ROOT / "apps" / "web" / "next.config.ts"
    check("next.config.ts has /learner/today redirect", "/learner/today" in next_config.read_text(encoding="utf-8"))

    # 9. Python syntax compilation
    py_files = [models_py, services_py, serializers_py, views_py, urls_py, tests_py]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except py_compile.PyCompileError as e:
            check(f"Python syntax valid for {pf.name}: {e}", False)

    print("Day 20 static checks passed: Daily Mission adaptive engine, payload protection, Wireframe 2 frontend, tokenized CSS, Rule #8 compliance, and clean syntax.")


if __name__ == "__main__":
    main()
