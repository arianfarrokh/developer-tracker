/**
 * DevDash color palette — dark neon-purple developer dashboard theme.
 * Values mirror CSS custom properties in globals.css.
 */

export const colors = {
  background: {
    /** Deepest app canvas — midnight navy */
    main: "#08081b",
    /** Sidebar, cards, elevated surfaces */
    surface: "#12122b",
    /** Inputs, search fields */
    input: "#0f111a",
    /** Slightly recessed muted areas */
    muted: "#0f0f23",
  },

  text: {
    /** Headings, primary labels */
    primary: "#f8fafc",
    /** Subtitles, secondary labels */
    secondary: "#94a3b8",
    /** Timestamps, hints, disabled copy */
    muted: "#6b7280",
  },

  primary: {
    /** Main brand purple — buttons, active indicators, progress */
    DEFAULT: "#8b5cf6",
    /** Deeper violet for emphasis */
    dark: "#7c3aed",
    /** Rich indigo-purple — active nav, gradients */
    deep: "#4c1d95",
    /** Secondary purple / indigo accent */
    indigo: "#6366f1",
  },

  accent: {
    green: "#22c55e",
    orange: "#f59e0b",
    pink: "#ec4899",
    blue: "#06b6d4",
  },

  border: {
    /** Card and section dividers */
    DEFAULT: "#1f2937",
    /** Slightly lighter edge on nested elements */
    subtle: "#1e293b",
  },

  chart: {
    purple: "#8b5cf6",
    green: "#22c55e",
    cyan: "#06b6d4",
    orange: "#f59e0b",
    pink: "#ec4899",
  },

  glow: {
    /** Soft outer glow for primary actions */
    primary: "rgba(139, 92, 246, 0.45)",
    green: "rgba(34, 197, 94, 0.35)",
    pink: "rgba(236, 72, 153, 0.35)",
  },
} as const;

/** Semantic status colors aligned with UI tags and badges */
export const statusColors = {
  success: colors.accent.green,
  warning: colors.accent.orange,
  danger: colors.accent.pink,
  info: colors.accent.blue,
} as const;

/**
 * CSS custom property names — use with getComputedStyle or inline styles.
 * Example: `var(${cssVars.primary})`
 */
export const cssVars = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  border: "--border",
  input: "--input",
  ring: "--ring",
  success: "--success",
  warning: "--warning",
  info: "--info",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
} as const;

export type ColorPalette = typeof colors;
export type StatusColor = keyof typeof statusColors;
