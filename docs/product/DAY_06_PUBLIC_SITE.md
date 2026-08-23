# Day 06 — Public Endoora Website and SEO Foundation

## Product rule

The public website is Persian-first and RTL. English is available through `/en` routes. `Endoora` and `A new door to your English` remain English brand copy.

## Public route model

Persian default:

- `/`
- `/how-it-works`
- `/placement`
- `/teachers`
- `/classes`
- `/learn`
- `/skills`
- `/ielts`
- `/culture`
- `/resources`
- `/pricing`
- `/help`
- `/about`
- `/contact`
- `/status`

English alternatives use `/en` before the same path.

The earlier non-functional placement UI is preserved at `/placement/demo` with `noindex`; `/placement` is the canonical public explanation until the real assessment engine is implemented on Days 14–17. Teacher resources remain at `/teacher/resources`, while `/resources` is the public learning-resources route.

Feature landing pages:

- `/features/learner-twin`
- `/features/daily-mission`
- `/features/mistake-genome`
- `/features/writing-mentor`
- `/features/roleplay-voice`
- `/features/teachers-classes`
- `/features/ielts-practice`
- `/features/premium`

Draft legal routes live under `/legal/*` and `/en/legal/*`. They are intentionally noindex and clearly labelled as drafts.

## SEO

- canonical base: `ENDOORA_PUBLIC_URL`, defaulting to `https://endoora.ir`;
- unique page title + description from route content;
- Persian and English alternates;
- generated sitemap and robots;
- generated Open Graph image;
- WebSite JSON-LD on Home;
- draft legal pages excluded from the sitemap and indexing.

## Waitlist privacy

The waitlist records only:

- normalized email;
- interface locale;
- allowlisted source string;
- landing path;
- explicit consent version and timestamp.

It does not store raw referrer history, browsing behavior, or third-party analytics IDs. Duplicate email submission is idempotent.

## Analytics consent foundation

Day 06 loads no third-party analytics script. The consent component stores the visitor's optional-analytics preference only in that browser. Actual analytics integration belongs to its roadmap day and must respect this choice.

## Visual direction

The accepted visual references and copy constraints live in `docs/uiux/day06-public-site/README.md`. Generated concept boards are retained as design evidence only; the product uses code-native, evidence-neutral previews and does not publish synthetic learner data from those boards.

## Pricing note

The 90-day Premium / 420,000 toman launch value is centralized in `apps/web/lib/public-site.ts` for Day 06 marketing only. It is not used for entitlement or payment. Day 41 must move this display data to the admin/database Plan/Price source of truth.
