import { Pencil, Mail, Phone, Globe, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { IconButton } from "@/components/ui/IconButton";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface ContactInfoSectionProps {
  profile: CompanyProfile;
  onEdit: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/[0.04] text-ink-faint">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-ink-faint">{label}</p>
        <p className="text-[13.5px] text-charcoal truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function ContactInfoSection({ profile, onEdit }: ContactInfoSectionProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <IconButton variant="ghost" size="sm" aria-label="Edit contact information" onClick={onEdit}>
          <Pencil size={15} />
        </IconButton>
      </CardHeader>
      <CardBody className="divide-y divide-line">
        <Row icon={<User size={15} />} label="Contact person" value={profile.contact.contactPerson} />
        <Row icon={<Phone size={15} />} label="Mobile" value={profile.contact.mobile} />
        <Row icon={<Mail size={15} />} label="Email" value={profile.contact.email} />
        <Row icon={<Globe size={15} />} label="Website" value={profile.contact.website} />
      </CardBody>
    </Card>
  );
}
