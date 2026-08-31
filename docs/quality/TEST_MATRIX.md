# Endoora Test Matrix

## Day 03 status

| Layer | Status | Evidence / next action |
|---|---|---|
| UI package typecheck | PASS in generated workspace | `tsc --noEmit -p packages/ui/tsconfig.json` |
| Web typecheck | PASS in generated workspace | `tsc --noEmit -p apps/web/tsconfig.json` |
| Frontend lint | PASS in generated workspace | ESLint executed directly against `apps/web` |
| Design token smoke test | PASS | 14 AA contrast pairs + focus + reduced motion + logical CSS + centralized colors |
| Next.js production build | PENDING founder machine | Sandbox could not fetch Linux SWC; run `npm run build` on Windows |
| Backend checks/tests | PENDING founder machine | Backend unchanged; sandbox Python lacks project dependencies |
| Migration drift | PENDING founder machine | No Day 03 model change; run Django dry-run check |
| 360 px browser | PENDING founder machine | Verify `/design-system` all theme/direction combinations |
| 768 px tablet browser | PENDING founder machine | Verify `/design-system` all theme/direction combinations |
| Desktop browser | PENDING founder machine | Verify `/design-system` all theme/direction combinations |
| Keyboard focus | PENDING founder machine | Tab through toolbar and focus demo |
| Dark mode | PENDING founder machine | Verify semantic text remains readable |
| RTL/LTR mixed content | PENDING founder machine | Check Persian UI + English/IPA/URL/email/numbers |
| Reduced motion | STATIC PASS / manual optional | Token rule present; optionally emulate reduced motion in DevTools |
| API logs | PENDING founder machine | Day 03 makes no API code changes; confirm no regression |
| Worker logs | N/A | No background worker exists yet |
| Secret scanner regression | PASS in generated workspace | 5 unit tests cover placeholders and realistic secrets |
| Secret scan | PASS in generated workspace | Founder should repeat before commit |

## Required later test layers

- Unit rules/transforms
- Model constraints
- Permission/negative cross-user tests
- API contract tests
- Migration tests
- Worker retry/idempotency tests
- Component tests
- Playwright critical journeys
- Accessibility checks
- 360 px + desktop manual tests
- AI schema/evaluation tests
- Payment tamper/replay/duplicate tests
- Concurrency/load tests where applicable

## Day 04 status

| Layer | Status | Evidence / next action |
|---|---|---|
| UI package typecheck | PASS in generated workspace | `npm run typecheck` |
| Contracts typecheck | PASS in generated workspace | `npm run typecheck` |
| Web typecheck | PASS in generated workspace | `npm run typecheck` |
| Frontend lint | PASS via ESLint Node entry point | Windows founder should repeat `npm run lint` |
| Day 03 token regression | PASS | `npm run check:design` |
| Day 04 component smoke | PASS | 29 visual examples + labelled errors + keyboard tabs + modal focus semantics + 44px targets + responsive data/chart/recovery checks |
| Next.js production build | PENDING founder machine | Run `npm run build` on Windows because sandbox has Windows SWC mismatch |
| Backend checks/tests | PENDING founder machine | Backend unchanged; run normal Django regression |
| Migration drift | PENDING founder machine | No Day 04 model changes |
| 360 px browser | PENDING founder machine | Verify mobile table cards, role bottom nav, overlays, forms, no overflow |
| Desktop browser | PENDING founder machine | Verify sidebar/table/dialog/stepper |
| Keyboard-only journey | PENDING founder machine | Form -> error summary -> tabs -> dialog/drawer -> stepper |
| Dialog focus restoration | STATIC source check PASS / browser pending | Native `<dialog>` + saved previous focus |
| Stepper refresh resume | STATIC source check PASS / browser pending | Current step ID persisted in localStorage |
| Chart accessibility | STATIC PASS / browser pending | Summary + semantic data table exists |
| AI result transparency | STATIC PASS | AI label, evidence, confidence, limitations, retry/save/report/human review |
| Secret scan | PENDING founder repeat | No Day 04 secret-bearing feature added |
| API logs | PENDING founder machine | No backend change; confirm no regression |
| Worker logs | N/A | No background worker feature added by Day 04 |

## Day 05 status

| Layer | Status | Evidence / next action |
|---|---|---|
| IA required-file/static check | PASS in generated package | `node scripts\check-information-architecture.mjs` |
| Public/learner/teacher sitemap | STATIC PASS | canonical role navigation present |
| Account consolidation | STATIC PASS | low-frequency tools grouped under Account |
| Six critical wireframes | STATIC PASS | exactly six files |
| Route inventory | STATIC PASS | route owner/guard/CTA/deep-link/state columns present |
| Day 05 IA prototype | SOURCE PASS / browser pending | `/design-system/information-architecture` |
| Frontend lint/typecheck | PENDING founder after copy | run normal regression |
| Day 03/04 regression checks | PENDING founder after copy | `check:design`, `check:components` |
| Next.js production build | PENDING founder Windows | `npm run build` |
| Backend regression | PENDING founder confirmation | Day 05 has no backend change |
| Migration drift | PENDING founder confirmation | expect no changes |
| 360 px browser | PENDING founder | IA prototype must not overflow |
| Desktop browser | PENDING founder | role hierarchy and anchors usable |
| Five-person hallway test | HUMAN PENDING | all five tasks ≤3 navigation decisions |
| Browser console | PENDING founder | no new errors |
| Secret scan | PENDING founder repeat | no secret-bearing feature added |


