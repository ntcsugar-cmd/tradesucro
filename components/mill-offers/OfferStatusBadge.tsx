import { StatusBadge } from "@/components/ui/StatusBadge";
import { resolveEffectiveStatus } from "@/services/millOffer.service";
import type { MillOffer, MillOfferStatus } from "@/lib/types/millOffer";

const STATUS_META: Record<MillOfferStatus, { label: string; badgeStatus: "success" | "neutral" | "info" | "danger" | "warning" }> = {
  draft: { label: "Draft", badgeStatus: "neutral" },
  published: { label: "Published", badgeStatus: "success" },
  closed: { label: "Closed", badgeStatus: "info" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
  expired: { label: "Expired", badgeStatus: "warning" },
};

interface OfferStatusBadgeProps {
  offer: MillOffer;
}

/** OfferStatusBadge — always renders the *effective* status (expiry is computed, not stored — see millOffer.service.ts). */
export function OfferStatusBadge({ offer }: OfferStatusBadgeProps) {
  const status = resolveEffectiveStatus(offer);
  const meta = STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
