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
9. **Privacy / Data Controls** — `/account/privacy`
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
