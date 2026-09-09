# Teacher Analytics, Early-Warning At-Risk System, and Pedagogical Interventions (Day 36)

## 1. Overview
Day 36 delivers a comprehensive analytics engine, automated early-warning risk detection system, and structured intervention workflow for Endoora educators.

Teachers obtain high-resolution insights into class cohorts and individual student trajectories, while privacy boundaries ensure that solo AI practice, voice recordings, and mistake journals remain strictly confidential.

---

## 2. Core Architectural Components

### 2.1 Backend Models
- **`AtRiskAlert`**:
  - `teacher`: Teacher responsible for the class.
  - `learner`: Enrolled student triggering risk condition.
  - `teacher_class`: Target class cohort.
  - `alert_type`: `low_mastery`, `missing_assignments`, `performance_drop`, `attendance_drop`, `unaddressed_feedback`, `manual_flag`.
  - `severity`: `high`, `medium`, `low`.
  - `status`: `active`, `acknowledged`, `resolved`, `dismissed`.
  - `metrics_snapshot`: JSON dictionary storing metric values (e.g., `{ "average_percentage": 42.5, "missing_count": 3 }`).
  - `acknowledged_at`, `resolved_at`, `resolution_notes`.
- **`TeacherIntervention`**:
  - `teacher`, `learner`, `teacher_class`, `alert` (optional relation).
  - `intervention_type`: `extra_time_accommodation`, `targeted_remedial_assignment`, `one_on_one_office_hour`, `direct_encouragement_note`, `learning_plan_adjustment`, `other`.
  - `status`: `planned`, `in_progress`, `completed`, `cancelled`.
  - `score_before`, `score_after`: Quantifiable academic progress delta.
  - `action_data`, `outcome_notes`, `target_date`, `completed_at`.

### 2.2 Early-Warning Automated Rules
1. **Low Mastery**:
   - `average_score < 50%`: `HIGH` severity.
   - `average_score < 60%`: `MEDIUM` severity.
2. **Missing / Overdue Assignments**:
   - `missing_count >= 3`: `HIGH` severity.
   - `missing_count == 2`: `MEDIUM` severity.
3. **Performance Drop**:
   - Chronological drop in recent 2 graded assignments vs prior >= 25%: `HIGH` severity.
   - Chronological drop in recent 2 graded assignments vs prior >= 15%: `MEDIUM` severity.
4. **Attendance Drop**:
   - Attendance rate in completed sessions < 60%: `MEDIUM` severity.
5. **Unaddressed Feedback**:
   - Returned teacher feedback unacknowledged for > 7 days or revision requested unfulfilled for > 7 days: `LOW` severity.

### 2.3 Strict Privacy Boundaries
- Teachers may only query analytics for students with an active, consented `TeacherLearnerLink`.
- Every access to `/learners/<learner_id>/analytics/` logs a `TeacherDataAccessAudit` record.
- **Strictly Excluded**: Private AI roleplay logs, voice lab recordings, and personal learner mistake genome entries are completely isolated from teacher queries.

---

## 3. Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/teachers/analytics/overview/` | Global overview across all teacher classes, KPI aggregates, alert feed |
| `GET` | `/api/teachers/classes/<id>/analytics/` | Deep-dive class report, score distributions, CEFR skills, trajectory |
| `GET` | `/api/teachers/classes/<id>/analytics/export/` | UTF-8 BOM CSV export of class roster performance |
| `GET` | `/api/teachers/classes/<id>/learners/<id>/analytics/` | Detailed learner analytics profile with CEFR breakdown and audit log |
| `GET` | `/api/teachers/alerts/` | Filterable list of at-risk alerts |
| `POST` | `/api/teachers/alerts/<id>/acknowledge/` | Transition alert to acknowledged |
| `POST` | `/api/teachers/alerts/<id>/resolve/` | Manually resolve alert with resolution notes |
| `GET` | `/api/teachers/interventions/` | Filterable list of interventions |
| `POST` | `/api/teachers/interventions/` | Create planned intervention |
| `PATCH` | `/api/teachers/interventions/<id>/` | Update status, score after, outcome notes, auto-resolve linked alert |

---

## 4. Frontend Workspace Pages
- `/teacher/analytics`: High-level teacher overview, class comparison cards, early-warning feed.
- `/teacher/analytics/[classId]`: Full cohort analytics report with score distribution bins, CEFR radar breakdown, longitudinal trajectory, and learner roster.
- `/teacher/analytics/learners/[learnerId]?classId=...`: Learner analytics profile and 1-click intervention modal.
- `/teacher/interventions`: Interventions workspace with status tabs, score delta tracking (`score_before -> score_after`), and completion evaluation modal.
