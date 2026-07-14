"use client";

import { useEffect, useState } from "react";
import { Plus, Users, ShieldCheck, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Button } from "@/components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useToast } from "@/components/ui/Toast";
import { ResaleSubNav, CustomerTable, CustomerForm } from "@/components/trader-resale";
import { traderCustomerService } from "@/services/traderCustomer.service";
import { formatINR } from "@/lib/utils/format";
import type { Customer, CustomerDraft } from "@/lib/types/traderResale";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const createModal = useDisclosure(false);
  const { toast } = useToast();

  async function load() {
    const result = await traderCustomerService.getCustomers();
    setCustomers(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(draft: CustomerDraft) {
    await traderCustomerService.createCustomer(draft);
    await load();
    toast({ variant: "success", title: "Customer added" });
  }

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0);
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);

  return (
    <>
      <ResaleSubNav />
      <PageHeader
        title="Customers"
        description="Wholesalers, semi-wholesalers, industrial buyers, retail chains, and exporters you sell to."
        actions={
          <Button variant="primary" size="md" onClick={createModal.open}>
            <Plus size={15} /> New Customer
          </Button>
        }
      />

      <Grid cols={1} colsMd={3} gap="md" className="mb-6">
        <StatisticsCard label="Total Customers" value={customers.length} icon={<Users size={16} />} />
        <StatisticsCard label="Total Credit Limit" value={formatINR(totalCreditLimit)} icon={<ShieldCheck size={16} />} tone="dark" />
        <StatisticsCard label="Total Outstanding" value={formatINR(totalOutstanding)} icon={<AlertCircle size={16} />} tone="dark" />
      </Grid>

      <CustomerTable customers={customers} loading={loading} />

      <CustomerForm open={createModal.isOpen} onClose={createModal.close} onSubmit={handleCreate} />
    </>
  );
}
