"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { animationTiming } from "@/lib/theme";

type ToastVariant = "success" | "warning" | "danger" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<ToastVariant, { icon: LucideIcon; iconClass: string; barClass: string }> = {
  success: { icon: CheckCircle2, iconClass: "text-success-700", barClass: "bg-success" },
  warning: { icon: AlertTriangle, iconClass: "text-gold-dim", barClass: "bg-gold" },
  danger: { icon: XCircle, iconClass: "text-danger-700", barClass: "bg-danger" },
  info: { icon: Info, iconClass: "text-navy-700", barClass: "bg-navy-500" },
};

/**
 * ToastProvider — wrap the app (or a subtree) once. Descendants call
 * `useToast().toast({ title, description, variant })` to trigger a toast.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...options }]);
      window.setTimeout(() => dismiss(id), animationTiming.toastDurationMs);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, iconClass, barClass } = variantConfig[t.variant];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto relative overflow-hidden flex gap-3 bg-charcoal text-white rounded-sm shadow-toast p-4 pl-5"
              >
                <span className={clsx("absolute left-0 top-0 h-full w-1", barClass)} />
                <Icon size={18} className={clsx("shrink-0 mt-0.5", iconClass)} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold">{t.title}</p>
                  {t.description && <p className="text-xs text-white/60 mt-0.5">{t.description}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
