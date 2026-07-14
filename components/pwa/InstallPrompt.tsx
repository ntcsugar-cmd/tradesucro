"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISSED_KEY = "tradesucro-install-dismissed-at";
const DISMISS_SNOOZE_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISSED_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return Date.now() - dismissedAt < DISMISS_SNOOZE_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * InstallPrompt — a custom "Install TradeSucro" banner. Chrome/Edge
 * fire `beforeinstallprompt`; we preventDefault() it and hold onto the
 * event so this banner (not the browser's own mini-infobar) drives the
 * install moment. iOS Safari never fires this event, so the banner
 * simply won't appear there rather than showing incorrect instructions.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      if (recentlyDismissed()) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  function handleDismiss() {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-3 z-header rounded-sm border border-line bg-white dark:bg-charcoal-soft dark:border-white/10 shadow-lg px-4 py-3.5 flex items-center gap-3"
      style={{ bottom: "calc(72px + env(safe-area-inset-bottom))" }}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-charcoal">
        <Download size={17} className="text-gold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-charcoal dark:text-white">Install TradeSucro</p>
        <p className="text-[11.5px] text-ink-faint">Add to your home screen for instant, one-tap access.</p>
      </div>
      <button type="button" onClick={handleInstall} className="shrink-0 rounded-sm bg-charcoal px-3.5 py-2 text-[12.5px] font-semibold text-white active:opacity-90">
        Install
      </button>
      <button type="button" onClick={handleDismiss} aria-label="Dismiss" className="shrink-0 text-ink-faint p-1">
        <X size={16} />
      </button>
    </div>
  );
}
