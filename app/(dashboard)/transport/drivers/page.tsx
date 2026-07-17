"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TransportSubNav, DriverTable, DriverFormModal } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import type { Driver, DriverDraft } from "@/lib/types/transport";

export default function DriversPage() {
  const { toast } = useToast();
  const modal = useDisclosure(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setDrivers(await transportService.getDrivers());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(draft: DriverDraft) {
    await transportService.createDriver(draft);
    toast({ variant: "success", title: "Driver added" });
    await load();
  }

  async function handleToggleStatus(driver: Driver) {
    await transportService.setDriverStatus(driver.id, driver.status === "off-duty" ? "available" : "off-duty");
    toast({ variant: "success", title: driver.status === "off-duty" ? "Driver set available" : "Driver set off duty" });
    await load();
  }

  return (
    <>
      <TransportSubNav />
      <PageHeader
        title="Drivers"
        description="Your driver roster — license status, rating, and availability."
        actions={
          <Button variant="primary" size="md" onClick={modal.open}>
            <Plus size={15} /> Add Driver
          </Button>
        }
      />

      <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${drivers.length} drivers`}</p>
      <DriverTable drivers={drivers} loading={loading} onToggleStatus={handleToggleStatus} />

      <DriverFormModal open={modal.isOpen} onClose={modal.close} onSubmit={handleAdd} />
    </>
  );
}
