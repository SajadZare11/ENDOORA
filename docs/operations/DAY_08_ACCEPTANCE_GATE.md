# Day 08 acceptance gate

## Objective

Build a simple bilingual path from account creation into role-specific onboarding and a usable Account hub while collecting only useful profile information.

## Authentication UX

- [x] Registration page exists.
- [x] Login page exists.
- [x] Password-reset page exists.
- [x] Persian is the default interface.
- [x] English switch is available.
- [x] Learner can self-register.
- [x] Teacher can self-register.
- [x] Administrative role cannot be self-assigned.
- [x] Terms acceptance is explicit.
- [x] Privacy acceptance is explicit.
- [x] Browser registration persists a real account.
- [x] Browser login works.
- [x] Password reset works end-to-end.

## Learner onboarding

- [x] Goal captured.
- [x] Age band captured.
- [x] Current level estimate captured.
- [x] Preferred daily study time captured.
- [x] Preferred learning days captured.
- [x] Timezone captured.
- [x] Save and continue later exists.
- [x] Debounced server autosave runs while the form is edited.
- [x] Refresh does not lose saved onboarding state.
- [x] Onboarding can resume from server state.
- [x] Profile completeness is available.
- [x] Learner onboarding can be completed.

## Teacher onboarding

- [x] Public name captured.
- [x] Bio captured.
- [x] Experience captured.
- [x] Specialties captured.
- [x] City captured.
- [x] Languages captured.
- [x] Availability intent captured.
- [x] Verification intent captured.
- [x] Save/resume works.
- [x] Teacher onboarding can be completed.
- [x] Verification intent does not set `is_teacher_verified`.
- [x] Verification intent does not set `marketplace_eligible`.
- [x] Verification intent does not set `paid_class_eligible`.

## Account hub

- [x] `/account`
- [x] `/account/profile`
- [x] `/account/sessions`
- [x] `/account/data-controls`
- [x] `/account/library`
- [x] `/account/usage`
- [x] `/account/plan`
- [x] `/account/billing`
- [x] Profile completeness visible.
- [x] Teacher capability status visible.
- [x] Foundation sections are explicitly labelled as foundation functionality.

## Profile / settings

- [x] Account profile can be edited.
- [x] Email remains read-only.
- [x] Role remains read-only.
- [x] Learner profile persists.
- [x] Teacher profile persists.
- [x] Interface locale persists after refresh.
- [x] Authenticated locale changes persist across every Day 08 account surface.

## Sessions

- [x] Current-session view exists.
- [x] Session expiry is visible.
- [x] Missing fingerprint is represented honestly.
- [x] UI does not falsely claim multi-device management exists.

## Privacy / data controls

- [x] Data-export entry point is discoverable.
- [x] Data-export request can be created.
- [x] Data-export request survives refresh.
- [x] Backend export request creation is idempotent for active requests.
- [x] Account-deletion entry point is discoverable.
- [x] Deletion UI requires exact `DELETE` confirmation.
- [x] Destructive deletion was intentionally not manually submitted during acceptance testing.

## Permissions / privacy

- [x] Learner cannot use teacher profile endpoint.
- [x] Teacher cannot use learner profile endpoint.
- [x] Cross-user learner profile access is rejected.
- [x] Sensitive onboarding draft keys are rejected.
- [x] Teacher role remains separate from verified-teacher capability.
- [x] Terms and Privacy consent are required for onboarding completion.
- [x] Outdated consent versions do not satisfy onboarding completion.

## Automated verification

- [x] `python manage.py check`
- [x] `python manage.py test`
- [x] Focused accounts/profiles backend tests passed
- [x] `python manage.py makemigrations --check --dry-run`
- [x] No migration drift
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run check:day08`

## Browser acceptance

- [x] Registration works.
- [x] Login works.
- [x] Password reset works.
- [x] Learner onboarding works.
- [x] Learner onboarding persists across refresh.
- [x] Teacher onboarding works.
- [x] Profile edits persist across refresh.
- [x] Preferred language persists.
- [x] Sessions page works.
- [x] Data-controls page works.
- [x] All Account destinations are reachable.
- [x] 360 px smoke test passes.
- [x] Keyboard-only smoke test passes.

## Known deferred work

- [ ] Multi-device session inventory.
- [ ] Remote session revocation.
- [ ] Generated export-file delivery.
- [ ] Full Library functionality.
- [ ] Full Usage functionality.
- [ ] Full Plan functionality.
- [ ] Full Billing functionality.
- [ ] Actual teacher verification process.
- [ ] Teacher marketplace eligibility workflow.
- [ ] Paid-class eligibility workflow.
- [ ] Automated Playwright/E2E coverage.

Deferred items above are not Day 08 blockers because Day 08 implements their required foundation/entry points only.

## Final repository gate

- [x] Secret-scanner unit tests pass.
- [x] Secret scan passes.
- [x] `git diff --check` passes.
- [x] Git status reviewed.
- [ ] Day 08 changes committed (not requested in this task).
- [ ] Day 08 commit pushed to `origin/main` (not requested in this task).
- 
## Day 08 gate status

**Functional and acceptance verification: PASS**

**Repository checkpoint: LOCAL CHANGES READY; COMMIT/PUSH NOT REQUESTED**

**DAY 08: COMPLETE**
