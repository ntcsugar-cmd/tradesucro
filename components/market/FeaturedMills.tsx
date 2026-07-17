"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { mills } from "@/lib/data";
import { formatNumber } from "@/lib/utils/format";

export function FeaturedMills() {
  return (
    <section id="mills" className="border-b border-line dark:border-white/10 bg-charcoal/[0.02]">
      <div className="container-page py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-eyebrow mb-3">Featured Mills</p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal dark:text-white">
              Mills trusted across the trade
            </h2>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-none">
          {mills.map((mill, i) => (
            <motion.div
              key={mill.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="snap-start shrink-0 w-[280px] bg-paper border border-line dark:border-white/10 p-6 hover:border-gold/40 hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-faint dark:text-white/40">
                  Est. {mill.established}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-gold-dim">
                  <Star size={12} fill="currentColor" />
                  {mill.rating}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-medium text-charcoal dark:text-white leading-snug">
                {mill.name}
              </h3>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-faint dark:text-white/40">
                <MapPin size={12} /> {mill.location}
              </p>

              <div className="mt-5 pt-5 border-t border-line dark:border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest2 text-ink-faint dark:text-white/40">
                    Capacity
                  </p>
                  <p className="font-mono text-sm text-charcoal dark:text-white mt-0.5">
                    {formatNumber(mill.capacityTpd)} TPD
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end max-w-[110px]">
                  {mill.grades.map((g) => (
                    <span
                      key={g}
                      className="text-[10px] font-mono text-gold-dim border border-gold/25 rounded-full px-2 py-0.5"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
