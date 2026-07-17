"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/** BottomSheet — the mobile pattern used for large dropdowns/selectors. Slides up from the bottom, full-width, scrollable body. */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-modal flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-charcoal/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[80vh] rounded-t-lg bg-white dark:bg-charcoal-soft flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-white/10 shrink-0">
              <p className="text-[15px] font-semibold text-charcoal dark:text-white">{title}</p>
              <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint dark:text-white/40 active:bg-charcoal/[0.06]">
                <X size={18} />
              </button>
            </div>
            <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-charcoal/10 shrink-0" />
            <div className="overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
