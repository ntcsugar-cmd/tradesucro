"use client";

import { Phone, MessageCircle, Mail, Share2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ContactActionsBarProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
  shareText?: string;
  shareUrl?: string;
}

/**
 * ContactActionsBar — every Company page's Call / WhatsApp / Email /
 * Share / Directions row. Directions is future-ready (GPS — see FUTURE
 * READY section) and shown disabled rather than omitted, so the layout
 * doesn't shift once it's wired up.
 */
export function ContactActionsBar({ phone, whatsapp, email, shareText, shareUrl }: ContactActionsBarProps) {
  const { toast } = useToast();

  async function handleShare() {
    const url = shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareText, url });
      } catch {
        // user cancelled — no-op
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast({ variant: "success", title: "Link copied" });
    }
  }

  const actions = [
    { label: "Call", icon: Phone, href: phone ? `tel:${phone}` : undefined, disabled: !phone },
    { label: "WhatsApp", icon: MessageCircle, href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined, disabled: !whatsapp },
    { label: "Email", icon: Mail, href: email ? `mailto:${email}` : undefined, disabled: !email },
    { label: "Share", icon: Share2, onClick: handleShare, disabled: false },
    { label: "Directions", icon: MapPin, disabled: true },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {actions.map(({ label, icon: Icon, href, onClick, disabled }) => {
        const body = (
          <span className={`flex flex-col items-center gap-1.5 rounded-sm py-3 min-h-[64px] justify-center ${disabled ? "text-ink-faint/50" : "text-charcoal active:bg-charcoal/[0.04]"}`}>
            <Icon size={18} />
            <span className="text-[10px] font-medium">{label}</span>
          </span>
        );
        if (disabled) {
          return (
            <span key={label} title={label === "Directions" ? "Coming soon" : undefined}>
              {body}
            </span>
          );
        }
        return href ? (
          <a key={label} href={href} target={label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer">
            {body}
          </a>
        ) : (
          <button key={label} type="button" onClick={onClick}>
            {body}
          </button>
        );
      })}
    </div>
  );
}
