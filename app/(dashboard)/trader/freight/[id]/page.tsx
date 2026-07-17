"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Truck, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TraderSubNav } from "@/components/trader";
import { FreightInquiryStatusBadge, TransportDispatchStatusBadge } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import { transportService } from "@/services/transport.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatINR } from "@/lib/utils/format";
import type { FreightInquiry, FreightQuote, TransportDispatch } from "@/lib/types/transport";

export default function TraderFreightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [inquiry, setInquiry] = useState<FreightInquiry | null | undefined>(undefined);
  const [approvedQuote, setApprovedQuote] = useState<FreightQuote | null>(null);
  const [dispatch, setDispatch] = useState<TransportDispatch | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function load() {
    const id = params.id as string;
    const found = await freightService.getInquiryById(id);
    setInquiry(found ?? null);
    if (found) {
      setApprovedQuote(await freightService.getApprovedQuote(found.id));
      if (found.dispatchId) setDispatch((await transportService.getDispatchById(found.dispatchId)) ?? null);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleConfirm() {
    if (!inquiry) return;
    setConfirming(true);
    try {
      await freightService.confirmTransport(inquiry.id);
      toast({ variant: "success", title: "Transport confirmed" });
      await load();
    } finally {
      setConfirming(false);
    }
  }

  if (inquiry === undefined) {
    return (
      <>
        <TraderSubNav />
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }

  if (inquiry === null) {
    return (
      <>
        <TraderSubNav />
        <EmptyState title="Freight request not found" description="This request may have been removed or the link is incorrect." />
      </>
    );
  }

  return (
    <>
      <TraderSubNav />
      <button
        onClick={() => router.push("/trader/freight")}
        className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-ink-soft dark:text-white/50 hover:text-charcoal dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Freight Status
      </button>

      <PageHeader
        title={inquiry.requestNumber}
        description={`${getProductLabel(inquiry.product)}${inquiry.grade ? ` · ${inquiry.grade}` : ""} · ${formatQuantityMt(inquiry.quantity)}`}
        actions={<FreightInquiryStatusBadge status={inquiry.status} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Route</CardTitle>
            </CardHeader>
            <CardBody className="flex items-center justify-between text-[14px]">
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Loading</p>
                <p className="font-medium text-charcoal dark:text-white">
                  {inquiry.loading.refName ? `${inquiry.loading.refName}, ` : ""}
                  {inquiry.loading.city}, {getMasterStateLabel(inquiry.loading.state)}
                </p>
              </div>
              <div className="text-ink-faint dark:text-white/40">→</div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Destination</p>
                <p className="font-medium text-charcoal dark:text-white">{inquiry.destination.city}, {getMasterStateLabel(inquiry.destination.state)}</p>
              </div>
            </CardBody>
          </Card>

          {dispatch && (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Shipment Tracking</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[13px] text-ink-faint dark:text-white/40">{dispatch.dispatchNumber}</span>
                  <TransportDispatchStatusBadge status={dispatch.status} />
                </div>
                <ul className="space-y-3">
                  {dispatch.statusHistory.map((event, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                        <CheckCircle2 size={14} />
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-charcoal dark:text-white capitalize">{event.status.replace("-", " ")}</p>
                        <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{new Date(event.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Received Quote</CardTitle>
            </CardHeader>
            <CardBody>
              {!approvedQuote ? (
                <p className="text-[13px] text-ink-faint dark:text-white/40 leading-relaxed">
                  TradeSucro is collecting and verifying transporter quotes. You&apos;ll see the confirmed offer here once approved — never the full list of bids.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dim">
                      <Truck size={15} />
                    </span>
                    <div>
                      <p className="flex items-center gap-1 text-[13.5px] font-medium text-charcoal dark:text-white">
                        {approvedQuote.transporterName}
                        {approvedQuote.transporterVerified && <ShieldCheck size={12} className="text-success" />}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-ink-faint dark:text-white/40">
                        <Star size={11} className="fill-gold-dim text-gold-dim" /> {approvedQuote.transporterRating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-line dark:border-white/10 space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-ink-faint dark:text-white/40">Freight Amount</span>
                      <span className="font-mono font-medium text-charcoal dark:text-white">{formatINR(approvedQuote.freightAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-faint dark:text-white/40">Vehicle Availability</span>
                      <span className="text-charcoal dark:text-white">{approvedQuote.vehicleAvailability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-faint dark:text-white/40">Est. Transit Time</span>
                      <span className="text-charcoal dark:text-white">{approvedQuote.transitTime}</span>
                    </div>
                  </div>
                  {inquiry.status === "quote_approved" && (
                    <Button variant="primary" size="md" fullWidth loading={confirming} onClick={handleConfirm}>
                      Confirm Transport
                    </Button>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
