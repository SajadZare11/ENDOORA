"""
Contract check for Day 35: Learner submission, teacher grading, feedback loop, and gradebook.
Validates:
1. Backend models & choices:
   - AttemptStatus.REVISION_REQUESTED
   - FeedbackStatus choices
   - AssignmentAttempt Day 35 fields (rubric_scores, question_grades, feedback_status, learner_reflection, learner_acknowledged_at, revision_notes)
   - SubmissionFeedbackMessage model
2. Backend service methods:
   - get_submission_grading_detail
   - grade_attempt_submission
   - acknowledge_feedback_and_reflect
   - add_feedback_message
   - get_feedback_messages (with teacher internal note privacy check)
   - get_teacher_submissions_queue
   - get_class_gradebook (matrix + student aggregates + assignment stats)
   - export_class_gradebook_csv (with UTF-8 BOM)
   - get_learner_gradebook
3. Django Admin:
   - SubmissionFeedbackMessageAdmin registered
   - AssignmentAttemptAdmin includes feedback_status
4. Database migration:
   - 0003_gradebook_and_feedback.py exists
5. URL patterns:
   - submissions/queue/
   - attempts/<uuid:attempt_id>/grading-detail/
   - attempts/<uuid:attempt_id>/grade/
   - classes/<uuid:class_id>/gradebook/
   - classes/<uuid:class_id>/gradebook/export/
   - attempts/<uuid:attempt_id>/acknowledge-feedback/
   - attempts/<uuid:attempt_id>/feedback-messages/
   - my-grades/
6. Frontend Client & Pages:
   - apps/web/lib/teacher-gradebook.ts
   - apps/web/app/(teacher)/teacher/grading/page.tsx
   - apps/web/app/(teacher)/teacher/grading/[attemptId]/page.tsx
   - apps/web/app/(teacher)/teacher/gradebook/page.tsx
   - apps/web/app/(learner)/grades/page.tsx
7. CSS Compliance (0 raw hex, 100% logical properties):
   - grading.module.css
   - gradebook.module.css
   - grades.module.css
8. Documentation:
   - docs/teachers/grading-and-gradebook.md
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
    print("Running Day 35 Contract Verification...")

    # 1. Models
    models_py = REPO_ROOT / "apps" / "api" / "teachers" / "models.py"
    check(models_py.is_file(), "apps/api/teachers/models.py exists")
    models = models_py.read_text(encoding="utf-8")

    check("REVISION_REQUESTED = \"revision_requested\"" in models, "REVISION_REQUESTED choice in AttemptStatus")
    check("class FeedbackStatus(" in models, "FeedbackStatus choices defined")
    check("rubric_scores" in models, "rubric_scores on AssignmentAttempt")
    check("question_grades" in models, "question_grades on AssignmentAttempt")
    check("feedback_status" in models, "feedback_status on AssignmentAttempt")
    check("learner_reflection" in models, "learner_reflection on AssignmentAttempt")
    check("learner_acknowledged_at" in models, "learner_acknowledged_at on AssignmentAttempt")
    check("revision_notes" in models, "revision_notes on AssignmentAttempt")
    check("class SubmissionFeedbackMessage(" in models, "SubmissionFeedbackMessage model defined")
    check("is_internal_note" in models, "is_internal_note field on SubmissionFeedbackMessage")

    # 2. Service Layer
    services_py = REPO_ROOT / "apps" / "api" / "teachers" / "assignment_services.py"
    check(services_py.is_file(), "apps/api/teachers/assignment_services.py exists")
    services = services_py.read_text(encoding="utf-8")

    check("def get_submission_grading_detail(" in services, "get_submission_grading_detail service defined")
    check("def grade_attempt_submission(" in services, "grade_attempt_submission service defined")
    check("def acknowledge_feedback_and_reflect(" in services, "acknowledge_feedback_and_reflect service defined")
    check("def add_feedback_message(" in services, "add_feedback_message service defined")
    check("def get_feedback_messages(" in services, "get_feedback_messages service defined")
    check("is_internal_note=False" in services, "Learner privacy filter on internal notes in get_feedback_messages")
    check("def get_teacher_submissions_queue(" in services, "get_teacher_submissions_queue service defined")
    check("def get_class_gradebook(" in services, "get_class_gradebook matrix service defined")
    check("def export_class_gradebook_csv(" in services, "export_class_gradebook_csv service defined")
    check("\\ufeff" in services, "export_class_gradebook_csv includes UTF-8 BOM for Excel")
    check("def get_learner_gradebook(" in services, "get_learner_gradebook service defined")

    # 3. Admin Registration
    admin_py = REPO_ROOT / "apps" / "api" / "teachers" / "admin.py"
    check(admin_py.is_file(), "apps/api/teachers/admin.py exists")
    admin_code = admin_py.read_text(encoding="utf-8")
    check("SubmissionFeedbackMessageAdmin" in admin_code, "SubmissionFeedbackMessage registered in admin")
    check("feedback_status" in admin_code, "feedback_status included in AssignmentAttemptAdmin")

    # 4. Migrations
    migrations_dir = REPO_ROOT / "apps" / "api" / "teachers" / "migrations"
    check(migrations_dir.is_dir(), "apps/api/teachers/migrations directory exists")
    mig3 = migrations_dir / "0003_gradebook_and_feedback.py"
    check(mig3.is_file(), "0003_gradebook_and_feedback.py migration exists")

    # 5. URLs
    urls_py = REPO_ROOT / "apps" / "api" / "teachers" / "urls.py"
    check(urls_py.is_file(), "apps/api/teachers/urls.py exists")
    urls = urls_py.read_text(encoding="utf-8")
    check('path("submissions/queue/",' in urls, "submissions/queue/ route registered")
    check('path("attempts/<uuid:attempt_id>/grading-detail/",' in urls, "grading-detail/ route registered")
    check('path("attempts/<uuid:attempt_id>/grade/",' in urls, "grade/ route registered")
    check('path("classes/<uuid:class_id>/gradebook/",' in urls, "gradebook/ route registered")
    check('path("classes/<uuid:class_id>/gradebook/export/",' in urls, "gradebook/export/ route registered")
    check('path("attempts/<uuid:attempt_id>/acknowledge-feedback/",' in urls, "acknowledge-feedback/ route registered")
    check('path("attempts/<uuid:attempt_id>/feedback-messages/",' in urls, "feedback-messages/ route registered")
    check('path("my-grades/",' in urls, "my-grades/ route registered")

    # 6. Frontend Files
    gradebook_ts = REPO_ROOT / "apps" / "web" / "lib" / "teacher-gradebook.ts"
    check(gradebook_ts.is_file(), "apps/web/lib/teacher-gradebook.ts exists")

    queue_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "grading" / "page.tsx"
    check(queue_page.is_file(), "Teacher submissions queue page exists")

    grading_studio_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "grading" / "[attemptId]" / "page.tsx"
    check(grading_studio_page.is_file(), "Teacher grading studio page exists")

    gradebook_page = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "gradebook" / "page.tsx"
    check(gradebook_page.is_file(), "Teacher class gradebook page exists")

    learner_grades_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "grades" / "page.tsx"
    check(learner_grades_page.is_file(), "Learner My Grades page exists")

    # 7. CSS Compliance
    for css_rel in [
        Path("apps/web/app/(teacher)/teacher/grading/grading.module.css"),
        Path("apps/web/app/(teacher)/teacher/gradebook/gradebook.module.css"),
        Path("apps/web/app/(learner)/grades/grades.module.css"),
    ]:
        css_file = REPO_ROOT / css_rel
        check(css_file.is_file(), f"{css_rel.name} exists")
        css_content = css_file.read_text(encoding="utf-8")
        check_no_raw_hex(css_content, css_rel.name)
        check_logical_properties(css_content, css_rel.name)

    # 8. Documentation
    doc_path = REPO_ROOT / "docs" / "teachers" / "grading-and-gradebook.md"
    check(doc_path.is_file(), "docs/teachers/grading-and-gradebook.md exists")
    doc_text = doc_path.read_text(encoding="utf-8")
    check("Grading Studio" in doc_text, "Grading Studio documented")
    check("Gradebook Matrix" in doc_text, "Gradebook Matrix documented")
    check("UTF-8" in doc_text, "UTF-8 BOM CSV export documented")

    print("\nAll Day 35 contracts verified successfully!")


if __name__ == "__main__":
    main()
