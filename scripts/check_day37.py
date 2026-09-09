"""
Contract check for Day 37: Marketplace Request Feed, Filtering, and Matching Pipeline.
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
passed_checks = 0
failed_checks = 0

def check(condition: bool, description: str):
    global passed_checks, failed_checks
    if condition:
        print(f"  [PASS] {description}")
        passed_checks += 1
    else:
        print(f"  [FAIL] {description}")
        failed_checks += 1

def check_file_contains(file_path: Path, patterns: list[str], label: str):
    if not file_path.exists():
        check(False, f"{label}: File {file_path.relative_to(REPO_ROOT)} does not exist")
        return
    text = file_path.read_text(encoding="utf-8")
    for pattern in patterns:
        if pattern in text:
            check(True, f"{label} contains '{pattern[:45]}...'")
        else:
            check(False, f"{label} MISSING '{pattern}'")

def check_no_raw_hex_and_logical_properties(css_path: Path, label: str):
    if not css_path.exists():
        check(False, f"{label}: {css_path.relative_to(REPO_ROOT)} does not exist")
        return
    text = css_path.read_text(encoding="utf-8")
    hex_pattern = re.compile(r"#[0-9a-fA-F]{3,8}\b")
    hex_matches = hex_pattern.findall(text)
    check(len(hex_matches) == 0, f"{label}: 0 raw hex colors (found {len(hex_matches)})")
    physical_props = [
        "margin-left", "margin-right", "margin-top", "margin-bottom",
        "padding-left", "padding-right", "padding-top", "padding-bottom",
    ]
    found_physical = []
    for prop in physical_props:
        if re.search(rf"\b{prop}\s*:", text):
            found_physical.append(prop)
    check(len(found_physical) == 0, f"{label}: 100% logical properties (no physical: {found_physical})")

print("=== Day 37 Contract Verification ===")
print("\n[1] Backend App Registration & Routing:")
check_file_contains(REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py", ["marketplace"], "settings/base.py INSTALLED_APPS")
check_file_contains(REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py", ["api/marketplace/", "include(\"marketplace.urls\")"], "endoora_api/urls.py routes")

print("\n[2] Backend Models & Choices:")
models_file = REPO_ROOT / "apps" / "api" / "marketplace" / "models.py"
check_file_contains(models_file, [
    "class RequestSkill", "class CEFRLevel", "class SessionFormat",
    "class PreferredTimeWindow", "class RequestStatus", "class OfferStatus",
    "class MarketplaceRequest", "class TeacherOffer",
    "unique_pending_offer_per_teacher_request",
], "marketplace/models.py")

print("\n[3] Backend Services & Security Gating:")
services_file = REPO_ROOT / "apps" / "api" / "marketplace" / "services.py"
check_file_contains(services_file, [
    "def ensure_teacher_marketplace_eligible",
    "def create_learn_now_request",
    "def list_teacher_feed",
    "def submit_teacher_offer",
    "def withdraw_teacher_offer",
    "def accept_teacher_offer",
    "def cancel_learner_request",
    "transaction.atomic()",
], "marketplace/services.py")

print("\n[4] Serializers & Privacy Protection:")
serializers_file = REPO_ROOT / "apps" / "api" / "marketplace" / "serializers.py"
check_file_contains(serializers_file, [
    "class TeacherFeedRequestSerializer", "class TeacherOfferSerializer",
    "class LearnerRequestDetailSerializer", "class TeacherWorkspaceOfferSerializer",
    "learner_display_name",
], "marketplace/serializers.py")
feed_text = serializers_file.read_text(encoding="utf-8")
feed_slice = feed_text[feed_text.find("class TeacherFeedRequestSerializer") : feed_text.find("class TeacherOfferSerializer")]
check('"email"' not in feed_slice and '"phone"' not in feed_slice, "Privacy: email/phone strictly excluded from teacher feed serializer")

print("\n[5] Django Admin & Migrations:")
check((REPO_ROOT / "apps" / "api" / "marketplace" / "migrations" / "0001_initial.py").exists(), "Migration 0001_initial.py exists")
check_file_contains(REPO_ROOT / "apps" / "api" / "marketplace" / "admin.py", ["MarketplaceRequestAdmin", "TeacherOfferAdmin"], "marketplace/admin.py")

print("\n[6] Marketplace Unit Tests:")
check_file_contains(REPO_ROOT / "apps" / "api" / "marketplace" / "tests.py", [
    "class MarketplaceDay37Tests", "test_teacher_eligibility_endpoint",
    "test_unverified_teacher_forbidden_from_feed", "test_learner_create_request",
    "test_learner_privacy_masked_in_teacher_feed", "test_teacher_offer_flow_and_acceptance",
    "test_teacher_offer_withdrawal", "test_learner_request_cancellation",
], "marketplace/tests.py")

print("\n[7] Frontend API Client:")
check_file_contains(REPO_ROOT / "apps" / "web" / "lib" / "marketplace.ts", [
    "export interface MarketplaceRequest", "export interface TeacherOffer",
    "export interface TeacherEligibility", "export async function fetchTeacherEligibility",
    "export async function fetchTeacherFeed", "export async function fetchTeacherOffers",
    "export async function submitTeacherOffer", "export async function withdrawTeacherOffer",
    "export async function createLearnNowRequest", "export async function acceptTeacherOffer",
], "web/lib/marketplace.ts")

print("\n[8] Frontend Pages & Routes:")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "requests" / "page.tsx", [
    "MarketplaceRequestsPage", "fetchTeacherEligibility", "fetchTeacherFeed", "submitTeacherOffer", "SKILL_OPTIONS",
], "teacher/marketplace/requests/page.tsx")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "offers" / "page.tsx", [
    "TeacherOffersPage", "fetchTeacherOffers", "withdrawTeacherOffer", "handleWithdraw",
], "teacher/marketplace/offers/page.tsx")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "learn" / "now" / "page.tsx", [
    "LearnNowWizardPage", "createLearnNowRequest", "fetchLearnerRequests", "acceptTeacherOffer", "handlePublishRequest", "handleAcceptOffer",
], "learner/learn/now/page.tsx")

print("\n[9] CSS Compliance (0 raw hex, 100% logical properties):")
check_no_raw_hex_and_logical_properties(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "requests" / "requests.module.css", "requests.module.css")
check_no_raw_hex_and_logical_properties(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "offers" / "offers.module.css", "offers.module.css")
check_no_raw_hex_and_logical_properties(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "learn" / "now" / "learn-now.module.css", "learn-now.module.css")

print("\n[10] Navigation Integration:")
check_file_contains(REPO_ROOT / "apps" / "web" / "components" / "teacher" / "TeacherShell.tsx", ["href: \"/marketplace/requests\""], "TeacherShell links to /marketplace/requests")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "learn" / "page.tsx", ["/learn/now"], "learn/page.tsx links to /learn/now")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "my-teachers" / "page.tsx", ["/learn/now"], "my-teachers/page.tsx links to /learn/now")

print(f"\nTotal: {passed_checks} passed, {failed_checks} failed.")
if failed_checks > 0:
    sys.exit(1)
else:
    print("ALL DAY 37 CONTRACT CHECKS PASSED!")
    sys.exit(0)