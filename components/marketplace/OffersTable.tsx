"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconButton } from "@/components/ui/IconButton";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import { LISTING_STATUS_META } from "./statusMeta";
import type { MarketplaceOffer } from "@/lib/types/marketplace";

interface OffersTableProps {
  offers: MarketplaceOffer[];
  loading?: boolean;
}

export function OffersTable({ offers, loading = false }: OffersTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<MarketplaceOffer>[] = [
    { key: "id", header: "Offer ID", render: (o) => <span className="font-mono text-xs">{o.id}</span> },
    {
      key: "company",
      header: "Company",
      render: (o) => (
        <span className="flex items-center gap-1.5 font-medium">
          {o.company.name}
          {o.company.verified === "verified" && <ShieldCheck size={13} className="text-success" />}
        </span>
      ),
    },
    { key: "product", header: "Product", render: (o) => getProductLabel(o.product) },
    { key: "grade", header: "Grade" },
    { key: "quantity", header: "Quantity", render: (o) => <span className="font-mono">{formatQuantityMt(o.quantity)}</span> },
    { key: "price", header: "Price", render: (o) => <span className="font-mono">{formatINR(o.price)}</span> },
    {
      key: "location",
      header: "Location",
      render: (o) => `${o.dispatchFrom.city}, ${getMasterStateLabel(o.dispatchFrom.state)}`,
    },
    {
      key: "dispatchDate",
      header: "Dispatch Date",
      render: (o) => new Date(o.dispatchDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => {
        const meta = LISTING_STATUS_META[o.status];
        return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={`View offer ${o.id}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/marketplace/offer/${o.id}`);
          }}
        >
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
      pageSize={10}
      onRowClick={(o) => router.push(`/marketplace/offer/${o.id}`)}
      emptyTitle="No offers"
      emptyDescription="No sell offers match your search or filters right now."
    />
  );
}
