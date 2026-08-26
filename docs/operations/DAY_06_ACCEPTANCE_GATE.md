# Day 06 acceptance gate — Public bilingual site

Status: **COMPLETE — implementation, automated checks, and local browser acceptance passed.**

## Public experience

- [x] Persian is the default public language and renders RTL.
- [x] English localized routes render LTR and update the real document root.
- [x] Home, how it works, placement, teachers, classes, courses, IELTS, pricing/subscription, guide, About, Contact, Terms, Privacy, and accessibility-facing surfaces exist in the route inventory.
- [x] The public header uses the approved compact navigation and keeps one clear primary call to action.
- [x] Login, registration, placement, and waitlist/contact calls to action lead to real or honestly labelled foundation destinations.
- [x] Waitlist/contact consent and draft legal links are visible.
- [x] Marketing copy avoids unsupported learner counts, outcomes, ratings, or performance claims.
- [x] Desktop, tablet, and 360 px navigation remain usable without horizontal page overflow.
- [x] The global light/night-mode control is available.

## Discoverability and metadata

- [x] Every indexed public page has a localized title and description.
- [x] Canonical and alternate-language links use the configured public origin.
- [x] Open Graph/Twitter metadata and a default share image exist.
- [x] `sitemap.xml` and `robots.txt` are generated.
- [x] Organization/WebSite structured data is present.
- [x] Infrastructure, authenticated, and foundation-only routes are not accidentally treated as public index targets.

## Current automated evidence — 2026-08-26

- [x] `npm run check:public` validates 58 localized public pages and 87 content/SEO contracts.
- [x] `npm run check:public:routes` reaches all 58 public pages, three infrastructure routes, three CTA/support destinations, and the expected not-found state.
- [x] `npm run lint`, clean generated-route `npm run typecheck`, and `npm run build` pass.
- [x] Production build generates 106 routes/pages with the expected public metadata routes.
- [x] Secret-scanner tests and tracked-file scan pass.

## Browser evidence — 2026-08-26

- [x] Persian `/` renders a complete, interactive page with `<html lang="fa" dir="rtl">`.
- [x] English `/en` renders with `<html lang="en" dir="ltr">`.
- [x] Theme switch, language switch, authentication CTA, and placement journey are reachable.
- [x] Desktop, 768 px, and exact 360 px surfaces have no horizontal overflow.
- [x] No relevant console warning, console error, or framework error overlay appears.

## Intentionally separate operational evidence

Production analytics, real search-engine indexing, and field performance monitoring require a deployed origin and real traffic. Their absence from a local audit does not weaken the Day 06 source, route, accessibility, or metadata acceptance above.
