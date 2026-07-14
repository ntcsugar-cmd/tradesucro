"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Gavel, ClipboardList, Package, ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Tabs } from "@/components/navigation/Tabs";
import { MarketStatsGrid, LivePriceTable, LivePriceFilterPanel, MarketFeedTimeline, PriceHeatMapGrid, MarketNewsGrid } from "@/components/market-intel";
import { TopMoversWidget, LiveListingsPanel, MarketDashboardExtras } from "@/components/market-match";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import { millOfferService } from "@/services/millOffer.service";
import { millTenderService } from "@/services/millTender.service";
import { marketplaceService } from "@/services/marketplace.service";
import { getProductLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";
import type { MillPriceEntry, LivePriceFilters } from "@/lib/types/marketIntelligence";
import type { MillOffer } from "@/lib/types/millOffer";
import type { MillTender } from "@/lib/types/millTender";
import type { MarketplaceOffer, MarketplaceRequirement } from "@/lib/types/marketplace";

const TERMINAL_TABS = [
  { value: "board", label: "Price Board" },
  { value: "activity", label: "Market Activity" },
];

const AUTO_REFRESH_MS = 30000;

export default function LivePriceBoardPage() {
  const [filters, setFilters] = useState<LivePriceFilters>({ sort: "latest" });
  const [entries, setEntries] = useState<MillPriceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [newOffers, setNewOffers] = useState<MillOffer[]>([]);
  const [activeTenders, setActiveTenders] = useState<MillTender[]>([]);
  const [buyRequirements, setBuyRequirements] = useState<MarketplaceRequirement[]>([]);
  const [sellOffers, setSellOffers] = useState<MarketplaceOffer[]>([]);
  const [panelsLoading, setPanelsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    marketIntelligenceService.getLivePrices(filters).then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, [filters]);

  useEffect(() => {
    async function loadPanels() {
      const [offers, tenders, requirements, sells] = await Promise.all([
        millOfferService.getOffers({ status: "published" }),
        millTenderService.getTenders(),
        marketplaceService.getRequirements(),
        marketplaceService.getOffers(),
      ]);
      setNewOffers(offers.slice(0, 5));
      setActiveTenders(tenders.filter((t) => t.status === "published").slice(0, 5));
      setBuyRequirements(requirements.filter((r) => r.status === "active").slice(0, 5));
      setSellOffers(sells.filter((o) => o.status === "active").slice(0, 5));
      setPanelsLoading(false);
      setLastRefreshed(new Date());
    }
    loadPanels();
    const interval = setInterval(loadPanels, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Live Trading Terminal" }]} className="mb-5" />
      <PageHeader
        title="Live Trading Terminal"
        description={`${entries.length} mills reporting today's price — the flagship view of TradeSucro's market.`}
        actions={
          <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rise opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rise" />
            </span>
            <Radio size={11} className="ml-0.5" /> Live · refreshed {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        }
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Market Dashboard</p>
        <div className="space-y-4">
          <MarketStatsGrid />
          <MarketDashboardExtras />
        </div>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Top Gainers &amp; Losers</p>
        <TopMoversWidget />
      </div>

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Market Activity</p>
        <Grid cols={1} colsMd={2} gap="md">
          <LiveListingsPanel
            title="New Mill Offers"
            items={newOffers}
            loading={panelsLoading}
            getKey={(o) => o.id}
            viewAllHref="/mill-offers"
            emptyText="No new mill offers right now."
            renderItem={(o) => (
              <Link href={`/mill-offers/${o.id}`} className="flex items-center justify-between gap-3 hover:opacity-70 transition-opacity">
                <div className="min-w-0">
                  <p className="text-[13px] text-charcoal truncate">{o.millName}</p>
                  <p className="text-[11px] text-ink-faint">{o.products.map((p) => getProductLabel(p.product)).join(", ")}</p>
                </div>
                <span className="flex items-center gap-1 font-mono text-[13px] text-charcoal shrink-0">
                  {formatQuantityMt(o.products.reduce((s, p) => s + p.availableQuantity, 0))} <ArrowUpRight size={11} className="text-ink-faint" />
                </span>
              </Link>
            )}
          />

          <LiveListingsPanel
            title="Active Tenders"
            items={activeTenders}
            loading={panelsLoading}
            getKey={(t) => t.id}
            viewAllHref="/mill/tenders"
            emptyText="No tenders open for bidding right now."
            renderItem={(t) => (
              <Link href={`/mill/tenders/${t.id}`} className="flex items-center justify-between gap-3 hover:opacity-70 transition-opacity">
                <div className="min-w-0 flex items-center gap-2">
                  <Gavel size={12} className="text-gold-dim shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal truncate">{t.tenderNumber}</p>
                    <p className="text-[11px] text-ink-faint truncate">{t.title}</p>
                  </div>
                </div>
                <span className="font-mono text-[13px] text-charcoal shrink-0">{formatINR(t.products[0]?.reservePrice ?? 0)}</span>
              </Link>
            )}
          />

          <LiveListingsPanel
            title="Buy Requirements"
            items={buyRequirements}
            loading={panelsLoading}
            getKey={(r) => r.id}
            viewAllHref="/marketplace/requirements"
            emptyText="No open buy requirements right now."
            renderItem={(r) => (
              <Link href={`/marketplace/requirement/${r.id}`} className="flex items-center justify-between gap-3 hover:opacity-70 transition-opacity">
                <div className="min-w-0 flex items-center gap-2">
                  <ClipboardList size={12} className="text-gold-dim shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal truncate">{r.company.name}</p>
                    <p className="text-[11px] text-ink-faint">{getProductLabel(r.product)} · {formatQuantityMt(r.quantity)}</p>
                  </div>
                </div>
                <span className="font-mono text-[13px] text-charcoal shrink-0">{formatINR(r.expectedPrice)}</span>
              </Link>
            )}
          />

          <LiveListingsPanel
            title="Sell Offers"
            items={sellOffers}
            loading={panelsLoading}
            getKey={(o) => o.id}
            viewAllHref="/marketplace/offers"
            emptyText="No active sell offers right now."
            renderItem={(o) => (
              <Link href={`/marketplace/offer/${o.id}`} className="flex items-center justify-between gap-3 hover:opacity-70 transition-opacity">
                <div className="min-w-0 flex items-center gap-2">
                  <Package size={12} className="text-gold-dim shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] text-charcoal truncate">{o.company.name}</p>
                    <p className="text-[11px] text-ink-faint">{getProductLabel(o.product)} · {formatQuantityMt(o.quantity)}</p>
                  </div>
                </div>
                <span className="font-mono text-[13px] text-charcoal shrink-0">{formatINR(o.price)}</span>
              </Link>
            )}
          />
        </Grid>
      </div>

      <Tabs tabs={TERMINAL_TABS} defaultValue="board">
        {(active) =>
          active === "board" ? (
            <Grid cols={1} colsLg={4} gap="md">
              <GridItem span={1} className="hidden lg:block">
                <LivePriceFilterPanel onApply={setFilters} />
              </GridItem>
              <GridItem span={3}>
                <LivePriceTable entries={entries} loading={loading} />
              </GridItem>
            </Grid>
          ) : (
            <div className="space-y-6">
              <Grid cols={1} colsLg={2} gap="md">
                <GridItem>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Market Activity Timeline</p>
                    <MarketFeedTimeline limit={15} />
                  </div>
                </GridItem>
                <GridItem>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Market News</p>
                    <MarketNewsGrid />
                  </div>
                </GridItem>
              </Grid>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-3">Market Heat Map</p>
                <PriceHeatMapGrid />
              </div>
            </div>
          )
        }
      </Tabs>
    </>
  );
}
