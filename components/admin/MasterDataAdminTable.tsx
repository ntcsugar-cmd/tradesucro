"use client";

import { ArrowUp, ArrowDown, Pencil, Power, PowerOff } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import type { MasterRecordStatus } from "@/lib/types/masterDataAdmin";

export interface MasterDataRow {
  id: string;
  code: string;
  displayName: string;
  status: MasterRecordStatus;
  sortOrder: number;
}

interface MasterDataAdminTableProps<T extends MasterDataRow> {
  rows: T[];
  loading?: boolean;
  extraColumns?: DataTableColumn<T>[];
  onEdit: (row: T) => void;
  onToggleStatus: (row: T) => void;
  onReorder: (row: T, direction: "up" | "down") => void;
}

/** MasterDataAdminTable — the one table implementation both the Product Master and Grade Master admin pages render, so "Add / Edit / Deactivate / Reorder" behaves identically for every master list TradeSucro adds going forward. */
export function MasterDataAdminTable<T extends MasterDataRow>({ rows, loading = false, extraColumns = [], onEdit, onToggleStatus, onReorder }: MasterDataAdminTableProps<T>) {
  const columns: DataTableColumn<T>[] = [
    {
      key: "sortOrder",
      header: "Order",
      render: (r) => (
        <div className="flex items-center gap-1">
          <IconButton variant="ghost" size="sm" aria-label="Move up" onClick={() => onReorder(r, "up")}>
            <ArrowUp size={13} />
          </IconButton>
          <IconButton variant="ghost" size="sm" aria-label="Move down" onClick={() => onReorder(r, "down")}>
            <ArrowDown size={13} />
          </IconButton>
        </div>
      ),
    },
    { key: "code", header: "Code", render: (r) => <span className="font-mono text-[13px]">{r.code}</span> },
    { key: "displayName", header: "Display Name", render: (r) => <span className="font-medium text-charcoal">{r.displayName}</span> },
    ...extraColumns,
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "active" ? "success" : "neutral"}>{r.status === "active" ? "Active" : "Inactive"}</StatusBadge> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton variant="ghost" size="sm" aria-label={`Edit ${r.displayName}`} onClick={() => onEdit(r)}>
            <Pencil size={14} />
          </IconButton>
          <IconButton variant="ghost" size="sm" aria-label={r.status === "active" ? `Deactivate ${r.displayName}` : `Activate ${r.displayName}`} onClick={() => onToggleStatus(r)}>
            {r.status === "active" ? <PowerOff size={14} className="text-fall" /> : <Power size={14} className="text-rise" />}
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={20}
      emptyTitle="No records yet"
      emptyDescription="Add the first record using the button above."
    />
  );
}
