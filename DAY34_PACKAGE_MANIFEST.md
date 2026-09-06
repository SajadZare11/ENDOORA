# Day 34 Package Manifest: Teacher Assignments, Question Selection, Due Dates, Attempts, and Accommodations

## Modified & Created Files
- `apps/api/teachers/models.py`: Added `AssignmentStatus`, `AttemptStatus`, `Assignment`, `AssignmentQuestion`, `AssignmentAccommodation`, and `AssignmentAttempt` models with optimistic concurrency locking, effective deadline/attempt calculations, and submission window checks.
- `apps/api/teachers/assignment_services.py`: Implemented `AssignmentService` providing draft creation, Question Bank version curation, delivery constraints (due date, grace period, attempts, timer), differentiated learning accommodations per student, publishing checks, sanitized learner payload generation (stripping answer keys), R-029 autosave resilience, submission handling, and auto-scoring via `questions.grading.grade_response`.
- `apps/api/teachers/assignment_serializers.py`: Comprehensive serializers for assignments, question items, delivery configuration, individual accommodations, learner attempts, autosave payloads, and grading overrides.
- `apps/api/teachers/assignment_views.py`: RESTful API endpoints for teacher assignment authoring, question bank browsing, student submission review, attempt grading, and learner attempt execution.
- `apps/api/teachers/urls.py`: Registered Day 34 endpoints under `/api/teachers/`.
- `apps/api/teachers/admin.py`: Registered `Assignment`, `AssignmentQuestion`, `AssignmentAccommodation`, and `AssignmentAttempt` with tabular inlines and search/filter fields.
- `apps/api/teachers/migrations/0002_assignments.py`: Django database migration for Day 34 models.
- `apps/api/teachers/tests.py`: Unit test suite testing draft creation, Question Bank selection, delivery rules, accommodations, publish requirements, learner attempt lifecycle, autosave resilience, and auto-scoring.
- `docs/teachers/assignments-and-accommodations.md`: Complete architecture and safety documentation covering Wireframe 4 wizard, content governance, delivery rules, accommodations, and auto-scoring.
- `apps/web/lib/teacher-assignments.ts`: Strongly typed TypeScript client library for assignment operations and learner attempts.
- `apps/web/app/(teacher)/teacher/assignments/page.tsx`: Teacher assignments hub with breadcrumbs, summary metrics, tabbed status filters, and actions table.
- `apps/web/app/(teacher)/teacher/assignments/new/page.tsx`: 4-stage Wireframe 4 wizard with "Save and Continue Later", Question Bank browser, delivery/accommodations configuration, and distinct Publish action.
- `apps/web/app/(teacher)/teacher/assignments/[id]/page.tsx`: Assignment detail and student submissions grading dashboard.
- `apps/web/app/(teacher)/teacher/assignments/assignments.module.css`: 100% tokenized CSS module with 0 raw hex colors and 100% logical properties.
- `apps/web/app/(learner)/assignments/page.tsx`: Learner-facing assignments dashboard showing pending and completed assignments.
- `apps/web/app/(learner)/assignments/[id]/page.tsx`: Learner attempt taking interface with real-time timer, R-029 resilient autosave, question navigation, and immediate auto-scoring results.
- `apps/web/app/(learner)/assignments/learner-assignments.module.css`: 100% tokenized CSS module with 0 raw hex colors and 100% logical properties.
- `apps/web/app/(teacher)/teacher/classes/page.tsx`: Added Assignments Hub navigation and quick Create Assignment link.
- `scripts/backup_day34.ps1`: Pre-migration database backup script for Day 34.
- `scripts/check_day34.py`: Comprehensive contract verification test suite for Day 34.
- `DAY34_INSTALL_WINDOWS.md`: Windows verification and execution guide.
- `DAY34_PACKAGE_MANIFEST.md`: Release asset manifest.
