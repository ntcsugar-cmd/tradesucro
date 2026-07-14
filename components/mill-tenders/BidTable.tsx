import { ShieldCheck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillTenderBid } from "@/lib/types/millTender";

interface BidTableProps {
  bids: MillTenderBid[];
  loading?: boolean;
}

const BID_STATUS_META = {
  submitted: { label: "Submitted", badgeStatus: "pending" as const },
  revised: { label: "Revised", badgeStatus: "info" as const },
  under_review: { label: "Under Review", badgeStatus: "info" as const },
  shortlisted: { label: "Shortlisted", badgeStatus: "warning" as const },
  awarded: { label: "Awarded", badgeStatus: "success" as const },
  rejected: { label: "Rejected", badgeStatus: "danger" as const },
};

const EMD_STATUS_META = {
  not_required: { label: "Not Required", badgeStatus: "neutral" as const },
  pending: { label: "Pending", badgeStatus: "pending" as const },
  paid: { label: "Paid", badgeStatus: "success" as const },
  refunded: { label: "Refunded", badgeStatus: "info" as const },
  forfeited: { label: "Forfeited", badgeStatus: "danger" as const },
};

export function BidTable({ bids, loading = false }: BidTableProps) {
  const columns: DataTableColumn<MillTenderBid>[] = [
    { key: "bidNumber", header: "Bid Number", render: (b) => <span className="font-mono text-xs">{b.bidNumber}</span> },
    {
      key: "companyName",
      header: "Company",
      render: (b) => (
        <span className="flex items-center gap-1.5 font-medium">
          {b.companyName}
          {b.verified && <ShieldCheck size={13} className="text-success" />}
        </span>
      ),
    },
    { key: "bidderType", header: "Trader/Broker", render: (b) => <span className="capitalize">{b.bidderType}</span> },
    { key: "quantity", header: "Quantity", render: (b) => <span className="font-mono">{formatQuantityMt(b.quantity)}</span> },
    { key: "price", header: "Bid Price", render: (b) => <span className="font-mono">{formatINR(b.price)}</span> },
    { key: "submittedAt", header: "Submitted", render: (b) => new Date(b.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
    { key: "revisionCount", header: "Revisions", render: (b) => <span className="font-mono">{b.revisionCount}</span> },
    { key: "emdStatus", header: "EMD Status", render: (b) => <StatusBadge status={EMD_STATUS_META[b.emdStatus].badgeStatus}>{EMD_STATUS_META[b.emdStatus].label}</StatusBadge> },
    { key: "status", header: "Bid Status", render: (b) => <StatusBadge status={BID_STATUS_META[b.status].badgeStatus}>{BID_STATUS_META[b.status].label}</StatusBadge> },
  ];

  return (
    <DataTable
      columns={columns}
      data={bids}
      getRowId={(b) => b.id}
      loading={loading}
      pageSize={10}
      emptyTitle="No bids"
      emptyDescription="No bids have been submitted for this tender yet."
    />
  );
}
