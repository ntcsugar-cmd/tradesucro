"use client";

import { ReactNode, useState } from "react";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
  active?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarNavItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Omit to let the Sidebar manage its own collapse state (e.g. standalone demos). */
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  /** Renders as a full-width drawer panel (mobile) instead of the persistent rail (desktop). */
  variant?: "rail" | "drawer";
  onCloseDrawer?: () => void;
}

/**
 * Sidebar — collapsible vertical navigation for dashboard/internal app
 * shells. Collapse state can be controlled by a parent (see
 * app/(dashboard)/layout.tsx, which persists it across the drawer/rail
 * switch) or left uncontrolled for standalone use.
 */
export function Sidebar({
  sections,
  header,
  footer,
  className,
  collapsed: collapsedProp,
  onToggleCollapsed,
  variant = "rail",
  onCloseDrawer,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const toggleCollapsed = onToggleCollapsed ?? (() => setInternalCollapsed((c) => !c));
  const isDrawer = variant === "drawer";

  return (
    <aside
      className={clsx(
        "flex flex-col h-full bg-charcoal dark:bg-charcoal-soft text-white transition-[width] duration-200 shrink-0",
        isDrawer ? "w-[280px]" : collapsed ? "w-[72px]" : "w-[240px]",
        className
      )}
    >
      <div
        className={clsx("flex items-center border-b border-white/10", collapsed && !isDrawer ? "justify-center px-0 py-5" : "justify-between px-4 py-5")}
        style={isDrawer ? { paddingTop: "calc(env(safe-area-inset-top) + 20px)" } : undefined}
      >
        {header}
        {isDrawer && (
          <IconButton variant="ghost-dark" size="sm" aria-label="Close menu" onClick={onCloseDrawer}>
            <X size={18} />
          </IconButton>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section, i) => (
          <div key={section.title ?? i}>
            {section.title && (collapsed === false || isDrawer) && (
              <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-widest2 text-white/35">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  title={collapsed && !isDrawer ? item.label : undefined}
                  aria-current={item.active ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    collapsed && !isDrawer && "justify-center px-0",
                    item.active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className={clsx("shrink-0", item.active && "text-gold-bright")}>{item.icon}</span>
                  {(!collapsed || isDrawer) && <span className="flex-1">{item.label}</span>}
                  {(!collapsed || isDrawer) && item.badge}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        {footer && (!collapsed || isDrawer) && <div className="mb-2">{footer}</div>}
        {!isDrawer && (
          <Button
            variant="ghost-dark"
            size="sm"
            fullWidth
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </Button>
        )}
      </div>
    </aside>
  );
}
