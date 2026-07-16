"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { MasterDataAdminTable, ProductFormModal } from "@/components/admin";
import { useDisclosure } from "@/hooks/useDisclosure";
import { productMasterService } from "@/services/productMaster.service";
import type { MasterProduct, MasterProductDraft } from "@/lib/types/masterDataAdmin";

export default function ProductMasterAdminPage() {
  const { toast } = useToast();
  const modal = useDisclosure(false);
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MasterProduct | null>(null);

  async function load() {
    setLoading(true);
    setProducts(await productMasterService.getAll());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    modal.open();
  }

  function openEdit(product: MasterProduct) {
    setEditing(product);
    modal.open();
  }

  async function handleSubmit(draft: MasterProductDraft) {
    if (editing) {
      await productMasterService.update(editing.id, draft);
      toast({ variant: "success", title: "Product updated" });
    } else {
      await productMasterService.create(draft);
      toast({ variant: "success", title: "Product added" });
    }
    await load();
  }

  async function handleToggleStatus(product: MasterProduct) {
    await productMasterService.setStatus(product.id, product.status === "active" ? "inactive" : "active");
    toast({ variant: "success", title: product.status === "active" ? "Product deactivated" : "Product activated" });
    await load();
  }

  async function handleReorder(product: MasterProduct, direction: "up" | "down") {
    setProducts(await productMasterService.reorder(product.id, direction));
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "Product Master" }]} className="mb-5" />
      <PageHeader
        title="Product Master"
        description="The sugar product categories every offer, requirement, tender, and filter draws from. Changes here apply platform-wide immediately."
        actions={
          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={15} /> Add Product
          </Button>
        }
      />

      <MasterDataAdminTable rows={products} loading={loading} onEdit={openEdit} onToggleStatus={handleToggleStatus} onReorder={handleReorder} />

      <ProductFormModal open={modal.isOpen} onClose={modal.close} onSubmit={handleSubmit} editing={editing} />
    </>
  );
}
