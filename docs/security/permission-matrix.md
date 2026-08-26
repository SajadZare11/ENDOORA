# Endoora Day 07 permission matrix

Endoora enforces authorization on the Django/DRF server. Hiding a button is never treated as permission.

| Capability | Visitor | Learner | Teacher | Editor | Support | Administrator |
|---|---:|---:|---:|---:|---:|---:|
| Read own account | No | Yes | Yes | Yes | Yes | Yes |
| Change own safe account fields | No | Yes | Yes | Yes | Yes | Yes |
| Change own role | No | No | No | No | No | No |
| Accept own consent version | No | Yes | Yes | Yes | Yes | Yes |
| Request own deactivation/deletion | No | Yes | Yes | Yes | Yes | Yes |
| Cancel own pending deletion request | No | Yes | Yes | Yes | Yes | Yes |
| Read another user's private account | No | No | No | No | No by default | Only scoped admin workflows |
| Teacher marketplace capability | No | No | Verified only | No | No | Operational override only |
| Paid-class capability | No | No | Verified + explicitly eligible | No | No | Operational override only |

## Role versus capability

`role=teacher` identifies the account's product role. It does **not** grant teacher verification, marketplace eligibility, or paid-class eligibility. Those capabilities are separate server-side fields and all must be checked by later teacher/marketplace features.

## Reusable negative-test rule

Every later object-bearing API must test at least:
1. owner,
2. legitimately related role,
3. unrelated authenticated user,
4. support,
5. administrator.

Unrelated users must receive a denial without leaking whether sensitive objects exist.

## Day 07 login strategy

Endoora is email-and-password first. An Iranian mobile number is an optional verified fallback identifier; it is normalized to E.164 before storage. Public OTP login is deliberately disabled until a complete login flow and production delivery provider exist. Password recovery returns the same acknowledgement for known and unknown active accounts.
