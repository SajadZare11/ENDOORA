# Day 03 acceptance gate

Do not start Day 04 until every item below passes on the founder's Windows/PyCharm machine.

## Automated checks

- [ ] From repository root, `npm run lint` passes.
- [ ] From repository root, `npm run typecheck` passes.
- [ ] From repository root, `npm run check:design` prints the Day 03 pass message.
- [ ] From repository root, `npm run build` completes successfully.
- [ ] From `apps\api` with the API virtual environment active, `python manage.py check` passes.
- [ ] `python manage.py test` passes.
- [ ] `python manage.py makemigrations --check --dry-run` reports no model changes.
- [ ] From repository root, `python scripts\scan_secrets.py` passes.

## Browser verification

Start API + web as documented, then open `http://localhost:3000/design-system`.

- [ ] Desktop: Light + RTL is readable.
- [ ] Desktop: Light + LTR is readable.
- [ ] Desktop: Dark + RTL is readable.
- [ ] Desktop: Dark + LTR is readable.
- [ ] 360px: all four combinations fit without horizontal page overflow.
- [ ] 768px tablet: all four combinations fit without layout breakage.
- [ ] Persian body text has comfortable line spacing.
- [ ] English example, IPA, email, URL, and numeric score stay LTR inside RTL UI.
- [ ] Achievement Amber is never used as normal body text on white.
- [ ] Learning Teal filled badge remains readable with Deep Navy text.
- [ ] Success/warning/error/info states remain understandable without relying only on color.
- [ ] Press `Tab` repeatedly: every interactive control receives a clearly visible focus ring.
- [ ] Browser Console has no new red runtime error from the design-system route.

## Day 02 regression

- [ ] `http://localhost:3000` still loads the Endoora developer landing page.
- [ ] With API/database/Redis running, the page still shows `API connected`.
- [ ] With the API stopped, the page still shows the understandable `API unavailable` state.
- [ ] `http://127.0.0.1:8000/api/health/` still returns the expected health payload when dependencies are healthy.

## Git gate

Before commit, `git status` must not show `.env`, virtual environments, `node_modules`, `.next`, local databases, uploads, or secrets.

Recommended commit message:

`Day 03: Build the Endoora bilingual design-token and brand system`
