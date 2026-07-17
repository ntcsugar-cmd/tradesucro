"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Users } from "lucide-react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/common/Badge";
import { CategoryBadge, VerificationStatusBadge, TrustScoreDisplay, ContactQuickActions, RelationshipTimeline } from "@/components/contacts";

import { contactService } from "@/services/contact.service";
import { getMasterStateLabel, getPaymentTermLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import type { Contact } from "@/lib/types/contact";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line dark:border-white/10 last:border-b-0">
      <span className="text-xs text-ink-faint dark:text-white/40">{label}</span>
      <span className="text-[13.5px] text-charcoal dark:text-white font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function ContactProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactService.getContactById(params.id).then((result) => {
      setContact(result ?? null);
      setLoading(false);
    });
    contactService.recordInteraction(params.id, "profile_viewed", "Viewed company profile");
  }, [params.id]);

  async function handleToggleFavorite() {
    if (!contact) return;
    const updated = await contactService.toggleFavorite(contact.id);
    if (updated) setContact(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading contact…" />
      </div>
    );
  }

  if (!contact) {
    return <EmptyState icon={<Users size={20} />} title="Contact not found" action={{ label: "Back to Contact Network", onClick: () => router.push("/contacts") }} />;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Contact Network", href: "/contacts" }, { label: contact.companyName }]} className="mb-5" />
      <PageHeader
        title={contact.companyName}
        description={`${contact.contactPerson} · ${contact.city}, ${getMasterStateLabel(contact.state)}`}
        actions={
          <Button variant={contact.favorite ? "gold" : "outline"} size="md" onClick={handleToggleFavorite}>
            <Star size={15} className={contact.favorite ? "fill-current" : ""} /> {contact.favorite ? "Favorited" : "Add to Favorites"}
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <CategoryBadge category={contact.category} />
        <VerificationStatusBadge status={contact.verificationStatus} />
        <TrustScoreDisplay score={contact.trustScore} />
      </div>

      <Grid cols={1} colsLg={3} gap="md">
        <GridItem span={2}>
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Row label="Contact Person" value={contact.contactPerson} />
                <Row label="Mobile" value={contact.mobile} />
                <Row label="WhatsApp" value={contact.whatsapp} />
                <Row label="Email" value={contact.email} />
                <Row label="City / State" value={`${contact.city}, ${getMasterStateLabel(contact.state)}`} />
                <Row label="Average Monthly Volume" value={formatQuantityMt(contact.averageMonthlyVolume)} />
                <Row label="Preferred Payment Terms" value={getPaymentTermLabel(contact.preferredPaymentTerms)} />
                <Row label="Last Interaction" value={new Date(contact.lastInteraction).toLocaleDateString("en-IN", { dateStyle: "medium" })} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-xs text-ink-faint dark:text-white/40 mb-2">Preferred Sugar Grades</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {contact.preferredGrades.map((g) => (
                    <Badge key={g} tone="gold">
                      {g}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-ink-faint dark:text-white/40 mb-2">Preferred Regions</p>
                <div className="flex flex-wrap gap-1.5">
                  {contact.preferredRegions.map((r) => (
                    <Badge key={r} tone="charcoal">
                      {getMasterStateLabel(r)}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>

            {contact.notes && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-[13.5px] text-ink-soft dark:text-white/50 leading-relaxed">{contact.notes}</p>
                </CardBody>
              </Card>
            )}
          </div>
        </GridItem>

        <GridItem span={1}>
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardBody>
                <ContactQuickActions contact={contact} />
              </CardBody>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Relationship Timeline</CardTitle>
              </CardHeader>
              <CardBody>
                <RelationshipTimeline contactId={contact.id} />
              </CardBody>
            </Card>
          </div>
        </GridItem>
      </Grid>
    </>
  );
}
