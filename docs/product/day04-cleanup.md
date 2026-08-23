
# Day 04 cleanup

The previous implementation mixed duplicate component systems.

Cleanup:
- The original accessible primitives remain canonical in `packages/ui/src/components/*`.
- Endoora learning, AI, and world components compose those primitives.
- The former top-level `components.tsx` duplicate is now only a compatibility re-export.
- The gallery imports the shipped package; it does not replace component implementations with page-local demos.
- Package scripts continue to typecheck every workspace and run the Day 03/04 static gates.

Recommended architecture:

tokens
  |
primitives
  |
experience components
  |
product features

Current Day 04 verification:

- `npm run check:design` — pass
- `npm run check:components` — pass
- `npm run typecheck` — pass
- Browser and full regression evidence are recorded only after those checks run in the current environment.
