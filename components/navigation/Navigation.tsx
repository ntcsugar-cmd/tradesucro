import { AnchorHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}

/** NavLink — a single navigation item, styled consistently wherever it's used (top nav, sidebar, footer). */
export function NavLink({ active = false, icon, badge, className, children, ...props }: NavLinkProps) {
  return (
    <a
      className={clsx(
        "flex items-center gap-2.5 text-[13.5px] font-medium transition-colors",
        active ? "text-charcoal" : "text-ink-soft hover:text-charcoal",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {badge}
    </a>
  );
}

interface NavMenuProps {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/** NavMenu — lays out a group of NavLinks. */
export function NavMenu({ children, orientation = "horizontal", className }: NavMenuProps) {
  return (
    <nav
      className={clsx(
        "flex",
        orientation === "horizontal" ? "flex-row items-center gap-8" : "flex-col gap-1",
        className
      )}
    >
      {children}
    </nav>
  );
}
