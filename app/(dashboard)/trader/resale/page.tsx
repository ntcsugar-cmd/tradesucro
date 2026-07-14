"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { ResaleSubNav, ResaleOfferTable } from "@/components/trader-resale";
import { traderResaleService } from "@/services/traderResale.service";
import type { ResaleOffer } from "@/lib/types/traderResale";

export default function ResaleOfferBoardPage() {
  const [offers, setOffers] = useState<ResaleOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    traderResaleService.getResaleOffers({ search: search || undefined }).then((result) => {
      setOffers(result);
      setLoading(false);
    });
  }, [search]);

  const activeCount = offers.filter((o) => o.status === "active" || o.status === "partially_sold").length;

  return (
    <>
      <ResaleSubNav />
      <PageHeader
        title="Resale Offers"
        description="Sell from your purchased inventory — every offer is backed by a real lot you own."
        actions={
          <Link href="/trader/resale/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> Create Resale Offer
            </Button>
          </Link>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <Tag size={13} className="text-gold-dim" />
        <p className="text-[13px] text-ink-faint">{loading ? "Loading…" : `${activeCount} active offers · ${offers.length} total`}</p>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by offer number, lot, grade…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <ResaleOfferTable offers={offers} loading={loading} />
    </>
  );
}
