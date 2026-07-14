"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PackageX } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { MillOfferForm } from "@/components/mill-offers";

import { millOfferService } from "@/services/millOffer.service";
import type { MillOffer } from "@/lib/types/millOffer";

export default function EditMillOfferPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [offer, setOffer] = useState<MillOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    millOfferService.getOfferById(params.id).then((result) => {
      setOffer(result ?? null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading offer…" />
      </div>
    );
  }

  if (!offer) {
    return (
      <>
        <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: "Not found" }]} className="mb-5" />
        <EmptyState
          icon={<PackageX size={20} />}
          title="Offer not found"
          description="This mill offer may have been removed."
          action={{ label: "Back to Mill Offers", onClick: () => router.push("/mill-offers") }}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Mill Offers", href: "/mill-offers" }, { label: offer.offerNumber, href: `/mill-offers/${offer.id}` }, { label: "Edit" }]} className="mb-5" />
      <PageHeader title={`Edit ${offer.offerNumber}`} description={`${offer.millName} · ${offer.city}`} />
      <div className="max-w-4xl">
        <MillOfferForm mode="edit" initialOffer={offer} />
      </div>
    </>
  );
}
