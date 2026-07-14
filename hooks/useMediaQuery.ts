"use client";

import { useEffect, useState } from "react";
import { breakpoints } from "@/lib/theme";

/**
 * useMediaQuery — subscribes to a CSS media query and returns whether it
 * currently matches. Defaults to `false` on the server/first render to
 * avoid hydration mismatches, then syncs on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/** Convenience hook: true below the "lg" breakpoint (1024px) — the point at
 *  which the dashboard shell switches from a persistent sidebar to a drawer. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.lg})`);
}
