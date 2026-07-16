import clsx from "clsx";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "gold" | "charcoal" | "verified" | "urgent";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  gold: "bg-gold/10 text-gold-dim border-gold/25 dark:bg-gold/15 dark:text-gold-bright dark:border-gold/30",
  charcoal: "bg-charcoal/5 text-charcoal/70 border-charcoal/15 dark:bg-white/10 dark:text-white/70 dark:border-white/15",
  verified: "bg-rise/10 text-rise border-rise/25 dark:bg-rise/20 dark:border-rise/35",
  urgent: "bg-fall/10 text-fall border-fall/25 dark:bg-fall/20 dark:border-fall/35",
};

export function Badge({ children, tone = "charcoal", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest2",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