## Day 08 status

| Layer | Status | Evidence |
|---|---|---|
| Django system check | PASS | `python manage.py check` — no issues |
| Backend regression suite | PASS | `python manage.py test` — 41 tests passed |
| Migration drift | PASS | `python manage.py makemigrations --check --dry-run` — no changes detected |
| Registration API | PASS | Browser registration created persisted learner account |
| Login API | PASS | Browser login established authenticated session |
| Password reset | PASS | OTP-based reset completed; new password authenticated successfully |
| Learner/teacher role separation | PASS | Role-specific profile tests reject wrong-role access |
| Cross-user isolation | PASS | Backend test prevents unrelated learner-profile access |
| Registration privilege safety | PASS | Self-registration cannot create administrative role |
| Teacher capability separation | PASS | Verification intent leaves verified/marketplace/paid-class capabilities false |
| Consent requirement | PASS | Terms and Privacy required during registration/onboarding completion |
| Sensitive onboarding drafts | PASS | Sensitive-key patterns rejected |
| Learner onboarding | PASS | Profile saved, resumed and completed |
| Learner refresh persistence | PASS | Saved onboarding data remained after browser refresh |
| Teacher onboarding | PASS | Profile completed with verification intent |
| Account Summary API | PASS | Returned account/profile/onboarding/session/data-control/section state |
| Profile/settings page | PASS | Profile update persisted after refresh |
| Preferred locale | PASS | Persian/English preference persisted after refresh |
| Current-session page | PASS | Current session and expiry displayed |
| Data export | PASS | Request created and persisted after refresh |
| Data-export idempotency | PASS | Backend test covers pending/processing request reuse |
| Deletion UX guard | PASS | Button disabled until exact `DELETE` entered |
| Destructive deletion execution | NOT RUN | Intentionally not submitted during Day 08 manual verification |
| Account hub | PASS | Seven Account destinations reachable |
| Library foundation | PASS | Real route, explicitly marked foundation |
| Usage foundation | PASS | Real route, explicitly marked foundation |
| Plan foundation | PASS | Real route, explicitly marked foundation |
| Billing foundation | PASS | Real route, explicitly marked foundation |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js production build | PASS | `npm run build`; all Day 08 routes generated successfully |
| 360 px browser | PASS | Auth/onboarding/Account pages tested without horizontal overflow |
| Keyboard navigation | PASS | Account/profile/session/data-control controls reachable without mouse |
| Persian RTL | PASS | Manual Day 08 smoke test |
| English LTR | PASS | Language switch and persisted locale verified |
| Browser/API redirect regression | PASS | `/api/auth/csrf/` and `/backend/api/auth/csrf/` return HTTP 200 |
| Multi-device session management | DEFERRED | Current-session endpoint only |
| Export file generation/download | DEFERRED | Day 08 tracks requests only |
| Automated browser E2E | DEFERRED | Manual browser acceptance used for Day 08 |
| Secret scanner | PENDING final repository gate | Run immediately before commit |

## Day 09 learner dashboard

- Anonymous -> learner dashboard: denied.
- Teacher -> learner dashboard: denied server-side.
- Learner -> learner dashboard: allowed.
- First-time learner -> Placement is the single primary action.
- No learning evidence -> no skill estimate and no path percentage.
- Next-best-action resolver priority: urgent assignment > mission > SRS > placement > class > general learning.
- Dashboard analytics -> bounded event/action identifiers only.
- 360 px -> mobile bottom navigation and dominant Today action.
- Offline/retry -> visible recovery behavior.
- Persian/English -> RTL/LTR switch verified.

## Day 10 teacher dashboard

| Layer | Status | Evidence |
|---|---|---|
| Django system check | PASS | `python manage.py check` |
| Teacher-focused backend tests | PASS | `python manage.py test teachers` |
| Full backend regression suite | PASS | `python manage.py test` |
| Migration drift | PASS | `python manage.py makemigrations --check --dry-run` — no changes detected |
| Anonymous teacher dashboard access | PASS | Backend test expects HTTP 401 |
| Non-teacher access | PASS | Backend test expects HTTP 403 |
| Unverified capability gating | PASS | Marketplace and paid-class effective capabilities remain false; fixed class locked |
| Verified teacher empty workspace | PASS | Verified capability state allowed without fabricated class/earnings data |
| Dashboard privacy redaction | PASS | Forbidden learner-content keys absent from API payload |
| Dashboard query bound | PASS | Service assertion uses one domain query |
| Analytics event bounds | PASS | Known action accepted; unknown/raw identifier rejected |
| Primary-action priority | PASS | Verification > session > request > grading > safe first-class action |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js production build | PASS | `npm run build`; teacher route family generated |
| Day 10 static source gate | PASS | `node scripts/check-day10.mjs` |
| Secret scan | PASS | `python scripts/scan_secrets.py` |
| Whitespace diff gate | PASS | `git diff --check`; line-ending conversion warnings only |
| Persian-first locale | PASS static / local shell reported working | Day 10 checker + founder local run |
| English option | PASS static / local shell reported working | Teacher shell implements locale switch |
| 360 px teacher navigation | PASS static; final manual gate retained | Mobile bottom-nav rule verified by checker; acceptance checklist remains authoritative |
| Raw writing/audio/conversation disclosure | PASS automated | API payload forbidden-key regression test |
| Payment/finance behavior | N/A | Day 10 has no payment/earnings transaction domain |
| Worker/Celery behavior | N/A | Day 10 adds no background job |
| Database migration | N/A | No Day 10 model change |
| Automated browser E2E | DEFERRED | Future Playwright coverage |

