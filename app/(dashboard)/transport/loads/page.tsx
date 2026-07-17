"use client";

import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { TransportSubNav, FreightInquiryCard } from "@/components/transport";
import { freightService } from "@/services/freight.service";
import type { FreightInquiry, FreightQuote } from "@/lib/types/transport";

export default function NewFreightInquiriesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<{ inquiry: FreightInquiry; quote: FreightQuote }[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setRows(await freightService.getNewInquiriesForTransporter());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRespond(quoteId: string, accept: boolean) {
    await freightService.respondToInquiry(quoteId, accept);
    if (!accept) {
      toast({ variant: "success", title: "Inquiry declined" });
      await load();
    }
  }

  async function handleSubmitQuote(quoteId: string, details: { freightAmount: number; vehicleAvailability: string; loadingTime: string; transitTime: string; remarks: string }) {
    await freightService.submitQuote(quoteId, details);
    toast({ variant: "success", title: "Quote submitted to TradeSucro" });
    await load();
  }

  return (
    <>
      <TransportSubNav />
      <PageHeader
        title="New Freight Inquiries"
        description="Freight inquiries TradeSucro has matched to your coverage area and vehicle types. Accept to submit a quote, or decline."
      />

      {loading ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </Grid>
      ) : rows.length === 0 ? (
        <EmptyState icon={<PackageSearch size={20} />} title="No new inquiries" description="TradeSucro will broadcast matching freight inquiries here as traders post them." />
      ) : (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {rows.map(({ inquiry, quote }) => (
            <GridItem key={quote.id}>
              <FreightInquiryCard inquiry={inquiry} quote={quote} onRespond={handleRespond} onSubmitQuote={handleSubmitQuote} />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
