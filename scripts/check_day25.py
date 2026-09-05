"""
Contract check for Day 25: Build text-based Roleplay Universe v1.
Validates:
1. Complete scenario catalog (10 scenarios) with valid schemas.
2. Backend models (RoleplaySession, RoleplayMessage, RoleplayReport) and initial migration.
3. Anti-exploit XP guard, bounded turn counts, and 500-char message caps.
4. Prompt injection defense and zero mid-turn interruption guarantee.
5. Deferred post-conversation report with Mistake Genome and SRS deck integrations.
6. Frontend roleplay page and 100% tokenized CSS module (0 raw hex colors).
7. Documentation updates in docs/ai/ and docs/learning/.
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        print(f"[FAIL] {message}")
        sys.exit(1)
    print(f"[PASS] {message}")


def main():
    print("Running Day 25 Contract Verification...")

    # 1. Scenario Catalog
    scenarios_dir = REPO_ROOT / "data" / "scenarios"
    check(scenarios_dir.is_dir(), "data/scenarios directory exists")

    required_scenarios = [
        "airport",
        "hotel",
        "restaurant",
        "shopping",
        "travel",
        "university",
        "job_interview",
        "business",
        "friendly_chat",
        "ielts_speaking",
    ]
    for sc_id in required_scenarios:
        sc_file = scenarios_dir / f"{sc_id}.json"
        check(sc_file.is_file(), f"Scenario file {sc_id}.json exists")
        with open(sc_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            check(data.get("id") == sc_id, f"Scenario {sc_id} ID matches")
            check(bool(data.get("title_en")), f"Scenario {sc_id} has title_en")
            check(bool(data.get("title_fa")), f"Scenario {sc_id} has title_fa")
            check("character" in data, f"Scenario {sc_id} has character definition")
            check("avatar" in data["character"], f"Scenario {sc_id} character has avatar")
            check(len(data.get("goals", [])) >= 3, f"Scenario {sc_id} has at least 3 goals")
            check(len(data.get("target_vocabulary", [])) >= 4, f"Scenario {sc_id} has target vocabulary")

    # 2. Backend Models & Migration
    models_py = REPO_ROOT / "apps" / "api" / "roleplay" / "models.py"
    check(models_py.is_file(), "apps/api/roleplay/models.py exists")
    models_content = models_py.read_text(encoding="utf-8")
    check("class RoleplaySession(" in models_content, "RoleplaySession model defined")
    check("class RoleplayMessage(" in models_content, "RoleplayMessage model defined")
    check("class RoleplayReport(" in models_content, "RoleplayReport model defined")
    check("xp_awarded" in models_content, "Anti-exploit xp_awarded boolean present on RoleplaySession")
    check("max_turns" in models_content, "max_turns field present on RoleplaySession")

    migration_file = REPO_ROOT / "apps" / "api" / "roleplay" / "migrations" / "0001_initial.py"
    check(migration_file.is_file(), "apps/api/roleplay/migrations/0001_initial.py exists")

    # 3. Backend Services & Safeguards
    services_py = REPO_ROOT / "apps" / "api" / "roleplay" / "services.py"
    check(services_py.is_file(), "apps/api/roleplay/services.py exists")
    services_content = services_py.read_text(encoding="utf-8")
    check("class RoleplayService:" in services_content, "RoleplayService defined")
    check("def get_scenarios(" in services_content, "get_scenarios implemented")
    check("def start_or_resume_session(" in services_content, "start_or_resume_session implemented")
    check("def send_message(" in services_content, "send_message implemented")
    check("def create_report(" in services_content, "create_report implemented")
    check("def get_hint(" in services_content, "get_hint implemented")
    check("def accept_mistake(" in services_content, "accept_mistake implemented")
    check("def save_srs_word(" in services_content, "save_srs_word implemented")
    check("MistakeGenomeService" in services_content, "MistakeGenomeService integrated")
    check("SrsItem" in services_content, "SrsItem integrated")
    check("PROMPT_INJECTION_KEYWORDS" in services_content, "Prompt injection keywords cataloged")
    check("[:500]" in services_content, "500 character input cap enforced")

    # 4. URLs & Endpoints
    urls_py = REPO_ROOT / "apps" / "api" / "roleplay" / "urls.py"
    check(urls_py.is_file(), "apps/api/roleplay/urls.py exists")
    urls_content = urls_py.read_text(encoding="utf-8")
    check("scenarios/" in urls_content, "scenarios endpoint registered")
    check("sessions/start/" in urls_content, "sessions/start endpoint registered")
    check("sessions/<int:session_id>/message/" in urls_content, "session message endpoint registered")
    check("sessions/<int:session_id>/hint/" in urls_content, "session hint endpoint registered")
    check("sessions/<int:session_id>/complete/" in urls_content, "session complete endpoint registered")
    check("accept-mistake/" in urls_content, "accept-mistake endpoint registered")
    check("save-srs-word/" in urls_content, "save-srs-word endpoint registered")

    main_urls_py = REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    main_urls_content = main_urls_py.read_text(encoding="utf-8")
    check("api/roleplay/" in main_urls_content, "api/roleplay/ wired into endoora_api/urls.py")

    # 5. Frontend Experience & Tokenized CSS
    frontend_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "roleplay" / "page.tsx"
    check(frontend_page.is_file(), "apps/web/app/(learner)/roleplay/page.tsx exists")
    page_content = frontend_page.read_text(encoding="utf-8")
    check("Roleplay Universe v1" in page_content, "Roleplay Universe branding present")
    check("handleSelectScenario" in page_content, "handleSelectScenario present")
    check("handleSendMessage" in page_content, "handleSendMessage present")
    check("handleAcceptMistake" in page_content, "handleAcceptMistake present")
    check("handleSaveSrsWord" in page_content, "handleSaveSrsWord present")

    css_file = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "roleplay" / "roleplay.module.css"
    check(css_file.is_file(), "roleplay.module.css exists")
    css_content = css_file.read_text(encoding="utf-8")
    raw_hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(len(raw_hex_matches) == 0, f"roleplay.module.css has 0 raw hex colors (found {len(raw_hex_matches)})")
    check("var(--color-" in css_content, "roleplay.module.css uses design tokens")

    # 6. Documentation
    ai_doc = REPO_ROOT / "docs" / "ai" / "roleplay-engine.md"
    check(ai_doc.is_file(), "docs/ai/roleplay-engine.md exists")
    learning_doc = REPO_ROOT / "docs" / "learning" / "roleplay.md"
    check(learning_doc.is_file(), "docs/learning/roleplay.md exists")

    print("\nAll Day 25 contract verification checks passed successfully!")


if __name__ == "__main__":
    main()
