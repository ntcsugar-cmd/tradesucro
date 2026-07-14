import { StatusBadge } from "@/components/ui/StatusBadge";
import { VERIFICATION_STATUS_META } from "@/lib/constants/verification";
import type { VerificationStatus } from "@/lib/types/company-profile";

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  const meta = VERIFICATION_STATUS_META[status];
  return <StatusBadge status={meta.badgeStatus}>{meta.label}</StatusBadge>;
}
