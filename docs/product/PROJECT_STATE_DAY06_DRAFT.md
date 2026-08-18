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

## Known Day 06 limitations

- Legal text is intentionally draft and not launch-ready.
- Placement, accounts, teacher marketplace, IELTS engine, payments, and other functional product features are described publicly but remain owned by their later roadmap days.
- The Premium value is centralized marketing copy only until Day 41 creates database/admin plan pricing.
- Lighthouse numbers must be recorded from the founder's Chrome/Windows environment.

## Exact next day

Day 07 — authentication, roles, consent, and account security — only after all Day 06 checks pass, migration is backed up, and the Git checkpoint is pushed.
