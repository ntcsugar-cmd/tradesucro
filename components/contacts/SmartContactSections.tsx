"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Clock, Flame, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryBadge, TrustScoreDisplay } from "./ContactBadges";
import { MillNameScroll } from "@/components/common";
import { contactService } from "@/services/contact.service";
import type { Contact } from "@/lib/types/contact";

type SectionKey = "favorites" | "recent" | "frequent" | "nearby" | "suggested";

const SECTIONS: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: "favorites", label: "Favorites", icon: Heart },
  { key: "recent", label: "Recent", icon: Clock },
  { key: "frequent", label: "Frequent", icon: Flame },
  { key: "nearby", label: "Nearby", icon: MapPin },
  { key: "suggested", label: "Suggested", icon: Sparkles },
];

const FETCHERS: Record<SectionKey, () => Promise<Contact[]>> = {
  favorites: () => contactService.getFavorites(),
  recent: () => contactService.getRecent(10),
  frequent: () => contactService.getFrequent(10),
  nearby: () => contactService.getNearby(10),
  suggested: () => contactService.getSuggested(10),
};

const EMPTY_COPY: Record<SectionKey, string> = {
  favorites: "Star a contact to pin them here.",
  recent: "Contacts you've interacted with recently will appear here.",
  frequent: "Your most-contacted relationships will appear here.",
  nearby: "No contacts found in your state yet.",
  suggested: "No suggestions right now — check back after adding more contacts.",
};

export function SmartContactSections() {
  const [active, setActive] = useState<SectionKey>("favorites");
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setLoading(true);
    FETCHERS[active]().then((result) => {
      setContacts(result);
      setLoading(false);
    });
  }, [active]);

  return (
    <div>
      <div className="flex items-center gap-1 overflow-x-auto rounded-sm border border-line bg-charcoal/[0.02] p-1.5 mb-4">
        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3.5 py-2 text-[13px] font-medium transition-colors ${
              active === key ? "bg-white text-charcoal shadow-card" : "text-ink-faint hover:text-charcoal"
            }`}
          >
            <Icon size={14} className={active === key ? "text-gold-dim" : ""} /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-56 shrink-0" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState title="Nothing here yet" description={EMPTY_COPY[active]} />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {contacts.map((c) => (
            <Link key={c.id} href={`/contacts/${c.id}`} className="shrink-0 w-56 rounded-sm border border-line bg-white p-3.5 hover:border-gold/40 hover:shadow-card transition-all">
              <MillNameScroll
                name={c.companyName}
                className="text-[13.5px] font-medium text-charcoal"
                prefix={c.verificationStatus === "verified" ? <ShieldCheck size={12} className="order-last shrink-0 text-success" /> : undefined}
              />
              <p className="text-[11px] text-ink-faint mt-0.5 truncate">{c.contactPerson}</p>
              <div className="mt-2.5 flex items-center justify-between">
                <CategoryBadge category={c.category} />
                <TrustScoreDisplay score={c.trustScore} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
