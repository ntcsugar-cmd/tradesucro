"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import { Download, Columns3, Check } from "lucide-react";
import clsx from "clsx";
import { Table, THead, TBody, TR, TH, TD } from "./Table";
import { Pagination } from "@/components/navigation/Pagination";
import { SkeletonTableRow } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";

export interface DataTableColumn<T> {
  /** Key into the row object, or a synthetic id if using a custom `render`. */
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  /** Custom cell renderer. Falls back to `String(row[key])` if omitted. */
  render?: (row: T) => ReactNode;
  className?: string;
  /** Pins this column to the left edge, above horizontally-scrolled content. Frozen columns must be the leading columns in the array — offsets are computed left-to-right in array order. */
  frozen?: boolean;
  /** Lets the user drag this column's right edge to resize it. */
  resizable?: boolean;
  /** Plain-text value used for CSV export when `render` produces JSX that can't be serialized directly. Falls back to the row's raw field value. */
  exportValue?: (row: T) => string | number;
  /** Excludes this column from the "Show/Hide Columns" menu — it's always shown (and always exported/never hidden). Use for identity columns like the row's primary name/code. */
  alwaysVisible?: boolean;
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
  /** Shows a "Columns" toggle in the table toolbar, letting the user hide/show any column not marked alwaysVisible. */
  enableColumnVisibility?: boolean;
  /** Shows an "Export" button in the table toolbar that downloads the current sort order and visible columns (full filtered dataset, not just the current page) as CSV. */
  enableExport?: boolean;
  exportFilename?: string;
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
  enableColumnVisibility = false,
  enableExport = false,
  exportFilename = "export",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const resizing = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const visibleColumns = useMemo(() => columns.filter((c) => c.alwaysVisible || !hiddenKeys.has(c.key)), [columns, hiddenKeys]);

  // Cumulative left offset for each frozen column, in array order, so multiple frozen columns stack correctly rather than overlapping.
  const frozenOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let running = 0;
    for (const col of visibleColumns) {
      if (!col.frozen) continue;
      offsets[col.key] = running;
      running += colWidths[col.key] ?? 160;
    }
    return offsets;
  }, [visibleColumns, colWidths]);

  function startResize(key: string, e: React.MouseEvent, currentWidth: number) {
    resizing.current = { key, startX: e.clientX, startWidth: currentWidth };
    function onMove(moveEvent: MouseEvent) {
      if (!resizing.current) return;
      const delta = moveEvent.clientX - resizing.current.startX;
      const next = Math.max(80, resizing.current.startWidth + delta);
      setColWidths((prev) => ({ ...prev, [resizing.current!.key]: next }));
    }
    function onUp() {
      resizing.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function toggleColumn(key: string) {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleExport() {
    const exportColumns = visibleColumns;
    const header = exportColumns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const rows = sorted.map((row) =>
      exportColumns
        .map((c) => {
          const raw = c.exportValue ? c.exportValue(row) : getValue(row, c.key);
          const cell = raw === undefined || raw === null ? "" : String(raw);
          return `"${cell.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFilename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

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
      {(enableColumnVisibility || enableExport) && (
        <div className="flex items-center justify-end gap-2 mb-3">
          {enableColumnVisibility && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setColumnsMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-sm border border-line dark:border-white/15 px-3 py-1.5 text-xs font-medium text-ink-soft dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:border-charcoal/30 dark:hover:border-white/30 transition-colors"
              >
                <Columns3 size={13} /> Columns
              </button>
              {columnsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-dropdown" onClick={() => setColumnsMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-full z-dropdown mt-1.5 w-56 rounded-sm border border-line dark:border-white/10 bg-white dark:bg-charcoal-soft shadow-lg py-1.5 max-h-72 overflow-y-auto">
                    {columns
                      .filter((c) => !c.alwaysVisible)
                      .map((c) => {
                        const visible = !hiddenKeys.has(c.key);
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => toggleColumn(c.key)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-charcoal dark:text-white hover:bg-charcoal/[0.04] dark:hover:bg-white/5 text-left"
                          >
                            <span className={clsx("flex h-4 w-4 items-center justify-center rounded-sm border", visible ? "bg-gold border-gold" : "border-line dark:border-white/20")}>
                              {visible && <Check size={11} className="text-charcoal dark:text-white" />}
                            </span>
                            {c.header}
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}
          {enableExport && (
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-sm border border-line dark:border-white/15 px-3 py-1.5 text-xs font-medium text-ink-soft dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:border-charcoal/30 dark:hover:border-white/30 transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>
      )}

      <div className={clsx(maxHeight && "overflow-y-auto", "overflow-x-auto", maxHeight)} style={maxHeight ? { maxHeight } : undefined}>
        <Table>
          <THead className={stickyHeader ? "sticky top-0 z-dropdown" : undefined}>
            <TR>
              {visibleColumns.map((col) => (
                <TH
                  key={col.key}
                  sortable={col.sortable}
                  sortDirection={sortKey === col.key ? sortDirection : null}
                  onSort={() => col.sortable && handleSort(col.key)}
                  className={clsx(col.align && alignClass[col.align], col.frozen && "sticky z-dropdown bg-[#faf9f7] dark:bg-charcoal")}
                  style={{
                    width: colWidths[col.key] ? `${colWidths[col.key]}px` : undefined,
                    left: col.frozen ? `${frozenOffsets[col.key]}px` : undefined,
                    position: col.frozen ? "sticky" : undefined,
                  }}
                >
                  <span className="relative flex items-center">
                    {col.header}
                    {col.resizable && (
                      <span
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResize(col.key, e, colWidths[col.key] ?? 160);
                        }}
                        className="absolute -right-2.5 top-1/2 h-4 w-2 -translate-y-1/2 cursor-col-resize"
                      />
                    )}
                  </span>
                </TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {loading &&
              Array.from({ length: pageSize || 5 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={visibleColumns.length} />
              ))}

            {!loading &&
              pageData.map((row) => (
                <TR
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {visibleColumns.map((col) => (
                    <TD
                      key={col.key}
                      className={clsx(col.align && alignClass[col.align], col.className, col.frozen && "sticky z-dropdown bg-white dark:bg-charcoal-soft")}
                      style={{
                        width: colWidths[col.key] ? `${colWidths[col.key]}px` : undefined,
                        left: col.frozen ? `${frozenOffsets[col.key]}px` : undefined,
                        position: col.frozen ? "sticky" : undefined,
                      }}
                    >
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
