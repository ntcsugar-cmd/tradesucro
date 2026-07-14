"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/navigation/Tabs";
import { MarketNewsGrid } from "@/components/market-intel";
import type { MarketNewsCategory } from "@/lib/types/marketIntelligence";

const CATEGORY_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "government", label: "Government" },
  { value: "export_policy", label: "Export Policy" },
  { value: "import_policy", label: "Import Policy" },
  { value: "industry", label: "Industry" },
  { value: "weather", label: "Weather" },
  { value: "production", label: "Production" },
  { value: "ethanol", label: "Ethanol" },
];

export default function MarketNewsPage() {
  const [category, setCategory] = useState<MarketNewsCategory | undefined>(undefined);

  return (
    <>
      <Breadcrumb items={[{ label: "Market Intelligence", href: "/market" }, { label: "Market News" }]} className="mb-5" />
      <PageHeader title="Market News" description="Government notifications, trade policy, weather, production, and ethanol updates." />

      <Tabs
        tabs={CATEGORY_TABS}
        defaultValue="all"
        onChange={(v) => setCategory(v === "all" ? undefined : (v as MarketNewsCategory))}
      >
        {() => <MarketNewsGrid category={category} />}
      </Tabs>
    </>
  );
}
