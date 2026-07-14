"use client";

import { motion } from "framer-motion";
import { ShieldCheck, LineChart, Landmark, Truck } from "lucide-react";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified counterparties",
    body: "Every mill and buyer completes documented KYC and a quality audit before their first trade goes live.",
  },
  {
    icon: LineChart,
    title: "Live, mandi-linked pricing",
    body: "Benchmark prices are drawn from real offers across producing belts, not delayed third-party feeds.",
  },
  {
    icon: Landmark,
    title: "Escrow-backed settlement",
    body: "Payments move through RBI-compliant escrow, released only against verified delivery documentation.",
  },
  {
    icon: Truck,
    title: "End-to-end logistics",
    body: "Freight, weighbridge, and quality inspection are coordinated through our partner network at every port and mandi.",
  },
];

export function WhyChoose() {
  return (
    <section className="border-b border-line">
      <div className="container-page py-20">
        <p className="text-eyebrow mb-3">Why TradeSucro</p>
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal max-w-lg">
          Built for the trade, not around it
        </h2>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06]">
                <reason.icon size={18} className="text-gold-dim" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-body font-semibold text-[15.5px] text-charcoal">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{reason.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
