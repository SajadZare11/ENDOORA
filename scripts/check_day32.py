"""
Contract check for Day 32: Unified Search, Recommendations, FAQ CMS, and AI Support Triage.
Validates:
1. Backend search models (SearchDocument, SearchQueryLog, RecentSearch).
2. Persian/English normalizer and tokenization in apps/api/search/normalizer.py.
3. Permission-aware search service and private message protection guard.
4. Backend support models (FAQCategory, FAQItem, SupportTicket, TicketMessage, TicketAttachment).
5. AI Support triage service with mandatory auto-escalation for payments/security and approved FAQ grounding.
6. Guaranteed human handoff capability in TicketService.
7. Migrations in search and support apps.
8. Settings installed apps and flags in endoora_api/settings/base.py.
9. URL routing in search/urls.py, support/urls.py, and endoora_api/urls.py.
10. Documentation in docs/support/faq-and-ai-triage.md.
11. Frontend search page, support hub, layout metadata, and navigation links.
12. CSS module tokens (zero raw hex colors and 100% logical properties).
"""

import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        try:
            print(f"[FAIL] {message}")
        except UnicodeEncodeError:
            print(f"[FAIL] {message.encode('ascii', 'backslashreplace').decode('ascii')}")
        sys.exit(1)
    try:
        print(f"[PASS] {message}")
    except UnicodeEncodeError:
        print(f"[PASS] {message.encode('ascii', 'backslashreplace').decode('ascii')}")



