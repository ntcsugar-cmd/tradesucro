"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Purchase } from "@/lib/types/traderWorkspace";

interface PurchaseTableProps {
  purchases: Purchase[];
  loading?: boolean;
}

export function PurchaseTable({ purchases, loading = false }: PurchaseTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<Purchase>[] = [
    {
      key: "purchaseNumber",
      header: "Purchase No",
      render: (p) => (
        <div>
          <p className="font-mono text-xs text-charcoal dark:text-white">{p.purchaseNumber}</p>
          <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{new Date(p.purchaseDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Supplier / Mill",
      render: (p) => (
        <div>
          <p className="font-medium text-charcoal dark:text-white">{p.supplier}</p>
          {p.supplier !== p.mill && <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">via {p.mill}</p>}
        </div>
      ),
    },
    { key: "broker", header: "Broker", render: (p) => (p.broker ? p.broker : <span className="text-ink-faint dark:text-white/40">—</span>) },
    { key: "grade", header: "Grade", render: (p) => <span className="font-mono">{getProductLabel(p.product)} · {p.grade}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (p) => <span className="font-mono">{formatQuantityMt(p.quantity)}</span> },
    { key: "rate", header: "Rate", align: "right", render: (p) => <span className="font-mono">{formatINR(p.rate)}</span> },
    { key: "totalCost", header: "Total Amount", align: "right", render: (p) => <span className="font-mono font-medium text-charcoal dark:text-white">{formatINR(p.totalCost)}</span> },
    {
      key: "dealReference",
      header: "Deal Reference",
      render: (p) => (p.dealReference ? <span className="font-mono text-xs text-gold-dim">{p.dealReference}</span> : <span className="text-ink-faint dark:text-white/40">—</span>),
    },
    { key: "status", header: "Status", render: (p) => <PurchaseStatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${p.purchaseNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/trader/purchases/${p.id}`); }}>
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={purchases}
      getRowId={(p) => p.id}
      loading={loading}
      pageSize={12}
      onRowClick={(p) => router.push(`/trader/purchases/${p.id}`)}
      emptyTitle="No purchases"
      emptyDescription="No purchases match your search or filters right now."
    />
  );
}
