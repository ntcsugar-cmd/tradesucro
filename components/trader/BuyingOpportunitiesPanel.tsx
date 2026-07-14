"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, MapPin, Flame } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/common/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { traderDashboardService } from "@/services/traderDashboard.service";
import { getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { BuyingOpportunity } from "@/lib/types/traderWorkspace";

export function BuyingOpportunitiesPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<BuyingOpportunity[]>([]);

  useEffect(() => {
    traderDashboardService.getBuyingOpportunities(8).then((result) => {
      setOpportunities(result);
      setLoading(false);
    });
  }, []);

  function handleBuyNow(opp: BuyingOpportunity) {
    const params = new URLSearchParams({ mill: opp.millName, grade: opp.grade, quantity: String(opp.quantity), rate: String(opp.rate) });
    router.push(`/trader/purchases/create?${params.toString()}`);
  }

  const topMargin = opportunities[0]?.expectedMargin ?? 0;

  const columns: DataTableColumn<BuyingOpportunity>[] = [
    {
      key: "millName",
      header: "Mill",
      render: (o) => (
        <div className="flex items-center gap-2">
          {o.expectedMargin === topMargin && (
            <span title="Best margin available">
              <Flame size={13} className="text-gold-dim shrink-0" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{o.millName}</p>
            <p className="flex items-center gap-1 text-[11px] text-ink-faint">
              <MapPin size={10} /> {getMasterStateLabel(o.state)}
            </p>
          </div>
        </div>
      ),
    },
    { key: "grade", header: "Grade", render: (o) => <span className="font-mono">{o.grade}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (o) => <span className="font-mono">{formatQuantityMt(o.quantity)}</span> },
    { key: "rate", header: "Rate", align: "right", render: (o) => <span className="font-mono">{formatINR(o.rate)}</span> },
    { key: "distanceKm", header: "Distance", align: "right", render: (o) => <span className="text-ink-soft">{o.distanceKm} km</span> },
    { key: "paymentTerms", header: "Payment Terms", render: (o) => <span className="text-ink-soft">{getPaymentTermLabel(o.paymentTerms)}</span> },
    {
      key: "expectedMargin",
      header: "Expected Margin",
      align: "right",
      render: (o) => (
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono font-semibold text-rise">{formatINR(o.expectedMargin)}</span>
          {o.expectedMargin === topMargin && <Badge tone="gold">Best</Badge>}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <Button variant="primary" size="sm" onClick={() => handleBuyNow(o)}>
          <ShoppingCart size={13} /> Buy Now
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <DataTable
      columns={columns}
      data={opportunities}
      getRowId={(o) => o.id}
      pageSize={8}
      emptyTitle="No opportunities right now"
      emptyDescription="Check back shortly — the market updates throughout the day."
    />
  );
}
