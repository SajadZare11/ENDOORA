# Day 07 auth and account-security design specification

## Source of truth

The implementation follows the Endoora brand and architecture volumes and the accepted concept in `day07-auth-security-concept.png`.

## Visual system

- Use a dedicated `AuthShell`; do not reuse the public marketing or learner application shells.
- Persian is the default language and RTL direction. English is optional and LTR. Email, phone, OTP, and other Latin identifiers remain directionally isolated.
- The desktop shell pairs a quiet, CSS-native doorway/orbit scene with one focused glass workspace. At narrow widths the scene becomes a compact atmospheric header and the form remains the primary content.
- Core surfaces use Deep Space (`#030712`), Midnight Blue (`#071A2B`), and Ocean Surface (`#102A43`). Action Blue is reserved for primary actions; Learning Teal communicates security and completion; Intelligence Purple remains a restrained ambient accent.
- Glass uses transparency, blur, a soft one-pixel border, and controlled depth. It must preserve contrast and must not become a generic neon effect.
- Motion is limited to doorway breathing, background drift, focus, hover, and busy feedback. All animation stops under `prefers-reduced-motion`.

## Experience contract

- The page title is the first textual heading; there is no decorative kicker above it.
- Home and language controls remain available on every auth state.
- Labels are persistent and errors are associated with their fields. Focus is clearly visible and targets are at least 44px.
- Password controls include visibility toggles and do not change the submitted value.
- Login errors remain generic to prevent account enumeration.
- Password recovery never discloses whether an account exists. The local mock code is explicitly identified as development-only.
- Consent text links to the exact legal surfaces and records immutable type/version pairs server-side.
- Destructive account actions show their delay, consequence, explicit confirmation, and cancellation path.
- Full device inventory is deliberately deferred; Day 07 exposes the current protected session without fabricating other devices.

## Responsive behavior

- Wide desktop: two-column stage, atmospheric scene and auth workspace.
- Tablet: reduced scene width, unchanged reading order and controls.
- 360px mobile: single-column layout, compact scene, full-width actions, no horizontal scrolling, and no hover-only information.

## Intentional differences from the concept image

- The decorative doorway is implemented in CSS instead of shipping a heavy raster hero asset.
- No “remember me” control is shown because the server currently uses one explicit two-week session policy rather than a user-selectable persistence policy.
- No social-login or passkey controls are shown because no provider or credential flow exists yet.
- Recovery copy uses a generic acknowledgement so unknown accounts cannot be distinguished from registered accounts.
