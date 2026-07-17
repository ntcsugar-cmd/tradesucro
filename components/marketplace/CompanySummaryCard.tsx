import { Star, MapPin } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { CompanyLogoPlaceholder } from "@/components/ui/CompanyLogoPlaceholder";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { getCompanyTypeLabel } from "@/lib/constants/company-types";
import type { CompanySummary } from "@/lib/types/marketplace";

interface CompanySummaryCardProps {
  company: CompanySummary;
}

/** CompanySummaryCard — company identity + verification + rating, shown on offer/requirement detail pages. */
export function CompanySummaryCard({ company }: CompanySummaryCardProps) {
  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CompanyLogoPlaceholder name={company.name} size="md" />
            <div>
              <p className="text-[14.5px] font-semibold text-charcoal dark:text-white">{company.name}</p>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{getCompanyTypeLabel(company.businessType)}</p>
            </div>
          </div>
          <VerificationBadge status={company.verified} />
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-line dark:border-white/10">
          <span className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-white/50">
            <MapPin size={13} /> {company.city}
          </span>
          {company.rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-mono text-gold-dim">
              <Star size={12} fill="currentColor" /> {company.rating.toFixed(1)}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
