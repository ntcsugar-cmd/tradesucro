import type { OfferStatus, RequirementStatus } from "@/lib/types/marketplace";

type BadgeStatus = "success" | "danger" | "warning" | "info" | "neutral" | "pending";

export const LISTING_STATUS_META: Record<OfferStatus | RequirementStatus, { label: string; badgeStatus: BadgeStatus }> = {
  active: { label: "Active", badgeStatus: "success" },
  draft: { label: "Draft", badgeStatus: "neutral" },
  expired: { label: "Expired", badgeStatus: "warning" },
  fulfilled: { label: "Fulfilled", badgeStatus: "info" },
  cancelled: { label: "Cancelled", badgeStatus: "danger" },
};
