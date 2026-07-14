import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TenderStatus } from "@/lib/types/tender";

const STATUS_META: Record<TenderStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" | "pending" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  published: { label: "Published", badgeStatus: "info" },
  bidding_open: { label: "Bidding Open", badgeStatus: "success" },
  bidding_closed: { label: "Bidding Closed", badgeStatus: "warning" },
  under_evaluation: { label: "Under Evaluation", badgeStatus: "pending" },
  awarded: { label: "Awarded", badgeStatus: "success" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
};

export function TenderStatusBadge({ status }: { status: TenderStatus }) {
  const meta = STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
