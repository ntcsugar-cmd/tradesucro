"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Grid, GridItem } from "@/components/ui/Grid";
import { SearchInput } from "@/components/forms/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContactCard, ContactFilterPanel, SmartContactSections, ContactDirectoryStatsWidget } from "@/components/contacts";
import { contactService } from "@/services/contact.service";
import type { Contact, ContactFilters } from "@/lib/types/contact";

export default function ContactDirectoryPage() {
  const [filters, setFilters] = useState<ContactFilters>({});
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const result = await contactService.getContacts({ ...filters, search: search || undefined });
    setContacts(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search]);

  async function handleToggleFavorite(id: string) {
    await contactService.toggleFavorite(id);
    await load();
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Contact Network" }]} className="mb-5" />
      <PageHeader
        title="Contact Network"
        description="Your organized business relationships across the sugar trade — mills, traders, brokers, buyers, transporters, and more."
      />

      <div className="mb-8">
        <ContactDirectoryStatsWidget />
      </div>

      <div className="mb-8">
        <SmartContactSections />
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput placeholder="Search by company, contact person, or city…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Grid cols={1} colsLg={4} gap="md">
        <GridItem span={1} className="hidden lg:block">
          <ContactFilterPanel onApply={setFilters} />
        </GridItem>

        <GridItem span={3}>
          <p className="text-[13px] text-ink-faint dark:text-white/40 mb-4">{loading ? "Loading…" : `${contacts.length} contacts`}</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <EmptyState icon={<Users size={20} />} title="No contacts found" description="No contacts match your search or filters right now." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <ContactCard key={c.id} contact={c} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          )}
        </GridItem>
      </Grid>
    </>
  );
}
