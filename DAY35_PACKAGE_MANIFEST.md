# Endoora Day 35 Package Manifest

## Summary of Deliverables
Day 35 completes the submission grading studio, rubric evaluation, private two-way feedback loop, 2D class gradebook matrix with student and assignment aggregates, UTF-8 BOM CSV export, and learner-facing grade reporting ("My Grades").

## 1. Backend Architecture
- **Models** (`apps/api/teachers/models.py`):
  - Added `AttemptStatus.REVISION_REQUESTED`
  - Created `FeedbackStatus` choices (`PENDING`, `RETURNED`, `ACKNOWLEDGED`, `REVISION_REQUESTED`)
  - Enhanced `AssignmentAttempt`: `rubric_scores`, `question_grades`, `feedback_status`, `learner_reflection`, `learner_acknowledged_at`, `revision_notes`
  - Created `SubmissionFeedbackMessage` for threaded discussions and internal teacher notes
- **Migrations** (`apps/api/teachers/migrations/0003_gradebook_and_feedback.py`)
- **Admin** (`apps/api/teachers/admin.py`):
  - Registered `SubmissionFeedbackMessageAdmin`
  - Updated `AssignmentAttemptAdmin`
- **Service Layer** (`apps/api/teachers/assignment_services.py`):
  - `get_submission_grading_detail`
  - `grade_attempt_submission`
  - `acknowledge_feedback_and_reflect`
  - `add_feedback_message`
  - `get_feedback_messages` (with strict privacy filter)
  - `get_teacher_submissions_queue`
  - `get_class_gradebook`
  - `export_class_gradebook_csv` (UTF-8 BOM)
  - `get_learner_gradebook`
- **Serializers & Views** (`apps/api/teachers/assignment_serializers.py`, `apps/api/teachers/assignment_views.py`):
  - 8 REST endpoints added and registered in `apps/api/teachers/urls.py`
- **Unit & Integration Tests** (`apps/api/teachers/tests.py`):
  - `TeacherGradebookAndFeedbackDay35Tests` with 8 comprehensive test cases

## 2. Frontend Implementation
- **Client Service** (`apps/web/lib/teacher-gradebook.ts`):
  - Strongly-typed API client using `endooraApi`
- **Pages & Components**:
  - `apps/web/app/(teacher)/teacher/grading/page.tsx`: Submissions queue with filters and search
  - `apps/web/app/(teacher)/teacher/grading/[attemptId]/page.tsx`: Grading studio with question override, rubric scoring, threaded discussion, and revision requests
  - `apps/web/app/(teacher)/teacher/gradebook/page.tsx`: 2D gradebook matrix, student aggregates, assignment stats, and CSV export
  - `apps/web/app/(learner)/grades/page.tsx`: Learner-facing cross-class GPA, assignment cards, and direct links
  - `apps/web/app/(learner)/assignments/[id]/page.tsx`: Enhanced attempt completion view with rubric breakdown and reflection acknowledgment form
- **CSS Modules** (100% tokenized, 0 raw hex, 100% logical properties):
  - `apps/web/app/(teacher)/teacher/grading/grading.module.css`
  - `apps/web/app/(teacher)/teacher/gradebook/gradebook.module.css`
  - `apps/web/app/(learner)/grades/grades.module.css`

## 3. Quality & Verification
- `scripts/check_day35.py`: Contract verification script
- `docs/teachers/grading-and-gradebook.md`: Technical architectural guide
- `scripts/backup_day35.ps1`: Automated backup script
