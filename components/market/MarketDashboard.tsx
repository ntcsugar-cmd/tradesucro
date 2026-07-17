"use client";

import { motion } from "framer-motion";
import { marketIndices } from "@/lib/data";
import { PriceDelta } from "@/components/common/PriceDelta";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatINR } from "@/lib/utils/format";

export function MarketDashboard() {
  return (
    <section id="dashboard" className="border-b border-line dark:border-white/10">
      <div className="container-page py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-eyebrow mb-3">Market Dashboard</p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal dark:text-white">
              Today&rsquo;s benchmark prices
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft dark:text-white/50">
            Weighted averages drawn from active mill offers across major
            producing belts, updated through the trading day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line dark:border-white/10">
          {marketIndices.map((idx, i) => (
            <motion.div
              key={idx.grade}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-paper p-7 hover:bg-white transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body font-medium text-[15px] text-charcoal dark:text-white">{idx.grade}</p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{idx.region}</p>
                </div>
                <PriceDelta change={idx.change} direction={idx.direction} />
              </div>

              <p className="mt-5 font-mono text-[28px] leading-none text-charcoal dark:text-white">
                {formatINR(idx.price)}
              </p>
              <p className="text-[11px] text-ink-faint dark:text-white/40 mt-1">{idx.unit}</p>

              <div className="mt-5">
                <Sparkline data={idx.sparkline} direction={idx.direction} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
