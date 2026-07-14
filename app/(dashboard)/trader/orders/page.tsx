"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { ResaleSubNav, CustomerOrderTable, CustomerOrderForm } from "@/components/trader-resale";
import { traderResaleService } from "@/services/traderResale.service";
import type { CustomerOrder } from "@/lib/types/traderResale";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCreate = searchParams.get("new") === "1";

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (showCreate) return;
    setLoading(true);
    traderResaleService.getOrders({ search: search || undefined }).then((result) => {
      setOrders(result);
      setLoading(false);
    });
  }, [search, showCreate]);

  if (showCreate) {
    return (
      <>
        <ResaleSubNav />
        <PageHeader
          title="New Customer Order"
          description="Order against an active resale offer — stock is reserved the moment you confirm."
          actions={
            <Button variant="ghost" size="md" onClick={() => router.push("/trader/orders")}>
              <X size={15} /> Cancel
            </Button>
          }
        />
        <CustomerOrderForm />
      </>
    );
  }

  return (
    <>
      <ResaleSubNav />
      <PageHeader
        title="Customer Orders"
        description="Every order placed against your resale offers, from draft to completed delivery."
        actions={
          <Button variant="primary" size="md" onClick={() => router.push("/trader/orders?new=1")}>
            <Plus size={15} /> New Order
          </Button>
        }
      />

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by order number, customer, lot, grade…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <CustomerOrderTable orders={orders} loading={loading} />
    </>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersContent />
    </Suspense>
  );
}
