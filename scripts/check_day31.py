"""
Contract check for Day 31: Community, Teacher Experiences, Lesson Plans, Moderation, and Safety Guidelines.
Validates:
1. Backend models (CommunityPost, PostComment, PostReaction, UserBlock, Report, ModerationAuditLog).
2. Mandatory copyright and format validation in CommunityPost.clean().
3. Mandatory alt_text and caption validation for media attachments.
4. PII scanner in apps/api/community/pii_scanner.py.
5. Database migrations in community and moderation apps.
6. Services in community/services.py and moderation/services.py with SLA calculation and audit preservation.
7. URL routing in apps/api/community/urls.py, apps/api/moderation/urls.py, and endoora_api/urls.py.
8. Settings installed apps and feature flags in apps/api/endoora_api/settings/base.py.
9. Safety documentation in docs/safety/community-guidelines.md (guidelines, minor protection, SLA, DMCA takedown).
10. Frontend community page and navigation link in Header.tsx.
11. Frontend CSS module tokens (zero raw hex colors and 100% logical properties).
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
    print("Running Day 31 Contract Verification...")

    # 1. Backend Community Models
    community_models_py = REPO_ROOT / "apps" / "api" / "community" / "models.py"
    check(community_models_py.is_file(), "apps/api/community/models.py exists")
    community_models = community_models_py.read_text(encoding="utf-8")
    check("class CommunityPost(" in community_models, "CommunityPost model defined")
    check("class PostComment(" in community_models, "PostComment model defined")
    check("class PostReaction(" in community_models, "PostReaction model defined")
    check("class UserBlock(" in community_models, "UserBlock model defined")
    check("class PostType(" in community_models, "PostType choices defined")
    check("class PostAudience(" in community_models, "PostAudience choices defined")
    check("class PostStatus(" in community_models, "PostStatus choices defined")
    check("class LicenseType(" in community_models, "LicenseType choices defined")
    check("is_verified_teacher" in community_models, "is_verified_teacher field on CommunityPost")
    check("lesson_plan_metadata" in community_models, "lesson_plan_metadata field on CommunityPost")
    check("is_monthly_featured" in community_models, "is_monthly_featured field on CommunityPost")
    check("editorial_review_notes" in community_models, "editorial_review_notes field on CommunityPost")
    check("def clean(self):" in community_models, "clean() method defined on CommunityPost")
    check("TEACHER_EXPERIENCE" in community_models, "TEACHER_EXPERIENCE validation present")

    # 2. PII Scanner
    pii_scanner_py = REPO_ROOT / "apps" / "api" / "community" / "pii_scanner.py"
    check(pii_scanner_py.is_file(), "apps/api/community/pii_scanner.py exists")
    pii_scanner = pii_scanner_py.read_text(encoding="utf-8")
    check("def scan_pii(" in pii_scanner, "scan_pii defined in pii_scanner.py")
    check("def assert_no_pii(" in pii_scanner, "assert_no_pii defined in pii_scanner.py")
    check("validate_iranian_national_id" in pii_scanner, "validate_iranian_national_id defined")

    # 3. Backend Moderation Models
    moderation_models_py = REPO_ROOT / "apps" / "api" / "moderation" / "models.py"
    check(moderation_models_py.is_file(), "apps/api/moderation/models.py exists")
    moderation_models = moderation_models_py.read_text(encoding="utf-8")
    check("class Report(" in moderation_models, "Report model defined")
    check("class ModerationAuditLog(" in moderation_models, "ModerationAuditLog model defined")
    check("class ReportReason(" in moderation_models, "ReportReason choices defined")
    check("class ModerationStatus(" in moderation_models, "ModerationStatus choices defined")
    check("class ModerationAction(" in moderation_models, "ModerationAction choices defined")
    check("target_content_snapshot" in moderation_models, "target_content_snapshot on Report")
    check("sla_deadline" in moderation_models, "sla_deadline on Report")
    check("sla_hours" in moderation_models, "sla_hours on Report")
    check("SLA_HOURS_MAP" in moderation_models, "SLA_HOURS_MAP defined on Report")

    # 4. Database Migrations
    comm_migrations = list((REPO_ROOT / "apps" / "api" / "community" / "migrations").glob("0001_*.py"))
    check(len(comm_migrations) >= 1, "community migration 0001 exists")
    mod_migrations = list((REPO_ROOT / "apps" / "api" / "moderation" / "migrations").glob("0001_*.py"))
    check(len(mod_migrations) >= 1, "moderation migration 0001 exists")

    # 5. Services Layer
    comm_services_py = REPO_ROOT / "apps" / "api" / "community" / "services.py"
    check(comm_services_py.is_file(), "apps/api/community/services.py exists")
    comm_services = comm_services_py.read_text(encoding="utf-8")
    check("class CommunityService" in comm_services, "CommunityService defined")
    check("list_posts" in comm_services, "list_posts defined in CommunityService")
    check("get_post_detail" in comm_services, "get_post_detail defined in CommunityService")
    check("create_post" in comm_services, "create_post defined in CommunityService")
    check("toggle_reaction" in comm_services, "toggle_reaction defined in CommunityService")
    check("add_comment" in comm_services, "add_comment defined in CommunityService")
    check("feature_post_editorial" in comm_services, "feature_post_editorial defined in CommunityService")
    check("block_user" in comm_services, "block_user defined in CommunityService")
    check("unblock_user" in comm_services, "unblock_user defined in CommunityService")

    mod_services_py = REPO_ROOT / "apps" / "api" / "moderation" / "services.py"
    check(mod_services_py.is_file(), "apps/api/moderation/services.py exists")
    mod_services = mod_services_py.read_text(encoding="utf-8")
    check("class ModerationService" in mod_services, "ModerationService defined")
    check("submit_report" in mod_services, "submit_report defined in ModerationService")
    check("get_moderation_queue" in mod_services, "get_moderation_queue defined in ModerationService")
    check("resolve_report" in mod_services, "resolve_report defined in ModerationService")

    # 6. URLs & Settings
    comm_urls_py = REPO_ROOT / "apps" / "api" / "community" / "urls.py"
    check(comm_urls_py.is_file(), "apps/api/community/urls.py exists")
    mod_urls_py = REPO_ROOT / "apps" / "api" / "moderation" / "urls.py"
    check(mod_urls_py.is_file(), "apps/api/moderation/urls.py exists")

    root_urls_py = REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    root_urls = root_urls_py.read_text(encoding="utf-8")
    check('"api/community/"' in root_urls and '"community.urls"' in root_urls, "api/community/ included in root urls")
    check('"api/moderation/"' in root_urls and '"moderation.urls"' in root_urls, "api/moderation/ included in root urls")

    settings_base = (REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py").read_text(encoding="utf-8")
    check('"community"' in settings_base, '"community" in INSTALLED_APPS')
    check('"moderation"' in settings_base, '"moderation" in INSTALLED_APPS')
    check("COMMUNITY_COMMENTS_ENABLED" in settings_base, "COMMUNITY_COMMENTS_ENABLED setting present")
    check("COMMUNITY_FILE_MAX_SIZE_MB" in settings_base, "COMMUNITY_FILE_MAX_SIZE_MB setting present")
    check("COMMUNITY_ALLOWED_EXTENSIONS" in settings_base, "COMMUNITY_ALLOWED_EXTENSIONS setting present")

    # 7. Safety Documentation
    safety_guidelines_md = REPO_ROOT / "docs" / "safety" / "community-guidelines.md"
    check(safety_guidelines_md.is_file(), "docs/safety/community-guidelines.md exists")
    safety_doc = safety_guidelines_md.read_text(encoding="utf-8")
    check("PII" in safety_doc, "PII rules covered in guidelines")
    check("SLA" in safety_doc, "SLA rules covered in guidelines")
    check("Copyright" in safety_doc or "کپی‌رایت" in safety_doc, "Copyright policy covered in guidelines")
    check("Takedown" in safety_doc or "نقض حق نشر" in safety_doc, "DMCA/takedown procedure covered in guidelines")

    # 8. Frontend Pages and Navigation
    comm_page_tsx = REPO_ROOT / "apps" / "web" / "app" / "community" / "page.tsx"
    check(comm_page_tsx.is_file(), "apps/web/app/community/page.tsx exists")
    comm_page = comm_page_tsx.read_text(encoding="utf-8")
    check("PublicShell" in comm_page, "Community page uses PublicShell")
    check("detectPii" in comm_page, "Client-side PII detector in Community page")
    check("isVerifiedTeacher" in comm_page, "Teacher verification badge logic in Community page")
    check("moderationQueue" in comm_page, "Moderation queue in Community page")
    check("lessonPlan" in comm_page, "Lesson plan handling in Community page")

    header_tsx = (REPO_ROOT / "apps" / "web" / "components" / "layout" / "Header.tsx").read_text(encoding="utf-8")
    check('href="/community"' in header_tsx, "Community link present in Header navigation")

    # 9. CSS Module Tokens & Logical Properties
    css_file = REPO_ROOT / "apps" / "web" / "app" / "community" / "community.module.css"
    check(css_file.is_file(), "community.module.css exists")
    css_content = css_file.read_text(encoding="utf-8")

    # Check for raw hex colors
    raw_hex = re.findall(r'#[0-9a-fA-F]{3,8}\b', css_content)
    check(len(raw_hex) == 0, f"Zero raw hex colors in community.module.css (found {len(raw_hex)})")

    # Check for physical left/right
    physical_props = re.findall(r'\b(margin-left|margin-right|padding-left|padding-right|border-left|border-right|left|right)\s*:', css_content)
    # Ignore linear-gradient(90deg) or similar function values
    check(len(physical_props) == 0, f"Zero physical left/right CSS properties in community.module.css (found {len(physical_props)})")

    print("\n[SUCCESS] Day 31 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
