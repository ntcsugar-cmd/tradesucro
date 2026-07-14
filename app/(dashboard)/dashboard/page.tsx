"use client";

import { useEffect, useState } from "react";
import { Inbox, Search, Pencil } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MarketSnapshot } from "@/components/dashboard/MarketSnapshot";
import { CompanyProfileCard } from "@/components/dashboard/CompanyProfileCard";
import { VerificationStatusCard } from "@/components/dashboard/VerificationStatusCard";
import {
  MillDashboardStatsGrid,
  MillQuickActions,
  TodaysPricesWidget,
  UpcomingLiftingWidget,
  NotificationPanel,
} from "@/components/mill-portal";
import { EditProfileModal } from "@/components/profile";

import { useDisclosure } from "@/hooks/useDisclosure";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { getCompanyTypeLabel } from "@/lib/constants/company-types";
import type { AuthUser } from "@/lib/types/auth";
import type { CompanyProfile } from "@/lib/types/company-profile";

const FALLBACK_USER: Pick<AuthUser, "fullName" | "companyName" | "businessType"> = {
  fullName: "Priya Nair",
  companyName: "Kaveri Sugar Mills Ltd.",
  businessType: "mill",
};

export default function DashboardPage() {
  const [user, setUser] = useState(FALLBACK_USER);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const editModal = useDisclosure(false);
  const { toast } = useToast();

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser({
        fullName: session.fullName,
        companyName: session.companyName ?? FALLBACK_USER.companyName,
        businessType: session.businessType ?? FALLBACK_USER.businessType,
      });
    }
    profileService.getProfile().then(setProfile);
  }, []);

  async function handleSaveProfile(patch: Partial<CompanyProfile>) {
    const updated = await profileService.updateProfile(patch);
    if (updated) {
      setProfile(updated);
      toast({ variant: "success", title: "Profile updated", description: "Your changes have been saved." });
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard" }]} className="mb-5" />
      <PageHeader
        title="Mill Dashboard"
        description="Today's prices, offers, tenders, inventory, and dispatches at a glance."
        actions={
          profile ? (
            <Button variant="outline" size="md" onClick={editModal.open}>
              <Pencil size={15} /> Quick Edit Profile
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6">
        <WelcomeCard
          userName={user.fullName}
          companyName={user.companyName ?? ""}
          businessTypeLabel={getCompanyTypeLabel(user.businessType ?? "")}
        />

        <MillDashboardStatsGrid />

        <MillQuickActions />

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <TodaysPricesWidget />
          </GridItem>
          <GridItem>
            <UpcomingLiftingWidget />
          </GridItem>
        </Grid>

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <RecentActivity />
          </GridItem>
          <GridItem>
            <NotificationPanel />
          </GridItem>
        </Grid>

        <p className="text-eyebrow pt-2">Company &amp; Market</p>

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <CompanyProfileCard />
          </GridItem>
          <GridItem>
            <ProfileCompletionCard />
          </GridItem>
        </Grid>

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <VerificationStatusCard />
          </GridItem>
          <GridItem>
            <QuickActions />
          </GridItem>
        </Grid>

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <MarketSnapshot />
          </GridItem>
          <GridItem>
            <div>
              <p className="text-eyebrow mb-3">Get started</p>
              <Grid cols={1} gap="md">
                <EmptyState
                  icon={<Inbox size={20} />}
                  title="No deals yet"
                  description="Once you match on a buy requirement or sell offer, your deals will show up here."
                />
              </Grid>
            </div>
          </GridItem>
        </Grid>

        <EmptyState
          icon={<Search size={20} />}
          title="No saved searches"
          description="Save a marketplace search to get notified when matching offers are posted."
        />
      </div>

      {profile && (
        <EditProfileModal open={editModal.isOpen} onClose={editModal.close} profile={profile} onSave={handleSaveProfile} />
      )}
    </>
  );
}
