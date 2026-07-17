"use client";

import { Star, Power, PowerOff } from "lucide-react";
import { type DataTableColumn } from "@/components/tables/DataTable";
import { ResponsiveTable, MobileDataCard } from "@/components/mobile";
import { IconButton } from "@/components/ui/IconButton";
import { DriverStatusBadge } from "./TransportBadges";
import type { Driver } from "@/lib/types/transport";

interface DriverTableProps {
  drivers: Driver[];
  loading?: boolean;
  onToggleStatus: (driver: Driver) => void;
}

export function DriverTable({ drivers, loading = false, onToggleStatus }: DriverTableProps) {
  const columns: DataTableColumn<Driver>[] = [
    { key: "name", header: "Driver Name", sortable: true, render: (d) => <span className="font-medium text-charcoal dark:text-white">{d.name}</span> },
    { key: "mobile", header: "Mobile", render: (d) => <span className="font-mono text-[13px]">{d.mobile}</span> },
    { key: "licenseNumber", header: "License No.", render: (d) => <span className="font-mono text-[12.5px]">{d.licenseNumber}</span> },
    { key: "rating", header: "Rating", render: (d) => <span className="flex items-center gap-1 font-mono"><Star size={11} className="text-gold-dim fill-gold-dim" /> {d.rating.toFixed(1)}</span> },
    { key: "totalTrips", header: "Trips", align: "right", sortable: true, render: (d) => <span className="font-mono">{d.totalTrips}</span> },
    { key: "status", header: "Status", render: (d) => <DriverStatusBadge status={d.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (d) => (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={d.status === "off-duty" ? "Set available" : "Set off duty"}
          onClick={() => onToggleStatus(d)}
        >
          {d.status === "off-duty" ? <Power size={15} className="text-rise" /> : <PowerOff size={15} className="text-fall" />}
        </IconButton>
      ),
    },
  ];

  return (
    <ResponsiveTable
      columns={columns}
      data={drivers}
      getRowId={(d) => d.id}
      loading={loading}
      pageSize={10}
      emptyTitle="No drivers yet"
      emptyDescription="Add your first driver to assign vehicles and loads."
      renderMobileCard={(d) => (
        <MobileDataCard
          title={d.name}
          subtitle={d.mobile}
          badge={<DriverStatusBadge status={d.status} />}
          fields={[
            { label: "Rating", value: `★ ${d.rating.toFixed(1)}` },
            { label: "Total Trips", value: String(d.totalTrips) },
            { label: "License No.", value: d.licenseNumber, secondary: true },
            { label: "License Expiry", value: new Date(d.licenseExpiry).toLocaleDateString("en-IN", { dateStyle: "medium" }), secondary: true },
          ]}
          footer={
            <button type="button" onClick={() => onToggleStatus(d)} className="flex items-center gap-1.5 text-[12.5px] font-medium text-gold-dim">
              {d.status === "off-duty" ? <Power size={13} /> : <PowerOff size={13} />}
              {d.status === "off-duty" ? "Set Available" : "Set Off Duty"}
            </button>
          }
        />
      )}
    />
  );
}
