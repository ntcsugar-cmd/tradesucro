import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { ANNUAL_TURNOVER_RANGES, MONTHLY_TRADING_VOLUME_RANGES } from "@/lib/constants/business-info";
import { getStateLabel } from "@/lib/constants/states";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface BusinessDetailsSectionProps {
  profile: CompanyProfile;
}

function rangeLabel(ranges: { value: string; label: string }[], value: string) {
  return ranges.find((r) => r.value === value)?.label ?? "—";
}

export function BusinessDetailsSection({ profile }: BusinessDetailsSectionProps) {
  const { businessDetails } = profile;

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-[11px] text-ink-faint dark:text-white/40">Annual turnover</p>
            <p className="text-[13.5px] text-charcoal dark:text-white mt-0.5">{rangeLabel(ANNUAL_TURNOVER_RANGES, businessDetails.annualTurnover)}</p>
          </div>
          <div>
            <p className="text-[11px] text-ink-faint dark:text-white/40">Monthly trading volume</p>
            <p className="text-[13.5px] text-charcoal dark:text-white mt-0.5">{rangeLabel(MONTHLY_TRADING_VOLUME_RANGES, businessDetails.monthlyTradingVolume)}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] text-ink-faint dark:text-white/40 mb-2">States served</p>
          {businessDetails.statesServed.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {businessDetails.statesServed.map((s) => (
                <Badge key={s} tone="charcoal">
                  {getStateLabel(s)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-ink-faint dark:text-white/40 italic">None specified</p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[11px] text-ink-faint dark:text-white/40 mb-2">Products handled</p>
          {businessDetails.productsHandled.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {businessDetails.productsHandled.map((p) => (
                <Badge key={p} tone="gold">
                  {p}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-ink-faint dark:text-white/40 italic">None specified</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
