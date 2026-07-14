"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History as HistoryIcon } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { useDisclosure } from "@/hooks/useDisclosure";
import { PriceBoardTable, PriceRevisionModal } from "@/components/pricing";
import { millPricingService } from "@/services/millPricing.service";
import type { MillPriceQuote } from "@/lib/types/millPricing";

export default function PriceBoardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<MillPriceQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MillPriceQuote | null>(null);
  const updateModal = useDisclosure(false);
  const { toast } = useToast();

  useEffect(() => {
    millPricingService.getTodaysPrices().then((result) => {
      setQuotes(result);
      setLoading(false);
    });
  }, []);

  function handleUpdatePrice(quote: MillPriceQuote) {
    setSelected(quote);
    updateModal.open();
  }

  async function handleSubmitRevision(newPrice: number, reason: string) {
    if (!selected) return;
    const updated = await millPricingService.updatePrice(selected.id, newPrice, reason);
    if (updated) {
      setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      toast({ variant: "success", title: "Price updated", description: "Revision saved to history." });
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Price History" }]} className="mb-5" />
      <PageHeader
        title="Today's Price Board"
        description="Grade-wise reference prices — updates automatically create a revision history."
        actions={
          <Link href="/price-board/history">
            <Button variant="outline" size="md">
              <HistoryIcon size={15} /> Price History
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading price board…" />
        </div>
      ) : (
        <PriceBoardTable
          quotes={quotes}
          onUpdatePrice={handleUpdatePrice}
          onViewHistory={(q) => router.push(`/price-board/history?quote=${q.id}`)}
        />
      )}

      <PriceRevisionModal open={updateModal.isOpen} onClose={updateModal.close} quote={selected} onSubmit={handleSubmitRevision} />
    </>
  );
}
