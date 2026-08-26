# Day 04 Acceptance Gate — Accessible Component Library

Day 04 is complete only after the following checks pass on the founder's Windows/PyCharm environment.

## Automated checks

Run from the repository root:

- `npm run lint`
- `npm run typecheck`
- `npm run check:design`
- `npm run check:components`
- `npm run build`

Backend regression (no Day 04 backend changes):

- `python manage.py check`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`

Secret regression:

- `python -m unittest scripts.test_scan_secrets`
- `python scripts\scan_secrets.py`

Expected Day 04 static-check line:

`Day 04 component checks passed: 29 visual examples, labels/errors, keyboard tabs, modal focus semantics, 44px targets, responsive table/cards, chart table fallback, recovery states, and logical CSS.`

## Manual component journey

Open `http://localhost:3000/design-system/components`.

- [ ] Primary, secondary, tertiary, destructive, loading, disabled, and icon buttons render and have visible focus.
- [ ] Every form control has a visible label.
- [ ] Error summary links focus/navigate to the matching invalid field.
- [ ] Tabs work with mouse, Tab, Arrow keys, Home, and End.
- [ ] Dialog opens modally, Escape closes it, and focus returns to its opener.
- [ ] Drawer behaves as a modal and does not leave hidden background controls keyboard-reachable.
- [ ] Toast is supplemental; inline/status feedback remains available for meaningful errors.
- [ ] Stepper supports Back, Save and Continue Later, Cancel, Continue, and refresh resume.
- [ ] At 360px the data table becomes labelled cards.
- [ ] Accessible chart has both summary text and a data table.
- [ ] AI result visibly shows AI-generated status, evidence, limitations, and control actions.
- [ ] Empty, permission-denied, offline, and retry states are understandable without color alone.
- [ ] Role shell shows desktop sidebar and mobile bottom navigation.
- [ ] Account navigation groups low-frequency administrative tools.
- [ ] No horizontal overflow at 360px.
- [ ] Browser console has no new error while running the interactions above.

## Security / data / migration

- No database migration is required.
- No payment, authentication, permissions, uploads, or persistent user data are changed.
- The demo stepper stores only a non-sensitive current-step ID in browser local storage.
- Provider status components accept public-safe labels/messages only; no API keys, provider IDs, callbacks, or secrets belong in their props.

## Current implementation evidence — 2026-08-24

Automated frontend/security checks:

- `npm run check:design` — PASS; 14 WCAG AA contrast pairs plus focus, reduced motion, logical CSS, and centralized colors.
- `npm run check:components` — PASS; all 29 required component examples and accessibility contracts.
- `npm run lint` — PASS.
- `npm run typecheck` — PASS across UI, contracts, and web workspaces.
- `npm run build` — PASS; `/design-system` and `/design-system/components` generated successfully.
- secret-scanner unit tests — PASS, 5 tests.
- secret scan — PASS.
- `git diff --check` — PASS; only line-ending conversion warnings were reported.

In-app Browser evidence:

- Page identity, non-blank content, and framework-overlay checks — PASS.
- Console error/warning check — PASS; no relevant entries.
- Primary-button status update — PASS.
- RTL tab Arrow-key selection — PASS.
- Dialog focus entry, Escape close, and opener-focus restoration — PASS.
- Stepper progression from Step 1 to Step 2 — PASS.
- 360px table-to-card and sidebar-to-bottom-navigation fallbacks — PASS.
- 360px horizontal overflow check — PASS.
- Five mobile navigation labels receive non-overlapping grid cells — PASS.

Current follow-up audit — 2026-08-26:

- The complete Django regression now passes: system check, 103 tests, and no migration drift.
- Representative keyboard behavior was exercised in-browser: tab selection with Arrow keys, dialog initial focus, Escape dismissal, and focus restoration.
- Save/resume was confirmed across refresh, the 360 px table/card fallback and five-item bottom navigation were visible, and there was no horizontal overflow or console error.
- The static checker still accounts for all 29 component examples, exceeding the 25-component roadmap minimum.

## Success gate

At least 25 core components have visual examples, keyboard-only completion works for the sample long form and overlays, 44px targets are present, the mobile table fallback works, and no automated check fails.
