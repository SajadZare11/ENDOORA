# Teacher Grading Studio, Two-Way Feedback Loop, and Class Gradebook (Day 35)

## Overview
Day 35 completes the assessment evaluation lifecycle in Endoora, connecting learner submissions with teacher grading studio workflows, a private two-way feedback loop, and a comprehensive 2D class gradebook matrix with student and assignment aggregates, UTF-8 BOM CSV export, and learner-facing grade reporting ("My Grades").

---

## 1. Architecture & Security Invariants

### 1.1 Submission Grading Studio
- **Route**: `/teacher/grading` (Queue) and `/teacher/grading/[attemptId]` (Studio)
- **Question-by-Question Grading**: Teachers can review learner responses side-by-side with reference solutions, answer keys, accepted variants, and automated grading engine diagnostics.
- **Score Overrides**: Teachers can override auto-graded points for any question with custom comments.
- **Rubric Criteria**: Supports structured multi-criteria rubric evaluation (e.g., Accuracy, Task Achievement, Vocabulary) with criterion-level scores and comments.
- **Qualitative Feedback & Revision Workflow**: Teachers can return final grades or request revisions (`REVISION_REQUESTED`) with targeted revision notes.

### 1.2 Two-Way Feedback Loop & Privacy Boundary
- **Route**: Integrated in `/assignments/[id]`, `/teacher/grading/[attemptId]`, and `/grades`
- **Reflection & Acknowledgment**: When an attempt is returned, learners can acknowledge teacher feedback and submit reflective self-assessment notes.
- **Threaded Communication**: Teachers and learners can exchange messages directly on an attempt.
- **Teacher Private Notes**: Internal teacher notes (`is_internal_note=True`) are strictly protected by server-side query filters and are never transmitted to learners.

### 1.3 Class Gradebook Matrix (2D Grid)
- **Route**: `/teacher/gradebook`
- **Matrix Layout**: Rows represent learners enrolled in the class; columns represent assignments created for that class.
- **Student Aggregates**:
  - Overall Weighted Average Percentage
  - Total Points Earned / Total Max Points
  - Completed count, Missing count, Late submission count
- **Assignment Column Statistics**:
  - Class Average Percentage
  - Median Score
  - Submission / Completion Rate
- **Excel-Safe CSV Export**:
  - Route: `/api/teachers/classes/<class_id>/gradebook/export/`
  - Output begins with `\ufeff` (UTF-8 Byte Order Mark) to ensure Persian and Arabic characters render flawlessly in Microsoft Excel.

### 1.4 Learner-Facing Gradebook ("My Grades")
- **Route**: `/grades`
- **Cross-Class GPA**: Displays overall weighted GPA percentage across all enrolled classes.
- **Class-by-Class Breakdown**: Lists all assignments per class with status badges, points, percentages, teacher feedback snippets, and reflection indicators.
- **Direct Feedback Access**: Links directly back to `/assignments/[id]` to review teacher comments or submit self-reflections.

---

## 2. API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/teachers/submissions/queue/` | Submissions queue filtered by class, assignment, status | Teacher (Owner) |
| `GET` | `/api/teachers/attempts/<attempt_id>/grading-detail/` | Detailed grading payload with solutions and auto-grading logs | Teacher (Owner) |
| `POST` | `/api/teachers/attempts/<attempt_id>/grade/` | Submit final scores, rubric evaluation, feedback, or revision request | Teacher (Owner) |
| `GET` | `/api/teachers/classes/<class_id>/gradebook/` | 2D gradebook matrix with student and assignment aggregates | Teacher (Owner) |
| `GET` | `/api/teachers/classes/<class_id>/gradebook/export/` | UTF-8 BOM CSV export for Excel | Teacher (Owner) |
| `POST` | `/api/teachers/attempts/<attempt_id>/acknowledge-feedback/` | Learner feedback acknowledgment & self-reflection | Learner (Owner) |
| `GET` | `/api/teachers/attempts/<attempt_id>/feedback-messages/` | Feedback discussion messages (private notes filtered for learners) | Teacher / Learner |
| `POST` | `/api/teachers/attempts/<attempt_id>/feedback-messages/` | Add feedback message or internal teacher note | Teacher / Learner |
| `GET` | `/api/teachers/my-grades/` | Learner cross-class GPA, assignment breakdowns, and feedback statuses | Learner |

---

## 3. Design System & CSS Compliance
All Day 35 frontend CSS modules strictly adhere to the Endoora Design System:
- **100% Tokenized Colors**: Zero raw hex colors (`#...`). All colors reference design tokens (`var(--color-...)`).
- **100% Logical Properties**: Uses `margin-inline`, `margin-block`, `padding-inline`, `padding-block`, `inset-inline`, and `inset-block` exclusively.
- **RTL/LTR Support**: Fully bi-directional with seamless Persian font rendering (IRANSansX / Vazirmatn).
