import type { VerificationStatus } from "@/lib/types/company-profile";

export const VERIFICATION_STATUS_META: Record<
  VerificationStatus,
  { label: string; badgeStatus: "success" | "pending" | "neutral" }
> = {
  verified: { label: "Verified", badgeStatus: "success" },
  pending: { label: "Pending", badgeStatus: "pending" },
  not_submitted: { label: "Not Submitted", badgeStatus: "neutral" },
};

export const PRODUCTS_HANDLED_OPTIONS = [
  "S-30",
  "S-31",
  "M-30",
  "M-31",
  "ICUMSA 45",
  "Raw Sugar",
  "Khandsari",
] as const;
