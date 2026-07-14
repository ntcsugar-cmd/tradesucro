"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { DealStatusBadge } from "./DealStatusBadge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Deal } from "@/lib/types/deal";

interface DealTableProps {
  deals: Deal[];
  loading?: boolean;
}

export function DealTable({ deals, loading = false }: DealTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<Deal>[] = [
    { key: "dealNumber", header: "Deal No", render: (d) => <span className="font-mono text-xs">{d.dealNumber}</span> },
    { key: "mill", header: "Mill", render: (d) => <span className="font-medium">{d.mill}</span> },
    { key: "buyer", header: "Buyer" },
    { key: "grade", header: "Grade", render: (d) => <span className="font-mono">{getProductLabel(d.product)} · {d.grade}</span> },
    { key: "quantity", header: "Quantity", render: (d) => <span className="font-mono">{formatQuantityMt(d.quantity)}</span> },
    { key: "totalValue", header: "Total Value", render: (d) => <span className="font-mono">{formatINR(d.totalValue)}</span> },
    { key: "status", header: "Status", render: (d) => <DealStatusBadge status={d.status} /> },
    {
      key: "updatedAt",
      header: "Updated",
      render: (d) => new Date(d.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (d) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${d.dealNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/deals/${d.id}`); }}>
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={deals}
      getRowId={(d) => d.id}
      loading={loading}
      pageSize={12}
      onRowClick={(d) => router.push(`/deals/${d.id}`)}
      emptyTitle="No deals"
      emptyDescription="No deals match your search or filters right now."
    />
  );
}
