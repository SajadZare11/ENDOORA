# Day 09 acceptance gate

## Objective

Build a calm, action-oriented learner application shell that answers “What should I do now?” within five seconds, using one aggregated endpoint and no unsupported learning precision.

## Learner shell

- [x] Learner role is enforced by the aggregated API.
- [x] Public marketing header and footer do not wrap the learner application.
- [x] Persian-first RTL shell exists.
- [x] English LTR switch exists and persists to the account.
- [x] Desktop navigation is simplified.
- [x] Mobile navigation contains exactly five destinations.
- [x] Account remains the destination for profile, privacy, plan and billing controls.
- [x] Global night-mode control remains available.
- [x] Keyboard focus and reduced-motion states exist.

## Learner Home

- [x] One dominant Today action appears above the fold.
- [x] First-time learners are guided to Placement.
- [x] The primary action explains why it was selected.
- [x] Path preview uses workflow states rather than fabricated progress.
- [x] Skill snapshot only appears from Learner Twin evidence.
- [x] SRS due count uses real due items.
- [x] Daily mission uses an existing mission record and does not create one during dashboard loading.
- [x] Assignment, class, course, XP/streak and notification states are honest when their domains have no data.
- [x] Detailed account destinations are not duplicated on the dashboard.
- [x] Offline state preserves already-loaded information.

## API and instrumentation

- [x] `/api/dashboard/home/` is the single aggregated dashboard endpoint.
- [x] Anonymous requests receive `401`.
- [x] Non-learner requests receive `403`.
- [x] Dashboard views are instrumented without raw learner content.
- [x] Primary CTA clicks are instrumented without blocking navigation.
- [x] Event names and action identifiers are allow-listed.
- [x] Mission, path and skill payloads use typed serializers.

## Visual design

- [x] Design follows the calm personal-learning-room hierarchy from the Endoora PDFs.
- [x] Endoora Blue and Growth Teal lead the palette.
- [x] Glass depth is restrained to navigation and primary surfaces.
- [x] The first-time placement object is a purpose-built optimized image asset.
- [x] Cards use soft geometry and controlled spacing.
- [x] No public marketing navigation, footer, fake charts or generic admin layout appears.

## Automated verification

- [x] Focused dashboard backend tests pass.
- [x] Full backend test suite passes (103 tests).
- [x] Django system check passes.
- [x] Migration drift check passes.
- [x] Frontend lint passes with no warnings.
- [x] Frontend typecheck passes.
- [x] Production build passes (106 static/dynamic routes collected).
- [x] `npm run check:day09` passes.
- [x] Design-token and information-architecture checks pass.
- [x] Secret scan and scanner tests pass (5 scanner tests).
- [x] `git diff --check` passes.

## Browser acceptance

- [x] Learner dashboard page identity is correct.
- [x] First-time learner sees Placement as the one primary action.
- [x] CTA click reaches Placement and emits its bounded event (`204`).
- [x] Persian RTL rendering passes.
- [x] English LTR preference persists after refresh.
- [x] Notification empty state is usable.
- [x] Desktop visual hierarchy passes at 1440 × 900.
- [x] 360 px mobile hierarchy passes without horizontal overflow.
- [x] Loading, authentication, permission and retry gates are represented.
- [x] No relevant framework overlay, console error or warning appears.

## Known deferred work

- [ ] Full Daily Mission activity engine.
- [ ] Assignment domain and learner assignment detail.
- [ ] Class/course relationship domain.
- [ ] Production notification inbox.
- [ ] XP/streak calculation from durable learning events.
- [ ] Final skill estimates and path progress from sufficient evidence.

Deferred items are not Day 09 blockers. Day 09 must expose honest empty/unavailable states and must not simulate their data.

## Gate status

**Implementation: COMPLETE**

**Automated and browser acceptance: COMPLETE**
