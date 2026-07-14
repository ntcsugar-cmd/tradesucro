"use client";

import { useState } from "react";
import { Trophy, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { formatINR, formatPricePerUnit, formatQuantityMt } from "@/lib/utils/format";
import type { MillTender, MillTenderBid, AwardDetails } from "@/lib/types/millTender";

interface AwardPanelProps {
  tender: MillTender;
  bids: MillTenderBid[];
  canAward: boolean;
  onAward: (details: AwardDetails) => Promise<void>;
}

export function AwardPanel({ tender, bids, canAward, onAward }: AwardPanelProps) {
  const eligibleBids = bids.filter((b) => b.status === "submitted" || b.status === "revised");
  const [winningBidId, setWinningBidId] = useState(eligibleBids[0]?.id ?? "");
  const [awardQuantity, setAwardQuantity] = useState(eligibleBids[0]?.quantity ?? 0);
  const [awardPrice, setAwardPrice] = useState(eligibleBids[0]?.price ?? 0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [awarding, setAwarding] = useState(false);
  const [summary, setSummary] = useState<AwardDetails | null>(null);

  const winner = bids.find((b) => b.id === winningBidId);

  function handleSelectWinner(id: string) {
    setWinningBidId(id);
    const bid = bids.find((b) => b.id === id);
    if (bid) {
      setAwardQuantity(bid.quantity);
      setAwardPrice(bid.price);
    }
  }

  async function handleAward() {
    if (!winningBidId || !awardQuantity || !awardPrice) {
      setError("Select a winner and confirm award quantity and price.");
      return;
    }
    setError(null);
    setAwarding(true);
    const details: AwardDetails = { tenderId: tender.id, winningBidId, awardQuantity, awardPrice, awardNotes: notes, awardedAt: new Date().toISOString() };
    await onAward(details);
    setAwarding(false);
    setSummary(details);
  }

  if (tender.status === "awarded") {
    const awardedBid = bids.find((b) => b.status === "awarded");
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Award Summary</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
              <Trophy size={18} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-charcoal">{awardedBid?.companyName ?? "Winner"}</p>
              <p className="text-xs text-ink-faint mt-0.5">
                Awarded {formatQuantityMt(awardedBid?.quantity ?? 0)} at {formatPricePerUnit(awardedBid?.price ?? 0)} on{" "}
                {new Date(tender.awardDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!canAward) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Award Tender</CardTitle>
        </CardHeader>
        <CardBody>
          <Alert variant="info">This tender must close before it can be awarded.</Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Award Tender</CardTitle>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert variant="danger" className="mb-5">
            {error}
          </Alert>
        )}
        {summary && (
          <Alert variant="success" className="mb-5">
            Award confirmed — {winner?.companyName} awarded {formatQuantityMt(summary.awardQuantity)} at {formatPricePerUnit(summary.awardPrice)}.
          </Alert>
        )}

        <div className="space-y-5">
          <Select
            label="Select Winner"
            defaultValue={winningBidId}
            options={eligibleBids.map((b) => ({ value: b.id, label: `${b.bidNumber} — ${b.companyName} (${formatINR(b.price)})` }))}
            onChange={(e) => handleSelectWinner(e.target.value)}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <NumberInput label="Award Quantity" unit="MT" value={awardQuantity || ""} onChange={(e) => setAwardQuantity(Number(e.target.value) || 0)} />
            <NumberInput label="Award Price" unit="₹" value={awardPrice || ""} onChange={(e) => setAwardPrice(Number(e.target.value) || 0)} />
          </div>

          <Textarea label="Award Notes" rows={2} placeholder="Any conditions or notes for the award record…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Button variant="primary" size="md" className="mt-6" loading={awarding} onClick={handleAward}>
          <FileText size={15} /> Award Tender & Generate Summary
        </Button>
      </CardBody>
    </Card>
  );
}
