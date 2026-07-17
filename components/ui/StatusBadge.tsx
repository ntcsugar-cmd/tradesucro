import clsx from "clsx";
import { ReactNode } from "react";
import { Circle } from "lucide-react";

type Status = "success" | "danger" | "warning" | "info" | "neutral" | "pending";

interface StatusBadgeProps {
  status: Status;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  success: "bg-success/10 text-success-700 border-success/25 dark:bg-success/20 dark:text-success-300 dark:border-success/35",
  danger: "bg-danger/10 text-danger-700 border-danger/25 dark:bg-danger/20 dark:text-danger-300 dark:border-danger/35",
  warning: "bg-gold/10 text-gold-dim border-gold/25 dark:bg-gold/20 dark:text-gold-bright dark:border-gold/35",
  info: "bg-navy-500/10 text-navy-700 border-navy-500/25 dark:bg-navy-500/25 dark:text-navy-200 dark:border-navy-500/40",
  neutral: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-white/10 dark:text-white/70 dark:border-white/15",
  pending: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-white/10 dark:text-white/60 dark:border-white/15",
};

const dotStyles: Record<Status, string> = {
  success: "text-success dark:text-success-300",
  danger: "text-danger dark:text-danger-300",
  warning: "text-gold dark:text-gold-bright",
  info: "text-navy-500 dark:text-navy-200",
  neutral: "text-gray-500 dark:text-white/50",
  pending: "text-gray-400 dark:text-white/40",
};

/** StatusBadge — for order/offer/mill lifecycle states (e.g. "Verified", "Pending review", "Rejected"). */
export function StatusBadge({ status, children, dot = true, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-widest2",
        statusStyles[status],
        className
      )}
    >
      {dot && <Circle size={6} fill="currentColor" className={dotStyles[status]} />}
      {children}
    </span>
  );
}
