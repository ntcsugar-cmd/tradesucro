"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { profileService } from "@/services/profile.service";
import type { CompanyProfile } from "@/lib/types/company-profile";

const LABELS: { key: keyof CompanyProfile["verification"]; label: string }[] = [
  { key: "gst", label: "GST" },
  { key: "pan", label: "PAN" },
  { key: "iec", label: "IEC" },
  { key: "fssai", label: "FSSAI" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
];

/** VerificationStatusCard — dashboard-scale summary of the same verification data shown in full on /company-profile. */
export function VerificationStatusCard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    profileService.getProfile().then((result) => {
      if (cancelled) return;
      setProfile(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Verification status</CardTitle>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : profile ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[13px] text-ink-soft">{label}</span>
                <VerificationBadge status={profile.verification[key]} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-ink-faint italic">Complete onboarding to start verification.</p>
        )}
      </CardBody>
    </Card>
  );
}
