"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/forms/Input";
import { Alert } from "@/components/ui/Alert";
import type { DriverDraft } from "@/lib/types/transport";

interface DriverFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: DriverDraft) => Promise<void>;
}

export function DriverFormModal({ open, onClose, onSubmit }: DriverFormModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !mobile.trim() || !licenseNumber.trim() || !licenseExpiry) {
      setError("Fill in all fields before adding a driver.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ name, mobile, licenseNumber, licenseExpiry });
      setName("");
      setMobile("");
      setLicenseNumber("");
      setLicenseExpiry("");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Driver" size="sm">
      <div className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <TextInput label="Driver Name" placeholder="e.g. Ramesh Yadav" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <TextInput label="Mobile" placeholder="10-digit mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <TextInput label="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
        <TextInput label="License Expiry" type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
            Add Driver
          </Button>
        </div>
      </div>
    </Modal>
  );
}
