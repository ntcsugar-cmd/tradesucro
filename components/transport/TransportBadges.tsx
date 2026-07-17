import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VehicleStatus, DriverStatus, LoadRequestStatus, TransportDispatchStatus } from "@/lib/types/transport";

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

const LOAD_REQUEST_STATUS_META: Record<LoadRequestStatus, { label: string; status: "warning" | "success" | "danger" | "info" }> = {
  pending: { label: "Pending", status: "warning" },
  accepted: { label: "Accepted", status: "success" },
  rejected: { label: "Rejected", status: "danger" },
  assigned: { label: "Assigned", status: "info" },
};

export function LoadRequestStatusBadge({ status }: { status: LoadRequestStatus }) {
  const meta = LOAD_REQUEST_STATUS_META[status];
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