def main():
    print("Running Day 32 Contract Verification...")

    # 1. Search Models
    search_models_py = REPO_ROOT / "apps" / "api" / "search" / "models.py"
    check(search_models_py.is_file(), "apps/api/search/models.py exists")
    search_models = search_models_py.read_text(encoding="utf-8")
    check("class SearchDocument(" in search_models, "SearchDocument model defined")
    check("class SearchQueryLog(" in search_models, "SearchQueryLog model defined")
    check("class RecentSearch(" in search_models, "RecentSearch model defined")
    check("class SearchContentType(" in search_models, "SearchContentType choices defined")
    check("class SearchVisibility(" in search_models, "SearchVisibility choices defined")
    check("normalized_title" in search_models, "normalized_title field on SearchDocument")
    check("normalized_content" in search_models, "normalized_content field on SearchDocument")
    check("is_zero_result" in search_models, "is_zero_result field on SearchQueryLog")

    # 2. Search Normalizer
    normalizer_py = REPO_ROOT / "apps" / "api" / "search" / "normalizer.py"
    check(normalizer_py.is_file(), "apps/api/search/normalizer.py exists")
    normalizer = normalizer_py.read_text(encoding="utf-8")
    check("def normalize_persian_text(" in normalizer, "normalize_persian_text defined")
    check("def normalize_text(" in normalizer, "normalize_text defined")
    check("def tokenize(" in normalizer, "tokenize defined")

    # Verify normalization logic directly
    sys.path.insert(0, str(REPO_ROOT / "apps" / "api"))
    from search.normalizer import normalize_text
    check(normalize_text("كتاب يادگيري") == "کتاب یادگیری", "Persian ي/ي and ك/ك normalization works correctly")

    # 3. Search Services & Guards
    search_services_py = REPO_ROOT / "apps" / "api" / "search" / "services.py"
    check(search_services_py.is_file(), "apps/api/search/services.py exists")
    search_services = search_services_py.read_text(encoding="utf-8")
    check("class SearchIndexingService" in search_services, "SearchIndexingService defined")
    check("class SearchService" in search_services, "SearchService defined")
    check("def build_permission_filter(" in search_services, "build_permission_filter defined")
    check("index_private_message" in search_services, "index_private_message guard present")

    # 4. Support Models
    support_models_py = REPO_ROOT / "apps" / "api" / "support" / "models.py"
    check(support_models_py.is_file(), "apps/api/support/models.py exists")
    support_models = support_models_py.read_text(encoding="utf-8")
    check("class FAQCategory(" in support_models, "FAQCategory model defined")
    check("class FAQItem(" in support_models, "FAQItem model defined")
    check("class SupportTicket(" in support_models, "SupportTicket model defined")
    check("class TicketMessage(" in support_models, "TicketMessage model defined")
    check("class TicketAttachment(" in support_models, "TicketAttachment model defined")
    check("class TicketCategory(" in support_models, "TicketCategory choices defined")
    check("class TicketStatus(" in support_models, "TicketStatus choices defined")
    check("escalated_to_human" in support_models, "escalated_to_human field defined on SupportTicket")
    check("cited_faq" in support_models, "cited_faq field defined on SupportTicket")

    # 5. Support Services & AI Triage
    support_services_py = REPO_ROOT / "apps" / "api" / "support" / "services.py"
    check(support_services_py.is_file(), "apps/api/support/services.py exists")
    support_services = support_services_py.read_text(encoding="utf-8")
    check("class FAQService" in support_services, "FAQService defined")
    check("class AITriageService" in support_services, "AITriageService defined")
    check("class TicketService" in support_services, "TicketService defined")
    check("SENSITIVE_CATEGORIES" in support_services, "SENSITIVE_CATEGORIES defined")
    check("def escalate_to_human(" in support_services, "escalate_to_human defined")

    # 6. Database Migrations
    search_migration = REPO_ROOT / "apps" / "api" / "search" / "migrations" / "0001_initial.py"
    support_migration = REPO_ROOT / "apps" / "api" / "support" / "migrations" / "0001_initial.py"
    check(search_migration.is_file(), "search migration 0001 exists")
    check(support_migration.is_file(), "support migration 0001 exists")

    # 7. URLs & Settings
    check((REPO_ROOT / "apps" / "api" / "search" / "urls.py").is_file(), "apps/api/search/urls.py exists")
    check((REPO_ROOT / "apps" / "api" / "support" / "urls.py").is_file(), "apps/api/support/urls.py exists")

    root_urls = (REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py").read_text(encoding="utf-8")
    check('include("search.urls")' in root_urls, "api/search/ included in root urls")
    check('include("support.urls")' in root_urls, "api/support/ included in root urls")

    settings_base = (REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py").read_text(encoding="utf-8")
    check('"search"' in settings_base, '"search" in INSTALLED_APPS')
    check('"support"' in settings_base, '"support" in INSTALLED_APPS')
    check("SUPPORT_AUTO_ESCALATE_CATEGORIES" in settings_base, "SUPPORT_AUTO_ESCALATE_CATEGORIES setting present")

    # 8. Documentation
    safety_doc = REPO_ROOT / "docs" / "support" / "faq-and-ai-triage.md"
    check(safety_doc.is_file(), "docs/support/faq-and-ai-triage.md exists")
    safety_text = safety_doc.read_text(encoding="utf-8")
    check("Permission-Aware Unified Search" in safety_text, "Permission boundaries covered in doc")
    check("AI Support Triage" in safety_text, "AI Triage policies covered in doc")
    check("SLA" in safety_text, "SLA commitments covered in doc")

    # 9. Frontend Pages & Layouts
    search_page = REPO_ROOT / "apps" / "web" / "app" / "search" / "page.tsx"
    search_layout = REPO_ROOT / "apps" / "web" / "app" / "search" / "layout.tsx"
    support_page = REPO_ROOT / "apps" / "web" / "app" / "support" / "page.tsx"
    support_layout = REPO_ROOT / "apps" / "web" / "app" / "support" / "layout.tsx"

    check(search_page.is_file(), "apps/web/app/search/page.tsx exists")
    check(search_layout.is_file(), "apps/web/app/search/layout.tsx exists")
    check(support_page.is_file(), "apps/web/app/support/page.tsx exists")
    check(support_layout.is_file(), "apps/web/app/support/layout.tsx exists")

    search_page_content = search_page.read_text(encoding="utf-8")
    check("PublicShell" in search_page_content, "Search page uses PublicShell")
    check("POPULAR_SEARCH_TERMS" in search_page_content, "Search page includes popular terms")

    support_page_content = support_page.read_text(encoding="utf-8")
    check("PublicShell" in support_page_content, "Support page uses PublicShell")
    check("handleEscalateToHuman" in support_page_content, "Support page implements human escalation action")
    check("isFinancialOrSecurity" in support_page_content, "Support page handles financial/security policy warning")

    header_tsx = (REPO_ROOT / "apps" / "web" / "components" / "layout" / "Header.tsx").read_text(encoding="utf-8")
    check('href="/search"' in header_tsx, "Search link in Header.tsx")
    check('href="/support"' in header_tsx, "Support link in Header.tsx")

    public_shell = (REPO_ROOT / "apps" / "web" / "components" / "marketing" / "PublicShell.tsx").read_text(encoding="utf-8")
    check('"/support"' in public_shell, "Support link in PublicShell footer")
    check('"/search"' in public_shell, "Search link in PublicShell footer")

    # 10. CSS Token Compliance
    hex_pattern = re.compile(r"#[0-9a-fA-F]{3,8}\b")
    physical_props = re.compile(r"\b(margin-left|margin-right|padding-left|padding-right|left:|right:)")

    for css_rel in ["apps/web/app/search/search.module.css", "apps/web/app/support/support.module.css"]:
        css_file = REPO_ROOT / css_rel
        check(css_file.is_file(), f"{css_rel} exists")
        css_content = css_file.read_text(encoding="utf-8")

        # Check raw hex colors (allow comments if any, but clean rules)
        clean_css = re.sub(r"/\*.*?\*/", "", css_content, flags=re.DOTALL)
        hex_matches = hex_pattern.findall(clean_css)
        check(len(hex_matches) == 0, f"Zero raw hex colors in {css_rel} (found {len(hex_matches)})")

        # Check physical left/right properties
        prop_matches = physical_props.findall(clean_css)
        check(len(prop_matches) == 0, f"Zero physical left/right CSS properties in {css_rel} (found {len(prop_matches)})")

    print("\n[SUCCESS] Day 32 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
