"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { newsItems } from "@/lib/data";

export function IndustryNews() {
  return (
    <section id="news" className="border-b border-line dark:border-white/10">
      <div className="container-page py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-eyebrow mb-3">Industry Insights</p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal dark:text-white">
              News from the sugar trade
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold-dim hover:text-gold-bright transition-colors"
          >
            All insights <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-10">
          {newsItems.map((item, i) => (
            <motion.a
              href="#"
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group flex items-start justify-between gap-6 py-6 border-t border-line dark:border-white/10 first:lg:border-t last:border-b lg:last:border-b-0"
            >
              <div>
                <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest2 text-gold-dim">
                  <span>{item.category}</span>
                  <span className="text-ink-faint dark:text-white/40">{item.date}</span>
                </div>
                <h3 className="mt-3 font-body font-semibold text-[16px] text-charcoal dark:text-white leading-snug group-hover:text-gold-dim transition-colors">
                  {item.headline}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft dark:text-white/50 max-w-md">
                  {item.summary}
                </p>
                <p className="mt-3 text-xs text-ink-faint dark:text-white/40">{item.readMins} min read</p>
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 mt-1 text-ink-faint dark:text-white/40 group-hover:text-gold-dim group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
