"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextInput, EmailInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { FileUpload } from "@/components/forms/FileUpload";
import { COMPANY_TYPES } from "@/lib/constants/company-types";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSave: (patch: Partial<CompanyProfile>) => Promise<void>;
}

/**
 * EditProfileModal — covers Company Overview + Contact Information, the
 * two sections most relevant to profile completion. Other sections
 * (address, business details, documents) are edited from their own
 * onboarding-style forms in a future pass; this is the "Quick Edit"
 * the dashboard button and profile page header both open today.
 */
export function EditProfileModal({ open, onClose, profile, onSave }: EditProfileModalProps) {
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [businessType, setBusinessType] = useState(profile.businessType);
  const [yearsInBusiness, setYearsInBusiness] = useState(profile.yearsInBusiness);
  const [businessDescription, setBusinessDescription] = useState(profile.businessDescription);
  const [logo, setLogo] = useState<{ fileName: string | null; uploadedAt: string | null }>({
    fileName: profile.logoFileName,
    uploadedAt: null,
  });
  const [contactPerson, setContactPerson] = useState(profile.contact.contactPerson);
  const [mobile, setMobile] = useState(profile.contact.mobile);
  const [email, setEmail] = useState(profile.contact.email);
  const [website, setWebsite] = useState(profile.contact.website);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({
      companyName,
      businessType,
      yearsInBusiness,
      businessDescription,
      logoFileName: logo.fileName,
      contact: { contactPerson, mobile, email, website },
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit company profile"
      description="Update your overview and contact details."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FileUpload
          label="Company logo"
          mockFileName="company_logo.png"
          value={logo}
          onChange={setLogo}
        />

        <TextInput label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

        <div className="grid sm:grid-cols-2 gap-5">
          <Select
            label="Business type"
            defaultValue={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            options={COMPANY_TYPES}
          />
          <TextInput
            label="Years in business"
            type="number"
            value={yearsInBusiness}
            onChange={(e) => setYearsInBusiness(e.target.value)}
          />
        </div>

        <Textarea
          label="Business description"
          placeholder="Tell buyers and mills about your business…"
          rows={3}
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
        />

        <div className="pt-2 border-t border-line" />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="Contact person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          <TextInput label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <EmailInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextInput label="Website" placeholder="https://" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
