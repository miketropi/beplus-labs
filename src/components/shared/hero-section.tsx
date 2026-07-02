"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
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

const MULTIPLIERS = [25, 45, 25, 45];

function useParallax() {
  const pos = useRef<{ tx: number; ty: number }[]>(
    MULTIPLIERS.map(() => ({ tx: 0, ty: 0 })),
  );
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const els = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouse.current.x = (e.clientX - cx) / cx;
      mouse.current.y = (e.clientY - cy) / cy;
    };

    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;
      for (let i = 0; i < els.current.length; i++) {
        const el = els.current[i];
        if (!el) continue;
        const m = MULTIPLIERS[i];
        const targetX = mx * m;
        const targetY = my * m;
        const p = pos.current[i];
        p.tx += (targetX - p.tx) * 0.08;
        p.ty += (targetY - p.ty) * 0.08;
        el.style.transform = `translate(${p.tx}px, ${p.ty}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouse);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (i: number) => (el: HTMLDivElement | null) => {
    if (el) els.current[i] = el;
  };
}

export function HeroSection() {
  const text = useTyping();
  const orbRef = useParallax();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 sm:pb-28">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={orbRef(0)}
          className="absolute -top-40 -left-40 size-96 rounded-full bg-brand/20 blur-3xl will-change-transform"
        />
        <div
          ref={orbRef(1)}
          className="absolute top-1/4 left-1/3 size-64 rounded-full bg-brand/30 blur-3xl will-change-transform"
        />
        <div
          ref={orbRef(2)}
          className="absolute bottom-1/4 right-1/3 size-72 rounded-full bg-purple-500/20 blur-3xl will-change-transform"
        />
        <div
          ref={orbRef(3)}
          className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-500/20 blur-3xl will-change-transform"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(207,254,37,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex h-8 items-center gap-2 rounded-full border border-brand-bright/30 bg-brand-muted px-4 text-xs font-medium text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright"
        >
          <Zap className="h-3.5 w-3.5" />
          Crafted for the WordPress community
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
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
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Professional WordPress themes, plugins, and tools — open-source,
          rigorously tested, and built with modern workflows so you can
          focus on what matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <ButtonLink
            size="lg"
            href="/products"
            className="h-12 bg-brand-bright px-8 text-sm font-semibold text-brand-foreground hover:bg-brand-bright/90"
          >
            Explore Products <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
          <ButtonLink
            variant="outline"
            size="lg"
            href="/feedback"
            className="h-12 px-8"
          >
            Share Feedback
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
