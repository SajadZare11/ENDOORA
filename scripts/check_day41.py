# -*- coding: utf-8 -*-
"""
Contract check for Day 41: Marketplace Admin Moderation, Teacher Onboarding Approval, and Dispute Resolution (MKT-007 / MKT-006).
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
            check(True, f"{label} contains '{pattern[:50]}...'")
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

print("=== Day 41 Contract Verification ===")

print("\n[1] Backend Models and Database Schema:")
marketplace_models = REPO_ROOT / "apps" / "api" / "marketplace" / "models.py"
check_file_contains(marketplace_models, [
    "class DisputeReasonCategory(models.TextChoices):",
    "TEACHER_ABSENT = \"teacher_absent\"",
    "LEARNER_ABSENT = \"learner_absent\"",
    "TECHNICAL_DIFFICULTIES = \"technical_difficulties\"",
    "POOR_QUALITY = \"poor_quality\"",
    "class DisputeStatus(models.TextChoices):",
    "OPEN = \"open\"",
    "UNDER_REVIEW = \"under_review\"",
    "RESOLVED_FULL_REFUND = \"resolved_full_refund\"",
    "RESOLVED_PARTIAL_REFUND = \"resolved_partial_refund\"",
    "RESOLVED_PAY_TEACHER = \"resolved_pay_teacher\"",
    "DISMISSED = \"dismissed\"",
    "class BookingDispute(models.Model):",
    "booking = models.OneToOneField(",
    "reason_category = models.CharField(",
    "refund_percentage = models.PositiveSmallIntegerField(",
    "resolution_notes = models.TextField(",
    "class TeacherOnboardingStatus(models.TextChoices):",
    "PENDING = \"pending\"",
    "IN_REVIEW = \"in_review\"",
    "APPROVED = \"approved\"",
    "REJECTED = \"rejected\"",
    "REVISION_REQUESTED = \"revision_requested\"",
    "class TeacherOnboardingApplication(models.Model):",
    "national_id_number = models.CharField(",
    "id_document_url = models.URLField(",
    "degree_document_url = models.URLField(",
    "celta_tesol_document_url = models.URLField(",
    "sample_teaching_url = models.URLField(",
    "class PlatformPricingPlan(models.Model):",
    "price_toman = models.DecimalField(",
    "is_featured = models.BooleanField(",
], "marketplace/models.py")

print("\n[2] Backend Services and State Transitions:")
services_file = REPO_ROOT / "apps" / "api" / "marketplace" / "services.py"
check_file_contains(services_file, [
    "def open_booking_dispute(",
    "def list_marketplace_disputes(",
    "def get_booking_dispute_detail(",
    "def resolve_booking_dispute(",
    "def get_or_create_teacher_onboarding_application(",
    "def submit_teacher_onboarding_application(",
    "def list_teacher_onboarding_applications(",
    "def review_teacher_onboarding_application(",
    "def toggle_teacher_marketplace_eligibility(",
    "def list_reviews_for_moderation(",
    "def moderate_review(",
    "def get_active_pricing_plans(",
    "def update_pricing_plan(",
    "BookingStatus.DISPUTED",
    "is_teacher_verified = True",
    "marketplace_eligible = True",
], "marketplace/services.py")

print("\n[3] Backend Serializers, Views and URL Routing:")
serializers_file = REPO_ROOT / "apps" / "api" / "marketplace" / "serializers.py"
check_file_contains(serializers_file, [
    "class BookingDisputeSerializer(",
    "class OpenDisputeInputSerializer(",
    "class ResolveDisputeInputSerializer(",
    "class TeacherOnboardingApplicationSerializer(",
    "class SubmitOnboardingInputSerializer(",
    "class ReviewOnboardingInputSerializer(",
    "class PlatformPricingPlanSerializer(",
], "marketplace/serializers.py")

views_file = REPO_ROOT / "apps" / "api" / "marketplace" / "views.py"
check_file_contains(views_file, [
    "def booking_dispute_view(",
    "def admin_disputes_list_view(",
    "def admin_dispute_detail_view(",
    "def admin_dispute_resolve_view(",
    "def teacher_onboarding_application_view(",
    "def admin_teacher_applications_list_view(",
    "def admin_teacher_application_review_view(",
    "def admin_teacher_eligibility_toggle_view(",
    "def admin_reviews_moderation_list_view(",
    "def admin_review_moderate_view(",
    "def public_pricing_plans_view(",
    "def admin_pricing_plans_view(",
], "marketplace/views.py")

urls_file = REPO_ROOT / "apps" / "api" / "marketplace" / "urls.py"
check_file_contains(urls_file, [
    "bookings/<uuid:booking_id>/dispute/",
    "admin/disputes/",
    "admin/disputes/<uuid:dispute_id>/resolve/",
    "teacher/onboarding/",
    "admin/teachers/",
    "admin/teachers/<uuid:application_id>/review/",
    "admin/teachers/<uuid:teacher_id>/eligibility/",
    "admin/reviews/",
    "admin/reviews/<uuid:review_id>/moderate/",
    "plans/",
    "admin/plans/",
], "marketplace/urls.py")

print("\n[4] Django Admin Registrations:")
admin_file = REPO_ROOT / "apps" / "api" / "marketplace" / "admin.py"
check_file_contains(admin_file, [
    "class BookingDisputeAdmin(",
    "class TeacherOnboardingApplicationAdmin(",
    "class PlatformPricingPlanAdmin(",
], "marketplace/admin.py")

print("\n[5] Frontend Client Library (marketplace.ts & public-site.ts):")
client_lib = REPO_ROOT / "apps" / "web" / "lib" / "marketplace.ts"
check_file_contains(client_lib, [
    "export interface BookingDispute",
    "export interface TeacherOnboardingApplication",
    "export interface PlatformPricingPlan",
    "export async function fetchBookingDispute(",
    "export async function openBookingDispute(",
    "export async function fetchAdminDisputes(",
    "export async function resolveAdminDispute(",
    "export async function fetchTeacherOnboardingApplication(",
    "export async function submitTeacherOnboardingApplication(",
    "export async function fetchAdminTeacherApplications(",
    "export async function reviewAdminTeacherApplication(",
    "export async function toggleAdminTeacherEligibility(",
    "export async function fetchAdminModerationReviews(",
    "export async function moderateAdminReview(",
    "export async function fetchPublicPricingPlans(",
    "export async function fetchAdminPricingPlans(",
    "export async function updateAdminPricingPlan(",
], "apps/web/lib/marketplace.ts")

public_site = REPO_ROOT / "apps" / "web" / "lib" / "public-site.ts"
check_file_contains(public_site, [
    "export const LAUNCH_PLAN",
    "export async function getLaunchPricingPlan(",
], "apps/web/lib/public-site.ts")

print("\n[6] Frontend Admin Marketplace Operations Hub:")
admin_page = REPO_ROOT / "apps" / "web" / "app" / "(admin)" / "marketplace" / "page.tsx"
check_file_contains(admin_page, [
    "export default function MarketplaceAdminPage",
    "activeTab",
    "handleResolveDispute",
    "handleReviewApplication",
    "handleToggleEligibility",
    "handleModerateReview",
    "handleSavePricingPlan",
    "disputes",
    "onboarding",
    "reviews",
    "pricing",
], "admin/marketplace/page.tsx")

print("\n[7] Frontend Teacher Verification Portal:")
verification_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "verification" / "page.tsx"
check_file_contains(verification_page, [
    "export default function TeacherVerificationPage",
    "fetchTeacherOnboardingApplication",
    "submitTeacherOnboardingApplication",
    "nationalId",
    "idDocUrl",
    "degreeDocUrl",
    "celtaDocUrl",
    "sampleTeachingUrl",
    "handleSubmit",
], "teacher/verification/page.tsx")

print("\n[8] Frontend Booking Detail Dispute Integration:")
booking_detail_page = REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "page.tsx"
check_file_contains(booking_detail_page, [
    "fetchBookingDispute",
    "openBookingDispute",
    "showDisputeModal",
    "handleOpenDispute",
    "disputeCard",
    "disputeReason",
], "bookings/[id]/page.tsx")

print("\n[9] CSS Design Tokens & Logical Properties Compliance:")
admin_css = REPO_ROOT / "apps" / "web" / "app" / "(admin)" / "marketplace" / "marketplace-admin.module.css"
check_no_raw_hex_and_logical_properties(admin_css, "marketplace-admin.module.css")

verification_css = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "verification" / "verification.module.css"
check_no_raw_hex_and_logical_properties(verification_css, "verification.module.css")

booking_detail_css = REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "booking-detail.module.css"
check_no_raw_hex_and_logical_properties(booking_detail_css, "booking-detail.module.css")

print("\n=== Summary ===")
print(f"Passed: {passed_checks}")
print(f"Failed: {failed_checks}")

if failed_checks > 0:
    print("\n[RESULT] Verification FAILED.")
    sys.exit(1)
else:
    print("\n[RESULT] All Day 41 contracts VERIFIED 100% SUCCESSFULLY!")
    sys.exit(0)
