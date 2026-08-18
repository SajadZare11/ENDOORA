# Wireframe 5 — Fixed Class Enrollment

**Maturity:** Validated Beta later in the roadmap.

`Public/Learner Classes`
→ `Class detail`
→ **Enroll**
→ `Login if needed`
→ `Eligibility + capacity check`
→ `Price / policy review`
→ `Payment or entitlement step`
→ `Confirmed enrollment`

Alternative capacity path:
`Class full` → **Join waitlist** → `Waitlist confirmation`

## Recovery

- class full: do not continue into payment;
- capacity changed during checkout: revalidate before payment;
- payment cancelled/failed: no enrollment entitlement;
- duplicate callback later: no duplicate enrollment;
- class unavailable: preserve receipt/history if a previous transaction exists.

## Findability target

Public navigation exposes **Classes** directly.
