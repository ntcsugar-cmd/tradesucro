"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TransportSubNav, VehicleTable, VehicleFormModal } from "@/components/transport";
import { transportService } from "@/services/transport.service";
import type { Vehicle, VehicleDraft } from "@/lib/types/transport";

export default function VehiclesPage() {
  const { toast } = useToast();
  const modal = useDisclosure(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setVehicles(await transportService.getVehicles());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(draft: VehicleDraft) {
    await transportService.createVehicle(draft);
    toast({ variant: "success", title: "Vehicle added" });
    await load();
  }

  async function handleToggleStatus(vehicle: Vehicle) {
    await transportService.setVehicleStatus(vehicle.id, vehicle.status === "inactive" ? "available" : "inactive");
    toast({ variant: "success", title: vehicle.status === "inactive" ? "Vehicle activated" : "Vehicle deactivated" });
    await load();
  }

  return (
    <>
      <TransportSubNav />
      <PageHeader
        title="Vehicles"
        description="Your fleet — registration, type, capacity, and availability."
        actions={
          <Button variant="primary" size="md" onClick={modal.open}>
            <Plus size={15} /> Add Vehicle
          </Button>
        }
      />

      <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${vehicles.length} vehicles`}</p>
      <VehicleTable vehicles={vehicles} loading={loading} onToggleStatus={handleToggleStatus} />

      <VehicleFormModal open={modal.isOpen} onClose={modal.close} onSubmit={handleAdd} />
    </>
  );
}
