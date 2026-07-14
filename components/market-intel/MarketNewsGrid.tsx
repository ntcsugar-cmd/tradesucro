"use client";

import { useEffect, useState } from "react";
import { Landmark, ShipWheel, PackageSearch, Newspaper, CloudRain, Factory, Fuel } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Card, CardBody } from "@/components/cards/Card";
import { Badge } from "@/components/common/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { MarketNewsCategory, MarketNewsItem } from "@/lib/types/marketIntelligence";

const CATEGORY_META: Record<MarketNewsCategory, { label: string; icon: LucideIcon }> = {
  government: { label: "Government", icon: Landmark },
  export_policy: { label: "Export Policy", icon: ShipWheel },
  import_policy: { label: "Import Policy", icon: PackageSearch },
  industry: { label: "Industry News", icon: Newspaper },
  weather: { label: "Weather", icon: CloudRain },
  production: { label: "Production", icon: Factory },
  ethanol: { label: "Ethanol", icon: Fuel },
};

interface MarketNewsGridProps {
  category?: MarketNewsCategory;
}

export function MarketNewsGrid({ category }: MarketNewsGridProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MarketNewsItem[]>([]);

  useEffect(() => {
    setLoading(true);
    marketIntelligenceService.getNews(category).then((result) => {
      setItems(result);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <Grid cols={1} colsMd={2} gap="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={1} colsMd={2} gap="md">
      {items.map((item) => {
        const meta = CATEGORY_META[item.category];
        const Icon = meta.icon;
        return (
          <GridItem key={item.id}>
            <Card padding="lg" className="h-full">
              <CardBody>
                <div className="flex items-center justify-between">
                  <Badge tone="gold">
                    <Icon size={11} /> {meta.label}
                  </Badge>
                  <span className="text-[11px] text-ink-faint">{item.date}</span>
                </div>
                <h3 className="mt-3 font-body font-semibold text-[15px] text-charcoal leading-snug">{item.headline}</h3>
                <p className="mt-2 text-[13px] text-ink-soft leading-relaxed">{item.summary}</p>
              </CardBody>
            </Card>
          </GridItem>
        );
      })}
    </Grid>
  );
}
