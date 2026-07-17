"use client";

import Link from "next/link";
import { Phone, MessageCircle, Star, ShieldCheck, User } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { MillNameScroll } from "@/components/common";
import { CategoryBadge } from "./ContactBadges";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { contactService } from "@/services/contact.service";
import type { Contact } from "@/lib/types/contact";

interface ContactCardProps {
  contact: Contact;
  onToggleFavorite?: (id: string) => void;
}

/**
 * ContactCard — a professional business directory listing. Company
 * identity (name, contact person, business type, location, verified
 * badge) is the primary content; Call/WhatsApp are small, secondary
 * icon-only action buttons in the corner, not the visual focus of the
 * card the way two full-width labeled buttons were before.
 */
export function ContactCard({ contact, onToggleFavorite }: ContactCardProps) {
  function logInteraction(type: "call" | "whatsapp", label: string) {
    contactService.recordInteraction(contact.id, type, label);
  }

  return (
    <Card padding="none">
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/contacts/${contact.id}`} className="min-w-0 flex-1 block">
            <MillNameScroll
              name={contact.companyName}
              className="text-[14.5px] font-semibold text-charcoal dark:text-white"
              prefix={contact.verificationStatus === "verified" ? <ShieldCheck size={13} className="order-last shrink-0 text-success" /> : undefined}
            />
            <p className="flex items-center gap-1 text-[12px] text-ink-faint dark:text-white/40 mt-1">
              <User size={11} className="shrink-0" /> {contact.contactPerson}
            </p>
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(contact.id)}
                aria-label={contact.favorite ? "Remove favorite" : "Add favorite"}
                className="p-1.5"
              >
                <Star size={17} className={contact.favorite ? "text-gold-dim fill-gold-dim" : "text-charcoal/20 dark:text-white/20"} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CategoryBadge category={contact.category} />
          <span className="text-[12px] text-ink-soft dark:text-white/50">
            {contact.city}, {getMasterStateLabel(contact.state)}
          </span>
        </div>

        <div className="mt-3.5 pt-3.5 border-t border-line dark:border-white/10 flex items-center justify-between">
          <Link href={`/contacts/${contact.id}`} className="text-xs font-medium text-gold-dim hover:text-gold-bright transition-colors">
            View Profile →
          </Link>
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${contact.mobile}`}
              aria-label={`Call ${contact.contactPerson}`}
              onClick={() => logInteraction("call", `Called ${contact.contactPerson}`)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-charcoal/20 dark:border-white/20 text-charcoal dark:text-white hover:border-charcoal/40 dark:hover:border-white/40 transition-colors"
            >
              <Phone size={14} />
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${contact.contactPerson}`}
              onClick={() => logInteraction("whatsapp", `WhatsApp to ${contact.contactPerson}`)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-rise/30 text-rise hover:bg-rise/[0.08] transition-colors"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
