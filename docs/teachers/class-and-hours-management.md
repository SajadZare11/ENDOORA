# Day 33: Teacher Class, Learner Roster, Sessions, and Teaching-Hours Management

## Overview

Day 33 establishes the core instructional infrastructure for teachers on Endoora. This includes private class creation, student onboarding via explicit learner consent, session management with automated teaching hours calculation, an immutable ledger with audit trail, and strict privacy barriers protecting learner autonomy.

---

## 1. Class Creation and Capacity Management

Teachers can organize their private cohorts by creating managed classes:
- **Title, Subject, CEFR Level**: Target specific learning goals (e.g., IELTS Speaking B2, Business English C1).
- **Max Capacity**: Restrict class size to manage cohort workload.
- **Objectives**: Curricular milestones tracked across sessions.
- **Private Teacher Notes**: Kept strictly confidential from learners.

---

## 2. Student Linking & Explicit Learner Consent

### Security Boundary
Endoora enforces a strict privacy boundary: **teachers cannot search or browse arbitrary platform learners**.
To establish an educational relationship:
1. **Invite Generation**: A teacher invites a learner using their email or unique ID within a specific class.
2. **Pending Consent**: A `TeacherLearnerLink` is created in status `PENDING_CONSENT`. A secure, unpredictable invite code is generated.
3. **No Educational Data Access**: While in `PENDING_CONSENT`, the teacher cannot view the learner's educational profile, scores, or skill evidence (HTTP 403 Forbidden).
4. **Explicit Consent Grant**: The learner explicitly accepts the invitation (`POST /api/teachers/consent/`).
5. **Active Link**: Upon acceptance, status transitions to `ACTIVE` and `consent_given_at` timestamp is recorded.

---

## 3. Privacy Barriers & Data-Access Auditing

### Exclusion of Private AI Chats
Learners use Endoora's AI tools (`roleplay`, `voice_lab`, `mistake_genome`, `writing_mentor`) as private psychological safety zones.
- **Strict Prohibition**: Teacher overviews (`/api/teachers/learners/<id>/overview/`) **NEVER** expose raw AI conversations, voice audio clips, or private AI roleplay transcripts.
- **Safe Educational Evidence**: Only aggregate proficiency metrics, CEFR estimates, and course skill benchmarks are surfaced.
- **Accessibility**: Skill evidence charts include explicit, localized text alternatives for screen readers.

### Immutable Data-Access Audit Trail
Every time a teacher views a learner's educational overview, a `TeacherDataAccessAudit` record is created logging:
- `teacher`: The inspecting teacher user.
- `learner`: The learner whose profile was inspected.
- `access_type`: `VIEW_LEARNER_OVERVIEW`.
- `ip_address`: Remote client IP address.
- `user_agent`: Browser or client user-agent string.
- `timestamp`: UTC timestamp of the access event.

---

## 4. Relationship Termination & Legal Compliance

When an educational relationship concludes or is revoked:
- Either party (or platform staff) may terminate the link via `POST /api/teachers/links/<id>/terminate/`.
- **Immediate Access Revocation**: Status becomes `TERMINATED` and `terminated_at` is set. Future access to the learner's overview is blocked immediately.
- **Historical Immutability**: Historical class sessions (`ClassSession`) and teaching hour ledger records (`TeachingHourLedger`) are immutably preserved for accounting, payroll, and regulatory compliance.

---

## 5. Teaching Hours Calculation & Audit Ledger

### Automated Duration Calculation
Teaching hours are earned through confirmed class sessions:
$$\text{hours} = \frac{\text{duration\_minutes}}{60.0}$$
- When a teacher marks a session as completed (`POST /api/teachers/sessions/<id>/complete/`), a `TeachingHourLedger` entry is created with status `CONFIRMED`.

### Failure Trap Guard: No Un-audited Hours Adjustments
- **Rule**: Direct, silent modification of teaching hours is architecturally prohibited.
- **Audit Requirement**: Any adjustment (`POST /api/teachers/hours/<id>/adjust/`) requires:
  1. Mandatory explanation/reason (minimum 5 characters).
  2. Transactional lock on the ledger record (`select_for_update()`).
  3. Status changed to `REVISED`.
  4. Generation of an immutable `TeachingHourAuditLog` record containing `actor`, `action`, `previous_hours`, `new_hours`, `reason`, and `timestamp`.

---

## 6. Learner Transparency (`my-teachers`)

Learners retain full transparency over their instructional relationships:
- Through `GET /api/teachers/my-teachers/`, learners can review all active instructors, linked classes, and consent timestamps.
