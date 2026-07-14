import { Trophy, ShieldCheck, Star } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { MatchScoreBadge } from "@/components/market-match";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { SupplierComparisonRow } from "@/lib/types/commercial";

const RANK_TONE = ["text-gold-bright", "text-ink-soft", "text-gold-dim"];

interface SupplierComparisonTableProps {
  rows: SupplierComparisonRow[];
  loading?: boolean;
}

export function SupplierComparisonTable({ rows, loading = false }: SupplierComparisonTableProps) {
  const columns: DataTableColumn<SupplierComparisonRow>[] = [
    {
      key: "overallRank",
      header: "Rank",
      render: (r) => (
        <span className="flex items-center gap-1.5 font-mono">
          {r.overallRank <= 3 && <Trophy size={12} className={RANK_TONE[r.overallRank - 1]} />}#{r.overallRank}
        </span>
      ),
    },
    { key: "supplierName", header: "Supplier", render: (r) => <span className="flex items-center gap-1.5 font-medium">{r.supplierName}<ShieldCheck size={12} className="text-success" /></span> },
    { key: "state", header: "State", render: (r) => getMasterStateLabel(r.state) },
    { key: "grade", header: "Grade", render: (r) => <span className="font-mono">{getProductLabel(r.product)} · {r.grade}</span> },
    { key: "exMillPrice", header: "Ex-Mill", align: "right", render: (r) => <span className="font-mono">{formatINR(r.exMillPrice)}</span> },
    { key: "freight", header: "Freight", align: "right", render: (r) => <span className="font-mono text-ink-soft">{formatINR(r.freight)}</span> },
    { key: "insurance", header: "Insurance", align: "right", render: (r) => <span className="font-mono text-ink-soft">{formatINR(r.insurance)}</span> },
    { key: "brokerage", header: "Brokerage", align: "right", render: (r) => <span className="font-mono text-ink-soft">{formatINR(r.brokerage)}</span> },
    { key: "totalLandedCost", header: "Landed Cost", align: "right", render: (r) => <span className="font-mono font-semibold text-charcoal">{formatINR(r.totalLandedCost)}</span> },
    { key: "dispatchDays", header: "Dispatch", align: "right", render: (r) => <span className="font-mono">{r.dispatchDays}d</span> },
    { key: "qualityRating", header: "Quality", render: (r) => <span className="flex items-center gap-1 font-mono"><Star size={11} className="text-gold-dim fill-gold-dim" /> {r.qualityRating.toFixed(1)}</span> },
    { key: "trustScore", header: "Trust", render: (r) => <span className="font-mono">{r.trustScore.toFixed(1)}</span> },
    { key: "expectedMargin", header: "Expected Margin", align: "right", render: (r) => <span className={`font-mono ${r.expectedMargin >= 0 ? "text-rise" : "text-fall"}`}>{formatINR(r.expectedMargin)}</span> },
    { key: "commercialScore", header: "Score", render: (r) => <MatchScoreBadge score={r.commercialScore} /> },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      loading={loading}
      pageSize={15}
      emptyTitle="No offers to compare"
      emptyDescription="No published mill offers match this grade right now."
    />
  );
}
