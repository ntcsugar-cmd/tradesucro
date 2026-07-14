import { Pencil } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/common/Badge";
import { getCompanyTypeLabel } from "@/lib/constants/company-types";
import { getStateLabel } from "@/lib/constants/states";
import { getCountryLabel } from "@/lib/constants/countries";
import { ANNUAL_TURNOVER_RANGES, MONTHLY_TRADING_VOLUME_RANGES } from "@/lib/constants/business-info";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onEditStep: (step: number) => void;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs text-ink-faint shrink-0 w-40">{label}</span>
      <span className="text-[13.5px] text-charcoal text-right">{value || "—"}</span>
    </div>
  );
}

function ReviewSection({
  title,
  step,
  onEditStep,
  children,
}: {
  title: string;
  step: number;
  onEditStep: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line rounded-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[13px] font-semibold text-charcoal">{title}</p>
        <IconButton variant="ghost" size="sm" aria-label={`Edit ${title}`} onClick={() => onEditStep(step)}>
          <Pencil size={14} />
        </IconButton>
      </div>
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

export function StepReview({ data, onEditStep }: StepProps) {
  const rangeLabel = (ranges: { value: string; label: string }[], value: string) =>
    ranges.find((r) => r.value === value)?.label ?? "—";

  const selectedPreferences = Object.entries(data.preferences)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const preferenceLabels: Record<string, string> = {
    buySugar: "Buy Sugar",
    sellSugar: "Sell Sugar",
    bothBuyAndSell: "Both Buy & Sell",
    transportServices: "Transport Services",
  };

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal">Review your details</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">Make sure everything looks right before you submit.</p>

      <div className="mt-6 space-y-4">
        <ReviewSection title="Business Type" step={1} onEditStep={onEditStep}>
          <ReviewRow label="Type" value={getCompanyTypeLabel(data.businessType)} />
        </ReviewSection>

        <ReviewSection title="Company Details" step={2} onEditStep={onEditStep}>
          <ReviewRow label="Company name" value={data.companyName} />
          <ReviewRow label="GSTIN" value={data.gstin} />
          <ReviewRow label="PAN" value={data.pan} />
          <ReviewRow label="CIN" value={data.cin} />
          <ReviewRow label="IEC" value={data.iec} />
        </ReviewSection>

        <ReviewSection title="Business Information" step={3} onEditStep={onEditStep}>
          <ReviewRow label="Years in business" value={data.yearsInBusiness} />
          <ReviewRow label="Annual turnover" value={rangeLabel(ANNUAL_TURNOVER_RANGES, data.annualTurnover)} />
          <ReviewRow label="Monthly trading volume" value={rangeLabel(MONTHLY_TRADING_VOLUME_RANGES, data.monthlyTradingVolume)} />
          <ReviewRow label="States served" value={data.statesServed.map(getStateLabel).join(", ")} />
        </ReviewSection>

        <ReviewSection title="Address" step={4} onEditStep={onEditStep}>
          <ReviewRow label="Country" value={getCountryLabel(data.country)} />
          <ReviewRow label="State" value={getStateLabel(data.state)} />
          <ReviewRow label="City" value={data.city} />
          <ReviewRow label="PIN code" value={data.pinCode} />
          <ReviewRow label="Full address" value={data.fullAddress} />
        </ReviewSection>

        <ReviewSection title="Business Preference" step={5} onEditStep={onEditStep}>
          <div className="py-2 flex flex-wrap gap-2">
            {selectedPreferences.length > 0 ? (
              selectedPreferences.map((p) => (
                <Badge key={p} tone="gold">
                  {preferenceLabels[p]}
                </Badge>
              ))
            ) : (
              <span className="text-[13.5px] text-ink-faint">None selected</span>
            )}
          </div>
        </ReviewSection>

        <ReviewSection title="Documents" step={6} onEditStep={onEditStep}>
          <ReviewRow label="GST Certificate" value={data.documents.gstCertificate.fileName ?? "Not uploaded"} />
          <ReviewRow label="PAN Card" value={data.documents.panCard.fileName ?? "Not uploaded"} />
          <ReviewRow label="Company Logo" value={data.documents.companyLogo.fileName ?? "Not uploaded"} />
        </ReviewSection>
      </div>
    </div>
  );
}
