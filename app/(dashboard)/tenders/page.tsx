"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { TenderTable } from "@/components/tenders";
import { tenderService } from "@/services/tender.service";
import type { Tender } from "@/lib/types/tender";

export default function TenderBoardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tenderService.getTenders().then((result) => {
      setTenders(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management" }]} className="mb-5" />
      <PageHeader
        title="Tender Board"
        description="Bulk/strategic lots sold via bidding rather than a fixed price."
        actions={
          <Link href="/tenders/create">
            <Button variant="primary" size="md">
              <Plus size={15} /> Create Tender
            </Button>
          </Link>
        }
      />
      <TenderTable tenders={tenders} loading={loading} />
    </>
  );
}
