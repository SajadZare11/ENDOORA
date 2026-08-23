# Endoora Account Hub Specification

## Purpose

Account is a real hub page, not a dropdown dumping ground. It keeps administrative and low-frequency tools away from the learner/teacher Home while still making them easy to find.

## Learner Account

Recommended route: `/account`

Order:

1. **Status / next administrative action**
   - incomplete profile
   - pending consent update
   - payment issue
   - security/session action
2. **Library** — `/account/library`
3. **Usage** — `/account/usage`
4. **Premium** — `/account/plan`
5. **Billing** — `/account/billing`
6. **Profile** — `/account/profile`
7. **Sessions** — `/account/sessions`
8. **Notifications** — `/account/notifications`
9. **Privacy / Data Controls** — `/account/data-controls` (current route)
10. **Settings** — `/account/settings`
11. **Support** — `/support`

## Teacher Account

Recommended route: `/teacher/account`

Order:

1. **Status / next administrative action**
   - verification state
   - account/security issue
   - payout hold when relevant
2. **Profile / Verification** — `/teacher/profile`
3. **Teaching history** — `/teacher/classes`
4. **Usage** — `/teacher/account/usage`
5. **Earnings** — `/teacher/account/earnings`
6. **Payout requests** — `/teacher/account/payouts` (foundation/manual-review capability)
7. **Notifications** — `/account/notifications`
8. **Privacy / Data Controls** — `/account/privacy`
9. **Settings** — `/account/settings`
10. **Support** — `/support`

## What must not be duplicated as equal Home tiles

- Library
- Usage
- Premium/Plan
- Billing
- Profile
- Sessions
- Privacy/Data Controls
- Settings
- Support
- teacher Earnings/Payouts

A compact status can appear on Home only when it creates an urgent next action. The detailed tool remains in Account.

## Account states

- Loading: skeleton/labelled loading state.
- Empty: explain what will appear and provide one useful next action.
- Error: keep unaffected Account destinations usable.
- Offline: saved/local-safe settings may be readable; payment/security mutations do not pretend to succeed.
- Expired session: require re-authentication and return to the requested Account sub-route.
- Permission denied: show why the section is unavailable without leaking another user's data.

## Day 08 runtime implementation

Day 08 turns the Account hub from an information-architecture specification into a working runtime foundation.

### Implemented canonical Account route

`/account`

The Day 08 runtime Account hub is shared by authenticated learner and teacher accounts.

It exposes role-aware account state without duplicating administrative tools onto the primary learner/teacher Home experience.

### Runtime destinations available on Day 08

Fully functional Day 08 destinations:

1. **Profile & Settings** — `/account/profile`
2. **Devices & Sessions** — `/account/sessions`
3. **Privacy & Data Controls** — `/account/data-controls`

Real foundation routes for later roadmap functionality:

4. **Library** — `/account/library`
5. **Usage** — `/account/usage`
6. **Plan** — `/account/plan`
7. **Billing** — `/account/billing`

The foundation pages are intentionally labelled as incomplete rather than pretending later functionality exists.

### Account hub status information

The runtime hub can display:

- authenticated email
- learner/teacher role
- profile completeness
- onboarding completion
- teacher verification capability
- teacher marketplace capability
- teacher paid-class capability

For teacher accounts, role and capability remain explicitly separate.

### Profile & Settings

Day 08 supports:

- persisted interface locale
- optional phone update
- learner profile editing
- teacher profile editing
- read-only email
- read-only role

### Sessions

Day 08 exposes the current authenticated session:

- current/not-current state
- expiry
- session fingerprint when available

Multi-device inventory and remote session revocation are not simulated because the backend does not yet expose those capabilities.

### Privacy & Data Controls

Day 08 supports:

- viewing data-export requests
- creating a data-export request
- persistence of export-request state
- discovering account deletion
- exact `DELETE` confirmation guard before deletion request submission

Manual Day 08 acceptance intentionally did not submit a destructive deletion request.

### Localization and accessibility

Verified on Day 08:

- Persian-first interface
- RTL Persian layout
- English language option
- LTR isolation for account/email/system values where appropriate
- 360 px layout
- keyboard navigation
- visible focus behavior

### Deferred destinations from the original specification

The earlier Account specification includes later destinations such as notifications, support, teacher earnings and payout workflows.

Those are not falsely represented as complete on Day 08 and remain owned by their dedicated roadmap days.
