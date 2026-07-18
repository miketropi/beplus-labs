"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";

interface Stat {
  label: string;
  value: string;
}

interface HomeStatsProps {
  stats: Stat[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function HomeStats({ stats }: HomeStatsProps) {
  return (
    <section className="border-y bg-muted/20 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="relative text-center sm:text-left"
          >
            <p className="meta-value text-2xl font-bold sm:text-3xl">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="meta-label mt-1.5">{stat.label}</p>
            {i < stats.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute right-[-12px] top-1/2 hidden h-10 w-px -translate-y-1/2 bg-border sm:block"
              />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}