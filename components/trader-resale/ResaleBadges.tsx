import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/common/Badge";
import type { CustomerType, ResaleOfferStatus, OrderStatus } from "@/lib/types/traderResale";

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  wholesaler: "Wholesaler",
  semi_wholesaler: "Semi Wholesaler",
  industrial_buyer: "Industrial Buyer",
  retail_chain: "Retail Chain",
  exporter: "Exporter",
};

export const CUSTOMER_TYPE_OPTIONS = (Object.keys(CUSTOMER_TYPE_LABELS) as CustomerType[]).map((value) => ({ value, label: CUSTOMER_TYPE_LABELS[value] }));

export function CustomerTypeBadge({ type }: { type: CustomerType }) {
  return <Badge tone={type === "exporter" ? "gold" : "charcoal"}>{CUSTOMER_TYPE_LABELS[type]}</Badge>;
}

const OFFER_STATUS_META: Record<ResaleOfferStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" | "pending" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  active: { label: "Active", badgeStatus: "success" },
  partially_sold: { label: "Partially Sold", badgeStatus: "info" },
  sold_out: { label: "Sold Out", badgeStatus: "pending" },
  expired: { label: "Expired", badgeStatus: "warning" },
  withdrawn: { label: "Withdrawn", badgeStatus: "danger" },
};

export function resaleOfferStatusLabel(status: ResaleOfferStatus): string {
  return OFFER_STATUS_META[status].label;
}

export function ResaleOfferStatusBadge({ status }: { status: ResaleOfferStatus }) {
  const meta = OFFER_STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}

const ORDER_STATUS_META: Record<OrderStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" | "pending" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  confirmed: { label: "Confirmed", badgeStatus: "info" },
  reserved: { label: "Reserved", badgeStatus: "pending" },
  ready_for_dispatch: { label: "Ready for Dispatch", badgeStatus: "warning" },
  dispatched: { label: "Dispatched", badgeStatus: "info" },
  delivered: { label: "Delivered", badgeStatus: "success" },
  completed: { label: "Completed", badgeStatus: "success" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = ["draft", "confirmed", "reserved", "ready_for_dispatch", "dispatched", "delivered", "completed"];

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_META[status].label;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
