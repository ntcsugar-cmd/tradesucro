"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function getPageWindow(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  const pages = getPageWindow(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-line dark:border-white/10 text-ink-soft dark:text-white/50 hover:border-charcoal/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="flex h-9 w-9 items-center justify-center text-ink-faint dark:text-white/40">
            <MoreHorizontal size={16} />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={clsx(
              "h-9 w-9 rounded-sm text-[13px] font-mono transition-colors",
              p === currentPage
                ? "bg-charcoal text-white"
                : "text-ink-soft dark:text-white/50 hover:bg-charcoal/5 dark:hover:bg-white/5"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-line dark:border-white/10 text-ink-soft dark:text-white/50 hover:border-charcoal/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
