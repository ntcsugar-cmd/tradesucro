"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Package, ClipboardList, Tag, Truck, Handshake, TrendingUp, Receipt, ArrowRight, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { tradeSucroLiveMarketAdapter } from "@/services/adapters/tradeSucroLiveMarketAdapter";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt, formatPricePerUnit } from "@/lib/utils/format";
import type { LiveMarketFeed } from "@/lib/types/marketIntelligence";

export default function TradeSucroLiveMarketPage() {
  const [feed, setFeed] = useState<LiveMarketFeed | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tradeSucroLiveMarketAdapter.fetch().then(([result]) => {
      setFeed(result.value);
      setLastUpdated(result.meta.lastUpdated);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "TradeSucro Live Market" }]} className="mb-5" />
      <PageHeader title="TradeSucro Live Market" description="Only TradeSucro-generated activity — every mill offer, requirement, deal, and dispatch happening on the platform right now." />

      <div className="flex items-center gap-1.5 mb-6 text-xs text-ink-faint dark:text-white/40">
        <Radio size={12} className="text-rise" />
        Live · TradeSucro Platform{lastUpdated && ` · Updated ${new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
      </div>

      {loading || !feed ? (
        <Grid cols={1} colsMd={2} colsLg={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </Grid>
      ) : (
        <>
          <Grid cols={1} colsMd={2} colsLg={3} gap="md" className="mb-6">
            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Latest Mill Offers</CardTitle>
                  <Link href="/mill-offers" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                    All <ArrowRight size={12} />
                  </Link>
                </CardHeader>
                <CardBody>
                  {feed.latestMillOffers.length === 0 ? (
                    <EmptyState icon={<Package size={18} />} title="No offers yet" />
                  ) : (
                    <ul className="divide-y divide-line dark:divide-white/10">
                      {feed.latestMillOffers.slice(0, 5).map((o) => (
                        <li key={o.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{o.millName}</p>
                            <p className="text-[11.5px] text-ink-faint dark:text-white/40">{o.product} · {o.grade}</p>
                          </div>
                          <span className="font-mono text-xs text-charcoal dark:text-white shrink-0">{formatPricePerUnit(o.price)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Latest Buyer Requirements</CardTitle>
                  <Link href="/marketplace/requirements" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                    All <ArrowRight size={12} />
                  </Link>
                </CardHeader>
                <CardBody>
                  {feed.latestRequirements.length === 0 ? (
                    <EmptyState icon={<ClipboardList size={18} />} title="No requirements yet" />
                  ) : (
                    <ul className="divide-y divide-line dark:divide-white/10">
                      {feed.latestRequirements.slice(0, 5).map((r) => (
                        <li key={r.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{r.companyName}</p>
                            <p className="text-[11.5px] text-ink-faint dark:text-white/40">{r.product} · {r.grade}</p>
                          </div>
                          <span className="font-mono text-xs text-ink-soft dark:text-white/50 shrink-0">{formatQuantityMt(r.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Latest Trader Offers</CardTitle>
                  <Link href="/marketplace/offers" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                    All <ArrowRight size={12} />
                  </Link>
                </CardHeader>
                <CardBody>
                  {feed.latestTraderOffers.length === 0 ? (
                    <EmptyState icon={<Tag size={18} />} title="No offers yet" />
                  ) : (
                    <ul className="divide-y divide-line dark:divide-white/10">
                      {feed.latestTraderOffers.slice(0, 5).map((o) => (
                        <li key={o.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-charcoal dark:text-white truncate">{o.companyName}</p>
                            <p className="text-[11.5px] text-ink-faint dark:text-white/40">{o.product} · {o.grade}</p>
                          </div>
                          <span className="font-mono text-xs text-charcoal dark:text-white shrink-0">{formatPricePerUnit(o.price)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Freight Availability</CardTitle>
                </CardHeader>
                <CardBody>
                  <ul className="divide-y divide-line dark:divide-white/10">
                    {feed.freightAvailability.slice(0, 5).map((t) => (
                      <li key={t.transporterName} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[13px] text-charcoal dark:text-white truncate">
                          <Truck size={13} className="shrink-0 text-gold-dim" />
                          {t.transporterName}
                          {t.verified && <ShieldCheck size={11} className="shrink-0 text-success" />}
                        </span>
                        <span className="text-[11px] text-ink-faint dark:text-white/40 shrink-0">{t.coverageStates.length} states</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Latest Deals</CardTitle>
                </CardHeader>
                <CardBody>
                  {feed.latestDeals.length === 0 ? (
                    <EmptyState icon={<Handshake size={18} />} title="No deals yet" />
                  ) : (
                    <ul className="divide-y divide-line dark:divide-white/10">
                      {feed.latestDeals.slice(0, 5).map((d) => (
                        <li key={d.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-mono text-[12.5px] text-charcoal dark:text-white truncate">{d.dealNumber}</p>
                            <p className="text-[11.5px] text-ink-faint dark:text-white/40">{d.product} · {formatQuantityMt(d.quantity)}</p>
                          </div>
                          <span className="text-[11px] text-ink-soft dark:text-white/50 capitalize shrink-0">{d.status.replace("_", " ")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Most Active Markets</CardTitle>
                </CardHeader>
                <CardBody>
                  {feed.mostActiveStates.length === 0 ? (
                    <EmptyState icon={<TrendingUp size={18} />} title="No activity yet" />
                  ) : (
                    <ul className="space-y-2.5">
                      {feed.mostActiveStates.map((s, i) => (
                        <li key={s.state} className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[13px] text-charcoal dark:text-white">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[10px] font-mono text-gold-dim">{i + 1}</span>
                            {getMasterStateLabel(s.state)}
                          </span>
                          <span className="font-mono text-xs text-ink-faint dark:text-white/40">{s.activityCount} listings</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Receipt size={15} className="text-gold-dim" /> Recent Transactions
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              {feed.recentTransactions.length === 0 ? (
                <EmptyState icon={<Receipt size={18} />} title="No transactions yet" />
              ) : (
                <ul className="divide-y divide-line dark:divide-white/10">
                  {feed.recentTransactions.map((t) => (
                    <li key={t.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                      <span className="text-[13px] text-charcoal dark:text-white">{t.label}</span>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-ink-soft dark:text-white/50">{formatQuantityMt(t.amount)}</span>
                        <span className="text-[11px] text-ink-faint dark:text-white/40 ml-3">
                          {new Date(t.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
