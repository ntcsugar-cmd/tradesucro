import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

/** Skeleton — the base pulse block. Compose with utility classes for any shape. */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("animate-pulse rounded-sm bg-charcoal/[0.08] dark:bg-white/10", className)} />;
}

/** SkeletonText — a paragraph-shaped stack of lines. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** SkeletonCard — mirrors the shape of a standard listing/dashboard card. */
export function SkeletonCard() {
  return (
    <div className="border border-line dark:border-white/10 rounded-sm p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-7 w-32 mt-5" />
      <Skeleton className="h-3 w-20 mt-2" />
      <Skeleton className="h-8 w-full mt-5" />
    </div>
  );
}

/** SkeletonTableRow — mirrors a Table row while data loads. */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-t border-line dark:border-white/10">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
