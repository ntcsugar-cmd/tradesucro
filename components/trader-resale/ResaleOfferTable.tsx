"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { ResaleOfferStatusBadge } from "./ResaleBadges";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { ResaleOffer } from "@/lib/types/traderResale";

interface ResaleOfferTableProps {
  offers: ResaleOffer[];
  loading?: boolean;
}

export function ResaleOfferTable({ offers, loading = false }: ResaleOfferTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<ResaleOffer>[] = [
    { key: "offerNumber", header: "Offer No", render: (o) => <span className="font-mono text-xs">{o.offerNumber}</span> },
    { key: "lotNumber", header: "Lot", render: (o) => <span className="font-mono text-xs text-ink-faint dark:text-white/40">{o.lotNumber}</span> },
    { key: "grade", header: "Grade", render: (o) => <span className="font-mono">{getProductLabel(o.product)} · {o.grade}</span> },
    { key: "offeredQuantity", header: "Quantity", align: "right", render: (o) => <span className="font-mono">{formatQuantityMt(o.offeredQuantity)}</span> },
    { key: "averageCost", header: "Avg. Cost", align: "right", render: (o) => <span className="font-mono text-ink-faint dark:text-white/40">{formatINR(o.averageCost)}</span> },
    { key: "sellingPrice", header: "Selling Price", align: "right", render: (o) => <span className="font-mono text-charcoal dark:text-white">{formatINR(o.sellingPrice)}</span> },
    {
      key: "margin",
      header: "Margin",
      align: "right",
      render: (o) => {
        const marginPct = o.sellingPrice > 0 ? ((o.sellingPrice - o.averageCost) / o.sellingPrice) * 100 : 0;
        return <span className={`font-mono ${marginPct >= 0 ? "text-rise" : "text-fall"}`}>{marginPct.toFixed(1)}%</span>;
      },
    },
    { key: "validTill", header: "Valid Till", render: (o) => new Date(o.validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { key: "status", header: "Status", render: (o) => <ResaleOfferStatusBadge status={o.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${o.offerNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/trader/resale/${o.id}`); }}>
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={offers}
      getRowId={(o) => o.id}
      loading={loading}
      pageSize={12}
      onRowClick={(o) => router.push(`/trader/resale/${o.id}`)}
      emptyTitle="No resale offers"
      emptyDescription="Create an offer from your purchased inventory to start selling."
    />
  );
}
