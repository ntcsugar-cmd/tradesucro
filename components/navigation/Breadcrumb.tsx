import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import clsx from "clsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("flex items-center gap-1.5 text-[13px]", className)}>
      <Link href="/" className="text-ink-faint dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-ink-faint/60 dark:text-white/40" />
            {item.href && !isLast ? (
              <Link href={item.href} className="text-ink-soft dark:text-white/50 hover:text-charcoal dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-charcoal dark:text-white font-medium" : "text-ink-soft dark:text-white/50"}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
