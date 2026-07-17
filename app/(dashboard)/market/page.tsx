import Link from "next/link";
import { ArrowUpRight, Activity, Map, LineChart, Columns3, BellRing, Newspaper } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { MarketStatsGrid, MarketSearchBar, MarketFeedTimeline, PriceHeatMapGrid } from "@/components/market-intel";

const QUICK_LINKS = [
  { label: "Live Price Board", href: "/market/live", icon: Activity },
  { label: "Price Heat Map", href: "/market/prices", icon: Map },
  { label: "Market Trends", href: "/market/trends", icon: LineChart },
  { label: "Compare Mills", href: "/market/compare", icon: Columns3 },
  { label: "Smart Alerts", href: "/market/alerts", icon: BellRing },
  { label: "Market News", href: "/market/news", icon: Newspaper },
];

export default function MarketOverviewPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence" }]} className="mb-5" />
      <PageHeader title="Market Intelligence" description="India's live sugar market — prices, trends, and activity across every mill." />

      <div className="mb-6 max-w-2xl">
        <MarketSearchBar />
      </div>

      <div className="mb-8">
        <MarketStatsGrid />
      </div>

      <Grid cols={2} colsMd={3} colsLg={6} gap="sm" className="mb-8">
        {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
          <GridItem key={href}>
            <Link href={href} className="flex flex-col items-center gap-2 rounded-sm border border-line dark:border-white/10 bg-white dark:bg-charcoal-soft p-4 text-center hover:border-gold/40 dark:hover:border-gold/40 hover:shadow-card transition-all">
              <Icon size={18} className="text-gold-dim" />
              <span className="text-[12px] font-medium text-charcoal dark:text-white leading-tight">{label}</span>
            </Link>
          </GridItem>
        ))}
      </Grid>

      <Grid cols={1} colsLg={2} gap="md" className="mb-8">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Live Market Feed</CardTitle>
              <Link href="/market/live" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                Full board <ArrowUpRight size={13} />
              </Link>
            </CardHeader>
            <CardBody className="max-h-[420px] overflow-y-auto">
              <MarketFeedTimeline limit={10} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Market News</CardTitle>
              <Link href="/market/news" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
                All news <ArrowUpRight size={13} />
              </Link>
            </CardHeader>
            <CardBody>
              <p className="text-[13px] text-ink-soft dark:text-white/50">
                Government notifications, export/import policy, weather, production, and ethanol updates that move the sugar market — all in one feed.
              </p>
              <Link href="/market/news" className="mt-4 inline-block text-sm font-medium text-gold-dim hover:text-gold-bright transition-colors">
                Browse Market News →
              </Link>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <div className="flex items-center justify-between mb-3">
        <p className="text-eyebrow">Price Heat Map</p>
        <Link href="/market/prices" className="flex items-center gap-1 text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
          Full heat map <ArrowUpRight size={13} />
        </Link>
      </div>
      <PriceHeatMapGrid />
    </>
  );
}
