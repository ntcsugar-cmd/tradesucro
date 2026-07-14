import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { VerificationBadge } from "./VerificationBadge";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface VerificationSectionProps {
  profile: CompanyProfile;
}

const LABELS: { key: keyof CompanyProfile["verification"]; label: string }[] = [
  { key: "gst", label: "GST" },
  { key: "pan", label: "PAN" },
  { key: "iec", label: "IEC" },
  { key: "fssai", label: "FSSAI" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
];

export function VerificationSection({ profile }: VerificationSectionProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Verification</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between rounded-sm border border-line p-3">
              <span className="text-[13px] font-medium text-charcoal">{label}</span>
              <VerificationBadge status={profile.verification[key]} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
