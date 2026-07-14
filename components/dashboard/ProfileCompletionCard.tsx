"use client";

import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { profileService } from "@/services/profile.service";
import type { ProfileCompletionItem } from "@/lib/types/company-profile";

/** ProfileCompletionCard — fetches completion state from profileService, computed live from the CompanyProfile record. */
export function ProfileCompletionCard() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [items, setItems] = useState<ProfileCompletionItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    profileService.getProfileCompletion().then((result) => {
      if (cancelled) return;
      setPercent(result.percent);
      setItems(result.items);
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
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-faint">Profile completion</span>
              <span className="font-mono text-xs text-gold-dim">{percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>

            <ul className="mt-5 space-y-2.5">
              {items.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.complete ? (
                    <Check size={14} className="text-success shrink-0" />
                  ) : (
                    <Circle size={14} className="text-ink-faint shrink-0" />
                  )}
                  <span className={`text-[13px] ${item.complete ? "text-charcoal" : "text-ink-faint"}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardBody>
    </Card>
  );
}
