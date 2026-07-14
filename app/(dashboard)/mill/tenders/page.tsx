"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Gavel, Eye, Trophy } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/forms/Input";
import { TenderStatsWidget, TenderTable } from "@/components/mill-tenders";

import { millTenderService } from "@/services/millTender.service";
import type { MillTender } from "@/lib/types/millTender";

export default function MillTendersBoardPage() {
  const [tenders, setTenders] = useState<MillTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    millTenderService.getTenders().then((result) => {
      setTenders(result);
      setLoading(false);
    });
  }, []);

  const filtered = tenders.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.tenderNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q);
  });

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management" }]} className="mb-5" />
      <PageHeader
        title="Tender Management"
        description="Open, limited, private, negotiation, spot, forward, and export tenders — separate from Mill Offers."
        actions={
          <Link href="/mill/tenders/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> Create Tender
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <TenderStatsWidget />
      </div>

      <Card padding="lg" className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-2.5">
          <Link href="/mill/tenders/create">
            <Button variant="primary" size="sm">
              <Gavel size={14} /> Create Tender
            </Button>
          </Link>
          <Link href="/mill/tenders/history">
            <Button variant="outline" size="sm">
              <Eye size={14} /> View Bids &amp; History
            </Button>
          </Link>
          <Button variant="outline" size="sm" disabled title="Select a closed tender from the board to award it">
            <Trophy size={14} /> Award Tender
          </Button>
        </CardBody>
      </Card>

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by tender number or title…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <TenderTable tenders={filtered} loading={loading} />
    </>
  );
}
