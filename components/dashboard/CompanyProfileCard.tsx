"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { CompanyLogoPlaceholder } from "@/components/ui/CompanyLogoPlaceholder";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCompanyTypeLabel } from "@/lib/constants/company-types";
import { profileService } from "@/services/profile.service";
import type { CompanyProfile } from "@/lib/types/company-profile";

/** CompanyProfileCard — compact profile summary, links to /company-profile for the full view. */
export function CompanyProfileCard() {
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
        <CardTitle>Company profile</CardTitle>
        <Link href="/company-profile" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
          View profile <ArrowUpRight size={13} />
        </Link>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-sm" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ) : profile ? (
          <div className="flex items-center gap-3">
            <CompanyLogoPlaceholder name={profile.companyName || "Company"} size="md" />
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-charcoal dark:text-white truncate">{profile.companyName || "Unnamed company"}</p>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{getCompanyTypeLabel(profile.businessType)}</p>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-ink-faint dark:text-white/40 italic">Complete onboarding to set up your profile.</p>
        )}
      </CardBody>
    </Card>
  );
}
