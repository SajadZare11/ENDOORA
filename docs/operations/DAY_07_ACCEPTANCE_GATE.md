# Day 07 acceptance gate

## Automated
- [ ] `python manage.py check`
- [ ] `python manage.py test`
- [ ] `python manage.py makemigrations --check --dry-run`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `python scripts\scan_secrets.py`

## Security
- [ ] Self-service account update cannot change `role`.
- [ ] Teacher role alone does not grant verified-teacher capability.
- [ ] Unrelated-user object permission test fails.
- [ ] Inactive user cannot authenticate.
- [ ] Login throttle reaches HTTP 429.
- [ ] OTP is hashed, expires, is one-time, and has an attempt cap.
- [ ] Consent type + version are persisted.
- [ ] Production secure-cookie settings remain enabled.
- [ ] CORS and CSRF origin lists are explicit, not wildcard.

## Iranian localization
- [ ] `09123456789`, `+989123456789`, `989123456789`, and `00989123456789` normalize to `+989123456789`.
- [ ] Error payloads used by auth include Persian and English text.
- [ ] Persian remains the product's default interface contract; English remains optional.

## Data protection
- [ ] Pre-Day-07 PostgreSQL dump exists outside Git and is non-empty.
- [ ] Waitlist fixture was exported before database rebuild.
- [ ] Legacy users were exported before database rebuild.
- [ ] Waitlist rows were restored after migration.
- [ ] Legacy users were imported if any existed.

## Git
- [ ] `git status` contains only intended Day 07 changes.
- [ ] Day 07 commit pushed to `origin/main`.
