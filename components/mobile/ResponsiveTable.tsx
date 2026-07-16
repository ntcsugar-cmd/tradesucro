"use client";

import type { ReactNode } from "react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface ResponsiveTableProps<T> {
  data: T[];
  getRowId: (row: T) => string;
  columns: DataTableColumn<T>[];
  renderMobileCard: (row: T) => ReactNode;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  /** Desktop-only enterprise table features (mobile already gets its own card view) — see DataTable for details. */
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  exportFilename?: string;
}

/**
 * ResponsiveTable — renders the existing DataTable unchanged on
 * desktop (md+) and a MobileDataCard list on mobile. Existing pages
 * retrofit by keeping their DataTableColumn[] as-is and adding one
 * renderMobileCard function; nothing about the desktop table changes.
 */
export function ResponsiveTable<T>({
  data,
  getRowId,
  columns,
  renderMobileCard,
  loading = false,
  onRowClick,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  pageSize = 12,
  enableColumnVisibility = false,
  enableExport = false,
  exportFilename,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <DataTable
        columns={columns}
        data={data}
        getRowId={getRowId}
        loading={loading}
        pageSize={pageSize}
        onRowClick={onRowClick}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        enableColumnVisibility={enableColumnVisibility}
        enableExport={enableExport}
        exportFilename={exportFilename}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-3">
      {data.map((row) => (
        <div key={getRowId(row)}>{renderMobileCard(row)}</div>
      ))}
    </div>
  );
}
