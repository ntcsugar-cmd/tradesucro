"use client";

import { Power, PowerOff } from "lucide-react";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { IconButton } from "@/components/ui/IconButton";
import { VehicleStatusBadge } from "./TransportBadges";
import type { Vehicle } from "@/lib/types/transport";

const VEHICLE_TYPE_LABEL: Record<Vehicle["type"], string> = {
  "open-truck": "Open Truck",
  "covered-truck": "Covered Truck",
  trailer: "Trailer",
  container: "Container",
};

interface VehicleTableProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onToggleStatus: (vehicle: Vehicle) => void;
}

export function VehicleTable({ vehicles, loading = false, onToggleStatus }: VehicleTableProps) {
  const columns: DataTableColumn<Vehicle>[] = [
    { key: "registrationNumber", header: "Registration No.", sortable: true, render: (v) => <span className="font-mono text-[13px] font-medium text-charcoal dark:text-white">{v.registrationNumber}</span> },
    { key: "type", header: "Type", render: (v) => VEHICLE_TYPE_LABEL[v.type] },
    { key: "capacityMt", header: "Capacity", align: "right", sortable: true, render: (v) => <span className="font-mono">{v.capacityMt} MT</span> },
    { key: "status", header: "Status", render: (v) => <VehicleStatusBadge status={v.status} /> },
    { key: "lastServiceDate", header: "Last Service", render: (v) => new Date(v.lastServiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (v) => (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={v.status === "inactive" ? "Activate vehicle" : "Deactivate vehicle"}
          onClick={() => onToggleStatus(v)}
        >
          {v.status === "inactive" ? <Power size={15} className="text-rise" /> : <PowerOff size={15} className="text-fall" />}
        </IconButton>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      data={vehicles}
      getRowId={(v) => v.id}
      loading={loading}
      pageSize={10}
      emptyTitle="No vehicles yet"
      emptyDescription="Add your first vehicle to start accepting loads."
      renderMobileCard={(v) => (
        <MobileDataCard
          title={v.registrationNumber}
          subtitle={VEHICLE_TYPE_LABEL[v.type]}
          badge={<VehicleStatusBadge status={v.status} />}
          fields={[
            { label: "Capacity", value: `${v.capacityMt} MT` },
            { label: "Last Service", value: new Date(v.lastServiceDate).toLocaleDateString("en-IN", { dateStyle: "medium" }), secondary: true },
          ]}
          footer={
            <button
              type="button"
              onClick={() => onToggleStatus(v)}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-gold-dim"
            >
              {v.status === "inactive" ? <Power size={13} /> : <PowerOff size={13} />}
              {v.status === "inactive" ? "Activate" : "Deactivate"}
            </button>
          }
        />
      )}
    />
  );
}
