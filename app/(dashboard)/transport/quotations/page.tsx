"use client";

import { useEffect, useState } from "react";
import { FileStack } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TransportSubNav, FreightQuoteStatusBadge } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatINR } from "@/lib/utils/format";
import type { FreightInquiry, FreightQuote } from "@/lib/types/transport";

export default function MyQuotationsPage() {
  const [rows, setRows] = useState<{ inquiry: FreightInquiry; quote: FreightQuote }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    freightService.getMyQuotations().then((result) => {
      setRows(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TransportSubNav />
      <PageHeader title="My Quotations" description="Every inquiry you've responded to, and TradeSucro's review status on each." />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={<FileStack size={20} />} title="No quotations yet" description="Accept and quote a freight inquiry to see it listed here." />
      ) : (
        <div className="space-y-3">
          {rows.map(({ inquiry, quote }) => (
            <Card key={quote.id} padding="lg">
              <CardBody className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-ink-faint dark:text-white/40">{inquiry.requestNumber}</p>
                  <p className="mt-1 text-[14px] font-semibold text-charcoal dark:text-white">
                    {getProductLabel(inquiry.product)} · {formatQuantityMt(inquiry.quantity)}
                  </p>
                  <p className="mt-0.5 text-[13px] text-ink-soft dark:text-white/50">
                    {inquiry.loading.city}, {getMasterStateLabel(inquiry.loading.state)} → {inquiry.destination.city}, {getMasterStateLabel(inquiry.destination.state)}
                  </p>
                </div>
                <div className="text-right">
                  {quote.response === "declined" ? (
                    <p className="text-[13px] text-ink-faint dark:text-white/40 italic">Declined</p>
                  ) : quote.freightAmount !== null ? (
                    <p className="font-mono text-[15px] text-charcoal dark:text-white">{formatINR(quote.freightAmount)}</p>
                  ) : null}
                  <div className="mt-1.5">
                    <FreightQuoteStatusBadge status={quote.adminStatus} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
