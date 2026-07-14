"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevisionHistoryTable } from "@/components/mill-offers";

import { millOfferService } from "@/services/millOffer.service";
import type { MillOffer, MillOfferRevision } from "@/lib/types/millOffer";

export default function MillOfferHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [revisions, setRevisions] = useState<(MillOfferRevision & { offerNumber?: string })[]>([]);

  useEffect(() => {
    Promise.all([millOfferService.getAllHistory(), millOfferService.getOffers()]).then(([history, offers]) => {
      const offerMap = new Map<string, MillOffer>(offers.map((o) => [o.id, o]));
      setRevisions(history.map((r) => ({ ...r, offerNumber: offerMap.get(r.offerId)?.offerNumber })));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: "History" }]} className="mb-5" />
      <PageHeader title="Offer History" description="Every revision recorded across all mill offers." />
      <RevisionHistoryTable revisions={revisions} loading={loading} showOfferColumn />
    </>
  );
}
