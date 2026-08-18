# Day 06 acceptance gate

Do not start Day 07 until every relevant item below passes on the founder's Windows/PyCharm machine.

## Protect first

- [ ] `git status` reviewed before copying the overlay.
- [ ] Any existing local modification to `scripts/scan_secrets.py` remains untouched by the Day 06 overlay.
- [ ] PostgreSQL is running before migration/testing.
- [ ] A pre-migration database backup has been created and confirmed non-empty.

## Database

- [ ] `python manage.py showmigrations waitlist` shows `0001_initial` after migration.
- [ ] `python manage.py makemigrations --check --dry-run` reports `No changes detected`.
- [ ] Waitlist table exists and a test signup can be created without exposing email in logs.

## Automated checks

From repository root:

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run check:design`
- [ ] `npm run check:components`
- [ ] `npm run check:public`
- [ ] `npm run build`
- [ ] `python -m unittest scripts.test_scan_secrets`
- [ ] `python scripts\scan_secrets.py`

From `apps\api` with `.venv` active:

- [ ] `python manage.py check`
- [ ] `python manage.py test`
- [ ] `python manage.py makemigrations --check --dry-run`

## Public-route journey

- [ ] `/` is Persian and RTL by default.
- [ ] `/en` is English and LTR inside the public shell.
- [ ] Language switch keeps the visitor on the corresponding route.
- [ ] Home explains the connected learning loop in under 30 seconds.
- [ ] Placement and Start Learning CTAs work.
- [ ] Public route set returns expected 200 responses.
- [ ] An unknown public slug returns 404.
- [ ] Feature pages label beta/foundation maturity honestly.
- [ ] Legal routes visibly say draft/not yet published.
- [ ] Legal routes use noindex and are absent from sitemap.
- [ ] `/sitemap.xml` contains canonical `https://endoora.ir` URLs and Persian/English alternates.
- [ ] `/robots.txt` blocks developer/private/draft paths as intended.
- [ ] Open Graph metadata is unique enough per route and the generated OG image loads.

## Waitlist journey

- [ ] Submitting without consent fails visibly.
- [ ] Valid email + consent succeeds.
- [ ] Repeating the same email is harmless and does not create a duplicate row.
- [ ] Stopping the Django API causes a clear retryable error, not a fake success.
- [ ] No optional third-party analytics request appears in the browser Network panel before or after consent on Day 06.

## Mobile / accessibility / console

- [ ] 360px width has no horizontal page overflow.
- [ ] Header/mobile menu is keyboard usable.
- [ ] Focus is visible on links, buttons, checkbox, and email field.
- [ ] Persian line-height is comfortable.
- [ ] Brand motto and email input remain LTR inside Persian UI.
- [ ] Browser Console has no new red runtime error.
- [ ] API log has no unhandled exception during waitlist success/failure tests.

## Lighthouse baseline

Record a mobile Lighthouse run for `/` in Chrome DevTools. Save the four numbers below in a private/local Day 06 note or the project state after verification:

- Performance: ____
- Accessibility: ____
- Best Practices: ____
- SEO: ____

Do not invent a target pass score on Day 06; the baseline is for Day 55 comparison.

## Success gate

The public shell is deployable, Persian-first, bilingual, SEO-ready, honest about limitations, and a visitor can understand the product and next step in under 30 seconds.
