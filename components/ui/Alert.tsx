"use client";

import { ReactNode, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

type AlertVariant = "success" | "warning" | "danger" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  className?: string;
}

const variantConfig: Record<AlertVariant, { icon: LucideIcon; classes: string; iconClass: string }> = {
  success: {
    icon: CheckCircle2,
    classes: "bg-success/[0.06] border-success/25",
    iconClass: "text-success-700",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-gold/[0.06] border-gold/25",
    iconClass: "text-gold-dim",
  },
  danger: {
    icon: XCircle,
    classes: "bg-danger/[0.06] border-danger/25",
    iconClass: "text-danger-700",
  },
  info: {
    icon: Info,
    classes: "bg-navy-500/[0.06] border-navy-500/25",
    iconClass: "text-navy-700",
  },
};

/** Alert — inline, persistent message for page/section-level context (not a Toast). */
export function Alert({ variant = "info", title, children, dismissible = false, className }: AlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const { icon: Icon, classes, iconClass } = variantConfig[variant];

  return (
    <div className={clsx("flex gap-3 rounded-sm border p-4", classes, className)} role="alert">
      <Icon size={18} className={clsx("shrink-0 mt-0.5", iconClass)} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-[13.5px] font-semibold text-charcoal">{title}</p>}
        <div className={clsx("text-[13px] text-ink-soft leading-relaxed", title && "mt-0.5")}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss alert"
          className="shrink-0 text-ink-faint hover:text-charcoal transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
