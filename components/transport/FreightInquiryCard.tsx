"use client";

import { useState } from "react";
import { Factory, Warehouse, MapPin, Package, Truck, CalendarClock } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { getProductLabel, getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { FreightInquiry, FreightQuote } from "@/lib/types/transport";

const LOCATION_ICON = { mill: Factory, warehouse: Warehouse, city: MapPin };
const VEHICLE_LABEL: Record<string, string> = { "open-truck": "Open Truck", "covered-truck": "Covered Truck", trailer: "Trailer", container: "Container" };

interface FreightInquiryCardProps {
  inquiry: FreightInquiry;
  quote: FreightQuote;
  onRespond: (quoteId: string, accept: boolean) => Promise<void>;
  onSubmitQuote: (quoteId: string, details: { freightAmount: number; vehicleAvailability: string; loadingTime: string; transitTime: string; remarks: string }) => Promise<void>;
}

export function FreightInquiryCard({ inquiry, quote, onRespond, onSubmitQuote }: FreightInquiryCardProps) {
  const [quoting, setQuoting] = useState(false);
  const [busy, setBusy] = useState<"accept" | "decline" | "quote" | null>(null);
  const [form, setForm] = useState({ freightAmount: "", vehicleAvailability: "", loadingTime: "", transitTime: "", remarks: "" });

  const LocationIcon = LOCATION_ICON[inquiry.loading.locationType];

  async function handleAccept() {
    setBusy("accept");
    await onRespond(quote.id, true);
    setBusy(null);
    setQuoting(true);
  }

  async function handleDecline() {
    setBusy("decline");
    await onRespond(quote.id, false);
    setBusy(null);
  }

  async function handleSubmitQuote() {
    setBusy("quote");
    await onSubmitQuote(quote.id, {
      freightAmount: Number(form.freightAmount) || 0,
      vehicleAvailability: form.vehicleAvailability,
      loadingTime: form.loadingTime,
      transitTime: form.transitTime,
      remarks: form.remarks,
    });
    setBusy(null);
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-ink-faint dark:text-white/40">{inquiry.requestNumber}</p>
            <p className="mt-1 text-[14px] font-semibold text-charcoal dark:text-white">
              {getProductLabel(inquiry.product)} {inquiry.grade && `· ${inquiry.grade}`} · {formatQuantityMt(inquiry.quantity)}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-dim shrink-0">
            <Truck size={12} /> {VEHICLE_LABEL[inquiry.vehicleTypeRequired]}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-[13px]">
          <div className="flex items-center gap-2 text-ink-soft dark:text-white/50">
            <LocationIcon size={14} className="shrink-0 text-gold-dim" />
            <span>
              {inquiry.loading.refName ? `${inquiry.loading.refName}, ` : ""}
              {inquiry.loading.city}, {getMasterStateLabel(inquiry.loading.state)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft dark:text-white/50">
            <MapPin size={14} className="shrink-0 text-ink-faint dark:text-white/40" />
            <span>To {inquiry.destination.city}, {getMasterStateLabel(inquiry.destination.state)}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft dark:text-white/50">
            <CalendarClock size={14} className="shrink-0 text-ink-faint dark:text-white/40" />
            <span>Loading by {new Date(inquiry.expectedLoadingDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
          </div>
          {inquiry.specialInstructions && (
            <div className="flex items-start gap-2 text-ink-faint dark:text-white/40">
              <Package size={14} className="shrink-0 mt-0.5" />
              <span className="italic">{inquiry.specialInstructions}</span>
            </div>
          )}
        </div>

        {!quoting ? (
          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="md" fullWidth loading={busy === "decline"} disabled={busy !== null} onClick={handleDecline}>
              Decline
            </Button>
            <Button variant="primary" size="md" fullWidth loading={busy === "accept"} disabled={busy !== null} onClick={handleAccept}>
              Accept &amp; Quote
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-3 pt-4 border-t border-line dark:border-white/10">
            <div className="grid sm:grid-cols-2 gap-3">
              <TextInput label="Freight Amount (₹)" type="number" value={form.freightAmount} onChange={(e) => setForm((p) => ({ ...p, freightAmount: e.target.value }))} />
              <TextInput label="Vehicle Availability" placeholder="e.g. Available within 24 hours" value={form.vehicleAvailability} onChange={(e) => setForm((p) => ({ ...p, vehicleAvailability: e.target.value }))} />
              <TextInput label="Loading Time" placeholder="e.g. 6 hours" value={form.loadingTime} onChange={(e) => setForm((p) => ({ ...p, loadingTime: e.target.value }))} />
              <TextInput label="Expected Transit Time" placeholder="e.g. 2 days" value={form.transitTime} onChange={(e) => setForm((p) => ({ ...p, transitTime: e.target.value }))} />
            </div>
            <Textarea label="Remarks (optional)" rows={2} value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} />
            <Button variant="primary" size="md" fullWidth loading={busy === "quote"} onClick={handleSubmitQuote}>
              Submit Quote to TradeSucro
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
