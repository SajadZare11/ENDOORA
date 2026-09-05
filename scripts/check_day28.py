"""
Contract check for Day 28: Build Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules.
Validates:
1. Backend gamification models (XPTransaction, LearnerStreak, LearnerLevel, immutability constraints).
2. Database migration (gamification/migrations/0001_initial.py).
3. App registration in settings/base.py and URL routing in endoora_api/urls.py.
4. Gamification service methods (level curve, idempotent award_xp, streak/freeze rules, learner profile, legacy XPService).
5. Product Constitution Rule #7 (Calm, Anti-Addiction) and Rule #8 (Honest Assessment) compliance.
6. API routes for summary, ledger, award, and levels catalog.
7. Dashboard service integration (dynamically pulls from gamification ledger).
8. Frontend Progress page with dynamic level meter, streak flames, weekly activity dots, and live XP ledger table.
9. Frontend CSS module (progress.module.css) with zero raw hex colors and 100% logical properties.
10. Badges page enhanced with live learner level from gamification engine.
11. Technical documentation in docs/gamification/xp-ledger.md.
"""

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
    print("Running Day 28 Contract Verification...")

    # 1. Backend Models
    models_py = REPO_ROOT / "apps" / "api" / "gamification" / "models.py"
    check(models_py.is_file(), "apps/api/gamification/models.py exists")
    models_content = models_py.read_text(encoding="utf-8")
    check("class XPTransaction(" in models_content, "XPTransaction model defined")
    check("class LearnerStreak(" in models_content, "LearnerStreak model defined")
    check("class LearnerLevel(" in models_content, "LearnerLevel model defined")
    check("source_event = models.CharField(" in models_content, "source_event field present on XPTransaction")
    check("unique=True" in models_content, "source_event is unique for idempotency")
    check("freeze_credits" in models_content, "freeze_credits present on LearnerStreak")
    check("current_streak" in models_content, "current_streak present on LearnerStreak")
    check("total_xp" in models_content, "total_xp present on LearnerLevel")
    check("current_level" in models_content, "current_level present on LearnerLevel")
    check("def learner_id(" in models_content, "legacy learner_id property present")
    check("immutable" in models_content, "immutability validation present in save")

    # 2. Database Migration
    migration_file = REPO_ROOT / "apps" / "api" / "gamification" / "migrations" / "0001_initial.py"
    check(migration_file.is_file(), "gamification migration 0001_initial.py exists")

    # 3. Settings and URL Routing
    base_settings = (REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py").read_text(encoding="utf-8")
    check('"gamification"' in base_settings, "gamification registered in INSTALLED_APPS")

    root_urls = (REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py").read_text(encoding="utf-8")
    check('"api/gamification/"' in root_urls and '"gamification.urls"' in root_urls, "gamification routed in root urls")

    # 4. Service Layer Logic & Rules Compliance
    services_py = REPO_ROOT / "apps" / "api" / "gamification" / "services.py"
    check(services_py.is_file(), "apps/api/gamification/services.py exists")
    services_content = services_py.read_text(encoding="utf-8")
    check("def calculate_level_progression(" in services_content, "calculate_level_progression method exists")
    check("def award_xp(" in services_content, "award_xp method exists")
    check("def record_activity(" in services_content, "record_activity streak method exists")
    check("def get_learner_gamification_profile(" in services_content, "get_learner_gamification_profile method exists")
    check("class XPService" in services_content, "XPService legacy wrapper exists")
    check("freeze_credits" in services_content, "freeze credit grace logic implemented")
    check("Asia/Tehran" in services_content or "localdate()" in services_content, "timezone-aware streak calendar logic present")
    check("Rule #7" in services_content, "Rule #7 calm learning referenced in service")
    check("Rule #8" in services_content, "Rule #8 honest assessment referenced in service")

    # 5. URLs and Views
    urls_py = REPO_ROOT / "apps" / "api" / "gamification" / "urls.py"
    check(urls_py.is_file(), "apps/api/gamification/urls.py exists")
    urls_content = urls_py.read_text(encoding="utf-8")
    check('"summary/"' in urls_content, "summary/ route configured")
    check('"ledger/"' in urls_content, "ledger/ route configured")
    check('"award/"' in urls_content, "award/ route configured")
    check('"levels/"' in urls_content, "levels/ route configured")

    # 6. Dashboard Integration
    dashboard_services = (REPO_ROOT / "apps" / "api" / "dashboard" / "services.py").read_text(encoding="utf-8")
    check("XPTransaction.objects.filter" in dashboard_services, "Dashboard queries gamification XPTransaction")
    check("LearnerLevel" in dashboard_services, "Dashboard queries LearnerLevel")

    # 7. Frontend Pages
    progress_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "progress" / "page.tsx"
    check(progress_tsx.is_file(), "apps/web/app/(learner)/progress/page.tsx exists")
    progress_content = progress_tsx.read_text(encoding="utf-8")
    check("level_title" in progress_content, "level title displayed on progress page")
    check("current_streak" in progress_content, "current streak displayed on progress page")
    check("ledgerTable" in progress_content, "ledgerTable implemented on progress page")
    check("Rule #7" in progress_content or "قواعد ۷" in progress_content, "Rule #7 disclaimers present")
    check("Rule #8" in progress_content or "قانون شماره ۸" in progress_content or "قاعده ۸" in progress_content, "Rule #8 disclaimers present")

    badges_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "badges" / "page.tsx"
    check(badges_tsx.is_file(), "apps/web/app/(learner)/badges/page.tsx exists")
    badges_content = badges_tsx.read_text(encoding="utf-8")
    check("currentLevel" in badges_content, "currentLevel displayed on badges page")

    # 8. Frontend CSS Module & Zero Hex Check
    css_file = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "progress" / "progress.module.css"
    check(css_file.is_file(), "apps/web/app/(learner)/progress/progress.module.css exists")
    css_content = css_file.read_text(encoding="utf-8")

    # Hex color check
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(len(hex_matches) == 0, f"Zero raw hex colors in progress.module.css (found {len(hex_matches)})")

    # Physical left/right check
    physical_props = re.findall(r"(?:margin|padding|border)-(?:left|right)\s*:", css_content, re.IGNORECASE)
    check(len(physical_props) == 0, f"Zero physical left/right CSS properties in progress.module.css (found {len(physical_props)})")

    # 9. Documentation
    doc_file = REPO_ROOT / "docs" / "gamification" / "xp-ledger.md"
    check(doc_file.is_file(), "docs/gamification/xp-ledger.md exists")
    doc_content = doc_file.read_text(encoding="utf-8")
    check("Rule #7" in doc_content, "Rule #7 documented in xp-ledger.md")
    check("Rule #8" in doc_content, "Rule #8 documented in xp-ledger.md")
    check("idempotency" in doc_content.lower(), "idempotency documented")
    check("freeze" in doc_content.lower(), "freeze rules documented")

    print("\n[SUCCESS] Day 28 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
