"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Building2, Sparkles, BarChart3 } from "lucide-react";

const TRADER_SUB_NAV = [
  { label: "Trading Desk", href: "/trader", icon: LayoutDashboard },
  { label: "Purchases", href: "/trader/purchases", icon: ShoppingBag },
  { label: "Suppliers", href: "/trader/suppliers", icon: Building2 },
  { label: "Opportunities", href: "/trader/opportunities", icon: Sparkles },
  { label: "Analytics", href: "/trader/analytics", icon: BarChart3 },
];

/** TraderSubNav — in-module navigation for the Trader Workspace. Existing Navigation (lib/constants/navigation.ts) is protected, so this local tab bar is what links /trader's own sections together. Same links/hrefs/active logic as before — visual treatment only. */
export function TraderSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-dropdown -mx-6 mb-8 border-b border-line dark:border-white/10 bg-paper/95 dark:bg-charcoal/95 px-6 backdrop-blur-sm md:-mx-10 md:px-10">
      <nav className="flex items-center gap-0.5 overflow-x-auto">
        {TRADER_SUB_NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/trader" ? pathname === "/trader" || pathname === "/trader/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-3.5 text-[13px] font-medium transition-colors ${
                active ? "text-charcoal dark:text-white" : "text-ink-faint dark:text-white/40 hover:text-charcoal dark:hover:text-white"
              }`}
            >
              <Icon size={15} className={active ? "text-gold-dim" : "text-ink-faint dark:text-white/40 group-hover:text-ink-soft dark:group-hover:text-white/70 transition-colors"} />
              {label}
              <span
                className={`absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-colors ${active ? "bg-gold" : "bg-transparent"}`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
