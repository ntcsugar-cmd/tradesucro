"use client";

import { useEffect, useState } from "react";
import { Pencil, Building2 } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

import {
  CompanyOverviewSection,
  VerificationSection,
  ContactInfoSection,
  AddressSection,
  BusinessDetailsSection,
  DocumentsSection,
  GallerySection,
  TeamMembersSection,
  ActivityTimelineSection,
  EditProfileModal,
} from "@/components/profile";

import { useDisclosure } from "@/hooks/useDisclosure";
import { profileService } from "@/services/profile.service";
import type { CompanyProfile } from "@/lib/types/company-profile";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const editModal = useDisclosure(false);
  const { toast } = useToast();

  useEffect(() => {
    profileService.getProfile().then((result) => {
      setProfile(result);
      setLoading(false);
    });
  }, []);

  async function handleSave(patch: Partial<CompanyProfile>) {
    const updated = await profileService.updateProfile(patch);
    if (updated) {
      setProfile(updated);
      toast({ variant: "success", title: "Profile updated", description: "Your changes have been saved." });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading company profile…" />
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <Breadcrumb items={[{ label: "Company Profile" }]} className="mb-5" />
        <PageHeader title="Company Profile" />
        <EmptyState
          icon={<Building2 size={20} />}
          title="No company profile yet"
          description="Complete business onboarding to set up your company profile."
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Company Profile" }]} className="mb-5" />
      <PageHeader
        title="Company Profile"
        description="This is what mills, traders, and buyers see about your business."
        actions={
          <Button variant="primary" size="md" onClick={editModal.open}>
            <Pencil size={15} /> Edit Profile
          </Button>
        }
      />

      <div className="space-y-6">
        <CompanyOverviewSection profile={profile} onEdit={editModal.open} />

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <VerificationSection profile={profile} />
          </GridItem>
          <GridItem>
            <ContactInfoSection profile={profile} onEdit={editModal.open} />
          </GridItem>
        </Grid>

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <AddressSection profile={profile} />
          </GridItem>
          <GridItem>
            <BusinessDetailsSection profile={profile} />
          </GridItem>
        </Grid>

        <DocumentsSection profile={profile} />

        <GallerySection
          profile={profile}
          onChangeGallery={(fileNames) => handleSave({ galleryImageFileNames: fileNames })}
        />

        <Grid cols={1} colsLg={2} gap="md">
          <GridItem>
            <TeamMembersSection profile={profile} />
          </GridItem>
          <GridItem>
            <ActivityTimelineSection profile={profile} />
          </GridItem>
        </Grid>
      </div>

      <EditProfileModal open={editModal.isOpen} onClose={editModal.close} profile={profile} onSave={handleSave} />
    </>
  );
}
