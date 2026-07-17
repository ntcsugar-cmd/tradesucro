"use client";

import { useRouter } from "next/navigation";
import { Star, ShieldAlert } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { CustomerTypeBadge } from "./ResaleBadges";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { Customer } from "@/lib/types/traderResale";

interface CustomerTableProps {
  customers: Customer[];
  loading?: boolean;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} className={i < Math.round(rating) ? "text-gold-dim fill-gold-dim" : "text-charcoal/15 dark:text-white fill-charcoal/15"} />
        ))}
      </span>
      <span className="font-mono text-xs text-ink-soft dark:text-white/50">{rating.toFixed(1)}</span>
    </span>
  );
}

export function CustomerTable({ customers, loading = false }: CustomerTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "companyName",
      header: "Company",
      render: (c) => (
        <div>
          <p className="font-medium text-charcoal dark:text-white">{c.companyName}</p>
          <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{c.contactPerson}</p>
        </div>
      ),
    },
    { key: "customerType", header: "Type", render: (c) => <CustomerTypeBadge type={c.customerType} /> },
    { key: "state", header: "State", render: (c) => getMasterStateLabel(c.state) },
    { key: "rating", header: "Rating", sortable: true, render: (c) => <RatingStars rating={c.rating} /> },
    { key: "creditLimit", header: "Credit Limit", align: "right", sortable: true, render: (c) => <span className="font-mono">{formatINR(c.creditLimit)}</span> },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortable: true,
      render: (c) => {
        const utilization = c.creditLimit > 0 ? c.outstanding / c.creditLimit : 0;
        return (
          <span className="inline-flex items-center gap-1.5">
            {utilization > 0.85 && <ShieldAlert size={12} className="text-fall" />}
            <span className={`font-mono ${utilization > 0.85 ? "text-fall font-semibold" : "text-charcoal dark:text-white"}`}>{formatINR(c.outstanding)}</span>
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      getRowId={(c) => c.id}
      loading={loading}
      pageSize={12}
      onRowClick={(c) => router.push(`/trader/customer-ledger?customer=${c.id}`)}
      emptyTitle="No customers"
      emptyDescription="Add your first customer to start selling from inventory."
    />
  );
}
