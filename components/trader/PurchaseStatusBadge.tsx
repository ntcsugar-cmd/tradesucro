import { StatusBadge } from "@/components/ui/StatusBadge";
import type { PurchaseStatus } from "@/lib/types/traderWorkspace";

const STATUS_META: Record<PurchaseStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  confirmed: { label: "Confirmed", badgeStatus: "info" },
  deal_created: { label: "Deal Created", badgeStatus: "success" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
};

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  const meta = STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
