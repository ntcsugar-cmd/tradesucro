import { Star } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ContactCategory, ContactVerificationStatus } from "@/lib/types/contact";

const CATEGORY_LABELS: Record<ContactCategory, string> = {
  mill: "Sugar Mill",
  trader: "Trader",
  broker: "Broker",
  wholesaler: "Wholesaler",
  retailer: "Retailer",
  industrial_buyer: "Industrial Buyer",
  transporter: "Transporter",
  insurance_partner: "Insurance Partner",
  warehouse: "Warehouse",
  financial_partner: "Financial Partner",
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as ContactCategory[]).map((value) => ({ value, label: CATEGORY_LABELS[value] }));

export function categoryLabel(category: ContactCategory): string {
  return CATEGORY_LABELS[category];
}

export function CategoryBadge({ category }: { category: ContactCategory }) {
  return <Badge tone="charcoal">{CATEGORY_LABELS[category]}</Badge>;
}

const VERIFICATION_META: Record<ContactVerificationStatus, { label: string; status: "success" | "pending" | "neutral" }> = {
  verified: { label: "Verified", status: "success" },
  pending: { label: "Pending", status: "pending" },
  unverified: { label: "Unverified", status: "neutral" },
};

export function VerificationStatusBadge({ status }: { status: ContactVerificationStatus }) {
  const meta = VERIFICATION_META[status];
  return <StatusBadge status={meta.status}>{meta.label}</StatusBadge>;
}

export function TrustScoreDisplay({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star size={12} className="text-gold-dim fill-gold-dim" />
      <span className="font-mono text-[12.5px] text-charcoal dark:text-white">{score.toFixed(1)}</span>
    </span>
  );
}
