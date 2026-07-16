"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/forms/Input";
import { Alert } from "@/components/ui/Alert";
import type { MasterProduct, MasterProductDraft } from "@/lib/types/masterDataAdmin";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: MasterProductDraft) => Promise<void>;
  editing: MasterProduct | null;
}

export function ProductFormModal({ open, onClose, onSubmit, editing }: ProductFormModalProps) {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCode(editing?.code ?? "");
      setDisplayName(editing?.displayName ?? "");
      setError("");
    }
  }, [open, editing]);

  async function handleSubmit() {
    if (!displayName.trim()) {
      setError("Display name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ code, displayName });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit Product" : "Add Product"} size="sm">
      <div className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <TextInput
          label="Display Name"
          placeholder="e.g. Cube Sugar"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
        <TextInput
          label="Code (optional)"
          placeholder="Auto-generated from the display name if left blank"
          helperText={editing ? "Changing the code does not update records that already reference the old one." : undefined}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
            {editing ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
