"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/common/Badge";
import { useToast } from "@/components/ui/Toast";
import { MasterDataAdminTable, GradeFormModal } from "@/components/admin";
import { useDisclosure } from "@/hooks/useDisclosure";
import { gradeMasterService } from "@/services/gradeMaster.service";
import type { MasterGrade, MasterGradeDraft } from "@/lib/types/masterDataAdmin";
import type { DataTableColumn } from "@/components/tables/DataTable";

const CLASSIFICATION_LABEL: Record<MasterGrade["classification"], string> = {
  both: "Domestic & Export",
  domestic: "Domestic Only",
  export: "Export Only",
};

export default function GradeMasterAdminPage() {
  const { toast } = useToast();
  const modal = useDisclosure(false);
  const [grades, setGrades] = useState<MasterGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MasterGrade | null>(null);

  async function load() {
    setLoading(true);
    setGrades(await gradeMasterService.getAll());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    modal.open();
  }

  function openEdit(grade: MasterGrade) {
    setEditing(grade);
    modal.open();
  }

  async function handleSubmit(draft: MasterGradeDraft) {
    if (editing) {
      await gradeMasterService.update(editing.id, draft);
      toast({ variant: "success", title: "Grade updated" });
    } else {
      await gradeMasterService.create(draft);
      toast({ variant: "success", title: "Grade added" });
    }
    await load();
  }

  async function handleToggleStatus(grade: MasterGrade) {
    await gradeMasterService.setStatus(grade.id, grade.status === "active" ? "inactive" : "active");
    toast({ variant: "success", title: grade.status === "active" ? "Grade deactivated" : "Grade activated" });
    await load();
  }

  async function handleReorder(grade: MasterGrade, direction: "up" | "down") {
    setGrades(await gradeMasterService.reorder(grade.id, direction));
  }

  const extraColumns: DataTableColumn<MasterGrade>[] = [
    {
      key: "classification",
      header: "Market",
      render: (g) => <Badge tone={g.classification === "export" ? "gold" : "charcoal"}>{CLASSIFICATION_LABEL[g.classification]}</Badge>,
    },
    {
      key: "applicableProducts",
      header: "Applicable Products",
      render: (g) => <span className="text-xs text-ink-faint dark:text-white/40">{g.applicableProducts.length === 0 ? "All products" : `${g.applicableProducts.length} product(s)`}</span>,
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin-dashboard" }, { label: "Grade Master" }]} className="mb-5" />
      <PageHeader
        title="Grade Master"
        description="Every sugar grade traded on TradeSucro — the single source every Offer, Buy Requirement, Tender, and Search draws from. Changes here apply platform-wide immediately."
        actions={
          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={15} /> Add Grade
          </Button>
        }
      />

      <MasterDataAdminTable rows={grades} loading={loading} extraColumns={extraColumns} onEdit={openEdit} onToggleStatus={handleToggleStatus} onReorder={handleReorder} />

      <GradeFormModal open={modal.isOpen} onClose={modal.close} onSubmit={handleSubmit} editing={editing} />
    </>
  );
}
