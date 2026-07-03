"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";

const WORDS = ["care", "quality", "your vision"];
const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE = 2000;

function useTyping() {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIdx < word.length) {
            setCharIdx((c) => c + 1);
          } else {
            setTimeout(() => setDeleting(true), PAUSE);
          }
        } else {
          if (charIdx > 0) {
            setCharIdx((c) => c - 1);
          } else {
            setDeleting(false);
            setWordIdx((w) => (w + 1) % WORDS.length);
          }
        }
      },
      deleting ? DELETING_SPEED : TYPING_SPEED,
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx]);

  return WORDS[wordIdx].slice(0, charIdx);
}

export function HeroSection() {
  const text = useTyping();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(207,254,37,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(207,254,37,0.04),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-brand-bright/25 bg-brand-muted px-3.5 font-mono text-sm font-medium uppercase tracking-[0.15em] text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright"
        >
          Crafted for the WordPress community
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          We build for{" "}
          <span className="text-brand">WordPress</span>.
          <br />
          We ship with{" "}
          <span className="relative">
            <span className="text-brand">{text}</span>
            <span className="ml-0.5 inline-block h-[0.9em] w-[2px] animate-pulse bg-brand align-text-bottom" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Professional WordPress themes, plugins, and tools — open-source,
          rigorously tested, and built with modern workflows so you can
          focus on what matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <ButtonLink
            size="lg"
            href="/products"
            className="h-11 bg-brand-bright px-7 font-mono text-sm font-semibold text-brand-foreground hover:bg-brand-bright/85"
          >
            Explore Products <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </ButtonLink>
          <ButtonLink
            variant="outline"
            size="lg"
            href="/feedback"
            className="h-11 px-7 font-mono text-sm font-medium"
          >
            Share Feedback
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
