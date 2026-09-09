"""
Contract check for Day 39: Teacher Public Profile, Review System, and Social Proof (MKT-005 / MKT-001 / MKT-006).
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
    hex_pattern = re.compile(r"#[0-9a-fA-F]{3,8}")
    hex_matches = hex_pattern.findall(text)
    check(len(hex_matches) == 0, f"{label}: 0 raw hex colors (found {len(hex_matches)})")
    physical_props = [
        "margin-left", "margin-right", "margin-top", "margin-bottom",
        "padding-left", "padding-right", "padding-top", "padding-bottom",
    ]
    found_physical = []
    for prop in physical_props:
        if re.search(rf"{prop}\s*:", text):
            found_physical.append(prop)
    check(len(found_physical) == 0, f"{label}: 100% logical properties (no physical: {found_physical})")

print("=== Day 39 Contract Verification ===")
print("\n[1] Backend Models and Teacher Profile Extensions:")
profiles_models = REPO_ROOT / "apps" / "api" / "profiles" / "models.py"
check_file_contains(profiles_models, [
    "headline = models.CharField",
    "hourly_rate_toman = models.DecimalField",
    "video_intro_url = models.URLField",
    "education = models.JSONField",
    "certifications = models.JSONField",
    "response_time_minutes = models.PositiveSmallIntegerField",
], "profiles/models.py")

marketplace_models = REPO_ROOT / "apps" / "api" / "marketplace" / "models.py"
check_file_contains(marketplace_models, [
    "class ReviewStatus(models.TextChoices):",
    "class TeacherReview(models.Model):",
    "booking = models.OneToOneField",
    "overall_rating = models.PositiveSmallIntegerField",
    "rating_teaching = models.PositiveSmallIntegerField",
    "rating_punctuality = models.PositiveSmallIntegerField",
    "rating_communication = models.PositiveSmallIntegerField",
    "comment = models.TextField",
    "teacher_reply = models.TextField",
], "marketplace/models.py")

print("\n[2] Backend Services and Social Proof Aggregation:")
services_file = REPO_ROOT / "apps" / "api" / "marketplace" / "services.py"
check_file_contains(services_file, [
    "def calculate_teacher_social_proof(teacher_id)",
    "def list_public_teachers(",
    "def get_teacher_public_profile(",
    "def submit_session_review(",
    "def reply_to_teacher_review(",
    "def flag_teacher_review(",
    "phone_pattern = re.compile",
], "marketplace/services.py")

print("\n[3] Backend Serializers, Views and Endpoints:")
serializers_file = REPO_ROOT / "apps" / "api" / "marketplace" / "serializers.py"
check_file_contains(serializers_file, [
    "class TeacherReviewSerializer(",
    "class SubmitReviewSerializer(",
    "class TeacherReviewReplySerializer(",
    "class FlagReviewSerializer(",
], "marketplace/serializers.py")

views_file = REPO_ROOT / "apps" / "api" / "marketplace" / "views.py"
check_file_contains(views_file, [
    "def public_teachers_directory_view(",
    "def teacher_public_profile_view(",
    "def teacher_reviews_list_view(",
    "def booking_review_view(",
    "def reply_to_review_view(",
    "def flag_review_view(",
], "marketplace/views.py")

urls_file = REPO_ROOT / "apps" / "api" / "marketplace" / "urls.py"
check_file_contains(urls_file, [
    "teachers/",
    "<uuid:teacher_id>/",
    "<uuid:teacher_id>/reviews/",
    "bookings/<uuid:booking_id>/review/",
    "reviews/<uuid:review_id>/reply/",
    "reviews/<uuid:review_id>/flag/",
], "marketplace/urls.py")

print("\n[4] Backend Admin Registration:")
admin_file = REPO_ROOT / "apps" / "api" / "marketplace" / "admin.py"
check_file_contains(admin_file, [
    "@admin.register(TeacherReview)",
    "class TeacherReviewAdmin(",
], "marketplace/admin.py")

print("\n[5] Frontend Library and TypeScript Interfaces:")
ts_file = REPO_ROOT / "apps" / "web" / "lib" / "marketplace.ts"
check_file_contains(ts_file, [
    "interface TeacherSocialProof",
    "interface TeacherDirectoryItem",
    "interface TeacherPublicProfile",
    "interface TeacherReview",
    "interface SubmitReviewPayload",
    "async function fetchPublicTeachers(",
    "async function fetchTeacherPublicProfile(",
    "async function fetchTeacherReviews(",
    "async function fetchBookingReview(",
    "async function submitBookingReview(",
    "async function replyToTeacherReview(",
    "async function flagTeacherReview(",
], "marketplace.ts")

print("\n[6] Frontend Teachers Directory UI and CSS Standards:")
dir_page = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "page.tsx"
dir_css = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "teachers.module.css"
check(dir_page.exists(), "teachers/page.tsx exists")
check(dir_css.exists(), "teachers/teachers.module.css exists")
check_no_raw_hex_and_logical_properties(dir_css, "teachers.module.css")

print("\n[7] Frontend Teacher Public Profile UI and CSS Standards:")
prof_page = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "[id]" / "page.tsx"
prof_css = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "[id]" / "teacher-profile.module.css"
check(prof_page.exists(), "teachers/[id]/page.tsx exists")
check(prof_css.exists(), "teachers/[id]/teacher-profile.module.css exists")
check_no_raw_hex_and_logical_properties(prof_css, "teacher-profile.module.css")

print("\n[8] Frontend Booking Review Integration and CSS Standards:")
booking_page = REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "page.tsx"
booking_css = REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "booking-detail.module.css"
check(booking_page.exists(), "bookings/[id]/page.tsx exists")
check_file_contains(booking_page, [
    "fetchBookingReview",
    "submitBookingReview",
    "replyToTeacherReview",
    "reviewRating",
    "reviewSection",
], "bookings/[id]/page.tsx")
check_no_raw_hex_and_logical_properties(booking_css, "booking-detail.module.css")

print(f"\n==================================================")
print(f"Day 39 Contract Check Results: {passed_checks} passed, {failed_checks} failed")
print(f"==================================================")

if failed_checks > 0:
    sys.exit(1)
