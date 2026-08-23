# Endoora Project State — Day 06 Draft

This file is a Day 06 draft. Copy its verified facts into `docs/product/PROJECT_STATE.md` only after the Day 06 acceptance gate passes on Windows.

## Current checkpoint

- Roadmap day implemented in overlay: Day 06 — public website shell and SEO foundation.
- Day 05 IA evidence is already present on GitHub (`sitemap.md`, `user-flows.md`, `account-hub.md`, ADR-002).
- Existing `PROJECT_STATE.md` on GitHub still reports Day 04 and must be refreshed after Day 06 verification.
- Schema change: new `waitlist.WaitlistSignup` table via `0001_initial`.
- Backend foundation otherwise remains the Day 02 Django/DRF scaffold.

## Day 06 features

- Persian-first public Home and routes.
- English `/en` alternatives.
- Responsive public header/footer and language switch.
- Core-loop marketing copy with honest maturity/limitations.
- Feature landing pages.
- Pricing shell with centralized launch display value.
- FAQ/help/about/contact/status foundations.
- Draft/noindex legal pages.
- metadata, canonical/alternate URLs, sitemap, robots, OG image, JSON-LD.
- consent-aware waitlist API and same-origin Next.js proxy.
- optional-analytics consent UX with no third-party script loaded.
- professional editorial homepage treatment with a connected desktop/mobile learning loop, evidence-neutral product previews, trust rail, AI-plus-human explanation, FAQ accordions, and focused early-access section.
- static contract coverage for all marketing CSS module references.
- HTTP smoke coverage for 58 localized public pages, three SEO infrastructure routes, three CTA/support routes, unique metadata, draft legal `noindex`, and an explicit 404.
- route collisions resolved: public `/placement` and `/resources`; the earlier placement UI is preserved as a clearly labelled noindex demo at `/placement/demo`.

## Known Day 06 limitations

- Legal text is intentionally draft and not launch-ready.
- Placement, accounts, teacher marketplace, IELTS engine, payments, and other functional product features are described publicly but remain owned by their later roadmap days.
- The Premium value is centralized marketing copy only until Day 41 creates database/admin plan pricing.
- Lighthouse numbers must be recorded from the founder's Chrome/Windows environment.
- The local in-app browser rejected localhost control under its URL safety policy, so desktop/360 screenshots and interactive visual QA remain manual.
- The existing `apps/api/.venv` launcher points to a removed Python 3.10 executable. Django checks and waitlist success/duplicate database journeys remain blocked until that environment is repaired; no replacement environment or dependency installation was performed automatically.

## Exact next day

Day 07 — authentication, roles, consent, and account security — only after all Day 06 checks pass, migration is backed up, and the Git checkpoint is pushed.