## Day 11 operations coverage
- Audit event creation for privileged changes — automated
- Audit ORM immutability — automated
- Sensitive snapshot redaction — automated
- SystemSetting type/secret/bypass validation — automated
- FeatureFlag environment/rollout/dependency validation — automated
- Support cross-domain/profile restriction — automated policy test + manual admin check
- OneTimeCode hash hidden in admin — static + manual
- Endoora Operations mobile/Persian summary — manual 360 px
- Day 10 regression — `node scripts\check-day10.mjs`

## Day 12 taxonomy tests

- Import is idempotent.
- A new release can change a Persian label without changing the node UUID.
- Rewriting an existing release version with different content is rejected.
- Prerequisite cycles are rejected.
- Slugs are unique at the database boundary.
- Taxonomy API defaults to Persian and supports explicit English.
- Objective filtering by CEFR works.
- Deprecated nodes remain traceable but are hidden from default selectors.

## Day 12 taxonomy acceptance
| Layer | Status | Evidence |
|---|---|---|
| Pre-migration backup | PASS | 69,383-byte PostgreSQL custom-format backup verified and Git-ignored |
| Django migration | PASS | `taxonomy.0001_initial` |
| Dry-run import | PASS | 62 nodes / 62 revisions / 9 prerequisites; transaction rolled back |
| Real import | PASS | `day12-v1` imported |
| Idempotent re-import | PASS | 0 creates / 0 updates / 0 revisions / 0 prerequisite changes |
| Database counts | PASS | 1 release / 62 nodes / 62 revisions / 9 active prerequisites |
| Taxonomy-focused tests | PASS | `python manage.py test taxonomy` — 12 tests |
| Full backend regression | PASS | `python manage.py test` — 108 tests in the current regression suite |
| Migration drift | PASS | `makemigrations --check --dry-run` — no changes |
| Static Day 12 gate | PASS | `python scripts/check_day12.py` |
| Persian-default API | PASS | manual API verification |
| Explicit English API | PASS | manual `lang=en` verification |
| Django admin protections | PASS | stable identifiers/read-only protections verified |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js production build | PASS | `npm run build` |
| 360 px browser | PASS | manual regression |
| Desktop browser | PASS | manual regression |
| Persian RTL | PASS | manual regression |
| English LTR | PASS | manual regression |
| Secret scan | PASS | `python scripts/scan_secrets.py` |
| Whitespace diff gate | PASS | `git diff --check` |

## Day 13 question-bank tests

- nine question types
- published/retired immutability
- unlicensed publication blocked
- objective-kind enforcement
- answer normalization
- learner answer-key leak prevention
- post-submission explanation
- support/editor negative permission boundary
- retired historical preservation
- draft-only idempotent sample import

## Day 13 question-bank acceptance

| Layer | Status | Evidence |
|---|---|---|
| Pre-migration backup | PASS | Verified private PostgreSQL custom-format backup |
| Django migration | PASS | `questions.0001_initial` |
| Nine question types | PASS | model/static/unit tests |
| Published immutability | PASS | backend test + manual admin attempt |
| Copyright publication gate | PASS | unlicensed publication rejected |
| Taxonomy objective links | PASS | wrong-kind link rejected |
| Answer normalization | PASS | backend fixture |
| Learner answer-key redaction | PASS | serializer/network regression |
| Support/editor permissions | PASS | 403 support / editor allowed |
| Retired historical record | PASS | stored; public endpoint hides it |
| JSON import | PASS | draft-only; second identical import skips |
| Django system check | PASS | `python manage.py check` |
| Question tests | PASS | `python manage.py test questions` |
| Full backend regression | PASS | `python manage.py test` |
| Migration drift | PASS | `makemigrations --check --dry-run` |
| Frontend lint | PASS | `npm run lint` |
| TypeScript | PASS | `npm run typecheck` |
| Next.js build | PASS | `npm run build` |
| Persian RTL / English LTR | PASS | manual preview |
| 360 px / desktop | PASS | manual preview |
| Secret scan | PASS | `python scripts/scan_secrets.py` |
| Whitespace diff | PASS | `git diff --check` |
