"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Pencil } from "lucide-react";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { ResponsiveTable, MobileOfferCard } from "@/components/mobile";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { MillOffer } from "@/lib/types/millOffer";

interface OfferTableProps {
  offers: MillOffer[];
  loading?: boolean;
}

export function OfferTable({ offers, loading = false }: OfferTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<MillOffer>[] = [
    { key: "offerNumber", header: "Offer No", render: (o) => <span className="font-mono text-xs">{o.offerNumber}</span> },
    { key: "millName", header: "Mill", render: (o) => <span className="font-medium">{o.millName}</span> },
    { key: "state", header: "State", render: (o) => getMasterStateLabel(o.state) },
    {
      key: "products",
      header: "Products",
      render: (o) => (
        <span className="text-[13px]">
          {o.products.slice(0, 2).map((p) => getProductLabel(p.product)).join(", ")}
          {o.products.length > 2 ? ` +${o.products.length - 2}` : ""}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Available Quantity",
      render: (o) => (
        <span className="font-mono">{formatQuantityMt(o.products.reduce((sum, p) => sum + p.availableQuantity, 0))}</span>
      ),
    },
    {
      key: "validTill",
      header: "Offer Valid Till",
      render: (o) => new Date(o.validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    { key: "status", header: "Status", render: (o) => <OfferStatusBadge offer={o} /> },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (o) => new Date(o.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (o) => (
        <div className="flex items-center justify-end gap-1">
          {o.status === "draft" && (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={`Edit ${o.offerNumber}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/mill-offers/${o.id}/edit`);
              }}
            >
              <Pencil size={15} />
            </IconButton>
          )}
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`View ${o.offerNumber}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/mill-offers/${o.id}`);
            }}
          >
            <ArrowRight size={15} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      data={offers}
      getRowId={(o) => o.id}
      loading={loading}
      pageSize={10}
      onRowClick={(o) => router.push(`/mill-offers/${o.id}`)}
      emptyTitle="No mill offers"
      emptyDescription="No offers match your search or filters right now."
      renderMobileCard={(o) => (
        <MobileOfferCard
          millName={o.millName}
          grade={o.products[0]?.grade ?? ""}
          productLabel={getProductLabel(o.products[0]?.product ?? "")}
          price={o.products[0]?.basePrice ?? 0}
          dispatchDays={o.dispatch.liftingPeriodDays || 7}
          verified
          href={`/mill-offers/${o.id}`}
        />
      )}
    />
  );
}
