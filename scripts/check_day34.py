"""
Contract check for Day 34: Teacher Assignments, Question Selection, Due Dates, Attempts, and Accommodations.
Validates:
1. Backend models (Assignment, AssignmentQuestion, AssignmentAccommodation, AssignmentAttempt, AssignmentStatus, AttemptStatus).
2. Backend service methods & governance:
   - create_assignment_draft, update_assignment_draft, set_assignment_questions
   - configure_delivery, set_learner_accommodation, publish_assignment
   - browse_question_bank, get_learner_assignments, start_learner_attempt
   - get_attempt_learner_payload (stripping protected answer keys)
   - autosave_attempt (resilience against loss)
   - submit_attempt (auto-scoring integration with grade_response)
3. Django Admin registration for all Day 34 models.
4. Database migration 0002_assignments.py.
5. URL patterns in apps/api/teachers/urls.py.
6. Documentation in docs/teachers/assignments-and-accommodations.md.
7. Frontend implementation:
   - apps/web/lib/teacher-assignments.ts
   - apps/web/app/(teacher)/teacher/assignments/page.tsx
   - apps/web/app/(teacher)/teacher/assignments/new/page.tsx (Wireframe 4 wizard)
   - apps/web/app/(teacher)/teacher/assignments/[id]/page.tsx
   - apps/web/app/(teacher)/teacher/assignments/assignments.module.css (0 raw hex, 100% logical properties)
   - apps/web/app/(learner)/assignments/page.tsx
   - apps/web/app/(learner)/assignments/[id]/page.tsx
   - apps/web/app/(learner)/assignments/learner-assignments.module.css (0 raw hex, 100% logical properties)
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


def check_no_raw_hex(css_content: str, filename: str) -> None:
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(len(hex_matches) == 0, f"{filename} has zero raw hex colors (found {len(hex_matches)})")


def check_logical_properties(css_content: str, filename: str) -> None:
    forbidden = ["padding-left", "padding-right", "margin-left", "margin-right", "left:", "right:"]
    found = [p for p in forbidden if p in css_content]
    check(len(found) == 0, f"{filename} uses 100% logical properties (found forbidden: {found})")


def main():
    print("Running Day 34 Contract Verification...")

    # 1. Models
    models_py = REPO_ROOT / "apps" / "api" / "teachers" / "models.py"
    check(models_py.is_file(), "apps/api/teachers/models.py exists")
    models = models_py.read_text(encoding="utf-8")

    check("class AssignmentStatus(" in models, "AssignmentStatus choices defined")
    check("class AttemptStatus(" in models, "AttemptStatus choices defined")
    check("class Assignment(" in models, "Assignment model defined")
    check("grace_period_minutes" in models, "grace_period_minutes field on Assignment")
    check("allow_late_submission" in models, "allow_late_submission field on Assignment")
    check("time_limit_minutes" in models, "time_limit_minutes field on Assignment")
    check("max_attempts" in models, "max_attempts field on Assignment")
    check("total_points" in models, "total_points field on Assignment")
    check("version" in models, "version field for optimistic concurrency on Assignment")

    check("class AssignmentQuestion(" in models, "AssignmentQuestion model defined")
    check("question_version" in models, "question_version FK on AssignmentQuestion")
    check("points" in models, "points field on AssignmentQuestion")
    check("order" in models, "order field on AssignmentQuestion")

    check("class AssignmentAccommodation(" in models, "AssignmentAccommodation model defined")
    check("extra_time_minutes" in models, "extra_time_minutes field on AssignmentAccommodation")
    check("extra_attempts" in models, "extra_attempts field on AssignmentAccommodation")
    check("extended_due_date" in models, "extended_due_date field on AssignmentAccommodation")

    check("class AssignmentAttempt(" in models, "AssignmentAttempt model defined")
    check("answers_payload" in models, "answers_payload field on AssignmentAttempt")
    check("grading_results" in models, "grading_results field on AssignmentAttempt")
    check("score_awarded" in models, "score_awarded field on AssignmentAttempt")
    check("time_limit_expires_at" in models, "time_limit_expires_at field on AssignmentAttempt")

    # 2. Service Layer
    services_py = REPO_ROOT / "apps" / "api" / "teachers" / "assignment_services.py"
    check(services_py.is_file(), "apps/api/teachers/assignment_services.py exists")
    services = services_py.read_text(encoding="utf-8")

    check("class AssignmentService" in services, "AssignmentService defined")
    check("def create_assignment_draft(" in services, "create_assignment_draft defined")
    check("def update_assignment_draft(" in services, "update_assignment_draft defined")
    check("def set_assignment_questions(" in services, "set_assignment_questions defined")
    check("def configure_delivery(" in services, "configure_delivery defined")
    check("def set_learner_accommodation(" in services, "set_learner_accommodation defined")
    check("def publish_assignment(" in services, "publish_assignment defined")
    check("def browse_question_bank(" in services, "browse_question_bank defined")
    check("def get_learner_assignments(" in services, "get_learner_assignments defined")
    check("def start_learner_attempt(" in services, "start_learner_attempt defined")
    check("def get_attempt_learner_payload(" in services, "get_attempt_learner_payload defined")
    check("def autosave_attempt(" in services, "autosave_attempt defined")
    check("def submit_attempt(" in services, "submit_attempt defined")
    check("grade_response(" in services, "Auto-grading engine called via grade_response")

    # 3. Admin Registration
    admin_py = REPO_ROOT / "apps" / "api" / "teachers" / "admin.py"
    check(admin_py.is_file(), "apps/api/teachers/admin.py exists")
    admin_code = admin_py.read_text(encoding="utf-8")
    check("AssignmentAdmin" in admin_code, "Assignment registered in admin")
    check("AssignmentQuestionAdmin" in admin_code, "AssignmentQuestion registered in admin")
    check("AssignmentAccommodationAdmin" in admin_code, "AssignmentAccommodation registered in admin")
    check("AssignmentAttemptAdmin" in admin_code, "AssignmentAttempt registered in admin")

    # 4. Migrations
    migrations_dir = REPO_ROOT / "apps" / "api" / "teachers" / "migrations"
    check(migrations_dir.is_dir(), "apps/api/teachers/migrations directory exists")
    mig2 = migrations_dir / "0002_assignments.py"
    check(mig2.is_file(), "0002_assignments.py migration exists")

    # 5. URLs
    urls_py = REPO_ROOT / "apps" / "api" / "teachers" / "urls.py"
    check(urls_py.is_file(), "apps/api/teachers/urls.py exists")
    urls = urls_py.read_text(encoding="utf-8")
    check('path("assignments/",' in urls, "assignments/ route registered")
    check('path("assignments/<uuid:assignment_id>/questions/",' in urls, "questions/ route registered")
    check('path("assignments/<uuid:assignment_id>/delivery/",' in urls, "delivery/ route registered")
    check('path("assignments/<uuid:assignment_id>/accommodations/",' in urls, "accommodations/ route registered")
    check('path("assignments/<uuid:assignment_id>/publish/",' in urls, "publish/ route registered")
    check('path("assignments/<uuid:assignment_id>/submissions/",' in urls, "submissions/ route registered")
    check('path("my-assignments/",' in urls, "my-assignments/ route registered")
    check('path("assignments/<uuid:assignment_id>/start/",' in urls, "start/ route registered")
    check('path("attempts/<uuid:attempt_id>/autosave/",' in urls, "autosave/ route registered")
    check('path("attempts/<uuid:attempt_id>/submit/",' in urls, "submit/ route registered")

    # 6. Documentation
    doc_path = REPO_ROOT / "docs" / "teachers" / "assignments-and-accommodations.md"
    check(doc_path.is_file(), "docs/teachers/assignments-and-accommodations.md exists")
    doc_text = doc_path.read_text(encoding="utf-8")
    check("Wireframe 4" in doc_text, "Wireframe 4 referenced in documentation")
    check("Accommodations" in doc_text, "Accommodations documented")
    check("R-029" in doc_text, "Autosave resilience R-029 documented")

    # 7. Frontend
    client_ts = REPO_ROOT / "apps" / "web" / "lib" / "teacher-assignments.ts"
    check(client_ts.is_file(), "apps/web/lib/teacher-assignments.ts exists")

    teacher_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "assignments" / "page.tsx"
    check(teacher_page.is_file(), "Teacher assignments page exists")

    new_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "assignments" / "new" / "page.tsx"
    check(new_page.is_file(), "Teacher assignment wizard page exists")
    new_page_text = new_page.read_text(encoding="utf-8")
    check("Save and Continue Later" in new_page_text or "ذخیره پیش‌نویس و خروج" in new_page_text, "Wizard has Save and Continue Later")

    detail_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "assignments" / "[id]" / "page.tsx"
    check(detail_page.is_file(), "Teacher assignment detail page exists")

    teacher_css = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "assignments" / "assignments.module.css"
    check(teacher_css.is_file(), "assignments.module.css exists")
    css_content = teacher_css.read_text(encoding="utf-8")
    check_no_raw_hex(css_content, "assignments.module.css")
    check_logical_properties(css_content, "assignments.module.css")

    learner_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "assignments" / "page.tsx"
    check(learner_page.is_file(), "Learner assignments page exists")

    learner_attempt_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "assignments" / "[id]" / "page.tsx"
    check(learner_attempt_page.is_file(), "Learner attempt page exists")

    learner_css = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "assignments" / "learner-assignments.module.css"
    check(learner_css.is_file(), "learner-assignments.module.css exists")
    l_css_content = learner_css.read_text(encoding="utf-8")
    check_no_raw_hex(l_css_content, "learner-assignments.module.css")
    check_logical_properties(l_css_content, "learner-assignments.module.css")

    print("\nAll Day 34 contracts verified successfully!")


if __name__ == "__main__":
    main()
