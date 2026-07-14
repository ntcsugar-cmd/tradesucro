"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { sellOffers } from "@/lib/data";
import { Badge } from "@/components/common/Badge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";

export function SellOffers() {
  return (
    <section id="offers" className="border-b border-line">
      <div className="container-page py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-eyebrow mb-3">Sell Side</p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal">
              Latest sell offers
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold-dim hover:text-gold-bright transition-colors"
          >
            View all offers <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="border border-line">
          {/* header row */}
          <div className="hidden md:grid grid-cols-[1.8fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-4 px-6 py-3 bg-charcoal/[0.03] text-[11px] font-mono uppercase tracking-widest2 text-ink-faint">
            <span>Mill</span>
            <span>Grade</span>
            <span>Quantity</span>
            <span>Price / Qtl</span>
            <span>Posted</span>
          </div>

          {sellOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-2 md:grid-cols-[1.8fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-x-4 gap-y-2 px-6 py-5 border-t border-line hover:bg-gold/[0.04] transition-colors"
            >
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <p className="font-body font-medium text-[14.5px] text-charcoal">{offer.mill}</p>
                  {offer.verified && (
                    <ShieldCheck size={14} className="text-rise shrink-0" aria-label="Verified mill" />
                  )}
                </div>
                <p className="text-xs text-ink-faint mt-0.5">{offer.location}</p>
              </div>

              <div className="flex md:block items-center gap-2">
                <Badge tone="gold">{offer.grade}</Badge>
              </div>

              <div className="font-mono text-sm text-charcoal self-center">
                {formatQuantityMt(offer.quantityMt)}
              </div>

              <div className="font-mono text-sm text-charcoal self-center">
                {formatINR(offer.price)}
              </div>

              <div className="text-xs text-ink-faint self-center">{offer.postedAgo}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
