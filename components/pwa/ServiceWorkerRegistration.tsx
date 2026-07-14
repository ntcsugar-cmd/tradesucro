"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegistration — registers public/sw.js on mount. Rendered
 * once in the root layout so every route (marketing homepage, auth,
 * dashboard) is covered. Renders nothing; this is a side-effect-only
 * component, safe to mount anywhere in the tree.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("TradeSucro service worker registration failed:", error);
      });
    });
  }, []);

  return null;
}
