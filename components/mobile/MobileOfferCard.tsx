import Link from "next/link";
import { ShieldCheck, Phone, MessageCircle, Truck } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { formatINR } from "@/lib/utils/format";

interface MobileOfferCardProps {
  millName: string;
  grade: string;
  productLabel: string;
  price: number;
  freight?: number;
  landedCost?: number;
  dispatchDays: number;
  verified: boolean;
  href: string;
  phone?: string;
  whatsapp?: string;
}

/** MobileOfferCard — the spec'd "Professional Offer Card": everything a trader needs to decide in one glance, plus Call/WhatsApp without leaving the list. */
export function MobileOfferCard({ millName, grade, productLabel, price, freight, landedCost, dispatchDays, verified, href, phone, whatsapp }: MobileOfferCardProps) {
  return (
    <Card padding="none">
      <CardBody className="p-4">
        <Link href={href} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[14px] font-semibold text-charcoal truncate">
                {millName}
                {verified && <ShieldCheck size={13} className="text-success shrink-0" />}
              </p>
              <p className="text-[12px] text-ink-faint mt-0.5">
                {productLabel} · {grade}
              </p>
            </div>
            <p className="font-mono text-[16px] font-semibold text-charcoal shrink-0">{formatINR(price)}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-sm bg-charcoal/[0.03] p-2.5">
            {freight !== undefined && (
              <div>
                <p className="text-[10px] text-ink-faint">Freight</p>
                <p className="font-mono text-[12.5px] text-charcoal mt-0.5">{formatINR(freight)}</p>
              </div>
            )}
            {landedCost !== undefined && (
              <div>
                <p className="text-[10px] text-ink-faint">Landed Cost</p>
                <p className="font-mono text-[12.5px] font-semibold text-charcoal mt-0.5">{formatINR(landedCost)}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-ink-faint">Dispatch</p>
              <p className="flex items-center gap-1 font-mono text-[12.5px] text-charcoal mt-0.5">
                <Truck size={11} /> {dispatchDays}d
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 rounded-sm border border-line py-2.5 min-h-[44px] text-[12.5px] font-medium text-charcoal active:bg-charcoal/[0.04]">
              <Phone size={14} /> Call
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-sm border border-rise/30 bg-rise/[0.06] py-2.5 min-h-[44px] text-[12.5px] font-medium text-rise active:bg-rise/[0.12]"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          <Link href={href} className="flex items-center justify-center gap-1.5 rounded-sm bg-charcoal py-2.5 min-h-[44px] text-[12.5px] font-medium text-white active:opacity-90">
            View
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
