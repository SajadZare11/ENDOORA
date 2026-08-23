# Day 04 UI/UX Notes

The Day 04 gallery is available at `/design-system/components` and serves as the visual and interaction reference for the shared `@endoora/ui` package.

## Interaction contract

- Keyboard access and visible focus are mandatory.
- Controls use a minimum 44px target.
- Dialogs and drawers use native modal behavior and restore focus.
- Tables become labelled cards at the 48rem breakpoint.
- Charts include a textual summary and data table.
- Forms keep visible labels, connected help/error text, and error-summary links.
- Toasts are supplemental; meaningful feedback remains inline.
- RTL/LTR behavior is tested directly in the shared system rather than repaired separately on each page.

## Composition contract

Routes compose:

```text
Endoora shell + experience components + accessible primitives + tokens
```

The learning, AI, and world layers may add product meaning and visual identity, but they must reuse the same primitives and semantic states.

See `docs/product/component-library.md` for usage rules and `docs/operations/DAY_04_ACCEPTANCE_GATE.md` for the full acceptance journey.
