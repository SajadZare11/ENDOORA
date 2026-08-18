# Endoora Day 07 authentication threat model

## Scope

Day 07 establishes authentication, roles, consent history, Iranian mobile normalization, mock OTP, session security, throttling, deactivation, deletion-request foundations, and reusable object-level permission helpers.

## Threats and controls

| Threat | Day 07 control |
|---|---|
| User self-promotes to teacher/admin | `role` is read-only through self-service APIs; privileged roles are server/admin managed |
| Teacher role bypasses verification | verification and paid capabilities are separate fields |
| Cross-user account access / IDOR | reusable object permission helper + negative test |
| Password guessing | Django password hashing/validators + scoped API throttle; infrastructure-level controls still required later |
| OTP database leak | only Django password hashes of OTP values are stored |
| OTP replay | successful OTP is marked consumed |
| OTP brute force | short expiry, attempt cap, request/verify throttles |
| OTP log leak | mock provider does not print the raw code; debug code is returned only when DEBUG + mock mode |
| User enumeration | login failure message is generic |
| CSRF on cookie-based login | CSRF token endpoint + protected login endpoint + trusted origins |
| Cross-origin credential abuse | explicit CORS allow-list and credentials setting |
| Stolen session cookie | HttpOnly session cookie, SameSite policy, key rotation on login; production Secure cookies already enabled |
| Deactivated account continues authenticating | `is_active=False`; Django ModelBackend rejects inactive users |
| Destructive deletion | deletion is a request record with delay; no hard-delete job is executed on Day 07 |
| Minor-account unsafe messaging | no messaging is enabled; Day 08 collects age band and later messaging requires age-aware policy |

## Important limitation

DRF throttling is application-level abuse control, not a complete brute-force or denial-of-service defense. Reverse-proxy/WAF and stronger operational defenses are required before production.

## Day 07 non-goals

- Paid SMS provider
- unrestricted phone-only production login
- teacher document verification
- full device history UI
- production deletion worker
- community or direct messaging
