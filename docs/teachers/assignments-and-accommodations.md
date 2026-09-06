# Teacher Assignments, Question Bank Selection, Delivery Settings, and Accommodations

**Doc ID**: `DOC-TEACH-034`
**Status**: Approved & Implemented
**Owner**: Educational Technology & Instructional Architecture
**Release**: Day 34

---

## 1. Executive Summary

Day 34 implements the end-to-end Assignment Management and Delivery engine on Endoora. This system connects instructional cohort management (Day 33) with the Question Bank and automated evaluation engine (Day 13), empowering educators to curate assessments, configure strict or flexible delivery windows, offer personalized learning accommodations, and automatically grade objective questions while preserving complete autosave resilience against client disconnections.

---

## 2. Information Architecture & Navigation Path

In accordance with **Wireframe 4** (`docs/product/wireframes/teacher-assignment.md`), the navigation hierarchy is strictly optimized for high findability with exactly 3 decisions:

```
Teacher Home → Teach → Assignments → Create Assignment
```

### Multi-Stage Creation Wizard Workflow:
1. **Choose Class & Target Learners**:
   - Selects an active managed cohort (`TeacherClass.status == ACTIVE`).
   - Identifies active learners enrolled through verified consent links (`TeacherLearnerLink.status == ACTIVE`).
   - *Recovery Rule*: If no class exists or all classes are archived, clear actionable guidance explains how to create or activate a class before proceeding.
2. **Select Objectives & Browse Question Bank**:
   - Searches published `QuestionVersion` items across CEFR levels (A1–C2) and types (MCQ, Multi-Select, Gap fill, Short answer, Audio, Matching, Ordering).
   - Invariant: References `QuestionVersion.id` directly, ensuring immutable question content preservation.
   - *Recovery Rule*: If a previously attached question is retired or unavailable, the draft is preserved and the affected question is explicitly flagged for replacement.
3. **Delivery Settings & Individual Accommodations**:
   - **Due Date**: Mandatory deadline.
   - **Grace Period (Minutes)**: Configurable buffer period after deadline before submission cutoff.
   - **Late Submissions**: Optional toggle permitting submissions after the grace period marked with an `is_late=True` audit flag.
   - **Attempt Limits**: Maximum allowed attempts per learner (`max_attempts >= 1`).
   - **Time Limits**: Optional countdown timer in minutes for timed tests.
   - **Passing Threshold**: Percentage required for passing grade.
   - **Individualized Accommodations**: Differentiated settings per enrolled student:
     - `extra_time_minutes`: Extra minutes added to timer (e.g. 50% extra time for IEP/ELL).
     - `extra_attempts`: Additional chances granted to specific learners.
     - `extended_due_date`: Tailored deadline extension.
     - `notes`: Confidential pedagogical rationale.
4. **Review & Publish**:
   - Comprehensive summary of total points, questions count, estimated duration, and delivery constraints.
   - **Draft Persistence**: "Save and Continue Later" saves state without publishing.
   - **Publish Action**: Distinct final action transitioning status to `PUBLISHED` and making the assignment available to enrolled learners.

---

## 3. Strict Content Governance & Privacy Barrier

1. **Answer Key Protection**:
   - Under no circumstances does the API expose `answer_key`, `solutions`, `rubric`, or `accepted_variants` to learners.
   - Learner attempts receive strictly `QuestionVersion.learner_payload` via `AssignmentService.get_attempt_learner_payload`.
2. **Class & Learner Isolation**:
   - Teachers can only view, edit, or publish assignments for classes they own (`assignment.teacher == request.user`).
   - Learners can only view and attempt assignments belonging to cohorts in which they are actively linked (`status == ACTIVE`).
3. **Resilience (R-029 Autosave)**:
   - Learner answers are autosaved incrementally to `answers_payload`.
   - Unexpected page refreshes, browser crashes, or temporary connectivity losses seamlessly resume from the last saved state without losing progress.
4. **Auto-Scoring Engine**:
   - Objective question formats (MCQ, Multi-Select, Gap fill, Short answer, Audio, Matching, Ordering) are graded immediately upon submission using `questions.grading.grade_response`.
   - Subjective questions (Long writing, Speaking) are flagged with `manual_review_required` and routed to the teacher's grading queue.
   - Teachers can override scores and append qualitative feedback via `/api/teachers/attempts/<id>/grade/`.

---

## 4. API Endpoints Reference

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/api/teachers/assignments/` | List assignments owned by teacher | Teacher |
| `POST` | `/api/teachers/assignments/` | Create assignment draft | Teacher |
| `GET` | `/api/teachers/assignments/<id>/` | View assignment details & questions | Teacher |
| `PATCH` | `/api/teachers/assignments/<id>/` | Update draft details (with optimistic locking) | Teacher |
| `DELETE` | `/api/teachers/assignments/<id>/` | Delete draft assignment | Teacher |
| `POST` | `/api/teachers/assignments/<id>/questions/` | Attach / reorder question bank questions | Teacher |
| `POST` | `/api/teachers/assignments/<id>/delivery/` | Configure due date, timer, and attempts | Teacher |
| `GET` | `/api/teachers/assignments/<id>/accommodations/` | List learner accommodations | Teacher |
| `POST` | `/api/teachers/assignments/<id>/accommodations/` | Set accommodation for specific learner | Teacher |
| `POST` | `/api/teachers/assignments/<id>/publish/` | Validate and publish assignment | Teacher |
| `GET` | `/api/teachers/assignments/<id>/submissions/` | List student submissions and scores | Teacher |
| `POST` | `/api/teachers/attempts/<id>/grade/` | Manually grade or feedback attempt | Teacher |
| `GET` | `/api/teachers/question-bank/browse/` | Search published questions for curation | Teacher |
| `GET` | `/api/teachers/my-assignments/` | List assignments for authenticated learner | Learner |
| `POST` | `/api/teachers/assignments/<id>/start/` | Start or resume an assignment attempt | Learner |
| `POST` | `/api/teachers/attempts/<id>/autosave/` | Autosave draft answers | Learner |
| `POST` | `/api/teachers/attempts/<id>/submit/` | Submit attempt with auto-grading | Learner |
| `GET` | `/api/teachers/attempts/<id>/` | View submission results and feedback | Learner |

---

## 5. Architectural Compliance Checklist

- [x] Wireframe 4 multi-stage breadcrumbs and navigation.
- [x] "Save and Continue Later" preserves draft without publishing.
- [x] Optimistic concurrency control (`version` counter) prevents silent overwrites.
- [x] Strict content governance strips answers from learner payloads.
- [x] Auto-grading integrated with `questions.grading.grade_response`.
- [x] Resilient autosave (R-029) prevents data loss.
- [x] 100% tokenized CSS styling with 0 raw hex colors and 100% logical CSS properties.
- [x] Zero trailing whitespace or lint issues.
