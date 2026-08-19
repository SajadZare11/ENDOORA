# Day 11 acceptance gate

Do not mark Day 11 complete until every applicable check passes.

## A. Static package check — repository root

`python scripts\check_day11.py`

Expected:

`Day 11 static checks passed: audit app, immutable events, safe settings, feature flags, admin hardening, Persian-first operations summary, and least-privilege policy.`

## B. Django checks — apps\api

`python manage.py check`

`python manage.py makemigrations --check --dry-run`

Expected migration drift: `No changes detected`.

`python manage.py test`

All tests must pass, including:
- audit immutability
- audit redaction
- privileged change audit creation
- unsafe SystemSetting rejection
- FeatureFlag validation
- support least-privilege rules

## C. Admin role bootstrap

`python manage.py bootstrap_admin_roles`

Expected:

`Endoora operational groups created/updated with least-privilege permissions.`

Run it a second time. It must remain safe/idempotent.

## D. Manual administrator journey

1. Start API.
2. Open `http://127.0.0.1:8000/admin/`.
3. Sign in with your local superuser.
4. Confirm header says `Endoora Operations`.
5. Confirm Persian-first operations summary is visible and usable at 360 px width.
6. Create a safe `SystemSetting`:
   - key: `dashboard_notice_limit`
   - value_type: `integer`
   - value: `3`
   - environment_scope: `development`
   - owner: `operations`
   - rationale: `Day 11 manual acceptance`
7. Open Audit events.
8. Confirm a new event identifies actor, target, reason, method/path and time.
9. Confirm AuditEvent has no editable save/delete controls.
10. Try creating `payment_bypass=true`; validation must reject it.
11. Try a key containing `api_key`; validation must reject it.
12. Create a disabled FeatureFlag for staging and confirm invalid environment/rollout combinations are rejected.

## E. Support restriction journey

Create/use a disposable local support test account only. Do not change your founder superuser.

Requirements:
- Support must not edit user role/capabilities.
- Support must not browse `profiles` learner evidence.
- Support must not see OneTimeCode `code_hash`.
- Support must not get any payment-state editor.
- A learner/teacher with accidental `is_staff=True` but no operator role/group must not receive admin model access.

## F. Secret/privacy review

Repository root:

`python scripts\scan_secrets.py`

Review browser/API logs. No password, OTP/hash, API key, Merchant ID, raw learner writing, audio/transcript, private message, answer key or payment credential should appear.

## G. Existing regression suite

Repository root:

`node scripts\check-day10.mjs`

`npm run lint`

`npm run typecheck`

`npm run build`

Backend:

`python manage.py test`

This proves Day 11 did not regress the Day 10 teacher shell or prior account/learner work.

## H. Final Git checkpoint

Only after all checks pass:

`git status --short --branch`

`git diff --check`

`git add .`

`git commit -m "Day 11: Configure Django admin, audit logs, and safe settings"`

`git push origin main`

Then update `PROJECT_STATE.md` with the real backup path, real successful test commands and real commit hash. Never invent these values.
