import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { GradeInventory } from "@/lib/types/millOperations";

interface InventoryTableProps {
  rows: GradeInventory[];
  loading?: boolean;
}

export function InventoryTable({ rows, loading = false }: InventoryTableProps) {
  const columns: DataTableColumn<GradeInventory>[] = [
    { key: "product", header: "Product", render: (r) => <span className="font-medium">{getProductLabel(r.product)} · {r.grade}</span> },
    { key: "openingStock", header: "Opening Stock", align: "right", render: (r) => <span className="font-mono">{formatQuantityMt(r.openingStock)}</span> },
    { key: "todaysProduction", header: "Today's Production", align: "right", render: (r) => <span className="font-mono">{formatQuantityMt(r.todaysProduction)}</span> },
    { key: "totalStock", header: "Total Stock", align: "right", render: (r) => <span className="font-mono font-semibold">{formatQuantityMt(r.totalStock)}</span> },
    { key: "reservedStock", header: "Reserved", align: "right", render: (r) => <span className="font-mono text-gold-dim">{formatQuantityMt(r.reservedStock)}</span> },
    { key: "availableStock", header: "Available", align: "right", render: (r) => <span className="font-mono text-success-700">{formatQuantityMt(r.availableStock)}</span> },
    { key: "dispatched", header: "Dispatched", align: "right", render: (r) => <span className="font-mono">{formatQuantityMt(r.dispatched)}</span> },
    { key: "closingStock", header: "Closing Stock", align: "right", render: (r) => <span className="font-mono font-semibold">{formatQuantityMt(r.closingStock)}</span> },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      loading={loading}
      emptyTitle="No inventory data"
      emptyDescription="Inventory will appear here once production data is recorded."
    />
  );
}
