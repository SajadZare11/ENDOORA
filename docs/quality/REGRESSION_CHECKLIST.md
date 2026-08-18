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
