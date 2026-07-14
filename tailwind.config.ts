import type { Config } from "tailwindcss";
import { colors, shadows, zIndex, containers, animationTiming } from "./lib/theme";

/**
 * Tailwind reads its design tokens from lib/theme.ts — that file is the
 * single source of truth. Do not hardcode a hex color, shadow, or z-index
 * here; add/edit it in lib/theme.ts and it will flow through automatically.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        /* Design-system tokens are additive — homepage tokens above are untouched. */
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(28,27,25,0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "14px 14px",
      },
      boxShadow: {
        button: shadows.button,
        card: shadows.card,
        hero: shadows.hero,
        modal: shadows.modal,
        toast: shadows.toast,
      },
      zIndex: {
        dropdown: String(zIndex.dropdown),
        header: String(zIndex.header),
        drawer: String(zIndex.drawer),
        toast: String(zIndex.toast),
        modal: String(zIndex.modal),
        tooltip: String(zIndex.tooltip),
      },
      maxWidth: {
        page: containers.page,
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: `marquee ${animationTiming.marquee} linear infinite`,
        "fade-up": `fade-up ${animationTiming.fadeUp} ease forwards`,
      },
      letterSpacing: {
        widest2: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
