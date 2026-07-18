"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { OfferTable, OfferFilterPanel, MillOffersLiveIndicator } from "@/components/mill-offers";
import { FAB } from "@/components/mobile";
import { useIsMobile } from "@/hooks/useMediaQuery";

import { millOfferService } from "@/services/millOffer.service";
import type { MillOffer, MillOfferFilters } from "@/lib/types/millOffer";

export default function MillOfferBoardPage() {
  const [filters, setFilters] = useState<MillOfferFilters>({});
  const [search, setSearch] = useState("");
  const [offers, setOffers] = useState<MillOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setLoading(true);
    millOfferService.getOffers({ ...filters, search: search || undefined }).then((result) => {
      setOffers(result);
      setLoading(false);
    });
  }, [filters, search]);

  return (
    <>
      <Breadcrumb items={[{ label: "Mill Offers" }]} className="mb-5" />
      <PageHeader
        title="Mill Offer Board"
        description="Daily fixed-price mill offers — grade-wise quantity, price, and terms."
        actions={
          <Link href="/mill-offers/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> Create New Offer
            </Button>
          </Link>
        }
      />
      <MillOffersLiveIndicator />

      <div className="mb-6 max-w-md">
        <SearchInput
          placeholder="Search by offer number, mill, or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <OfferFilterPanel onApply={setFilters} />
        </GridItem>

        <GridItem span={3}>
          <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${offers.length} offers`}</p>
          <OfferTable offers={offers} loading={loading} />
        </GridItem>
      </Grid>

      {isMobile && <FAB label="Create Offer" icon={Plus} href="/mill-offers/create" />}
    </>
  );
}
