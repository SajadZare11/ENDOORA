# Endoora Operational Administration & Founder Console Handbook
**Document Code:** `OPS-ADMIN-001`  
**Revision:** `Day 50 Release`  
**Security Classification:** `Confidential / Internal Operations`

---

## 1. Executive Summary & Architecture

The Endoora Operational Administration Hub (`/admin`, `/operations/flags`, `/operations/audit`) and the Culture & Skills Content CMS (`/operations/content`) provide unified operational control, real-time platform telemetry, feature flag safety rails, and editorial publishing governance.

```
+-------------------------------------------------------------------------------+
|                       Endoora Unified Operations Hub                          |
+-------------------------------------------------------------------------------+
|  /operations/taxonomy   | Tree & CEFR Skill Taxonomy (TAXONOMY-001)           |
|  /operations/questions  | Versioned Question Bank & Rubrics (QUESTION-001)    |
|  /operations/courses    | Course CMS, Curriculum Units & Paywall (CONTENT-003)|
|  /operations/content    | Skills, Culture & School Editorial CMS (CONTENT-004)|
|  /admin                 | Executive Founder Console & Telemetry (OPS-001)     |
|  /operations/flags      | Feature Flags & Emergency Kill Switches (OPS-002)   |
|  /operations/audit      | Append-Only Immutable Audit Trail (OPS-003)         |
+-------------------------------------------------------------------------------+
```

---

## 2. Least-Privilege Role & Permission Boundaries

Endoora adheres strictly to the principle of least privilege:

| Role | API Permissions | Accessible Interfaces | Operational Authority |
|---|---|---|---|
| **Learner** (`learner`) | Public endpoints, authenticated learner views | `/learn`, `/courses`, `/skills` | No access to operational consoles (403 Forbidden). |
| **Teacher** (`teacher`) | Teacher gradebook, marketplace slots | `/teachers/portal` | Cannot modify platform courses, questions, or flags. |
| **Editor** (`editor`) | `IsContentEditorOrAdministrator`, `IsCourseEditorOrAdministrator` | `/operations/content`, `/operations/courses`, `/operations/questions` | Authoring, editing, submitting for review, drafting syllabus. |
| **Administrator** (`administrator`, `is_staff`, `is_superuser`) | `IsAdministratorOrStaff`, all editor scopes | `/admin`, `/operations/flags`, `/operations/audit`, all CMS routes | Founder telemetry, emergency kill switches, treasury reconciliation, final publishing. |

---

## 3. Real-Time Telemetry & Operational KPIs (`OPS-001`)

The founder console aggregates real-time signals across six domains:

1. **User Base Breakdown:**
   - Real-time counts of total active users, segmented by role: learners, verified teachers, editorial staff, support staff, administrators.
2. **Content & Editorial Review Queues:**
   - Unreleased items awaiting approval: `courses_in_review`, `content_items_in_review`, and `questions_in_review`.
3. **Teacher Credentialing & Verification:**
   - Unverified teacher applicants (`is_teacher_verified=False`) awaiting identity and educational diploma audits.
4. **Community Moderation & Safety SLA:**
   - Open reports pending investigation under strict SLA timelines (PII leaks: 2h, minors safety: 2h, harassment: 12h, copyright: 12h).
5. **Platform Treasury & Double-Entry Ledger:**
   - Platform cumulative commission earned (`commission_amount_toman`).
   - Confirmed teacher payable balances (`EARNING_AVAILABLE`).
   - Escrow balances in dispute resolution hold (`EARNING_PENDING`).
6. **Infrastructure Telemetry:**
   - PostgreSQL 16 HA connection status, Redis cluster connectivity, and Celery asynchronous task worker health.

---

## 4. Emergency Kill Switches & Feature Flags (`OPS-002`)

Feature flags allow runtime capability gating and instant degradation without code deployments:

- **Kill-Switch Behaviors:**
  - `disable_feature`: Completely takes the capability offline, returning graceful fallback messaging.
  - `reviewed_fallback`: Switches from dynamic/AI generation to pre-approved human-reviewed static curricula.
  - `read_only`: Disables writes or submissions while keeping content readable.
  - `retry_later`: Advises clients to queue requests or retry with exponential backoff.
- **Canary Rollouts:**
  - `rollout_percentage`: Granular percentage (0% to 100%) for gradual feature enablement.
- **Mandatory Audit Reason:**
  - Any toggle or parameter adjustment requires a mandatory explanation (`reason`) of at least 5 characters. The change is rejected with HTTP 400 if no justification is supplied.

---

## 5. Immutable Audit Trail Explorer (`OPS-003`)

Every administrative and editorial operation generates an immutable record in `audit.models.AuditEvent`:
- **Model Guarantees:**
  - Database queryset overrides prohibit `.update()` and `.delete()` across all audit records (`RuntimeError: Audit events are immutable`).
- **Audit Record Schema:**
  - `actor`: Reference to authenticated user.
  - `action`: `create`, `update`, `delete`, or `m2m_change`.
  - `target_app`, `target_model`, `target_pk`: Precise identifier of the affected record.
  - `before_summary` & `after_summary`: Complete JSON snapshots before and after the modification.
  - `reason`: Operator's stated justification.
  - `request_method`, `request_path`, `occurred_at`: Execution context.

---

## 6. Skills, Culture & School Editorial CMS (`CONTENT-004`)

The `/operations/content` workspace manages non-course learning resources:
- **8 Core Skill Domains:** Grammar, Listening, Reading, Writing, Speaking, Vocabulary, Culture & Events, School & Konkur.
- **6 Content Types:** Rich Articles, Audio Lessons (Podcasts), Video Lessons, Cultural Insights, School Guides (Vision 1-3 & Konkur), and Formative Practice Quizzes.
- **Copyright Integrity Gate:**
  - Content cannot be created or published without explicit `source_attribution` and `author_name`.
  - Premium content items (`is_premium=True`) require public `free_preview_excerpt_fa` / `free_preview_excerpt_en` so learners can evaluate quality before subscription.
