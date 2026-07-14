"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { TenderStatusBadge, TenderTypeBadge } from "./TenderTypeBadge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillTender } from "@/lib/types/millTender";

interface TenderTableProps {
  tenders: MillTender[];
  loading?: boolean;
}

export function TenderTable({ tenders, loading = false }: TenderTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<MillTender>[] = [
    { key: "tenderNumber", header: "Tender No", render: (t) => <span className="font-mono text-xs">{t.tenderNumber}</span> },
    { key: "title", header: "Title", render: (t) => <span className="font-medium">{t.title}</span> },
    { key: "type", header: "Type", render: (t) => <TenderTypeBadge type={t.type} /> },
    {
      key: "quantity",
      header: "Quantity",
      render: (t) => <span className="font-mono">{formatQuantityMt(t.products.reduce((sum, p) => sum + p.quantity, 0))}</span>,
    },
    {
      key: "reserve",
      header: "Reserve Price",
      render: (t) => <span className="font-mono">{formatINR(Math.min(...t.products.map((p) => p.reservePrice)))}</span>,
    },
    {
      key: "closingDateTime",
      header: "Closing",
      render: (t) => new Date(t.closingDateTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
    { key: "status", header: "Status", render: (t) => <TenderStatusBadge tender={t} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => (
        <IconButton variant="ghost" size="sm" aria-label={`View ${t.tenderNumber}`} onClick={(e) => { e.stopPropagation(); router.push(`/mill/tenders/${t.id}`); }}>
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
      onRowClick={(t) => router.push(`/mill/tenders/${t.id}`)}
      emptyTitle="No tenders"
      emptyDescription="No tenders match your search or filters right now."
    />
  );
}
