import { Mail, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Avatar } from "@/components/ui/Avatar";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface TeamMembersSectionProps {
  profile: CompanyProfile;
}

export function TeamMembersSection({ profile }: TeamMembersSectionProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardBody className="divide-y divide-line">
        {profile.team.map((member) => (
          <div key={member.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar name={member.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-charcoal">{member.name}</p>
              <p className="text-xs text-ink-faint">{member.designation}</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-0.5 text-xs text-ink-faint">
              <span className="flex items-center gap-1.5">
                <Mail size={11} /> {member.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={11} /> {member.phone}
              </span>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
