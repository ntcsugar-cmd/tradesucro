"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { MillProfileView } from "@/components/mill-profile";
import { millProfileService } from "@/services/millProfile.service";
import type { MillProfile } from "@/lib/types/millProfile";

export default function MillProfilePage() {
  const [profile, setProfile] = useState<MillProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    millProfileService.getProfile().then((result) => {
      setProfile(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Mill Profile" }]} className="mb-5" />
      <PageHeader title="Mill Profile" description="Factory details, capacity, warehouses, banking, and verification status." />
      {loading || !profile ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading mill profile…" />
        </div>
      ) : (
        <MillProfileView profile={profile} />
      )}
    </>
  );
}
