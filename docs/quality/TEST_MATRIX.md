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
