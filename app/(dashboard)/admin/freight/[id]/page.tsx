"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { FreightInquiryStatusBadge, FreightQuoteStatusBadge } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatINR } from "@/lib/utils/format";
import type { FreightInquiry, FreightQuote } from "@/lib/types/transport";

export default function AdminFreightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [inquiry, setInquiry] = useState<FreightInquiry | null | undefined>(undefined);
  const [quotes, setQuotes] = useState<FreightQuote[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  async function load() {
    const id = params.id as string;
    const found = await freightService.getInquiryById(id);
    setInquiry(found ?? null);
    if (found) setQuotes(await freightService.getQuotesForInquiry(found.id));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleApprove(quoteId: string) {
    setApproving(quoteId);
    try {
      await freightService.approveQuote(quoteId);
      toast({ variant: "success", title: "Quote approved and shared with the requester" });
      await load();
    } finally {
      setApproving(null);
    }
  }

  if (inquiry === undefined) {
    return (
      <>
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }
  if (inquiry === null) {
    return <EmptyState title="Freight request not found" description="This request may have been removed or the link is incorrect." />;
  }

  const submittedQuotes = quotes.filter((q) => q.response === "accepted" && q.freightAmount !== null).sort((a, b) => (a.freightAmount ?? 0) - (b.freightAmount ?? 0));
  const otherQuotes = quotes.filter((q) => !(q.response === "accepted" && q.freightAmount !== null));

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "Freight Coordination", href: "/admin/freight" }, { label: inquiry.requestNumber }]} className="mb-5" />
      <button
        onClick={() => router.push("/admin/freight")}
        className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-ink-soft dark:text-white/50 hover:text-charcoal dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to All Freight Requests
      </button>

      <PageHeader
        title={inquiry.requestNumber}
        description={`${inquiry.requestedByCompany} · ${getProductLabel(inquiry.product)}${inquiry.grade ? ` · ${inquiry.grade}` : ""} · ${formatQuantityMt(inquiry.quantity)}`}
        actions={<FreightInquiryStatusBadge status={inquiry.status} />}
      />

      <Card padding="lg" className="mb-6">
        <CardBody className="flex items-center justify-between text-[14px]">
          <div>
            <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Loading</p>
            <p className="font-medium text-charcoal dark:text-white">{inquiry.loading.city}, {getMasterStateLabel(inquiry.loading.state)}</p>
          </div>
          <div className="text-ink-faint dark:text-white/40">→</div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-mono mb-1">Destination</p>
            <p className="font-medium text-charcoal dark:text-white">{inquiry.destination.city}, {getMasterStateLabel(inquiry.destination.state)}</p>
          </div>
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Quote Comparison ({submittedQuotes.length} submitted)</CardTitle>
        </CardHeader>
        <CardBody>
          {submittedQuotes.length === 0 ? (
            <p className="text-[13px] text-ink-faint dark:text-white/40">No quotes submitted yet — {quotes.filter((q) => q.response === "pending").length} transporter(s) still to respond.</p>
          ) : (
            <div className="space-y-3">
              {submittedQuotes.map((q, i) => (
                <div key={q.id} className={`rounded-sm border p-4 ${q.adminStatus === "approved" ? "border-success/40 bg-success/[0.04]" : "border-line dark:border-white/10"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-[14px] font-semibold text-charcoal dark:text-white">
                        {q.transporterName}
                        {q.transporterVerified && <ShieldCheck size={13} className="text-success" />}
                        {i === 0 && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dim">Lowest Quote</span>}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-ink-faint dark:text-white/40 mt-0.5">
                        <Star size={11} className="fill-gold-dim text-gold-dim" /> {q.transporterRating.toFixed(1)} rating
                      </p>
                    </div>
                    <FreightQuoteStatusBadge status={q.adminStatus} />
                  </div>

                  <div className="mt-3 grid sm:grid-cols-4 gap-3 text-[13px]">
                    <div>
                      <p className="text-ink-faint dark:text-white/40 text-xs">Freight Amount</p>
                      <p className="font-mono font-medium text-charcoal dark:text-white">{formatINR(q.freightAmount ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint dark:text-white/40 text-xs">Vehicle Availability</p>
                      <p className="text-charcoal dark:text-white">{q.vehicleAvailability}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint dark:text-white/40 text-xs">Loading Time</p>
                      <p className="text-charcoal dark:text-white">{q.loadingTime}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint dark:text-white/40 text-xs">Transit Time</p>
                      <p className="text-charcoal dark:text-white">{q.transitTime}</p>
                    </div>
                  </div>
                  {q.remarks && <p className="mt-2 text-xs text-ink-soft dark:text-white/50 italic">{q.remarks}</p>}

                  {q.adminStatus === "pending_review" && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone size={13} /> Contact Transporter
                      </Button>
                      <Button variant="primary" size="sm" loading={approving === q.id} onClick={() => handleApprove(q.id)}>
                        Verify &amp; Approve This Quote
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {otherQuotes.length > 0 && (
            <div className="mt-5 pt-4 border-t border-line dark:border-white/10">
              <p className="text-xs font-medium text-ink-faint dark:text-white/40 mb-2">Other matched transporters</p>
              <ul className="space-y-1.5">
                {otherQuotes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-soft dark:text-white/50">{q.transporterName}</span>
                    <span className="text-xs text-ink-faint dark:text-white/40">{q.response === "pending" ? "Awaiting response" : "Declined"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}
