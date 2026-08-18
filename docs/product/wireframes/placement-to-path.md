# Wireframe 1 — Placement to Personal Path

**Goal:** a new learner can understand where to start immediately.

`Public Home`
→ primary CTA **Take Placement Test**
→ `Sign in / Register` if needed
→ `Learner onboarding minimum fields`
→ `Placement instructions`
→ `Placement sections`
→ `Transparent result`
→ primary CTA **Build my path**
→ `Personal Path`
→ primary CTA **Start today's mission**

## Screen hierarchy

1. One title explaining the current step.
2. One dominant CTA.
3. Secondary `Save and Continue Later` where a session exists.
4. `Back` and `Cancel` remain visible but visually secondary.
5. Progress is expressed as steps/sections, not fake skill precision.

## Failure/recovery

- Offline before start: explain connection requirement and allow return.
- Disconnect during attempt: resume last confirmed answer/session state.
- Expired session: explain expiry and safe restart.
- Wrong learner/session UUID: permission denied, no answer payload.
- Result unavailable: preserve attempt and retry result generation.

## Findability target

From public Home, Placement is one navigation decision.
