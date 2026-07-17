"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Handshake, BellRing, User, PackageSearch, Route, History } from "lucide-react";
import type { WorkspaceRole } from "@/lib/types/workspace";

const DEFAULT_TABS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Market", href: "/market", icon: TrendingUp },
  { label: "Trade", href: "/marketplace", icon: Handshake },
  { label: "Alerts", href: "/market/alerts", icon: BellRing },
  { label: "Profile", href: "/company-profile", icon: User },
] as const;

/** Transport's day-to-day work is fleet/freight operations, not market prices or marketplace listings — those pages are still reachable (transporter has permission), just not what belongs in the 5 precious bottom-nav slots. */
const TRANSPORTER_TABS = [
  { label: "Home", href: "/transport", icon: Home },
  { label: "Loads", href: "/transport/loads", icon: PackageSearch },
  { label: "Dispatches", href: "/transport/dispatches", icon: Route },
  { label: "Trips", href: "/transport/trips", icon: History },
  { label: "Profile", href: "/company-profile", icon: User },
] as const;

const ROLE_TABS: Partial<Record<WorkspaceRole, typeof DEFAULT_TABS | typeof TRANSPORTER_TABS>> = {
  transporter: TRANSPORTER_TABS,
};

interface BottomNavProps {
  /** Overrides which href counts as "active" for the Home tab — the real Home target is the active workspace's own landing page, not always literally /dashboard. */
  homeHref?: string;
  alertCount?: number;
  role?: WorkspaceRole;
}

/**
 * BottomNav — mobile-only (rendered conditionally by the caller via
 * useIsMobile, same pattern as the existing mobile drawer). Fixed to
 * the viewport bottom, safe-area aware for notch devices, 5 large
 * touch targets so the most common actions never need the drawer.
 * z-header (below the drawer's z-index) so the drawer still opens on
 * top of it when the person needs the rest of the navigation. Tab set
 * is role-aware (see ROLE_TABS) — roles without a specific entry get
 * the original, unchanged default.
 */
export function BottomNav({ homeHref = "/dashboard", alertCount = 0, role }: BottomNavProps) {
  const pathname = usePathname();
  const tabs = (role && ROLE_TABS[role]) || DEFAULT_TABS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-header flex items-stretch border-t border-line bg-white dark:bg-charcoal-soft dark:border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ label, href, icon: Icon }) => {
        const target = label === "Home" ? homeHref : href;
        const active = label === "Home" ? pathname === homeHref : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={label}
            href={target}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors ${
              active ? "text-gold-dim" : "text-ink-faint"
            }`}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
              {label === "Alerts" && alertCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-fall text-[9px] font-semibold text-white">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </span>
            <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
            {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold-dim" />}
          </Link>
        );
      })}
    </nav>
  );
}
