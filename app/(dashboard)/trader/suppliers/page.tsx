"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { ShieldCheck, Heart, AlertCircle, Factory } from "lucide-react";
import { TraderSubNav, SupplierTable } from "@/components/trader";
import { traderPurchaseService } from "@/services/traderPurchase.service";
import { formatINR } from "@/lib/utils/format";
import type { Supplier } from "@/lib/types/traderWorkspace";

export default function SupplierManagementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const result = await traderPurchaseService.getSuppliers();
    setSuppliers(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleTogglePreferred(id: string) {
    await traderPurchaseService.togglePreferred(id);
    await load();
  }

  const verifiedCount = suppliers.filter((s) => s.verified).length;
  const preferredCount = suppliers.filter((s) => s.preferred).length;
  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.outstanding, 0);

  return (
    <>
      <TraderSubNav />
      <PageHeader title="Supplier Management" description="Verified mills and your preferred suppliers, with rating, activity, and outstanding balances." />

      <Grid cols={2} colsMd={4} gap="md" className="mb-6">
        <StatisticsCard label="Total Suppliers" value={suppliers.length} icon={<Factory size={16} />} />
        <StatisticsCard label="Verified Mills" value={verifiedCount} icon={<ShieldCheck size={16} />} />
        <StatisticsCard label="Preferred Suppliers" value={preferredCount} icon={<Heart size={16} />} tone="dark" />
        <StatisticsCard label="Total Outstanding" value={formatINR(totalOutstanding)} icon={<AlertCircle size={16} />} tone="dark" />
      </Grid>

      <SupplierTable suppliers={suppliers} loading={loading} onTogglePreferred={handleTogglePreferred} />
    </>
  );
}
