"""
Contract check for Day 40: Teacher Availability Calendar, Recurring Slots, and Time-Off Management (MKT-002).
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

print("=== Day 40 Contract Verification ===")
print("\n[1] Backend Models and Availability Architecture:")
marketplace_models = REPO_ROOT / "apps" / "api" / "marketplace" / "models.py"
check_file_contains(marketplace_models, [
    "class DayOfWeek(models.IntegerChoices):",
    "SATURDAY = 0",
    "FRIDAY = 6",
    "class TeacherAvailabilitySlot(models.Model):",
    "day_of_week = models.PositiveSmallIntegerField",
    "start_time = models.TimeField",
    "end_time = models.TimeField",
    "is_active = models.BooleanField",
    "class TeacherTimeOff(models.Model):",
    "start_datetime = models.DateTimeField",
    "end_datetime = models.DateTimeField",
    "is_full_day = models.BooleanField",
    "valid_time_off_window",
    "class TeacherAvailabilitySetting(models.Model):",
    "notice_lead_time_hours = models.PositiveSmallIntegerField",
    "max_booking_ahead_days = models.PositiveSmallIntegerField",
    "default_session_duration_minutes = models.PositiveSmallIntegerField",
    "default_buffer_minutes = models.PositiveSmallIntegerField",
    "auto_accept_bookings = models.BooleanField",
], "marketplace/models.py")

print("\n[2] Backend Scheduling & Availability Services:")
services_file = REPO_ROOT / "apps" / "api" / "marketplace" / "services.py"
check_file_contains(services_file, [
    "def get_teacher_weekly_schedule(teacher_id)",
    "def save_teacher_weekly_schedule(teacher",
    "def list_teacher_time_off(teacher_id",
    "def add_teacher_time_off(",
    "def delete_teacher_time_off(",
    "def get_or_create_availability_settings(",
    "def update_availability_settings(",
    "def generate_teacher_available_slots(",
    "TEHRAN_TZ",
    "slots_by_dow",
    "earliest_bookable_utc",
], "marketplace/services.py")

print("\n[3] Backend Serializers, Views and Endpoints:")
serializers_file = REPO_ROOT / "apps" / "api" / "marketplace" / "serializers.py"
check_file_contains(serializers_file, [
    "class TeacherAvailabilitySlotSerializer(",
    "class WeeklyScheduleInputSerializer(",
    "class TeacherTimeOffSerializer(",
    "class CreateTimeOffSerializer(",
    "class TeacherAvailabilitySettingSerializer(",
    "class BookableSlotSerializer(",
], "marketplace/serializers.py")

views_file = REPO_ROOT / "apps" / "api" / "marketplace" / "views.py"
check_file_contains(views_file, [
    "def teacher_availability_view(",
    "def teacher_time_off_list_create_view(",
    "def teacher_time_off_delete_view(",
    "def teacher_availability_settings_view(",
    "def public_teacher_available_slots_view(",
], "marketplace/views.py")

urls_file = REPO_ROOT / "apps" / "api" / "marketplace" / "urls.py"
check_file_contains(urls_file, [
    "teacher/availability/",
    "teacher/availability/time-off/",
    "teacher/availability/time-off/<uuid:time_off_id>/",
    "teacher/availability/settings/",
    "teachers/<uuid:teacher_id>/available-slots/",
], "marketplace/urls.py")

print("\n[4] Frontend Client API:")
client_lib = REPO_ROOT / "apps" / "web" / "lib" / "marketplace.ts"
check_file_contains(client_lib, [
    "export interface TeacherAvailabilitySlot",
    "export interface TeacherTimeOff",
    "export interface TeacherAvailabilitySetting",
    "export interface BookableSlot",
    "export interface DayAvailableSlots",
    "fetchTeacherAvailability()",
    "saveTeacherWeeklySchedule(",
    "fetchTeacherTimeOff()",
    "addTeacherTimeOff(",
    "deleteTeacherTimeOff(",
    "fetchTeacherAvailabilitySettings()",
    "updateTeacherAvailabilitySettings(",
    "fetchTeacherAvailableSlots(",
], "apps/web/lib/marketplace.ts")

print("\n[5] Teacher Availability Hub Page & Layout:")
avail_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "availability" / "page.tsx"
check_file_contains(avail_page, [
    "export default function TeacherAvailabilityPage",
    "PERSIAN_DAYS",
    "handleSaveSchedule",
    "handleAddTimeOff",
    "handleDeleteTimeOff",
    "handleSaveSettings",
    "applyPreset",
], "teacher/availability/page.tsx")

hours_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "hours" / "page.tsx"
check_file_contains(hours_page, [
    'redirect("/teacher/availability")',
], "teacher/hours/page.tsx")

print("\n[6] Public Profile Slot Booking Calendar Integration:")
profile_page = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "[id]" / "page.tsx"
check_file_contains(profile_page, [
    "fetchTeacherAvailableSlots",
    "availableDays",
    "selectedDate",
    "selectedSlot",
    "slotSection",
    "datePickerScroll",
    "slotsGrid",
], "teachers/[id]/page.tsx")

print("\n[7] CSS Quality & Logical Properties Audit:")
avail_css = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "availability" / "availability.module.css"
check_no_raw_hex_and_logical_properties(avail_css, "availability.module.css")

profile_css = REPO_ROOT / "apps" / "web" / "app" / "teachers" / "[id]" / "teacher-profile.module.css"
check_no_raw_hex_and_logical_properties(profile_css, "teacher-profile.module.css")

print("\n=== Summary ===")
print(f"Passed: {passed_checks}")
print(f"Failed: {failed_checks}")

if failed_checks > 0:
    print("\n[RESULT] Verification FAILED.")
    sys.exit(1)
else:
    print("\n[RESULT] All Day 40 contracts VERIFIED SUCCESSFULLY!")
    sys.exit(0)
