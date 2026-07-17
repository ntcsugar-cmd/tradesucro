"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { TraderSubNav } from "@/components/trader";
import { FreightInquiryStatusBadge } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import { workspaceService } from "@/services/workspace.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { FreightInquiry } from "@/lib/types/transport";

export default function TraderFreightStatusPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<FreightInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyName = workspaceService.getActiveWorkspace()?.companyName ?? "";
    freightService.getInquiriesForTrader(companyName).then((result) => {
      setInquiries(result);
      setLoading(false);
    });
  }, []);

  const columns: DataTableColumn<FreightInquiry>[] = [
    { key: "requestNumber", header: "Request No.", sortable: true, render: (i) => <span className="font-mono text-[13px] font-medium text-charcoal dark:text-white">{i.requestNumber}</span> },
    { key: "product", header: "Product", render: (i) => <span>{getProductLabel(i.product)}{i.grade ? ` · ${i.grade}` : ""}</span> },
    { key: "quantity", header: "Quantity", align: "right", render: (i) => <span className="font-mono">{formatQuantityMt(i.quantity)}</span> },
    { key: "route", header: "Route", render: (i) => <span className="text-[13px]">{getMasterStateLabel(i.loading.state)} → {getMasterStateLabel(i.destination.state)}</span> },
    { key: "loadingDate", header: "Loading Date", render: (i) => new Date(i.expectedLoadingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { key: "status", header: "Status", render: (i) => <FreightInquiryStatusBadge status={i.status} /> },
  ];

  return (
    <>
      <TraderSubNav />
      <PageHeader
        title="Freight Status"
        description="Every freight inquiry you've posted — TradeSucro matches and broadcasts each one to eligible transporters automatically."
        actions={
          <Button variant="primary" size="md" onClick={() => router.push("/trader/freight/request")}>
            <Plus size={15} /> Request Freight
          </Button>
        }
      />

      {!loading && inquiries.length === 0 ? (
        <EmptyState icon={<Truck size={20} />} title="No freight requests yet" description="Post your first freight inquiry — TradeSucro will find matching transporters." />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={inquiries}
          getRowId={(i) => i.id}
          loading={loading}
          pageSize={12}
          onRowClick={(i) => router.push(`/trader/freight/${i.id}`)}
          emptyTitle="No freight requests yet"
          emptyDescription="Post your first freight inquiry — TradeSucro will find matching transporters."
          renderMobileCard={(i) => (
            <MobileDataCard
              title={i.requestNumber}
              subtitle={`${getProductLabel(i.product)} · ${formatQuantityMt(i.quantity)}`}
              badge={<FreightInquiryStatusBadge status={i.status} />}
              onClick={() => router.push(`/trader/freight/${i.id}`)}
              fields={[
                { label: "Route", value: `${getMasterStateLabel(i.loading.state)} → ${getMasterStateLabel(i.destination.state)}` },
                { label: "Loading", value: new Date(i.expectedLoadingDate).toLocaleDateString("en-IN", { dateStyle: "medium" }), secondary: true },
              ]}
            />
          )}
        />
      )}
    </>
  );
}
