# Session Booking, Scheduling State Machine, and Timezone Management (MKT-004)

## Overview
Day 38 introduces the full-stack session scheduling, conflict prevention, negotiation, and lifecycle state machine for the Endoora marketplace. It bridges marketplace offer acceptance and direct teacher bookings into immutable, audited session records with strict concurrency guards, idempotency enforcement, and localized Iran Standard Time (`Asia/Tehran`) management.

---

## 1. Data Architecture & State Machine

### Booking Status Lifecycle
The `SessionBooking` model implements an explicit state machine with guarded transitions:

```
                      ┌───────────────────────────────┐
                      │  Learner Direct or Accepted   │
                      │         Teacher Offer         │
                      └──────────────┬────────────────┘
                                     │
                                     ▼
                              [ CONFIRMED ]
                               │   │   │
          ┌────────────────────┘   │   └───────────────────────┐
          │ (reschedule req)       │ (start session)           │ (cancel)
          ▼                        ▼                           ▼
[ RESCHEDULE_REQUESTED ]    [ IN_PROGRESS ]       [ CANCELLED_BY_LEARNER ]
     │           │                 │              [ CANCELLED_BY_TEACHER ]
     │ (accept)  │ (decline)       │ (complete)
     ▼           ▼                 ▼
[ CONFIRMED ]  [ CONFIRMED ]  [ COMPLETED ]
(new start)    (original)          │
                                   ▼
                            [ Session Notes ]
                            [ Teaching Hours ]
```

### State Definitions
- `CONFIRMED`: Time slot reserved for both teacher and learner. Meeting room URL generated.
- `RESCHEDULE_REQUESTED`: One party proposed an alternative time; previous slot remains tentatively reserved until counterparty acts.
- `IN_PROGRESS`: Session has started during the active session window (from 15 minutes before scheduled start until 30 minutes after scheduled end).
- `COMPLETED`: Session concluded successfully with optional teacher feedback notes.
- `CANCELLED_BY_LEARNER` / `CANCELLED_BY_TEACHER`: Session aborted with required cancellation explanation; time slot released immediately.
- `NO_SHOW_LEARNER` / `NO_SHOW_TEACHER`: Audit trail for non-attendance.
- `DISPUTED`: Flagged for admin/support triage.

---

## 2. Concurrency, Conflict Prevention & Idempotency

### Double-Booking Conflict Detection
Before creating a booking or approving a reschedule, the `check_schedule_conflict` service validates:
1. Teacher has zero active bookings (`CONFIRMED`, `RESCHEDULE_REQUESTED`, `IN_PROGRESS`) where `scheduled_start < new_end` and `scheduled_end > new_start`.
2. Learner has zero active bookings overlapping the same window.
3. If an overlap is found, raises a descriptive Persian `ValidationError` without modifying database state.

### Idempotency Key Guard
Each booking request carries an optional or auto-minted unique `idempotency_key`. The `SessionBooking` table applies a unique index on `idempotency_key`, guaranteeing that duplicate network retries or double-clicks do not create phantom duplicate bookings or double-charge balances.

---

## 3. Timezone Management & Localization

- **Storage**: All timestamps (`scheduled_start`, `scheduled_end`, `reschedule_proposed_start`, etc.) are persisted in UTC (`datetime.timezone.utc`) with database microsecond precision.
- **System Reference**: All scheduling logic and booking agreements reference `Asia/Tehran` (IRST, UTC+03:30).
- **Client Presentation**:
  - Persian-first formatted dates via `Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran" })`.
  - Automatic detection of learner/teacher device timezone. If different from Tehran, a companion indicator displays the local equivalent (e.g., `(ساعت محلی شما: 14:30 GMT+1)`).

---

## 4. Frontend Workspaces

### Top-Level Bookings Hub (`/bookings`)
- Comprehensive overview of upcoming, active, completed, and cancelled sessions.
- Role toggle: Filter between learner sessions and teacher sessions.
- Interactive Reschedule Modal: Date/time picker with proposal notes.
- Interactive Cancellation Modal: Reason submission with immediate feedback.
- One-click join button for active live classes.

### Session Detail Workspace (`/bookings/[id]`)
- Session breadcrumb navigation and unique booking UUID tracking.
- Interactive live meeting room card (Direct Jitsi/WebRTC room access).
- Chronological session timeline: booking time, reschedule requests, start, completion, and cancellation reasons.
- Participant metadata and financial rate breakdown in Toman.

---

## 5. Security & Verification
- **Teacher Capability Gating**: Only verified teachers with `marketplace_eligible=True` can have sessions scheduled.
- **Participant Access Control**: Only the associated learner, teacher, or staff members can view booking details, request reschedules, cancel, or initiate sessions.
- **Validation**:
  - `start`: Gated to the session active window (within 15 minutes before scheduled start).
  - `complete`: Accessible only when session is `IN_PROGRESS` or within scheduled window.
  - `cancel`: Requires non-empty reason string.
