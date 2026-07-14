/**
 * TradeSucro Design Tokens
 * ------------------------------------------------------------------
 * The single source of truth for every visual constant in the app.
 * `tailwind.config.ts` imports `colors`, `radius`, `shadows`, and
 * `zIndex` from this file directly, so a change here propagates to
 * every component automatically — no component should hardcode a
 * color, shadow, or z-index value; it should reach for the matching
 * Tailwind class (which resolves back to a token defined here).
 *
 * Values in this file mirror what shipped in v0.2.0 exactly — this
 * pass centralizes them, it does not restyle anything.
 */

/* ------------------------------------------------------------------ */
/* Colors                                                              */
/* ------------------------------------------------------------------ */

export const colors = {
  /** Page background. */
  paper: "#FAF9F6",
  /** Surface / card background. */
  white: "#FFFFFF",

  charcoal: {
    DEFAULT: "#1C1B19",
    soft: "#2A2825",
    faint: "#3A3733",
  },

  /** Primary Gold — brand accent, primary CTAs. */
  gold: {
    DEFAULT: "#B8933D",
    bright: "#D4A94A",
    dim: "#8C6F2E",
    line: "#C9A85C",
  },

  /** Primary Navy — secondary brand accent, info states, dashboard chrome. */
  navy: {
    50: "#EEF2F7",
    100: "#D6E0EB",
    200: "#AEC1D6",
    300: "#7E9BB9",
    400: "#4E7398",
    500: "#2F567C",
    600: "#1F3F60",
    700: "#152E48",
    800: "#0F2136",
    900: "#0B1928",
    DEFAULT: "#0F2136",
  },

  /** Hairline borders. */
  line: "#E7E3DA",

  /** Text-on-paper scale. */
  ink: {
    DEFAULT: "#1C1B19",
    soft: "rgba(28,27,25,0.64)",
    faint: "rgba(28,27,25,0.4)",
  },

  /** Homepage-era price-direction aliases — kept for backward compatibility. */
  rise: "#4B7757",
  fall: "#A5473A",

  /** Green — success states, positive price movement. */
  success: {
    50: "#EDF5EF",
    100: "#D3E7D8",
    200: "#A6CFB0",
    300: "#79B788",
    400: "#549968",
    500: "#3D7A50",
    600: "#4B7757",
    700: "#2E5A3D",
    800: "#213F2B",
    900: "#15281B",
    DEFAULT: "#4B7757",
  },

  /** Red — danger states, negative price movement. */
  danger: {
    50: "#FBEEEC",
    100: "#F2D2CC",
    200: "#E3A79B",
    300: "#CF7A69",
    400: "#B85B47",
    500: "#A5473A",
    600: "#8F3B2F",
    700: "#722F26",
    800: "#4F211A",
    900: "#331512",
    DEFAULT: "#A5473A",
  },

  /** Orange — warning states. */
  warning: {
    50: "#FBF2E8",
    100: "#F4DDBE",
    200: "#E9BB84",
    300: "#DD9A4C",
    400: "#CD8332",
    500: "#B36B25",
    600: "#94551D",
    700: "#734117",
    800: "#502D10",
    900: "#301B09",
    DEFAULT: "#B36B25",
  },

  /** Blue — informational states, distinct from Navy (which is the brand chrome color). */
  info: {
    50: "#EBF1F8",
    100: "#CBDCEE",
    200: "#9DBEDE",
    300: "#6E9FCD",
    400: "#4A85C0",
    500: "#33689D",
    600: "#28527D",
    700: "#1F3F60",
    800: "#152B42",
    900: "#0C1926",
    DEFAULT: "#33689D",
  },

  /** Full warm Gray scale — neutral UI chrome, muted text, disabled states. */
  gray: {
    50: "#F8F7F5",
    100: "#F0EEEA",
    200: "#E1DDD5",
    300: "#C7C1B6",
    400: "#A39C8E",
    500: "#83796A",
    600: "#635C50",
    700: "#4A453C",
    800: "#332F29",
    900: "#211E1A",
    DEFAULT: "#635C50",
  },

  /** Semantic aliases — named by role rather than hue, for legibility at call sites. */
  background: "#FAF9F6",
  surface: "#FFFFFF",
  border: "#E7E3DA",
  muted: "#83796A",
} as const;

