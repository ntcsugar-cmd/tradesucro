import { ShieldCheck, MapPin, Truck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Badge } from "@/components/common/Badge";
import { MatchScoreBadge, MatchReasonsList } from "./MatchScoreBadge";
import { getProductLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MatchCandidate } from "@/lib/types/smartMatch";

const SOURCE_LABELS: Record<MatchCandidate["sourceType"], string> = {
  marketplace_offer: "Marketplace",
  mill_offer: "Mill Offer",
  resale_offer: "Trader Resale",
  tender_award: "Tender Award",
};

function dispatchSpeedLabel(days: number): string {
  if (days <= 0) return "Immediate";
  if (days <= 3) return "Fast (≤3d)";
  if (days <= 7) return "Standard (≤7d)";
  return `Slow (${days}d)`;
}

interface MatchCandidateTableProps {
  candidates: MatchCandidate[];
  loading?: boolean;
}

export function MatchCandidateTable({ candidates, loading = false }: MatchCandidateTableProps) {
  const columns: DataTableColumn<MatchCandidate>[] = [
    {
      key: "matchScore",
      header: "Match",
      render: (c) => <MatchScoreBadge score={c.matchScore} />,
    },
    {
      key: "supplierName",
      header: "Supplier",
      render: (c) => (
        <div>
          <span className="flex items-center gap-1.5 font-medium text-charcoal">
            {c.supplierName}
            {c.verified && <ShieldCheck size={12} className="text-success" />}
          </span>
          <Badge tone="gold" className="mt-1">
            {SOURCE_LABELS[c.sourceType]}
          </Badge>
        </div>
      ),
    },
    { key: "grade", header: "Grade", render: (c) => <span className="font-mono">{getProductLabel(c.product)} · {c.grade}</span> },
    { key: "price", header: "Price", align: "right", render: (c) => <span className="font-mono">{formatINR(c.price)}</span> },
    { key: "quantityAvailable", header: "Quantity", align: "right", render: (c) => <span className="font-mono">{formatQuantityMt(c.quantityAvailable)}</span> },
    {
      key: "distanceKm",
      header: "Distance",
      align: "right",
      render: (c) => (
        <span className="flex items-center justify-end gap-1 text-ink-soft">
          <MapPin size={11} /> {c.distanceKm} km
        </span>
      ),
    },
    {
      key: "expectedDispatchDays",
      header: "Dispatch",
      render: (c) => (
        <span className="flex items-center gap-1 text-ink-soft">
          <Truck size={11} /> {dispatchSpeedLabel(c.expectedDispatchDays)}
        </span>
      ),
    },
    { key: "paymentTerms", header: "Payment", render: (c) => <span className="text-ink-soft">{c.paymentTerms ? getPaymentTermLabel(c.paymentTerms) : "—"}</span> },
    {
      key: "estimatedProfitPotential",
      header: "Profit Potential",
      align: "right",
      render: (c) => (c.estimatedProfitPotential ? <span className="font-mono text-rise">{formatINR(c.estimatedProfitPotential)}</span> : <span className="text-ink-faint">—</span>),
    },
    { key: "matchReasons", header: "Why this match", render: (c) => <MatchReasonsList reasons={c.matchReasons} /> },
  ];

  return (
    <DataTable
      columns={columns}
      data={candidates}
      getRowId={(c) => c.id}
      loading={loading}
      pageSize={10}
      emptyTitle="No matches found"
      emptyDescription="Widen your criteria — try a different grade, state, or price ceiling."
    />
  );
}
