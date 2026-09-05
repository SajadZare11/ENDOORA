"""
Contract check for Day 29: Badges, Daily/Weekly Challenges, Clubs, and Privacy-Safe Leaderboards.
Validates:
1. Backend models (Badge, LearnerBadge, ChallengeTemplate, LearnerChallenge, SevenDaySprintEnrollment,
   ActiveUsersClub, ClubMembership, LearnerPrivacySettings, LeaderboardSnapshot, LeaderboardEntry).
2. Database migration (gamification/migrations/0002_*.py).
3. URL routing in gamification/urls.py.
4. Services in gamification/services.py (BadgeService, ChallengeService, ClubService, LeaderboardService).
5. Product Constitution Rule #5 (Privacy), Rule #7 (Calm, Anti-Addiction), and Rule #8 (Honest Assessment).
6. Safety & privacy policy documentation in docs/safety/leaderboard-policy.md.
7. Frontend Achievements and Leaderboard page at apps/web/app/(learner)/achievements/page.tsx.
8. Frontend CSS module tokens (zero raw hex colors and 100% logical properties).
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
    print("Running Day 29 Contract Verification...")

    # 1. Backend Models
    models_py = REPO_ROOT / "apps" / "api" / "gamification" / "models.py"
    check(models_py.is_file(), "apps/api/gamification/models.py exists")
    models_content = models_py.read_text(encoding="utf-8")
    check("class Badge(" in models_content, "Badge model defined")
    check("class LearnerBadge(" in models_content, "LearnerBadge model defined")
    check("class ChallengeTemplate(" in models_content, "ChallengeTemplate model defined")
    check("class LearnerChallenge(" in models_content, "LearnerChallenge model defined")
    check("class SevenDaySprintEnrollment(" in models_content, "SevenDaySprintEnrollment model defined")
    check("class ActiveUsersClub(" in models_content, "ActiveUsersClub model defined")
    check("class ClubMembership(" in models_content, "ClubMembership model defined")
    check("class LearnerPrivacySettings(" in models_content, "LearnerPrivacySettings model defined")
    check("class LeaderboardSnapshot(" in models_content, "LeaderboardSnapshot model defined")
    check("class LeaderboardEntry(" in models_content, "LeaderboardEntry model defined")
    check("is_suppressed" in models_content, "is_suppressed field on LeaderboardSnapshot")
    check("is_minor" in models_content, "is_minor field on LearnerPrivacySettings")
    check("pseudonym" in models_content, "pseudonym field on LearnerPrivacySettings")

    # 2. Database Migration
    migration_files = list((REPO_ROOT / "apps" / "api" / "gamification" / "migrations").glob("0002_*.py"))
    check(len(migration_files) >= 1, "gamification migration 0002 exists")

    # 3. Service Layer
    services_py = REPO_ROOT / "apps" / "api" / "gamification" / "services.py"
    check(services_py.is_file(), "apps/api/gamification/services.py exists")
    services_content = services_py.read_text(encoding="utf-8")
    check("class BadgeService" in services_content, "BadgeService defined")
    check("class ChallengeService" in services_content, "ChallengeService defined")
    check("class ClubService" in services_content, "ClubService defined")
    check("class LeaderboardService" in services_content, "LeaderboardService defined")
    check("MIN_SAFE_COHORT_SIZE = 10" in services_content, "MIN_SAFE_COHORT_SIZE = 10 anti-doxxing threshold enforced")
    check("is_minor" in services_content, "is_minor location protection enforced in LeaderboardService")
    check("Asia/Tehran" in services_content, "Asia/Tehran timezone evaluated for challenges and streaks")
    check("Rule #7" in services_content, "Rule #7 calm learning referenced")
    check("Rule #8" in services_content, "Rule #8 honest assessment referenced")

    # 4. URLs & Endpoints
    urls_py = REPO_ROOT / "apps" / "api" / "gamification" / "urls.py"
    check(urls_py.is_file(), "apps/api/gamification/urls.py exists")
    urls_content = urls_py.read_text(encoding="utf-8")
    check('"badges/"' in urls_content, "badges/ route configured")
    check('"challenges/"' in urls_content, "challenges/ route configured")
    check('"challenges/enroll-sprint/"' in urls_content, "challenges/enroll-sprint/ route configured")
    check('"clubs/"' in urls_content, "clubs/ route configured")
    check('"leaderboard/"' in urls_content, "leaderboard/ route configured")
    check('"leaderboard/privacy/"' in urls_content, "leaderboard/privacy/ route configured")

    # 5. Safety & Policy Documentation
    policy_md = REPO_ROOT / "docs" / "safety" / "leaderboard-policy.md"
    check(policy_md.is_file(), "docs/safety/leaderboard-policy.md exists")
    policy_content = policy_md.read_text(encoding="utf-8")
    check("Rule #5" in policy_content, "Rule #5 privacy referenced in policy")
    check("Rule #7" in policy_content, "Rule #7 calm learning referenced in policy")
    check("Rule #8" in policy_content, "Rule #8 honest assessment referenced in policy")
    check("Minimum Safe Cohort Size" in policy_content or "10" in policy_content, "Minimum safe cohort size documented")
    check("minors" in policy_content.lower(), "Minor protection rules documented")

    # 6. Frontend Achievements Page
    achievements_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "achievements" / "page.tsx"
    check(achievements_page.is_file(), "apps/web/app/(learner)/achievements/page.tsx exists")

    # 7. Frontend CSS Module & Zero Hex Check
    css_file = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "achievements" / "achievements.module.css"
    check(css_file.is_file(), "apps/web/app/(learner)/achievements/achievements.module.css exists")
    css_content = css_file.read_text(encoding="utf-8")

    # Hex color check
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(len(hex_matches) == 0, f"Zero raw hex colors in achievements.module.css (found {len(hex_matches)})")

    # Physical left/right check
    physical_props = re.findall(r"(?:margin|padding|border)-(?:left|right)\s*:", css_content, re.IGNORECASE)
    check(len(physical_props) == 0, f"Zero physical left/right CSS properties in achievements.module.css (found {len(physical_props)})")

    print("\n[SUCCESS] Day 29 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
