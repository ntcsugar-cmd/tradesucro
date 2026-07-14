"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Textarea } from "@/components/forms/Textarea";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { marketplaceService } from "@/services/marketplace.service";
import type { ExpressInterestPayload } from "@/lib/types/marketplace";

interface ExpressInterestModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingType: "offer" | "requirement";
  listingLabel: string;
}

const INITIAL = { message: "", offeredPrice: "", quantity: "", expectedDispatch: "" };

/** ExpressInterestModal — no backend; marketplaceService.expressInterest() simulates the send. */
export function ExpressInterestModal({ open, onClose, listingId, listingType, listingLabel }: ExpressInterestModalProps) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setForm(INITIAL);
      setError(null);
      setSent(false);
    }, 200);
  }

  async function handleSend() {
    setError(null);
    if (!form.message.trim()) {
      setError("Add a short message before sending.");
      return;
    }

    setSending(true);
    const payload: ExpressInterestPayload = {
      listingId,
      listingType,
      message: form.message,
      offeredPrice: Number(form.offeredPrice) || 0,
      quantity: Number(form.quantity) || 0,
      expectedDispatch: form.expectedDispatch,
    };
    const result = await marketplaceService.expressInterest(payload);
    setSending(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    setSent(true);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Express Interest"
      description={listingLabel}
      footer={
        sent ? (
          <Button variant="primary" onClick={handleClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose} disabled={sending}>
              Cancel
            </Button>
            <Button variant="primary" loading={sending} onClick={handleSend}>
              <Send size={15} /> Send Interest
            </Button>
          </>
        )
      }
    >
      {sent ? (
        <Alert variant="success" title="Interest sent">
          The company will be notified and can respond with next steps.
        </Alert>
      ) : (
        <div className="space-y-5">
          {error && <Alert variant="danger">{error}</Alert>}

          <Textarea
            label="Message"
            placeholder="Introduce your business and what you're looking for…"
            rows={3}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput
              label="Offered price"
              unit="₹/QTL"
              placeholder="3800"
              value={form.offeredPrice}
              onChange={(e) => setForm((f) => ({ ...f, offeredPrice: e.target.value }))}
            />
            <NumberInput
              label="Quantity"
              unit="MT"
              placeholder="200"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
            />
          </div>

          <TextInput
            label="Expected dispatch"
            type="date"
            value={form.expectedDispatch}
            onChange={(e) => setForm((f) => ({ ...f, expectedDispatch: e.target.value }))}
          />
        </div>
      )}
    </Modal>
  );
}
