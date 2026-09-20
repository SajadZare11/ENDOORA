export const themeNames = ["light", "dark"] as const;
export type EndooraTheme = (typeof themeNames)[number];

export const textDirections = ["rtl", "ltr"] as const;
export type TextDirection = (typeof textDirections)[number];

export const tokens = {
  color: {
    deepNavy: "var(--color-deep-navy)",
    deepSpace: "var(--color-deep-space)",
    midnightBlue: "var(--color-midnight-blue)",
    oceanSurface: "var(--color-ocean-surface)",
    endooraBlue: "var(--color-endoora-blue)",
    learningTeal: "var(--color-learning-teal)",
    intelligencePurple: "var(--color-intelligence-purple)",
    achievementAmber: "var(--color-achievement-amber)",
    achievementGold: "var(--color-achievement-gold)",
    successGreen: "var(--color-success-green)",
    warningOrange: "var(--color-warning-orange)",
    errorRed: "var(--color-error-red)",
    canvas: "var(--color-canvas)",
    surface: "var(--color-surface)",
    text: "var(--color-text)",
    muted: "var(--color-muted)",
    border: "var(--color-border)",
    action: "var(--color-action)",
    actionHover: "var(--color-action-hover)",
    actionText: "var(--color-action-text)",
    link: "var(--color-link)",
    focus: "var(--color-focus)",
    warmPaper: "var(--color-warm-paper)",
    softSand: "var(--color-soft-sand)",
    ink: "var(--color-ink)",
    successBg: "var(--color-success-bg)",
    successText: "var(--color-success-text)",
    warningBg: "var(--color-warning-bg)",
    warningText: "var(--color-warning-text)",
    errorBg: "var(--color-error-bg)",
    errorText: "var(--color-error-text)",
    infoBg: "var(--color-info-bg)",
    infoText: "var(--color-info-text)",
    chart1: "var(--color-chart-1)",
    chart2: "var(--color-chart-2)",
    chart3: "var(--color-chart-3)",
    chart4: "var(--color-chart-4)",
    chart5: "var(--color-chart-5)",
    chart6: "var(--color-chart-6)",
  },
  glass: {
    background: "var(--glass-background)",
    border: "var(--glass-border)",
    surfaceBorder: "var(--glass-surface-border)",
    highlight: "var(--glass-highlight)",
    blur: "var(--glass-blur)",
  },
  controlHeight: {
    targetMin: "var(--target-min)",
    compact: "var(--control-height-compact)",
  },
  gradient: {
    gateway: "var(--gradient-gateway)",
    intelligence: "var(--gradient-intelligence)",
    achievement: "var(--gradient-achievement)",
    deepUniverse: "var(--gradient-deep-universe)",
  },
  spacing: {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    5: "var(--space-5)",
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
