# Endoora Regression Checklist

Apply as features appear:

- [ ] Correct role can access feature
- [ ] Unrelated user cannot access object
- [ ] Persian RTL renders correctly
- [ ] English/IPA/URLs/emails/answers isolate as LTR
- [ ] 360 px mobile journey works
- [ ] Desktop journey works
- [ ] Loading state
- [ ] Empty state
- [ ] Error/retry state
- [ ] Offline/interrupted state where relevant
- [ ] Expired-session state where relevant
- [ ] Permission-denied state
- [ ] No secrets/answer keys/private content in frontend/logs
- [ ] Duplicate submission is safe where relevant
- [ ] Browser/API/worker logs have no unhandled errors
- [ ] Documentation matches behavior

## Day 03 design-system regression additions

- [ ] No raw hex/rgb color is introduced outside the centralized token stylesheet unless explicitly documented as an exception.
- [ ] No physical `left`/`right` layout property is introduced where a logical CSS property is available.
- [ ] Endoora Blue primary action with white text remains AA for normal text.
- [ ] Achievement Amber is not used as normal body text on white.
- [ ] Learning Teal filled surfaces use a contrast-safe foreground.
- [ ] Light and dark semantic success/warning/error states remain readable without color-only meaning.
- [ ] Focus is visible using keyboard navigation.
- [ ] `prefers-reduced-motion` is respected.
- [ ] Persian UI keeps readable line height and English/IPA/URL/email/numeric content is isolated LTR.
- [ ] `/design-system` has no horizontal overflow at 360px.

## Day 04 component-library regression additions

- [ ] Every icon-only button has a non-empty accessible label.
- [ ] Loading buttons expose busy state and cannot be submitted twice while loading.
- [ ] Form fields keep visible labels; placeholder-only controls are rejected.
- [ ] Inline errors use programmatic field associations and long forms provide an error summary linking to fields.
- [ ] Tabs work with Tab, Arrow keys, Home, and End.
- [ ] Dialog/Drawer closes with Escape and restores focus to the opening control.
- [ ] Toasts are supplemental and are not the only place a blocking error appears.
- [ ] All primary interactive targets remain at least 44px.
- [ ] Resumable Stepper keeps Back, Save and Continue Later, Cancel, and refresh recovery.
- [ ] Stepper local storage contains only non-sensitive progress identifiers.
- [ ] DataTable becomes labelled cards at 360px without losing field names.
- [ ] AccessibleChart includes a textual interpretation and semantic data table.
- [ ] AIResultCard always labels AI output and shows evidence/limitations plus recovery/report controls.
- [ ] Empty, permission-denied, offline, and retry states explain a next action without color-only meaning.
- [ ] ProviderStatus does not expose provider credentials, IDs, callback URLs, or other implementation secrets.
- [ ] RoleShell desktop/sidebar and mobile/bottom-nav variants preserve the same authorized destinations.
- [ ] AccountNavigation keeps Library, Usage, Plan/Premium, Billing, Privacy/Data, Settings, and Support grouped away from the primary dashboard action.
