import { Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface ActivityTimelineSectionProps {
  profile: CompanyProfile;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function ActivityTimelineSection({ profile }: ActivityTimelineSectionProps) {
  const items = [...profile.activityTimeline].reverse();

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardBody>
        <ol className="relative border-l border-line ml-1.5 space-y-6">
          {items.map((item, i) => (
            <li key={item.id} className="pl-5 relative">
              <span
                className={`absolute -left-[7px] top-1 flex h-3 w-3 items-center justify-center rounded-full ${
                  i === 0 ? "bg-gold" : "bg-charcoal/20"
                }`}
              >
                <Circle size={6} fill="white" className="text-white" />
              </span>
              <p className="text-[13.5px] font-medium text-charcoal">{item.title}</p>
              <p className="text-xs text-ink-faint mt-0.5">{formatTimestamp(item.timestamp)}</p>
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}
