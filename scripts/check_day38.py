"""
Contract check for Day 38: Session Booking, Scheduling State Machine, and Timezone Management (MKT-004).
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

print("=== Day 38 Contract Verification ===")
print("\n[1] Backend Routing & Endpoints:")
urls_file = REPO_ROOT / "apps" / "api" / "marketplace" / "urls.py"
check_file_contains(urls_file, [
    "bookings/",
    "create_direct",
    "reschedule",
    "respond_reschedule",
    "cancel",
    "start",
    "complete",
], "marketplace/urls.py")

print("\n[2] Backend Booking Models & State Machine Definition:")
models_file = REPO_ROOT / "apps" / "api" / "marketplace" / "models.py"
check_file_contains(models_file, [
    "class BookingStatus",
    "class SessionBooking",
    "CONFIRMED = \"confirmed\"",
    "RESCHEDULE_REQUESTED = \"reschedule_requested\"",
    "IN_PROGRESS = \"in_progress\"",
    "COMPLETED = \"completed\"",
    "CANCELLED_BY_LEARNER = \"cancelled_by_learner\"",
    "CANCELLED_BY_TEACHER = \"cancelled_by_teacher\"",
    "NO_SHOW = \"no_show\"",
    "DISPUTED = \"disputed\"",
    "scheduled_start",
    "scheduled_end",
    "duration_minutes",
    "rate_toman",
    "online_format",
    "target_skill",
    "target_subskill",
    "reschedule_proposed_start",
    "reschedule_proposed_by",
    "reschedule_note",
    "cancellation_reason",
    "cancelled_by",
    "meeting_room_url",
    "idempotency_key",
    "unique_booking_idempotency",
], "marketplace/models.py")

print("\n[3] Backend Services, Conflict Detection & Idempotency:")
services_file = REPO_ROOT / "apps" / "api" / "marketplace" / "services.py"
check_file_contains(services_file, [
    "def check_schedule_conflict",
    "def create_session_booking",
    "def list_user_bookings",
    "def request_booking_reschedule",
    "def respond_booking_reschedule",
    "def cancel_session_booking",
    "def start_session_booking",
    "def complete_session_booking",
    "accept_teacher_offer",
    "create_session_booking",
    "transaction.atomic()",
], "marketplace/services.py")

print("\n[4] Serializers & Permissions:")
serializers_file = REPO_ROOT / "apps" / "api" / "marketplace" / "serializers.py"
check_file_contains(serializers_file, [
    "class SessionBookingSerializer",
    "class DirectCreateBookingSerializer",
    "class RescheduleBookingSerializer",
    "class RespondRescheduleSerializer",
    "class CancelBookingSerializer",
    "class CompleteBookingSerializer",
    "meeting_room_url",
    "can_reschedule",
    "can_cancel",
    "can_start",
    "can_complete",
    "can_respond_reschedule",
], "marketplace/serializers.py")

print("\n[5] Django Admin & Migrations:")
check((REPO_ROOT / "apps" / "api" / "marketplace" / "migrations" / "0002_sessionbooking.py").exists(), "Migration 0002_sessionbooking.py exists")
check_file_contains(REPO_ROOT / "apps" / "api" / "marketplace" / "admin.py", ["SessionBookingAdmin"], "marketplace/admin.py")

print("\n[6] Backend Unit Tests:")
tests_file = REPO_ROOT / "apps" / "api" / "marketplace" / "tests.py"
check_file_contains(tests_file, [
    "test_teacher_offer_flow_and_acceptance_creates_booking",
    "test_booking_conflict_prevention",
    "test_booking_reschedule_negotiation_flow",
    "test_booking_cancellation_with_reason",
    "test_booking_session_lifecycle_start_and_complete",
], "marketplace/tests.py")

print("\n[7] Frontend API Client & Timezone Handling:")
lib_file = REPO_ROOT / "apps" / "web" / "lib" / "marketplace.ts"
check_file_contains(lib_file, [
    "export type BookingStatus",
    "export interface SessionBooking",
    "export interface DirectBookingPayload",
    "export async function fetchUserBookings",
    "export async function fetchBookingDetail",
    "export async function createDirectBooking",
    "export async function requestBookingReschedule",
    "export async function respondBookingReschedule",
    "export async function cancelBooking",
    "export async function startSession",
    "export async function completeSession",
    "export const TEHRAN_TIMEZONE = \"Asia/Tehran\"",
    "export function formatTehranDateTime",
    "export function formatTehranDateOnly",
    "export function formatTehranTimeOnly",
    "export function formatUserLocalTime",
    "export function isSameTimezoneAsTehran",
], "web/lib/marketplace.ts")

print("\n[8] Frontend Pages & Routes:")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "bookings" / "page.tsx", [
    "BookingsWorkspacePage",
    "fetchUserBookings",
    "requestBookingReschedule",
    "respondBookingReschedule",
    "cancelBooking",
    "startSession",
    "formatTehranDateTime",
    "getStatusBadge",
], "app/bookings/page.tsx")

check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "page.tsx", [
    "BookingDetailPage",
    "fetchBookingDetail",
    "startSession",
    "completeSession",
    "cancelBooking",
    "formatTehranDateTime",
    "meeting_room_url",
    "timelineCard",
], "app/bookings/[id]/page.tsx")

print("\n[9] CSS Compliance (0 raw hex, 100% logical properties):")
check_no_raw_hex_and_logical_properties(REPO_ROOT / "apps" / "web" / "app" / "bookings" / "bookings.module.css", "bookings.module.css")
check_no_raw_hex_and_logical_properties(REPO_ROOT / "apps" / "web" / "app" / "bookings" / "[id]" / "booking-detail.module.css", "booking-detail.module.css")

print("\n[10] Navigation Integration:")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "requests" / "page.tsx", ["href=\"/bookings\""], "requests/page.tsx links to /bookings")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "marketplace" / "offers" / "page.tsx", ["href=\"/bookings\""], "offers/page.tsx links to /bookings")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "learn" / "now" / "page.tsx", ["href=\"/bookings\""], "learn/now/page.tsx links to /bookings")
check_file_contains(REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "my-teachers" / "page.tsx", ["href=\"/bookings\""], "my-teachers/page.tsx links to /bookings")

print(f"\nTotal: {passed_checks} passed, {failed_checks} failed.")
if failed_checks > 0:
    sys.exit(1)
else:
    print("ALL DAY 38 CONTRACT CHECKS PASSED!")
    sys.exit(0)