/* ------------------------------------------------------------------ */
/* Spacing                                                             */
/* ------------------------------------------------------------------ */
/** Reference scale. Tailwind's default spacing utilities (p-1, p-2, gap-4…)
 *  already implement this rem-based scale — documented here so custom
 *  spacing decisions (e.g. section padding) have a named point of reference. */
export const spacing = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
} as const;

/* ------------------------------------------------------------------ */
/* Border Radius                                                       */
/* ------------------------------------------------------------------ */
export const radius = {
  none: "0px",
  sm: "0.125rem", // the default across TradeSucro's crisp, minimal surfaces
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
} as const;

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */
export const typography = {
  fontFamily: {
    display: "var(--font-fraunces), serif",
    body: "var(--font-inter), sans-serif",
    mono: "var(--font-plex-mono), monospace",
  },
  /** Matches the scale implemented in components/ui/Typography.tsx. */
  fontSize: {
    caption: "11px",
    sm: "13px",
    base: "14.5px",
    lg: "16px",
    h4: "1.125rem",
    h3: "1.5rem",
    h2: "2rem",
    h1: "2.5rem",
  },
  letterSpacing: {
    widest2: "0.22em",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Shadows                                                             */
/* ------------------------------------------------------------------ */
export const shadows = {
  /** Subtle 1px lift used under primary/gold buttons. */
  button: "0 1px 0 0 rgba(0,0,0,0.05)",
  /** Hover elevation for interactive cards (mill cards, dashboard cards). */
  card: "0 20px 40px -30px rgba(28,27,25,0.4)",
  /** The hero live-quote panel and similarly prominent floating surfaces. */
  hero: "0 30px 60px -25px rgba(28,27,25,0.45)",
  /** Modal dialogs. */
  modal: "0 40px 80px -20px rgba(28,27,25,0.35)",
  /** Toast notifications. */
  toast: "0 20px 45px -15px rgba(0,0,0,0.4)",
} as const;

/* ------------------------------------------------------------------ */
/* Transitions                                                         */
/* ------------------------------------------------------------------ */
export const transitions = {
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
  easing: {
    /** Used for scroll reveals and modal/toast entrances. */
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Breakpoints                                                         */
/* ------------------------------------------------------------------ */
/** Tailwind's default breakpoints — documented for reference in JS-side
 *  responsive logic (e.g. the useMediaQuery hook). */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/* ------------------------------------------------------------------ */
/* Container Sizes                                                     */
/* ------------------------------------------------------------------ */
export const containers = {
  /** Max page width used by Container/section wrappers across the app. */
  page: "1400px",
} as const;

/* ------------------------------------------------------------------ */
/* Z-Index                                                             */
/* ------------------------------------------------------------------ */
export const zIndex = {
  dropdown: 20,
  header: 50,
  drawer: 150,
  toast: 100,
  modal: 200,
  tooltip: 300,
} as const;

/* ------------------------------------------------------------------ */
/* Animation Timing                                                    */
/* ------------------------------------------------------------------ */
export const animationTiming = {
  /** Ticker tape scroll loop duration. */
  marquee: "38s",
  /** Hero/section fade-up entrance. */
  fadeUp: "0.6s",
  /** Modal open/close. */
  modal: "250ms",
  /** Scroll-triggered card/row reveals. */
  reveal: "0.5s",
  /** Auto-dismiss delay for toast notifications, in milliseconds. */
  toastDurationMs: 5000,
} as const;

/* ------------------------------------------------------------------ */

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  transitions,
  breakpoints,
  containers,
  zIndex,
  animationTiming,
} as const;

export default theme;
