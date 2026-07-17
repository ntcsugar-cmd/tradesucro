import { FileUpload } from "@/components/forms/FileUpload";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
}

export function StepDocuments({ data, onChange }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal dark:text-white">Upload documents</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft dark:text-white/50">
        These speed up verification. You can also add them later from your profile.
      </p>

      <div className="mt-6 space-y-4">
        <FileUpload
          label="GST Certificate"
          mockFileName="gst_certificate.pdf"
          value={data.documents.gstCertificate}
          onChange={(v) => onChange({ documents: { ...data.documents, gstCertificate: v } })}
        />
        <FileUpload
          label="PAN Card"
          mockFileName="pan_card.pdf"
          value={data.documents.panCard}
          onChange={(v) => onChange({ documents: { ...data.documents, panCard: v } })}
        />
        <FileUpload
          label="Company Logo"
          mockFileName="company_logo.png"
          value={data.documents.companyLogo}
          onChange={(v) => onChange({ documents: { ...data.documents, companyLogo: v } })}
        />
      </div>
    </div>
  );
}
