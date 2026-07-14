import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DealStatus } from "@/lib/types/deal";

const STATUS_META: Record<DealStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" | "pending" }> = {
  inquiry: { label: "Inquiry", badgeStatus: "neutral" },
  negotiation: { label: "Negotiation", badgeStatus: "pending" },
  offer_accepted: { label: "Offer Accepted", badgeStatus: "info" },
  deal_confirmed: { label: "Deal Confirmed", badgeStatus: "info" },
  emd_pending: { label: "EMD Pending", badgeStatus: "warning" },
  emd_received: { label: "EMD Received", badgeStatus: "success" },
  purchase_order: { label: "Purchase Order", badgeStatus: "info" },
  payment_pending: { label: "Payment Pending", badgeStatus: "warning" },
  payment_received: { label: "Payment Received", badgeStatus: "success" },
  dispatch_scheduled: { label: "Dispatch Scheduled", badgeStatus: "info" },
  loading: { label: "Loading", badgeStatus: "pending" },
  in_transit: { label: "In Transit", badgeStatus: "pending" },
  delivered: { label: "Delivered", badgeStatus: "success" },
  closed: { label: "Closed", badgeStatus: "success" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
};

export function dealStatusLabel(status: DealStatus): string {
  return STATUS_META[status].label;
}

export function DealStatusBadge({ status }: { status: DealStatus }) {
  const meta = STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
