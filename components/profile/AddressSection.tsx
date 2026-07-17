import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { getStateLabel } from "@/lib/constants/states";
import { getCountryLabel } from "@/lib/constants/countries";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface AddressSectionProps {
  profile: CompanyProfile;
}

export function AddressSection({ profile }: AddressSectionProps) {
  const { address } = profile;
  const hasAddress = address.city || address.fullAddress;

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardBody>
        {hasAddress ? (
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/[0.04] text-ink-faint dark:text-white/40">
              <MapPin size={15} />
            </span>
            <div>
              <p className="text-[13.5px] text-charcoal dark:text-white leading-relaxed">
                {address.fullAddress && `${address.fullAddress}, `}
                {address.city}
                {address.city && ", "}
                {getStateLabel(address.state)} {address.pinCode}
              </p>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-1">{getCountryLabel(address.country)}</p>
            </div>
          </div>
        ) : (
          <p className="text-[13.5px] text-ink-faint dark:text-white/40 italic">No address on file yet.</p>
        )}
      </CardBody>
    </Card>
  );
}
