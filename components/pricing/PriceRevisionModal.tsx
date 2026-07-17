"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { NumberInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { MillPriceQuote } from "@/lib/types/millPricing";

interface PriceRevisionModalProps {
  open: boolean;
  onClose: () => void;
  quote: MillPriceQuote | null;
  onSubmit: (newPrice: number, reason: string) => Promise<void>;
}

export function PriceRevisionModal({ open, onClose, quote, onSubmit }: PriceRevisionModalProps) {
  const [newPrice, setNewPrice] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setNewPrice("");
      setReason("");
      setError(null);
    }, 200);
  }

  async function handleSubmit() {
    if (!newPrice || Number(newPrice) <= 0) {
      setError("Enter a valid new price.");
      return;
    }
    setSaving(true);
    await onSubmit(Number(newPrice), reason);
    setSaving(false);
    handleClose();
  }

  if (!quote) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Update Price" description={`${getProductLabel(quote.product)} · ${quote.grade}`}>
      <div className="space-y-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="flex items-center justify-between rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] p-3.5">
          <span className="text-xs text-ink-faint dark:text-white/40">Current price</span>
          <span className="font-mono text-sm text-charcoal dark:text-white">{formatINR(quote.todaysPrice)}</span>
        </div>

        <NumberInput label="New Price" unit="₹" placeholder={String(quote.todaysPrice)} value={newPrice} onChange={(e) => setNewPrice(e.target.value)} autoFocus />

        <Textarea label="Reason" placeholder="e.g. Aligning with market rate" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" loading={saving} onClick={handleSubmit}>
          Save Revision
        </Button>
      </div>
    </Modal>
  );
}
