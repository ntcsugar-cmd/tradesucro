"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox, Route, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TransportSubNav, TransportStatsWidget, TransportDispatchStatusBadge } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import { freightService } from "@/services/freight.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type { FreightInquiry, FreightQuote, TransportDispatch } from "@/lib/types/transport";

export default function TransportDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [newInquiries, setNewInquiries] = useState<{ inquiry: FreightInquiry; quote: FreightQuote }[]>([]);
  const [activeDispatches, setActiveDispatches] = useState<TransportDispatch[]>([]);

  useEffect(() => {
    Promise.all([freightService.getNewInquiriesForTransporter(), transportService.getDispatches(true)]).then(([inquiries, dispatches]) => {
      setNewInquiries(inquiries.slice(0, 4));
      setActiveDispatches(dispatches.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TransportSubNav />
      <PageHeader title="Transport Dashboard" description="Fleet status, new freight inquiries, and active trips at a glance." />

      <div className="mb-8">
        <TransportStatsWidget />
      </div>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>New Freight Inquiries</CardTitle>
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
              ) : newInquiries.length === 0 ? (
                <EmptyState icon={<Inbox size={20} />} title="No new inquiries" description="TradeSucro will broadcast matching freight inquiries here." />
              ) : (
                <ul className="divide-y divide-line dark:divide-white/10">
                  {newInquiries.map(({ inquiry }) => (
                    <li key={inquiry.id} className="py-3 first:pt-0 last:pb-0">
                      <Link href="/transport/loads" className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{inquiry.requestedByCompany}</p>
                          <p className="text-[11.5px] text-ink-faint dark:text-white/40">
                            {getProductLabel(inquiry.product)} · {getMasterStateLabel(inquiry.loading.state)} → {getMasterStateLabel(inquiry.destination.state)}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-ink-faint dark:text-white/40 shrink-0" />
                      </Link>
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
              <CardTitle>Active Trips</CardTitle>
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
                <EmptyState icon={<Route size={20} />} title="No active trips" description="Confirmed freight assigned to a vehicle will appear here." />
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
