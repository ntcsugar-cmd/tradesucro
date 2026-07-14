import { NumberInput, TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { StateSelect, CitySelect } from "@/components/master-data";
import type { DealDispatch } from "@/lib/types/deal";

const DELIVERY_STATUS_OPTIONS: { value: DealDispatch["deliveryStatus"]; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
];

interface DispatchSectionProps {
  data: DealDispatch;
  onChange: (patch: Partial<DealDispatch>) => void;
  readOnly?: boolean;
}

export function DispatchSection({ data, onChange, readOnly = false }: DispatchSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal">Dispatch</h2>
      <div className="mt-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="Dispatch Start" type="date" value={data.dispatchStart} disabled={readOnly} onChange={(e) => onChange({ dispatchStart: e.target.value })} />
          <TextInput label="Dispatch End" type="date" value={data.dispatchEnd} disabled={readOnly} onChange={(e) => onChange({ dispatchEnd: e.target.value })} />
        </div>

        <NumberInput label="Daily Dispatch Quantity" unit="MT" value={data.dailyDispatchQuantity || ""} disabled={readOnly} onChange={(e) => onChange({ dailyDispatchQuantity: Number(e.target.value) || 0 })} />
        <TextInput label="Loading Point" value={data.loadingPoint} disabled={readOnly} onChange={(e) => onChange({ loadingPoint: e.target.value })} />

        <div className="grid sm:grid-cols-2 gap-5">
          <StateSelect label="Destination State" defaultValue={data.destinationState} disabled={readOnly} onChange={(e) => onChange({ destinationState: e.target.value })} />
          <CitySelect label="Destination City" state={data.destinationState} disabled={readOnly} onChange={(e) => onChange({ destinationCity: e.target.value })} />
        </div>

        <TextInput label="Transporter" value={data.transporter} disabled={readOnly} onChange={(e) => onChange({ transporter: e.target.value })} />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="Vehicle Details" value={data.vehicleDetails} disabled={readOnly} onChange={(e) => onChange({ vehicleDetails: e.target.value })} />
          <TextInput label="LR Number" value={data.lrNumber} disabled={readOnly} onChange={(e) => onChange({ lrNumber: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="E-way Bill" value={data.ewayBill} disabled={readOnly} onChange={(e) => onChange({ ewayBill: e.target.value })} />
          <Select label="Delivery Status" defaultValue={data.deliveryStatus} disabled={readOnly} options={DELIVERY_STATUS_OPTIONS} onChange={(e) => onChange({ deliveryStatus: e.target.value as DealDispatch["deliveryStatus"] })} />
        </div>
      </div>
    </div>
  );
}
