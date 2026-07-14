"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag, ClipboardList, Users, BookOpen, BarChart3 } from "lucide-react";

const RESALE_SUB_NAV = [
  { label: "Trading Desk", href: "/trader", icon: LayoutDashboard },
  { label: "Resale Offers", href: "/trader/resale", icon: Tag },
  { label: "Customer Orders", href: "/trader/orders", icon: ClipboardList },
  { label: "Customers", href: "/trader/customers", icon: Users },
  { label: "Customer Ledger", href: "/trader/customer-ledger", icon: BookOpen },
  { label: "Sales Analytics", href: "/trader/sales-analytics", icon: BarChart3 },
];

/**
 * ResaleSubNav — in-module navigation for Resale Market & Customer
 * Orders. Existing Navigation (lib/constants/navigation.ts) and the
 * Trader Dashboard's own TraderSubNav are both protected this pass, so
 * this is a new, separate tab bar (not an edit to TraderSubNav) — it
 * includes a "Trading Desk" link back for orientation, since the
 * reverse link can't be added without touching a protected file.
 */
export function ResaleSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex items-center gap-1 overflow-x-auto rounded-sm border border-line bg-charcoal/[0.02] p-1.5">
      {RESALE_SUB_NAV.map(({ label, href, icon: Icon }) => {
        const active = href === "/trader" ? pathname === "/trader" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3.5 py-2 text-[13px] font-medium transition-colors ${
              active ? "bg-white text-charcoal shadow-card" : "text-ink-faint hover:text-charcoal"
            }`}
          >
            <Icon size={14} className={active ? "text-gold-dim" : ""} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
