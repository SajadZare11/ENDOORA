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
