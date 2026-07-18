"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RevealItem } from "@/components/shared/reveal";

interface ValueItem {
  num: string;
  kicker: string;
  title: string;
  highlight: string;
  desc: string;
  meta: string;
}

const VALUES: ValueItem[] = [
  {
    num: "01",
    kicker: "Foundation",
    title: "Open Source First",
    highlight: "Open Source",
    desc: "Every line of code is public on GitHub. MIT-licensed, community-driven, and built in the open — no hidden tiers, no lock-in, no surprises.",
    meta: "MIT · Public repos · PRs welcome · Discord",
  },
  {
    num: "02",
    kicker: "Process",
    title: "Quality Gates",
    highlight: "Quality",
    desc: "TypeScript, PHPStan, PHPUnit, and CI on every commit. No compromises.",
    meta: "CI on every push",
  },
  {
    num: "03",
    kicker: "Tooling",
    title: "Modern Stack",
    highlight: "Modern",
    desc: "Tailwind v4, esbuild, block editor APIs — modern tooling for modern WordPress.",
    meta: "v4 · block editor · i18n",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}) {
  const idx = title.indexOf(highlight);
  if (idx < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-brand">{highlight}</span>
      {title.slice(idx + highlight.length)}
    </>
  );
}

export function HomeValues() {
  const reduce = useReducedMotion();
  const viewport = reduce
    ? { once: true, amount: 0.05 }
    : { once: true, amount: 0.15 };

  return (
    <section className="border-y bg-muted/20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <RevealItem className="mb-20 sm:mb-24">
          <p className="meta-label mb-4">What we believe</p>
          <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built different,{" "}
            <span className="text-brand">on purpose</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Modern engineering practices for the WordPress ecosystem —
            because the platform deserves better tooling.
          </p>
        </RevealItem>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={containerVariants}
          className="border-t border-border/50"
        >
          {VALUES.map((item) => (
            <motion.li
              key={item.title}
              variants={reduce ? undefined : itemVariants}
              className="border-b border-border/50 last:border-b-0"
            >
              <div className="py-12 sm:py-16">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-medium tracking-[0.12em] text-brand-bright">
                    /{item.num}
                  </span>
                  <p className="meta-label">{item.kicker}</p>
                </div>

                <h3 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl lg:leading-[1.15]">
                  <HighlightedTitle
                    title={item.title}
                    highlight={item.highlight}
                  />
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
                  {item.desc}
                </p>
                <p className="meta-label mt-7 sm:mt-8">{item.meta}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
