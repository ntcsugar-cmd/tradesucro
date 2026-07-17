"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";
import { buyRequirements } from "@/lib/data";
import { Badge } from "@/components/common/Badge";
import { formatINR, formatQuantityMt } from "@/lib/utils/format";

export function BuyRequirements() {
  return (
    <section className="border-b border-line dark:border-white/10 bg-charcoal/[0.02]">
      <div className="container-page py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-eyebrow mb-3">Buy Side</p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal dark:text-white">
              Latest buy requirements
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold-dim hover:text-gold-bright transition-colors"
          >
            View all requirements <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="border border-line dark:border-white/10 bg-paper">
          <div className="hidden md:grid grid-cols-[1.8fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-4 px-6 py-3 bg-charcoal/[0.03] text-[11px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">
            <span>Buyer</span>
            <span>Grade</span>
            <span>Quantity</span>
            <span>Target Price</span>
            <span>Posted</span>
          </div>

          {buyRequirements.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-2 md:grid-cols-[1.8fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-x-4 gap-y-2 px-6 py-5 border-t border-line dark:border-white/10 hover:bg-gold/[0.04] transition-colors"
            >
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <p className="font-body font-medium text-[14.5px] text-charcoal dark:text-white">{req.buyer}</p>
                  {req.urgent && (
                    <span className="flex items-center gap-0.5">
                      <Zap size={12} className="text-gold-dim" aria-label="Urgent requirement" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{req.location}</p>
              </div>

              <div className="flex md:block items-center gap-2">
                <Badge tone="charcoal">{req.grade}</Badge>
              </div>

              <div className="font-mono text-sm text-charcoal dark:text-white self-center">
                {formatQuantityMt(req.quantityMt)}
              </div>

              <div className="font-mono text-sm text-charcoal dark:text-white self-center">
                {formatINR(req.targetPrice)}
              </div>

              <div className="text-xs text-ink-faint dark:text-white/40 self-center">{req.postedAgo}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
