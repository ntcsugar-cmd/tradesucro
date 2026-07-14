"use client";

import Link from "next/link";
import { Building2, Tag, ClipboardList, Handshake } from "lucide-react";
import { ContactActionsBar } from "@/components/mobile";
import { contactService } from "@/services/contact.service";
import type { Contact } from "@/lib/types/contact";

interface ContactQuickActionsProps {
  contact: Contact;
  showViewProfile?: boolean;
}

/**
 * ContactQuickActions — reuses the existing ContactActionsBar (v1.8
 * Mobile Foundation) for Call/WhatsApp/Email/Share/Directions, and
 * adds the business actions this brief asks for that
 * ContactActionsBar doesn't cover (Create Offer, Create Requirement,
 * Start Deal, View Company Profile). Every business action routes to
 * an existing, unmodified page.
 */
export function ContactQuickActions({ contact, showViewProfile = false }: ContactQuickActionsProps) {
  function logEmail() {
    contactService.recordInteraction(contact.id, "email", `Emailed ${contact.contactPerson}`);
  }

  const businessActions = [
    ...(showViewProfile ? [{ label: "View Profile", icon: Building2, href: `/contacts/${contact.id}` }] : []),
    { label: "Create Offer", icon: Tag, href: "/mill-offers/create" },
    { label: "Create Requirement", icon: ClipboardList, href: "/marketplace/buy" },
    { label: "Start Deal", icon: Handshake, href: "/deals/create" },
  ];

  return (
    <div className="space-y-4">
      <div onClick={logEmail}>
        <ContactActionsBar phone={contact.mobile} whatsapp={contact.whatsapp} email={contact.email} shareText={contact.companyName} />
      </div>

      <div className={`grid gap-2 ${businessActions.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
        {businessActions.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1.5 rounded-sm border border-line py-3 min-h-[64px] justify-center text-center active:bg-charcoal/[0.04]"
          >
            <Icon size={17} className="text-gold-dim" />
            <span className="text-[11px] font-medium text-charcoal leading-tight px-1">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
