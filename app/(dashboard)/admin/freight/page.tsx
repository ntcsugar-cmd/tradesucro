"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { FreightInquiryStatusBadge } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { FreightInquiry } from "@/lib/types/transport";

export default function AdminFreightRequestsPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<FreightInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending">("all");

  useEffect(() => {
    freightService.getAllInquiries().then((result) => {
      setInquiries(result);
      setLoading(false);
    });
  }, []);

  const rows = filter === "pending" ? inquiries.filter((i) => i.status === "quotes_received") : inquiries;
  const pendingCount = inquiries.filter((i) => i.status === "quotes_received").length;

  const columns: DataTableColumn<FreightInquiry>[] = [
    { key: "requestNumber", header: "Request No.", sortable: true, render: (i) => <span className="font-mono text-[13px] font-medium text-charcoal dark:text-white">{i.requestNumber}</span> },
    { key: "requestedBy", header: "Requested By", render: (i) => <span>{i.requestedByCompany}</span> },
    { key: "product", header: "Product", render: (i) => <span>{getProductLabel(i.product)}{i.grade ? ` · ${i.grade}` : ""}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (i) => <span className="font-mono">{formatQuantityMt(i.quantity)}</span> },
    { key: "route", header: "Route", render: (i) => <span className="text-[13px]">{getMasterStateLabel(i.loading.state)} → {getMasterStateLabel(i.destination.state)}</span> },
    { key: "matched", header: "Matched", align: "right", render: (i) => <span className="font-mono text-[13px]">{i.matchedTransporterIds.length}</span> },
    { key: "status", header: "Status", render: (i) => <FreightInquiryStatusBadge status={i.status} /> },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "Freight Coordination" }]} className="mb-5" />
      <PageHeader title="All Freight Requests" description="Every freight inquiry posted on TradeSucro, and how many transporters were matched." />

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${filter === "all" ? "bg-charcoal dark:bg-gold text-white dark:text-charcoal" : "bg-charcoal/[0.05] dark:bg-white/10 text-ink-soft dark:text-white/50"}`}
        >
          All Requests
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${filter === "pending" ? "bg-charcoal dark:bg-gold text-white dark:text-charcoal" : "bg-charcoal/[0.05] dark:bg-white/10 text-ink-soft dark:text-white/50"}`}
        >
          Pending Assignment ({pendingCount})
        </button>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState icon={<Truck size={20} />} title="Nothing here" description="No freight requests match this filter." />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={rows}
          getRowId={(i) => i.id}
          loading={loading}
          pageSize={15}
          onRowClick={(i) => router.push(`/admin/freight/${i.id}`)}
          emptyTitle="Nothing here"
          emptyDescription="No freight requests match this filter."
          renderMobileCard={(i) => (
            <MobileDataCard
              title={i.requestNumber}
              subtitle={`${i.requestedByCompany} · ${getProductLabel(i.product)}`}
              badge={<FreightInquiryStatusBadge status={i.status} />}
              onClick={() => router.push(`/admin/freight/${i.id}`)}
              fields={[
                { label: "Route", value: `${getMasterStateLabel(i.loading.state)} → ${getMasterStateLabel(i.destination.state)}` },
                { label: "Matched Transporters", value: String(i.matchedTransporterIds.length), secondary: true },
              ]}
            />
          )}
        />
      )}
    </>
  );
}
