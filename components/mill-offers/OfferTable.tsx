"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Pencil, ShieldCheck } from "lucide-react";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { ResponsiveTable, MobileOfferCard } from "@/components/mobile";
import { MillNameScroll } from "@/components/common";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { getProductLabel, getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatPricePerUnit } from "@/lib/utils/format";
import type { MillOffer } from "@/lib/types/millOffer";

interface OfferTableProps {
  offers: MillOffer[];
  loading?: boolean;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 60) return `${Math.max(diffMins, 0)}m ago`;
  const diffHrs = Math.round(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function OfferTable({ offers, loading = false }: OfferTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<MillOffer>[] = [
    {
      key: "factoryCode",
      header: "Plant Code",
      frozen: true,
      alwaysVisible: true,
      render: (o) => <span className="font-mono text-xs">{o.factoryCode}</span>,
    },
    {
      key: "millName",
      header: "Mill Name",
      frozen: true,
      resizable: true,
      alwaysVisible: true,
      sortable: true,
      className: "max-w-[220px]",
      render: (o) => <MillNameScroll name={o.millName} prefix={<ShieldCheck size={12} className="shrink-0 text-success" />} />,
    },
    { key: "state", header: "State", sortable: true, render: (o) => getMasterStateLabel(o.state) },
    { key: "city", header: "City", render: (o) => o.city },
    {
      key: "product",
      header: "Product",
      render: (o) => (
        <span className="text-[13px]">
          {o.products.slice(0, 2).map((p) => getProductLabel(p.product)).join(", ")}
          {o.products.length > 2 ? ` +${o.products.length - 2}` : ""}
        </span>
      ),
      exportValue: (o) => o.products.map((p) => getProductLabel(p.product)).join("; "),
    },
    {
      key: "grade",
      header: "Grade",
      render: (o) => <span className="font-mono text-[12.5px]">{[...new Set(o.products.map((p) => p.grade))].join(", ")}</span>,
      exportValue: (o) => [...new Set(o.products.map((p) => p.grade))].join("; "),
    },
    { key: "season", header: "Season", sortable: true, render: (o) => o.season },
    {
      key: "price",
      header: "Price (₹/QTL)",
      align: "right",
      sortable: true,
      render: (o) => <span className="font-mono">{formatPricePerUnit(o.products[0]?.basePrice ?? 0)}</span>,
      exportValue: (o) => o.products[0]?.basePrice ?? 0,
    },
    { key: "paymentTerms", header: "Payment Terms", render: (o) => getPaymentTermLabel(o.paymentTerms.paymentType) },
    {
      key: "dispatchDate",
      header: "Dispatch Date",
      render: (o) => new Date(o.dispatch.dispatchStartDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
      key: "quantity",
      header: "Available Quantity",
      align: "right",
      sortable: true,
      resizable: true,
      render: (o) => <span className="font-mono">{formatQuantityMt(o.products.reduce((sum, p) => sum + p.availableQuantity, 0))}</span>,
      exportValue: (o) => o.products.reduce((sum, p) => sum + p.availableQuantity, 0),
    },
    {
      key: "updatedAt",
      header: "Updated Time",
      sortable: true,
      render: (o) => <span className="text-ink-faint dark:text-white/40">{relativeTime(o.updatedAt)}</span>,
      exportValue: (o) => o.updatedAt,
    },
    { key: "status", header: "Status", render: (o) => <OfferStatusBadge offer={o} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      alwaysVisible: true,
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
      enableColumnVisibility
      enableExport
      exportFilename="mill-offers"
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
