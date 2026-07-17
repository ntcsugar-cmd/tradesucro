"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { marketIndices } from "@/lib/data";
import { formatINR } from "@/lib/utils/format";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const headline = marketIndices[0];

  return (
    <section id="top" className="relative border-b border-line dark:border-white/10 grain-surface">
      <div className="container-page grid lg:grid-cols-[1.15fr_0.85fr] gap-14 py-20 lg:py-28 items-center">
        <div>
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-eyebrow mb-6"
          >
            Est. 2019 &nbsp;·&nbsp; RBI-compliant escrow &nbsp;·&nbsp; 1,200+ verified mills
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="font-display text-[2.6rem] leading-[1.06] sm:text-[3.4rem] lg:text-[4rem] font-medium text-charcoal dark:text-white tracking-tight"
          >
            India&rsquo;s Trusted
            <br />
            <span className="italic text-gold-dim">Digital Sugar</span> Marketplace
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-7 max-w-lg text-[15.5px] leading-relaxed text-ink-soft dark:text-white/50"
          >
            Buy and sell sugar directly with verified mills and buyers across India.
            Live mandi-linked pricing, transparent offers, and settlement you can
            trust — on one exchange built for the trade.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button variant="gold" size="lg">
              Post an Offer <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg">
              Explore Marketplace
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 flex items-center gap-2 text-xs text-ink-faint dark:text-white/40"
          >
            <ShieldCheck size={15} className="text-gold-dim" />
            Every mill and buyer on TradeSucro passes a documented KYC and quality audit.
          </motion.div>
        </div>

        {/* Live quote panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-charcoal text-white rounded-sm p-8 shadow-hero"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-eyebrow !text-gold-bright">Live Reference Price</span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-rise animate-pulse" />
              Live
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-white/50">{headline.grade} · {headline.region}</p>
            <p className="mt-2 font-mono text-5xl tracking-tight">
              {formatINR(headline.price)}
            </p>
            <p className="mt-1 text-xs text-white/40">{headline.unit}, ex-mill</p>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-3">
            {marketIndices.slice(1).map((idx) => (
              <div key={idx.grade} className="border-t border-white/10 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-white/40">
                  {idx.grade}
                </p>
                <p className="mt-1.5 font-mono text-sm text-white">
                  {formatINR(idx.price)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[11px] leading-relaxed text-white/35">
            Reference prices are aggregated from live sell offers across TradeSucro
            and refresh continuously through market hours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
