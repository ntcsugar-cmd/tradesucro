"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch, Route, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TransportSubNav, TransportStatsWidget, LoadRequestStatusBadge, TransportDispatchStatusBadge } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type { LoadRequest, TransportDispatch } from "@/lib/types/transport";

export default function TransportDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<LoadRequest[]>([]);
  const [activeDispatches, setActiveDispatches] = useState<TransportDispatch[]>([]);

  useEffect(() => {
    Promise.all([transportService.getLoadRequests("pending"), transportService.getDispatches(true)]).then(([requests, dispatches]) => {
      setPendingRequests(requests.slice(0, 4));
      setActiveDispatches(dispatches.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Transport Dashboard" description="Fleet status, pending requests, and active dispatches at a glance." />

      <div className="mb-8">
        <TransportStatsWidget />
      </div>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Pending Load Requests</CardTitle>
              <Link href="/transport/loads" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : pendingRequests.length === 0 ? (
                <EmptyState icon={<PackageSearch size={20} />} title="No pending requests" description="New load requests will appear here." />
              ) : (
                <ul className="divide-y divide-line dark:divide-white/10">
                  {pendingRequests.map((r) => (
                    <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{r.requestedBy}</p>
                          <p className="text-[11.5px] text-ink-faint dark:text-white/40">
                            {getProductLabel(r.product)} · {getMasterStateLabel(r.pickup.state)} → {getMasterStateLabel(r.delivery.state)}
                          </p>
                        </div>
                        <LoadRequestStatusBadge status={r.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Active Dispatches</CardTitle>
              <Link href="/transport/dispatches" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : activeDispatches.length === 0 ? (
                <EmptyState icon={<Route size={20} />} title="No active dispatches" description="Accepted loads assigned to a vehicle will appear here." />
              ) : (
                <ul className="divide-y divide-line dark:divide-white/10">
                  {activeDispatches.map((d) => (
                    <li key={d.id} className="py-3 first:pt-0 last:pb-0">
                      <Link href={`/transport/dispatches/${d.id}`} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{d.dispatchNumber}</p>
                          <p className="text-[11.5px] text-ink-faint dark:text-white/40">
                            {getMasterStateLabel(d.pickup.state)} → {getMasterStateLabel(d.delivery.state)}
                          </p>
                        </div>
                        <TransportDispatchStatusBadge status={d.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}
