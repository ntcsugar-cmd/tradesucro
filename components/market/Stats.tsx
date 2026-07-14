"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";
import { formatNumber } from "@/lib/utils/format";

export function Stats() {
  return (
    <section className="bg-charcoal">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-l border-white/10 pl-5"
            >
              <p className="font-mono text-3xl sm:text-4xl text-gold-bright">
                {formatNumber(stat.value)}
                <span className="text-white/50">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-[13px] text-white/50 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
