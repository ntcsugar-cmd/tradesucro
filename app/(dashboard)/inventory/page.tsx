"use client";

import { useEffect, useState } from "react";
import { Scale, Lock, CheckCircle2, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Grid } from "@/components/ui/Grid";
import { InventoryTable } from "@/components/inventory";
import { inventoryService } from "@/services/inventory.service";
import { formatQuantityMt } from "@/lib/utils/format";
import type { GradeInventory } from "@/lib/types/millOperations";

export default function InventoryPage() {
  const [rows, setRows] = useState<GradeInventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryService.getInventory().then((result) => {
      setRows(result);
      setLoading(false);
    });
  }, []);

  const totals = rows.reduce(
    (acc, r) => ({
      total: acc.total + r.totalStock,
      reserved: acc.reserved + r.reservedStock,
      available: acc.available + r.availableStock,
      dispatched: acc.dispatched + r.dispatched,
    }),
    { total: 0, reserved: 0, available: 0, dispatched: 0 }
  );

  return (
    <>
      <Breadcrumb items={[{ label: "Inventory" }]} className="mb-5" />
      <PageHeader title="Inventory Summary" description="Grade-wise stock position — always reconciled, never negative." />

      <Grid cols={2} colsMd={4} gap="md" className="mb-6">
        <StatisticsCard label="Total Stock" value={formatQuantityMt(totals.total)} icon={<Scale size={16} />} />
        <StatisticsCard label="Reserved" value={formatQuantityMt(totals.reserved)} icon={<Lock size={16} />} />
        <StatisticsCard label="Available" value={formatQuantityMt(totals.available)} icon={<CheckCircle2 size={16} />} tone="dark" />
        <StatisticsCard label="Dispatched" value={formatQuantityMt(totals.dispatched)} icon={<Truck size={16} />} tone="dark" />
      </Grid>

      <InventoryTable rows={rows} loading={loading} />
    </>
  );
}
