import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Skeleton } from "@/components/ui/Skeleton";

interface LiveListingsPanelProps<T> {
  title: string;
  items: T[];
  loading?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  emptyText?: string;
  viewAllHref?: string;
}

export function LiveListingsPanel<T>({ title, items, loading = false, renderItem, getKey, emptyText = "Nothing to show right now.", viewAllHref }: LiveListingsPanelProps<T>) {
  return (
    <DashboardWidget
      title={title}
      action={
        viewAllHref ? (
          <Link href={viewAllHref} className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            View all <ArrowUpRight size={12} />
          </Link>
        ) : undefined
      }
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-ink-faint dark:text-white/40 italic py-2">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-line -my-1">
          {items.map((item, i) => (
            <li key={getKey(item, i)} className="py-2.5">
              {renderItem(item, i)}
            </li>
          ))}
        </ul>
      )}
    </DashboardWidget>
  );
}
