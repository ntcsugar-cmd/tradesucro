"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Package, AlertTriangle, CheckCircle2, FileEdit, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatQuantityMt } from "@/lib/utils/format";
import { millOfferService } from "@/services/millOffer.service";
import type { MillOfferDashboardStats } from "@/lib/types/millOffer";

const STAT_ITEMS: { key: keyof MillOfferDashboardStats; label: string; icon: LucideIcon; format?: (n: number) => string }[] = [
  { key: "todaysActiveOffers", label: "Today's Active Offers", icon: Package },
  { key: "offersExpiringToday", label: "Offers Expiring Today", icon: AlertTriangle },
  { key: "publishedOffers", label: "Published Offers", icon: CheckCircle2 },
  { key: "draftOffers", label: "Draft Offers", icon: FileEdit },
  { key: "totalQuantityAvailable", label: "Total Quantity Available", icon: Scale, format: formatQuantityMt },
];

/** MillOfferStatsWidget — the "Mill Dashboard" integration requested in the Mill Offer Management brief. */
export function MillOfferStatsWidget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MillOfferDashboardStats | null>(null);

  useEffect(() => {
    millOfferService.getDashboardStats().then((result) => {
      setStats(result);
      setLoading(false);
    });
  }, []);

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Mill Offers</CardTitle>
        <Link href="/mill-offers/create">
          <Button variant="primary" size="sm">
            <Plus size={14} /> Create New Offer
          </Button>
        </Link>
      </CardHeader>
      <CardBody>
        {loading || !stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {STAT_ITEMS.map(({ key, label, icon: Icon, format }) => (
              <div key={key} className="rounded-sm border border-line dark:border-white/10 p-3.5">
                <Icon size={15} className="text-gold-dim" />
                <p className="mt-2 font-mono text-xl text-charcoal dark:text-white">
                  {format ? format(stats[key]) : stats[key].toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
