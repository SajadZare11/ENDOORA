# Endoora Design System — Day 03

Endoora uses one bilingual token system for public, learner, teacher, and operations interfaces. The design language is calm, premium, readable, and role-neutral. Page code may arrange components, but it must not introduce new raw colors or physical left/right layout assumptions.

## Brand foundation

- Public name: **Endoora**
- Motto: **A new door to your English**
- Primary action token: **Endoora Blue** `#2563EB`
- Adaptive/progress token: **Learning Teal** `#14B8A6`
- Primary heading/high-contrast token: **Deep Navy** `#0F172A`
- Achievement token: **Achievement Amber** `#F59E0B`

The current wordmark is text-only so the product does not depend on an unfinished logo asset.

## Color tokens

Canonical tokens live only in `packages/ui/src/tokens.css`.

| Token | Value | Primary use | Text rule |
|---|---:|---|---|
| Deep Navy | `#0F172A` | headings, navigation, high contrast | safe on light surfaces |
| Endoora Blue | `#2563EB` | primary actions, focus | use white text on blue |
| Learning Teal | `#14B8A6` | adaptive learning, progress | use Deep Navy text when teal is a filled surface |
| Achievement Amber | `#F59E0B` | XP, badges | never normal body text on white |
| Success Green | `#16A34A` | completion, verified state | use as icon/accent; semantic text uses `--color-success-text` |
| Warning Orange | `#D97706` | warnings, expiry | use as icon/accent; semantic text uses `--color-warning-text` |
| Error Red | `#DC2626` | validation, destructive actions | allowed only for error/destructive meaning |
| Canvas | `#F8FAFC` | light page background | normal text uses Deep Navy |
| Surface | `#FFFFFF` | cards, dialogs, forms | normal text uses Deep Navy |
| Muted Text | `#475569` | descriptions, metadata | passes AA on light surface/canvas |
| Border | `#E2E8F0` | separators | never the only focus indicator |
| Dark Canvas | `#08111F` | dark page background | light text |
| Dark Surface | `#111C2E` | dark cards/forms | light text |

Support semantic background/text pairs are defined for success, warning, error, and information states so base brand colors are not misused as body text.

## Verified contrast rules

The automated Day 03 smoke test requires at least WCAG AA `4.5:1` for normal-text pairs. Representative ratios from the current palette:

| Pair | Ratio |
|---|---:|
| Deep Navy / Canvas | 17.06:1 |
| White / Endoora Blue | 5.17:1 |
| Deep Navy / Learning Teal | 7.17:1 |
| Deep Navy / Achievement Amber | 8.31:1 |
| Muted Text / Surface | 7.58:1 |
| Light text / Dark Canvas | 18.91:1 |
| Light success semantic pair | 8.30:1 |
| Dark success semantic pair | 10.32:1 |

`npm run check:design` fails when a required tested pair drops below `4.5:1`, when focus/reduced-motion rules disappear, when raw colors are placed outside the token file, or when physical left/right CSS properties appear in the Day 03 CSS surface.

## Typography

Endoora uses `next/font` with Vazirmatn and Inter. The framework generates locally served font assets for the built application; raw font files are not committed to this repository.

- Persian UI: Vazirmatn, with Tahoma/Arial fallback.
- English/Latin learning content: Inter, with system sans-serif fallback.
- Minimum body size: `16px`.
- Persian body line-height: approximately `1.6`.
- English body line-height: approximately `1.5`.
- Hero: `40/48` desktop, reduced on smaller viewports.
- Page title: `32/40` desktop.
- Section title: `24/32`.
- Card title: `20/28`.
- Metadata: `14/20`.

English examples, IPA, email addresses, URLs, code, and numeric answer content use `.ltr-isolate` inside Persian pages. Persian snippets inside LTR contexts can use `.rtl-isolate`.

## Spacing, shape, and targets

The scale is based on 8px with deliberate 4px/12px half steps:

- `4, 8, 12, 16, 24, 32, 48, 64px`
- Control radius: `12px`
- Card radius: `16px`
- Pill radius: fully rounded
- Minimum interactive target: `44px`
- Reading width: about `736px`
- Main desktop content width: up to `1248px`

Use CSS logical properties (`margin-inline`, `padding-block`, `inset-inline`, `border-inline`, etc.). Do not use layout rules that assume left-to-right positioning.

## Dark mode

`[data-theme="dark"]` overrides semantic surface, text, border, link, focus, status, and elevation tokens. Components must consume semantic variables rather than switching their own colors.

The Day 03 preview supports both light and dark modes without changing component markup.

## Focus and motion

All keyboard-focusable controls receive a visible `:focus-visible` ring using `--color-focus`, `--focus-ring-width`, and `--focus-ring-offset`.

Motion duration tokens are `150ms`, `200ms`, and `250ms`. Under `prefers-reduced-motion: reduce`, effective transitions and animations are reduced to near-zero while preserving state changes.

## Preview route

Run the Next.js application and open:

`http://localhost:3000/design-system`

Verify all four combinations:

1. Light + RTL
2. Light + LTR
3. Dark + RTL
4. Dark + LTR

Then test desktop, a 768px tablet viewport, and a 360px mobile viewport.

## Usage rules for later days

1. New UI colors must first become reviewed tokens; do not put raw hex values in components or page CSS.
2. Use Endoora Blue for primary actions, not for every decorative element.
3. Use Learning Teal for adaptation/progress meaning.
4. Never use Achievement Amber as normal body text on white.
5. Do not rely on color alone for success, warning, error, or selected states.
6. Preserve visible labels and focus states.
7. Isolate mixed-direction learning content explicitly.
8. Test each new component in light/dark, RTL/LTR, mobile/desktop, keyboard focus, and reduced motion.
