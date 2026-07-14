"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  tone?: "gold" | "rise" | "default";
}

interface QuickActionsBarProps {
  actions: QuickAction[];
}

const TONE_CLASSES: Record<NonNullable<QuickAction["tone"]>, string> = {
  gold: "bg-gold text-charcoal",
  rise: "bg-rise text-white",
  default: "bg-charcoal/[0.04] text-charcoal border border-line",
};

/**
 * QuickActionsBar — a horizontally scrollable row of large, one-tap
 * action chips. This is the one place "swipeable" is actually a
 * horizontal scroll (quick actions), distinct from tables, which must
 * never scroll horizontally — they convert to cards instead.
 */
export function QuickActionsBar({ actions }: QuickActionsBarProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {actions.map(({ label, icon: Icon, href, onClick, tone = "default" }) => {
        const content = (
          <span className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 min-h-[44px] text-[13px] font-medium whitespace-nowrap transition-transform active:scale-95 ${TONE_CLASSES[tone]}`}>
            <Icon size={16} /> {label}
          </span>
        );
        return href ? (
          <Link key={label} href={href}>
            {content}
          </Link>
        ) : (
          <button key={label} type="button" onClick={onClick}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
