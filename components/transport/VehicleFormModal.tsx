"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextInput, NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Alert } from "@/components/ui/Alert";
import type { VehicleDraft, VehicleType } from "@/lib/types/transport";

const TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "open-truck", label: "Open Truck" },
  { value: "covered-truck", label: "Covered Truck" },
  { value: "trailer", label: "Trailer" },
  { value: "container", label: "Container" },
];

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: VehicleDraft) => Promise<void>;
}

export function VehicleFormModal({ open, onClose, onSubmit }: VehicleFormModalProps) {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [type, setType] = useState<VehicleType>("open-truck");
  const [capacityMt, setCapacityMt] = useState(16);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!registrationNumber.trim()) {
      setError("Registration number is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ registrationNumber: registrationNumber.toUpperCase(), type, capacityMt });
      setRegistrationNumber("");
      setCapacityMt(16);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Vehicle" size="sm">
      <div className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <TextInput label="Registration Number" placeholder="e.g. MH12 AB 3456" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} autoFocus />
        <Select label="Vehicle Type" defaultValue={type} options={TYPE_OPTIONS} onChange={(e) => setType(e.target.value as VehicleType)} />
        <NumberInput label="Capacity" unit="MT" value={capacityMt || ""} onChange={(e) => setCapacityMt(Number(e.target.value) || 0)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
            Add Vehicle
          </Button>
        </div>
      </div>
    </Modal>
  );
}
