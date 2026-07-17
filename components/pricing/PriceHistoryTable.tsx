import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { formatINR } from "@/lib/utils/format";
import type { PriceRevision } from "@/lib/types/millPricing";

interface PriceHistoryTableProps {
  revisions: PriceRevision[];
  loading?: boolean;
}

export function PriceHistoryTable({ revisions, loading = false }: PriceHistoryTableProps) {
  const columns: DataTableColumn<PriceRevision>[] = [
    { key: "revisionNo", header: "Revision No", render: (r) => <span className="font-mono">Rev {r.revisionNo}</span> },
    { key: "oldPrice", header: "Old Price", render: (r) => <span className="font-mono">{formatINR(r.oldPrice)}</span> },
    { key: "newPrice", header: "New Price", render: (r) => <span className="font-mono">{formatINR(r.newPrice)}</span> },
    {
      key: "difference",
      header: "Difference",
      render: (r) => (
        <span className={`font-mono ${r.difference > 0 ? "text-rise" : r.difference < 0 ? "text-fall" : "text-ink-faint dark:text-white/40"}`}>
          {r.difference > 0 ? "+" : ""}{formatINR(r.difference)}
        </span>
      ),
    },
    { key: "changedAt", header: "Time", render: (r) => new Date(r.changedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
    { key: "updatedBy", header: "Updated By" },
    { key: "reason", header: "Reason" },
  ];

  return (
    <DataTable
      columns={columns}
      data={revisions}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={15}
      emptyTitle="No price revisions"
      emptyDescription="Price changes will be recorded here."
    />
  );
}
