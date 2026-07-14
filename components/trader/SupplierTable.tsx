"use client";

import { Star, ShieldCheck, Heart } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/common/Badge";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Supplier } from "@/lib/types/traderWorkspace";

interface SupplierTableProps {
  suppliers: Supplier[];
  loading?: boolean;
  onTogglePreferred: (id: string) => void;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} className={i < Math.round(rating) ? "text-gold-dim fill-gold-dim" : "text-charcoal/15 fill-charcoal/15"} />
        ))}
      </span>
      <span className="font-mono text-xs text-ink-soft">{rating.toFixed(1)}</span>
    </span>
  );
}

export function SupplierTable({ suppliers, loading = false, onTogglePreferred }: SupplierTableProps) {
  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "name",
      header: "Mill",
      render: (s) => (
        <div className="flex items-center gap-2">
          <div>
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              {s.name}
              {s.verified && (
                <span title="Verified mill">
                  <ShieldCheck size={13} className="text-success" />
                </span>
              )}
            </span>
            {s.preferred && <Badge tone="gold" className="mt-1">Preferred</Badge>}
          </div>
        </div>
      ),
    },
    { key: "state", header: "State", render: (s) => getMasterStateLabel(s.state) },
    { key: "rating", header: "Rating", sortable: true, render: (s) => <RatingStars rating={s.rating} /> },
    {
      key: "lastPurchaseDate",
      header: "Last Purchase",
      sortable: true,
      render: (s) => (s.lastPurchaseDate ? new Date(s.lastPurchaseDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : <span className="text-ink-faint">Never</span>),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortable: true,
      render: (s) => <span className={`font-mono ${s.outstanding > 0 ? "text-charcoal" : "text-ink-faint"}`}>{formatINR(s.outstanding)}</span>,
    },
    { key: "purchaseVolume", header: "Purchase Volume", align: "right", sortable: true, render: (s) => <span className="font-mono">{formatQuantityMt(s.purchaseVolume)}</span> },
    {
      key: "preferred",
      header: "",
      align: "right",
      render: (s) => (
        <IconButton variant="ghost" size="sm" aria-label={s.preferred ? `Remove ${s.name} from preferred` : `Mark ${s.name} preferred`} onClick={() => onTogglePreferred(s.id)}>
          <Heart size={15} className={s.preferred ? "text-fall fill-fall" : "text-ink-faint"} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={suppliers}
      getRowId={(s) => s.id}
      loading={loading}
      pageSize={15}
      emptyTitle="No suppliers"
      emptyDescription="Suppliers will appear here as you purchase from mills."
    />
  );
}
