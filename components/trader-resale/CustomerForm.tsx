"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextInput, NumberInput } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { StateSelect } from "@/components/master-data";
import { CUSTOMER_TYPE_OPTIONS } from "./ResaleBadges";
import type { CustomerDraft, CustomerType } from "@/lib/types/traderResale";

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: CustomerDraft) => Promise<void>;
}

const EMPTY: CustomerDraft = {
  companyName: "",
  customerType: "wholesaler",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  gst: "",
  pan: "",
  address: "",
  state: "",
  creditLimit: 0,
  rating: 4,
};

export function CustomerForm({ open, onClose, onSubmit }: CustomerFormProps) {
  const [data, setData] = useState<CustomerDraft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CustomerDraft>(key: K, value: CustomerDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setData(EMPTY);
      setError(null);
    }, 200);
  }

  async function handleSubmit() {
    if (!data.companyName || !data.contactPerson || !data.state) {
      setError("Company name, contact person, and state are required.");
      return;
    }
    setSaving(true);
    await onSubmit(data);
    setSaving(false);
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Customer" description="Add a buyer to sell inventory to." size="lg">
      <div className="space-y-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="Company Name" value={data.companyName} onChange={(e) => set("companyName", e.target.value)} />
          <Select label="Customer Type" defaultValue={data.customerType} options={CUSTOMER_TYPE_OPTIONS} onChange={(e) => set("customerType", e.target.value as CustomerType)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="Contact Person" value={data.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
          <TextInput label="Contact Phone" value={data.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
        </div>

        <TextInput label="Contact Email" type="email" value={data.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput label="GST" value={data.gst} onChange={(e) => set("gst", e.target.value.toUpperCase())} />
          <TextInput label="PAN" value={data.pan} onChange={(e) => set("pan", e.target.value.toUpperCase())} />
        </div>

        <Textarea label="Address" rows={2} value={data.address} onChange={(e) => set("address", e.target.value)} />

        <div className="grid sm:grid-cols-2 gap-5">
          <StateSelect label="State" defaultValue={data.state} onChange={(e) => set("state", e.target.value)} />
          <NumberInput label="Credit Limit" unit="₹" value={data.creditLimit || ""} onChange={(e) => set("creditLimit", Number(e.target.value) || 0)} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" loading={saving} onClick={handleSubmit}>
          Add Customer
        </Button>
      </div>
    </Modal>
  );
}
