"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, UserRound, Inbox, FileStack, Route, History, BarChart3 } from "lucide-react";

const TRANSPORT_SUB_NAV = [
  { label: "Dashboard", href: "/transport", icon: LayoutDashboard },
  { label: "New Inquiries", href: "/transport/loads", icon: Inbox },
  { label: "My Quotations", href: "/transport/quotations", icon: FileStack },
  { label: "Active Trips", href: "/transport/dispatches", icon: Route },
  { label: "Completed Trips", href: "/transport/trips", icon: History },
  { label: "Fleet", href: "/transport/vehicles", icon: Truck },
  { label: "Drivers", href: "/transport/drivers", icon: UserRound },
  { label: "Analytics & Earnings", href: "/transport/analytics", icon: BarChart3 },
];

/** TransportSubNav — in-module navigation for the Transport Workspace, same pattern as TraderSubNav so the two workspaces feel like one product. */
export function TransportSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-dropdown -mx-6 mb-8 border-b border-line dark:border-white/10 bg-paper/95 dark:bg-charcoal/95 px-6 backdrop-blur-sm md:-mx-10 md:px-10">
      <nav className="flex items-center gap-0.5 overflow-x-auto">
        {TRANSPORT_SUB_NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/transport" ? pathname === "/transport" : pathname.startsWith(href);
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
              <span className={`absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-colors ${active ? "bg-gold" : "bg-transparent"}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
