import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/common/Badge";
import { resolveEffectiveTenderStatus } from "@/services/millTender.service";
import type { MillTender, TenderType } from "@/lib/types/millTender";

const STATUS_META: Record<MillTender["status"], { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" | "pending" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  published: { label: "Published", badgeStatus: "success" },
  closed: { label: "Closed", badgeStatus: "pending" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
  awarded: { label: "Awarded", badgeStatus: "info" },
  expired: { label: "Expired", badgeStatus: "warning" },
};

export function TenderStatusBadge({ tender }: { tender: MillTender }) {
  const status = resolveEffectiveTenderStatus(tender);
  const meta = STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}

const TYPE_LABELS: Record<TenderType, string> = {
  open: "Open Tender",
  limited: "Limited Tender",
  private: "Private Tender",
  negotiation: "Negotiation Tender",
  spot: "Spot Tender",
  forward: "Forward Tender",
  export: "Export Tender",
};

export const TENDER_TYPE_OPTIONS = (Object.keys(TYPE_LABELS) as TenderType[]).map((value) => ({ value, label: TYPE_LABELS[value] }));

export function TenderTypeBadge({ type }: { type: TenderType }) {
  return <Badge tone={type === "export" ? "gold" : "charcoal"}>{TYPE_LABELS[type]}</Badge>;
}
