export const themeNames = ["light", "dark"] as const;
export type EndooraTheme = (typeof themeNames)[number];

export const textDirections = ["rtl", "ltr"] as const;
export type TextDirection = (typeof textDirections)[number];

export const tokens = {
  color: {
    deepNavy: "var(--color-deep-navy)",
    endooraBlue: "var(--color-endoora-blue)",
    learningTeal: "var(--color-learning-teal)",
    achievementAmber: "var(--color-achievement-amber)",
    successGreen: "var(--color-success-green)",
    warningOrange: "var(--color-warning-orange)",
    errorRed: "var(--color-error-red)",
    canvas: "var(--color-canvas)",
    surface: "var(--color-surface)",
    text: "var(--color-text)",
    muted: "var(--color-muted)",
    border: "var(--color-border)",
    action: "var(--color-action)",
  },
  spacing: {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    6: "var(--space-6)",
    8: "var(--space-8)",
    12: "var(--space-12)",
    16: "var(--space-16)",
  },
  radius: {
    control: "var(--radius-control)",
    card: "var(--radius-card)",
    pill: "var(--radius-pill)",
  },
  motion: {
    fast: "var(--motion-fast)",
    normal: "var(--motion-normal)",
    slow: "var(--motion-slow)",
  },
} as const;

export function themeDataAttributes(theme: EndooraTheme, direction: TextDirection) {
  return {
    "data-theme": theme,
    dir: direction,
  } as const;
}
