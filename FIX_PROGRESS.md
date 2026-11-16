# ENDOORA Audit Remediation Progress (F01–F26)

## Baseline Summary
- **Audit Commit**: `f4a48bde1f1efc96d04f82dc74abfab5086311d6`
- **Remediation Branch**: `fix/audit-remediation-f01-f26`
- **Initial Baseline Measurements**:
  - Backend Tests: 561 passing, 3 failing (`marketplace.tests.MarketplaceDay41Tests.test_platform_pricing_plans_api`, `offline_sync.tests.OfflineSyncTests.test_batch_sync_sanitizes_malicious_script`, `teachers.tests.TeacherDashboardTests.test_dashboard_service_uses_one_domain_query`).
  - Frontend Lint: 333 errors, 317 warnings (650 total problems).
  - Frontend Build: Passed (284 static/SSG pages).
  - Registered Checks: 19 passed, 10 failed.

---

## Findings Progress Tracker

| ID | Finding Description | Status | Changed Files | Test Verification |
|---|---|---|---|---|
| **F01** | Block sandbox payment selection in production | COMPLETE | `apps/api/marketplace/serializers.py`, `apps/api/marketplace/services.py`, `apps/api/marketplace/views.py`, `apps/api/marketplace/zarinpal.py`, `apps/api/endoora_api/settings/*.py`, `apps/api/marketplace/tests.py` | `SandboxPaymentSecurityTests` (6 tests pass), existing Day 42 tests pass |
| **F02** | Enforce server-side admin authorization | COMPLETE | `apps/web/lib/admin-auth.ts`, `apps/web/components/admin/AdminLoginGate.tsx`, `apps/web/components/admin/AdminPageClient.tsx`, `apps/web/app/api/admin/**/route.ts`, `tests/unit/admin-auth-security.test.mjs` | `tests/unit/admin-auth-security.test.mjs` (4 tests pass), all 14 admin API routes protected |
| **F03** | Remove DEBUG login password replacement | COMPLETE | `apps/api/accounts/views.py`, `apps/api/accounts/management/commands/create_dev_user.py`, `apps/api/accounts/tests/test_api.py` | `DebugLoginRemovalSecurityTests` (4 tests pass), all 28 accounts tests pass |
| **F04** | Repair online exam ownership and enrollment permissions | PENDING | | |
| **F05** | Make grades and assessment state server-controlled | PENDING | | |
| **F06** | Persist failed OTP attempts | COMPLETE | `apps/api/accounts/services.py`, `apps/api/accounts/tests/test_api.py` | `OtpAttemptPersistenceSecurityTests` (6 tests pass), 34 accounts tests pass |
| **F07** | Calculate booking prices on the server | PENDING | | |
| **F08** | Enforce booking and payment state transitions | PENDING | | |
| **F09** | Scope idempotency correctly | PENDING | | |
| **F10** | Repair Docker application and data paths | PENDING | | |
| **F11** | Configure trusted HTTPS proxy handling | PENDING | | |
| **F12** | Resolve API and admin route ownership | PENDING | | |
| **F13** | Replace synthetic backups with actual backups | PENDING | | |
| **F14** | Replace unconditional production-readiness results | PENDING | | |
| **F15** | Add missing disaster recovery migration | PENDING | | |
| **F16** | Repair exam question, answer, and grading writes | PENDING | | |
| **F17** | Align proctoring batch contract | PENDING | | |
| **F18** | Implement expiring subscription entitlements | PENDING | | |
| **F19** | Implement working OTP delivery | PENDING | | |
| **F20** | Enforce two-person payout approval | PENDING | | |
| **F21** | Connect administrative operations to authoritative data | COMPLETE | `apps/api/admin_dashboard/views.py`, `apps/api/admin_dashboard/urls.py`, `apps/api/admin_dashboard/tests.py`, `apps/web/app/api/admin/users/route.ts` | `AdminUserManagementSecurityTests` (7 tests pass), authoritative DB transactions & audit log |
| **F22** | Isolate browser storage by account | PENDING | | |
| **F23** | Repair offline draft synchronization | PENDING | | |
| **F24** | Repair populated account data exports | PENDING | | |
| **F25** | Repair portable video delivery and CSP | PENDING | | |
| **F26** | Preserve locale and repair public route metadata | PENDING | | |
