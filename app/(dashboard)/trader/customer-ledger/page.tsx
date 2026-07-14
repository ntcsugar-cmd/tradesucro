"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Select } from "@/components/forms/Select";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResaleSubNav, CustomerLedgerView } from "@/components/trader-resale";
import { ContactActionsBar } from "@/components/mobile";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { traderCustomerService } from "@/services/traderCustomer.service";
import type { Customer } from "@/lib/types/traderResale";

function CustomerLedgerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("customer") ?? "";
  const isMobile = useIsMobile();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState(preselected);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    traderCustomerService.getCustomers().then((result) => {
      setCustomers(result);
      if (!selectedId && result.length > 0) setSelectedId(result[0].id);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  return (
    <>
      <ResaleSubNav />
      <PageHeader title="Customer Ledger" description="Sales, payments, credit balance, and ageing — per customer." />

      <div className="mb-6 max-w-sm">
        <Select
          label="Customer"
          defaultValue={selectedId}
          disabled={loading}
          options={customers.map((c) => ({ value: c.id, label: c.companyName }))}
          onChange={(e) => {
            setSelectedId(e.target.value);
            router.replace(`/trader/customer-ledger?customer=${e.target.value}`);
          }}
        />
      </div>

      {isMobile && selected && (
        <div className="mb-6">
          <ContactActionsBar phone={selected.contactPhone} whatsapp={selected.contactPhone} email={selected.contactEmail} shareText={selected.companyName} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading ledger…" />
        </div>
      ) : selected ? (
        <CustomerLedgerView customer={selected} />
      ) : (
        <EmptyState icon={<BookOpen size={20} />} title="No customers yet" description="Add a customer to see their ledger here." />
      )}
    </>
  );
}

export default function CustomerLedgerPage() {
  return (
    <Suspense fallback={null}>
      <CustomerLedgerContent />
    </Suspense>
  );
}
