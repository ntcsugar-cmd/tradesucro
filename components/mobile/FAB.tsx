"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface FABProps {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

/**
 * FAB — a single, context-aware floating action button. Sits above
 * BottomNav (bottom offset clears its ~56px height + safe-area).
 * Desktop pages keep their existing header "actions" buttons
 * untouched; this is additive, mobile-only chrome for the one primary
 * action on a given screen (e.g. "Buy Sugar" on the marketplace,
 * "Create Offer" on Mill Offers).
 */
export function FAB({ label, icon: Icon, href, onClick }: FABProps) {
  const content = (
    <span className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-white shadow-lg active:scale-95 transition-transform">
      <Icon size={19} />
      <span className="text-[13px] font-semibold">{label}</span>
    </span>
  );

  return (
    <div className="fixed right-4 z-header" style={{ bottom: "calc(72px + env(safe-area-inset-bottom))" }}>
      {href ? <Link href={href}>{content}</Link> : <button type="button" onClick={onClick}>{content}</button>}
    </div>
  );
}
