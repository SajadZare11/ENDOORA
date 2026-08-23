# Endoora Component Library

Day 04 establishes one accessible UI system for every public, learner, teacher, and operations surface.

## Architecture

```text
design tokens
  -> accessible primitives
    -> experience components
      -> product features and routes
```

Canonical implementations live in `packages/ui/src/components/*` and are exported through `@endoora/ui`. Product pages must compose these components rather than creating a second button, form, dialog, feedback, table, or navigation system.

## Primitive layer

- `Button` and `IconButton`: primary, secondary, tertiary, destructive, loading, and disabled actions.
- `TextInput`, `TextArea`, `Select`, `MultiSelect`, `Checkbox`, and `RadioGroup`: visible labels with connected help and validation messages.
- `ErrorSummary`: links directly to invalid fields.
- `Card` and `Badge`: content hierarchy and semantic status.
- `Tabs`: RTL/LTR-aware Arrow keys plus Home and End.
- `Dialog` and `Drawer`: native modal behavior, Escape handling, background inertness, and focus restoration.
- `ToastRegion`: supplemental notifications; never the only meaningful error message.

## Data and workflow layer

- `ResumableStepper`: Back, Continue, Cancel, and Save and Continue Later with a non-sensitive step ID in local storage.
- `DataTable`: semantic desktop table and labelled mobile-card fallback.
- `AccessibleChart`: visible chart, factual summary, and data-table fallback.
- `Skeleton`, `ProgressBar`, and `StatusMessage`: understandable loading and status feedback.
- `EmptyState`, `OfflineState`, `PermissionDeniedState`, and `RetryState`: consistent recovery paths.
- `ProviderStatus`: public-safe service messages without provider identifiers or secrets.
- `AccountNavigation` and `RoleShell`: role-aware desktop sidebar and mobile bottom navigation.

## Experience layer

- Learning: `MissionCard`, `GrowthCard`, and `LearnerTwinCard`.
- AI: `AIResultCard`, `AIInsight`, and `AIThinkingState`.
- World objects: `Door` and `Crystal` are optional presentational objects and must retain accessible names when meaningful.

Experience components compose the primitive layer. They do not redefine `.endoora-button`, `.endoora-card`, form controls, or feedback behavior.

## Usage rules

1. Import behavior from `@endoora/ui`; import its tokens and component CSS once in the root application layout.
2. Use design tokens for color, spacing, shape, motion, elevation, and focus. Raw colors outside `tokens.css` are not allowed.
3. Use logical CSS properties such as `margin-inline` and `border-block`; do not encode left/right assumptions.
4. Keep the Persian interface RTL and isolate English learning content with `dir="ltr"`, `lang="en"`, or `.ltr-isolate` as appropriate.
5. Give every interactive control an accessible name and a minimum 44px target.
6. Preserve native semantics before adding ARIA. Do not replace buttons, tables, progress elements, or dialogs with generic `div` elements.
7. Show errors inline or in a status region. Toasts may supplement but cannot replace the recovery path.
8. AI output must identify itself, show evidence and limitations, and provide retry/report/save or human-review controls where relevant.
9. Do not display fabricated scores, confidence, progress, counts, or provider states.
10. Add every reusable component and important state to `/design-system/components` before product adoption.

## Verification

Run from the repository root:

```powershell
npm run check:design
npm run check:components
npm run lint
npm run typecheck
npm run build
```

Then complete `docs/operations/DAY_04_ACCEPTANCE_GATE.md` at desktop and 360px widths using keyboard-only interaction.
