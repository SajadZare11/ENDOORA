# Endoora Accessible Component Library

## Status

Day 04 Production V1 foundation. Components live in `packages/ui/src/components/` and consume Day 03 design tokens from `packages/ui/src/tokens.css`.

## Principles

- Use native semantic HTML before custom roles.
- Keep every interactive target at least `--target-min` (44px).
- Keep visible labels on form controls; placeholder text is never the only label.
- Associate helper/error text with fields using `aria-describedby` and invalid state using `aria-invalid`.
- Use the shared `ErrorSummary` to link users directly to invalid fields in long forms.
- Use logical CSS properties so Persian RTL and English LTR layouts do not fork.
- Use semantic tokens rather than raw colors.
- Keep keyboard focus visible and respect `prefers-reduced-motion` from Day 03.
- Status messages must include text; color is never the only signal.
- AI output must show that it is AI-generated, the evidence used, limitations/uncertainty, and recovery/report controls.
- Charts must include a textual summary and an accessible data table.
- Data tables must preserve semantic table markup on larger screens and use labelled mobile cards at narrow widths.

## Component inventory

### Actions

- `Button`: primary, secondary, tertiary, destructive, disabled, and loading states.
- `IconButton`: requires an explicit accessible `label`.

### Forms

- `TextInput`
- `TextArea`
- `Select`
- `MultiSelect`
- `Checkbox`
- `RadioGroup`
- `ErrorSummary`

Form controls accept visible labels, helper text, error text, and required state. Invalid fields expose both inline errors and an error-summary navigation path.

### Structure and overlays

- `Tabs`: Arrow keys, Home, End, `tablist`/`tab`/`tabpanel` semantics.
- `Card`
- `Badge`
- `Dialog`: native `<dialog>` modal behavior, initial focus, Escape handling, and focus restoration.
- `Drawer`: the same modal contract presented as a side sheet.
- `ToastRegion`: polite live-region notifications. Toasts are never the only error channel.

### Feedback and long workflows

- `Skeleton`
- `ProgressBar`
- `StatusMessage`
- `ResumableStepper`: Back, Continue, Save and Continue Later, Cancel, completion, and local refresh recovery.

The Day 04 stepper stores only a current step identifier in local browser storage. Sensitive form values are not stored by the component. Server-side draft persistence is added when the relevant product flows are implemented.

### Data and AI

- `DataTable`: semantic desktop table plus 360px card fallback.
- `AccessibleChart`: visual bars plus factual summary and accessible data table.
- `AIResultCard`: visible AI label, confidence, evidence, limitations, retry, save, report, and human-review actions.

### Standard recovery states

- `EmptyState`
- `PermissionDeniedState`
- `OfflineState`
- `RetryState`
- `ProviderStatus`: safe provider degradation language without exposing secrets or provider implementation details.

### Navigation

- `AccountNavigation`: groups Library, Usage, Premium/Plan, Billing, Profile/Privacy, Settings, and Support.
- `RoleShell`: reusable desktop sidebar + mobile bottom-navigation shell. It accepts role-specific navigation items rather than hardcoding one role.

## Preview

Open `/design-system/components` while the Next.js development server is running. The page contains more than 25 visual examples and interactive demonstrations.

Required manual checks:

1. Tab through every interactive section using keyboard only.
2. Use Arrow keys/Home/End in Tabs.
3. Open a Dialog, press Escape, and confirm focus returns to the trigger.
4. Trigger the form error summary and follow its links to fields.
5. Start the Resumable Stepper, advance to step 2, refresh, and confirm step 2 resumes.
6. Set the browser viewport to 360px and confirm the table becomes cards and the role shell becomes bottom navigation.
7. Check light and dark themes through the Day 03 token preview plus the component page under the active root theme.

## Usage rule

Later Endoora feature pages should reuse these components first. A new one-off component is justified only when an existing primitive cannot represent the interaction without breaking accessibility, product semantics, or performance.
