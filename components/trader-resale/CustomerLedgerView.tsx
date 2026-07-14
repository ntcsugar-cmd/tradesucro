"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid } from "@/components/ui/Grid";
import { StatisticsCard } from "@/components/cards/StatisticsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { traderCustomerService } from "@/services/traderCustomer.service";
import { formatINR } from "@/lib/utils/format";
import type { Customer, LedgerEntry, CustomerAgeing } from "@/lib/types/traderResale";

interface CustomerLedgerViewProps {
  customer: Customer;
}

function AgeingBar({ ageing }: { ageing: CustomerAgeing }) {
  const total = ageing.current + ageing.days30 + ageing.days60 + ageing.days90Plus || 1;
  const buckets = [
    { label: "Current", value: ageing.current, className: "bg-rise" },
    { label: "30 Days", value: ageing.days30, className: "bg-gold" },
    { label: "60 Days", value: ageing.days60, className: "bg-warning-600" },
    { label: "90+ Days", value: ageing.days90Plus, className: "bg-fall" },
  ];

  return (
    <div>
      <div className="h-2.5 rounded-full overflow-hidden flex bg-charcoal/[0.06]">
        {buckets.map((b) => (
          <div key={b.label} className={b.className} style={{ width: `${Math.max(0, (b.value / total) * 100)}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 mt-3">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${b.className}`} />
              <span className="text-[11px] text-ink-faint">{b.label}</span>
            </div>
            <p className="font-mono text-[13px] text-charcoal mt-1">{formatINR(b.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerLedgerView({ customer }: CustomerLedgerViewProps) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [ageing, setAgeing] = useState<CustomerAgeing | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([traderCustomerService.getLedger(customer.id), traderCustomerService.getAgeing(customer.id)]).then(([e, a]) => {
      setEntries(e);
      setAgeing(a);
      setLoading(false);
    });
  }, [customer.id]);

  const totalSales = entries.filter((e) => e.type === "sale").reduce((sum, e) => sum + e.amount, 0);
  const totalPayments = entries.filter((e) => e.type === "payment").reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const creditBalance = Math.max(0, customer.creditLimit - customer.outstanding);

  if (loading) {
    return (
      <div className="space-y-6">
        <Grid cols={1} colsMd={4} gap="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </Grid>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Grid cols={1} colsMd={4} gap="md">
        <StatisticsCard label="Total Sales" value={formatINR(totalSales)} icon={<ArrowUpRight size={16} />} tone="dark" />
        <StatisticsCard label="Outstanding" value={formatINR(customer.outstanding)} icon={<ArrowUpRight size={16} />} />
        <StatisticsCard label="Payments Received" value={formatINR(totalPayments)} icon={<ArrowDownLeft size={16} />} />
        <StatisticsCard label="Credit Balance" value={formatINR(creditBalance)} icon={<ArrowDownLeft size={16} />} tone="dark" />
      </Grid>

      {ageing && (
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Outstanding Ageing</CardTitle>
          </CardHeader>
          <CardBody>
            <AgeingBar ageing={ageing} />
          </CardBody>
        </Card>
      )}

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
        </CardHeader>
        <CardBody>
          {entries.length === 0 ? (
            <EmptyState title="No ledger activity" description="Sales and payments for this customer will appear here." />
          ) : (
            <ul className="divide-y divide-line">
              {entries.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${e.amount >= 0 ? "bg-fall/10 text-fall" : "bg-rise/10 text-rise"}`}>
                      {e.amount >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-charcoal">{e.description}</p>
                      <p className="text-[11px] text-ink-faint mt-0.5">
                        {e.reference} · {new Date(e.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-[13px] ${e.amount >= 0 ? "text-fall" : "text-rise"}`}>
                      {e.amount >= 0 ? "+" : ""}
                      {formatINR(e.amount)}
                    </p>
                    <p className="text-[11px] text-ink-faint mt-0.5">Bal: {formatINR(e.balanceAfter)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
