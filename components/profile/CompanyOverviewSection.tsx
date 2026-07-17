import { Pencil } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { CompanyLogoPlaceholder } from "@/components/ui/CompanyLogoPlaceholder";
import { IconButton } from "@/components/ui/IconButton";
import { getCompanyTypeLabel } from "@/lib/constants/company-types";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface CompanyOverviewSectionProps {
  profile: CompanyProfile;
  onEdit: () => void;
}

export function CompanyOverviewSection({ profile, onEdit }: CompanyOverviewSectionProps) {
  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <CompanyLogoPlaceholder name={profile.companyName || "Company"} size="lg" />
            <div>
              <h2 className="font-display text-xl font-medium text-charcoal dark:text-white">
                {profile.companyName || "Unnamed company"}
              </h2>
              <p className="mt-1 text-[13px] text-ink-soft dark:text-white/50">
                {getCompanyTypeLabel(profile.businessType)} · {profile.yearsInBusiness || "—"} years in business
              </p>
            </div>
          </div>
          <IconButton variant="ghost" size="sm" aria-label="Edit company overview" onClick={onEdit}>
            <Pencil size={15} />
          </IconButton>
        </div>

        <p className="mt-5 text-[13.5px] text-ink-soft dark:text-white/50 leading-relaxed max-w-2xl">
          {profile.businessDescription || (
            <span className="text-ink-faint dark:text-white/40 italic">
              No business description yet — add one so buyers and mills know more about you.
            </span>
          )}
        </p>
      </CardBody>
    </Card>
  );
}
