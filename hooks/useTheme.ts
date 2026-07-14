"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "tradesucro-theme";

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * useTheme — light/dark mode for the dashboard shell. Persists the choice
 * in localStorage and applies it by toggling the "dark" class on <html>,
 * which tailwind.config.ts (darkMode: "class") uses to scope `dark:` variants.
 *
 * Scope note (v0.2.1): this wires up a working, app-wide toggle and applies
 * `dark:` variants to the dashboard shell (TopNav, Sidebar, Breadcrumb,
 * Footer). The public homepage and the rest of the existing component
 * library intentionally keep their current light-only styling in this pass
 * — extending `dark:` variants to every component is follow-up work, not a
 * silent partial rollout.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
    setMounted(true);
  }, []);

  const applyTheme = useCallback((mode: ThemeMode) => {
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return { theme, mounted, setTheme: applyTheme, toggleTheme };
}
