"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { TenderStatusBadge } from "./TenderStatusBadge";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { Tender } from "@/lib/types/tender";

interface TenderTableProps {
  tenders: Tender[];
  loading?: boolean;
}

export function TenderTable({ tenders, loading = false }: TenderTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<Tender>[] = [
    { key: "tenderNumber", header: "Tender No", render: (t) => <span className="font-mono text-xs">{t.tenderNumber}</span> },
    { key: "product", header: "Product", render: (t) => <span>{getProductLabel(t.product)} · {t.grade}</span> },
    { key: "quantity", header: "Quantity", render: (t) => <span className="font-mono">{formatQuantityMt(t.quantity)}</span> },
    { key: "reservePrice", header: "Reserve Price", render: (t) => <span className="font-mono">{formatINR(t.reservePrice)}</span> },
    { key: "emdAmount", header: "EMD", render: (t) => <span className="font-mono">{formatINR(t.emdAmount)}</span> },
    { key: "bidDeadline", header: "Bid Deadline", render: (t) => new Date(t.bidDeadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) },
    { key: "status", header: "Status", render: (t) => <TenderStatusBadge status={t.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${t.tenderNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/tenders/${t.id}`); }}>
          <ArrowRight size={15} />
        </IconButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tenders}
      getRowId={(t) => t.id}
      loading={loading}
      pageSize={10}
      onRowClick={(t) => router.push(`/tenders/${t.id}`)}
      emptyTitle="No tenders"
      emptyDescription="No tenders have been created yet."
    />
  );
}
