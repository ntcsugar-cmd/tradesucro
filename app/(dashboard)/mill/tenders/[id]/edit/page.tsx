"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Gavel } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { TenderForm } from "@/components/mill-tenders";

import { millTenderService } from "@/services/millTender.service";
import type { MillTender } from "@/lib/types/millTender";

export default function EditMillTenderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<MillTender | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    millTenderService.getTenderById(params.id).then((result) => {
      setTender(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading tender…" />
      </div>
    );
  }

  if (!tender) {
    return (
      <>
        <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState icon={<Gavel size={20} />} title="Tender not found" action={{ label: "Back to Tender Board", onClick: () => router.push("/mill/tenders") }} />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Tender Management", href: "/mill/tenders" }, { label: tender.tenderNumber, href: `/mill/tenders/${tender.id}` }, { label: "Edit" }]} className="mb-5" />
      <PageHeader title={`Edit ${tender.tenderNumber}`} description={tender.title} />
      <div className="max-w-4xl">
        <TenderForm mode="edit" initialTender={tender} />
      </div>
    </>
  );
}
