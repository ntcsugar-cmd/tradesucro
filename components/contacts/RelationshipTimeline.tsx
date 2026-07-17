"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Mail, Tag, ClipboardList, Handshake, StickyNote, Eye } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { contactService } from "@/services/contact.service";
import type { ContactActivityEvent, ContactActivityType } from "@/lib/types/contact";

const TYPE_ICON: Record<ContactActivityType, typeof Phone> = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  offer_created: Tag,
  requirement_created: ClipboardList,
  deal_started: Handshake,
  note_added: StickyNote,
  profile_viewed: Eye,
};

function timeAgo(timestamp: string): string {
  return new Date(timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function RelationshipTimeline({ contactId }: { contactId: string }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ContactActivityEvent[]>([]);

  useEffect(() => {
    contactService.getRelationshipTimeline(contactId).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, [contactId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState title="No activity yet" description="Calls, messages, and business actions with this contact will appear here." />;
  }

  return (
    <ol className="relative border-l border-line dark:border-white/10 ml-1.5 space-y-5">
      {events.map((e, i) => {
        const Icon = TYPE_ICON[e.type];
        return (
          <li key={e.id} className="pl-5 relative">
            <span className={`absolute -left-[13px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ${i === 0 ? "bg-gold/15 text-gold-dim" : "bg-charcoal/[0.05] text-ink-faint dark:text-white/40"}`}>
              <Icon size={12} />
            </span>
            <p className="text-[13px] font-medium text-charcoal dark:text-white">{e.description}</p>
            <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{timeAgo(e.timestamp)}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function BusinessActivityFeed() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<(ContactActivityEvent & { contactName: string })[]>([]);

  useEffect(() => {
    contactService.getBusinessActivityFeed(15).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState title="No activity yet" description="Business activity across your network will appear here." />;
  }

  return (
    <ul className="divide-y divide-line">
      {events.map((e) => {
        const Icon = TYPE_ICON[e.type];
        return (
          <li key={e.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/[0.05] text-ink-faint dark:text-white/40">
              <Icon size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-charcoal dark:text-white">
                <Link href={`/contacts/${e.contactId}`} className="font-medium hover:text-gold-dim">
                  {e.contactName}
                </Link>{" "}
                — {e.description}
              </p>
              <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{timeAgo(e.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
