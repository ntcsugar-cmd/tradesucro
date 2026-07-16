"use client";

import Link from "next/link";
import { Phone, MessageCircle, Star, ShieldCheck } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { MillNameScroll } from "@/components/common";
import { CategoryBadge, TrustScoreDisplay } from "./ContactBadges";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatQuantityMt } from "@/lib/utils/format";
import { contactService } from "@/services/contact.service";
import type { Contact } from "@/lib/types/contact";

interface ContactCardProps {
  contact: Contact;
  onToggleFavorite?: (id: string) => void;
}

export function ContactCard({ contact, onToggleFavorite }: ContactCardProps) {
  function logInteraction(type: "call" | "whatsapp", label: string) {
    contactService.recordInteraction(contact.id, type, label);
  }

  return (
    <Card padding="none">
      <CardBody className="p-4">
        <Link href={`/contacts/${contact.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <MillNameScroll
                name={contact.companyName}
                className="text-[14px] font-semibold text-charcoal"
                prefix={contact.verificationStatus === "verified" ? <ShieldCheck size={13} className="order-last shrink-0 text-success" /> : undefined}
              />
              <p className="text-[12px] text-ink-faint mt-0.5">
                {contact.contactPerson} · {contact.city}, {getMasterStateLabel(contact.state)}
              </p>
            </div>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(contact.id);
                }}
                aria-label={contact.favorite ? "Remove favorite" : "Add favorite"}
                className="shrink-0 p-1"
              >
                <Star size={17} className={contact.favorite ? "text-gold-dim fill-gold-dim" : "text-charcoal/20"} />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={contact.category} />
            <TrustScoreDisplay score={contact.trustScore} />
            <span className="text-[11px] text-ink-faint">{formatQuantityMt(contact.averageMonthlyVolume)}/mo</span>
          </div>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`tel:${contact.mobile}`}
            onClick={() => logInteraction("call", `Called ${contact.contactPerson}`)}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-line py-2.5 min-h-[44px] text-[12.5px] font-medium text-charcoal active:bg-charcoal/[0.04]"
          >
            <Phone size={14} /> Call
          </a>
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => logInteraction("whatsapp", `WhatsApp to ${contact.contactPerson}`)}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-rise/30 bg-rise/[0.06] py-2.5 min-h-[44px] text-[12.5px] font-medium text-rise active:bg-rise/[0.12]"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
