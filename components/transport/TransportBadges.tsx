import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VehicleStatus, DriverStatus, FreightInquiryStatus, FreightQuoteAdminStatus, TransportDispatchStatus } from "@/lib/types/transport";

const VEHICLE_STATUS_META: Record<VehicleStatus, { label: string; status: "success" | "info" | "warning" | "neutral" }> = {
  available: { label: "Available", status: "success" },
  "on-trip": { label: "On Trip", status: "info" },
  maintenance: { label: "Maintenance", status: "warning" },
  inactive: { label: "Inactive", status: "neutral" },
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const meta = VEHICLE_STATUS_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}

const DRIVER_STATUS_META: Record<DriverStatus, { label: string; status: "success" | "info" | "neutral" }> = {
  available: { label: "Available", status: "success" },
  "on-trip": { label: "On Trip", status: "info" },
  "off-duty": { label: "Off Duty", status: "neutral" },
};

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const meta = DRIVER_STATUS_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}

const INQUIRY_STATUS_META: Record<FreightInquiryStatus, { label: string; status: "warning" | "success" | "danger" | "info" | "neutral" }> = {
  broadcasting: { label: "Broadcasting", status: "warning" },
  quotes_received: { label: "Quotes Received", status: "info" },
  quote_approved: { label: "Quote Approved", status: "success" },
  confirmed: { label: "Confirmed", status: "success" },
  in_transit: { label: "In Transit", status: "info" },
  delivered: { label: "Delivered", status: "success" },
  cancelled: { label: "Cancelled", status: "danger" },
};

export function FreightInquiryStatusBadge({ status }: { status: FreightInquiryStatus }) {
  const meta = INQUIRY_STATUS_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}

const QUOTE_ADMIN_STATUS_META: Record<FreightQuoteAdminStatus, { label: string; status: "warning" | "success" | "danger" | "info" | "neutral" }> = {
  awaiting_quote: { label: "Awaiting Quote", status: "neutral" },
  pending_review: { label: "Pending Review", status: "warning" },
  approved: { label: "Approved", status: "success" },
  not_selected: { label: "Not Selected", status: "danger" },
};

export function FreightQuoteStatusBadge({ status }: { status: FreightQuoteAdminStatus }) {
  const meta = QUOTE_ADMIN_STATUS_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}

const DISPATCH_STATUS_META: Record<TransportDispatchStatus, { label: string; status: "info" | "success" | "danger" | "neutral" }> = {
  assigned: { label: "Assigned", status: "neutral" },
  "in-transit": { label: "In Transit", status: "info" },
  delivered: { label: "Delivered", status: "success" },
  delayed: { label: "Delayed", status: "danger" },
};

export function TransportDispatchStatusBadge({ status }: { status: TransportDispatchStatus }) {
  const meta = DISPATCH_STATUS_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}
