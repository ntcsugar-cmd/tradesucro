"use client";

import { ReactNode, useMemo, useState } from "react";
import clsx from "clsx";
import { Table, THead, TBody, TR, TH, TD } from "./Table";
import { Pagination } from "@/components/navigation/Pagination";
import { SkeletonTableRow } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export interface DataTableColumn<T> {
  /** Key into the row object, or a synthetic id if using a custom `render`. */
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  /** Custom cell renderer. Falls back to `String(row[key])` if omitted. */
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable unique id per row, used as the React key. */
  getRowId: (row: T) => string;
  loading?: boolean;
  /** Rows per page. Omit or set to 0 to disable pagination. */
  pageSize?: number;
  stickyHeader?: boolean;
  /** Caps the scroll area height — required for stickyHeader to have an effect. */
  maxHeight?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

function getValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" };

/**
 * DataTable — the standard reusable data grid for TradeSucro. Wraps the low
 * level Table/THead/TBody/TR/TH/TD primitives with sorting, client-side
 * pagination, a loading skeleton, and an empty state, so feature code never
 * hand-rolls table chrome.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  pageSize = 0,
  stickyHeader = false,
  maxHeight,
  emptyTitle = "No results",
  emptyDescription = "There's nothing to show with the current filters.",
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDirection) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDirection === "asc" ? av - bv : bv - av;
      }
      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return sortDirection === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return copy;
  }, [data, sortKey, sortDirection]);

  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const pageData = pageSize > 0 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
      return;
    }
    setSortDirection((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
    if (sortDirection === "desc") setSortKey(null);
  }

  const showEmpty = !loading && data.length === 0;

  return (
    <div className={className}>
      <div className={clsx(maxHeight && "overflow-y-auto", maxHeight)} style={maxHeight ? { maxHeight } : undefined}>
        <Table>
          <THead className={stickyHeader ? "sticky top-0 z-dropdown" : undefined}>
            <TR>
              {columns.map((col) => (
                <TH
                  key={col.key}
                  sortable={col.sortable}
                  sortDirection={sortKey === col.key ? sortDirection : null}
                  onSort={() => col.sortable && handleSort(col.key)}
                  className={clsx(col.align && alignClass[col.align])}
                >
                  {col.header}
                </TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {loading &&
              Array.from({ length: pageSize || 5 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={columns.length} />
              ))}

            {!loading &&
              pageData.map((row) => (
                <TR
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {columns.map((col) => (
                    <TD key={col.key} className={clsx(col.align && alignClass[col.align], col.className)}>
                      {col.render ? col.render(row) : String(getValue(row, col.key) ?? "—")}
                    </TD>
                  ))}
                </TR>
              ))}
          </TBody>
        </Table>
      </div>

      {showEmpty && <EmptyState title={emptyTitle} description={emptyDescription} />}

      {pageSize > 0 && !showEmpty && !loading && totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
