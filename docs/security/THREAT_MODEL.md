# Endoora Threat Model — Day 01 Baseline

## Primary assets
- User identities/sessions
- Learner evidence, writing, audio, messages
- Teacher verification information
- Payment/order/entitlement state
- Financial and XP ledgers
- OpenRouter/ZarinPal/SMS/storage credentials
- Admin privileges
- Copyright/licensing records

## Primary threats
- Account takeover / brute force / OTP abuse
- Privilege escalation
- IDOR / cross-user data access
- CSRF/XSS/SQL injection/SSRF/path traversal
- Malicious uploads
- AI prompt injection / unsafe structured output
- Provider-key exposure
- Payment replay/tamper/duplicate callback
- Community abuse and adult-minor unsafe contact
- Excessive support/admin privilege
- Sensitive-data logging
- Destructive migrations / missing backups

## Required controls
Server-side authorization, throttling, secure session handling, CSRF/CORS controls, object-level permission tests, upload validation, schema-validated AI output, backend-only provider calls, idempotency, immutable ledgers, least privilege, audit logs, retention/deletion controls, backups, and incident response.

Detailed threat cases are expanded when each feature is implemented.
