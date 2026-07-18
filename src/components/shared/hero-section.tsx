"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/button-link";
import { RevealItem } from "@/components/shared/reveal";

type Token =
  | { t: "kw"; v: string; slot?: string }
  | { t: "var"; v: string; slot?: string }
  | { t: "str"; v: string; slot?: string }
  | { t: "num"; v: string; slot?: string }
  | { t: "comment"; v: string; slot?: string }
  | { t: "fn"; v: string; slot?: string }
  | { t: "punct"; v: string; slot?: string }
  | { t: "plain"; v: string; slot?: string };

const TOKEN_CLASS: Record<Token["t"], string> = {
  kw: "text-lime-700 dark:text-brand-bright",
  var: "text-zinc-800 dark:text-foreground/90",
  str: "text-amber-600 dark:text-amber-200",
  num: "text-emerald-700 dark:text-emerald-300",
  comment: "text-muted-foreground italic",
  fn: "text-zinc-900 dark:text-foreground font-semibold",
  punct: "text-zinc-500 dark:text-muted-foreground",
  plain: "text-zinc-700 dark:text-foreground/85",
};

const CODE: Token[][] = [
      [
        { t: "kw", v: "import" },
        { t: "plain", v: " { " },
        { t: "var", v: "registerBlockType" },
        { t: "plain", v: " } " },
        { t: "kw", v: "from" },
        { t: "plain", v: " " },
        { t: "str", v: '"@wordpress/blocks"' },
        { t: "punct", v: ";" },
      ],
      [],
      [
        { t: "fn", v: "registerBlockType" },
        { t: "punct", v: "(" },
        { t: "str", v: '"beplus/cover"', slot: "blockName" },
        { t: "punct", v: ", {" },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "apiVersion" },
        { t: "punct", v: ": " },
        { t: "num", v: "3" },
        { t: "punct", v: "," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "title" },
        { t: "punct", v: ": " },
        { t: "str", v: '"Cover"', slot: "title" },
        { t: "punct", v: "," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "description" },
        { t: "punct", v: ": " },
        { t: "str", v: '"A vibrant full-width cover block"', slot: "description" },
        { t: "punct", v: "," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "category" },
        { t: "punct", v: ": " },
        { t: "str", v: '"media"', slot: "category" },
        { t: "punct", v: "," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "attributes" },
        { t: "punct", v: ": {" },
      ],
      [
        { t: "plain", v: "    " },
        { t: "var", v: "accent" },
        { t: "punct", v: ": { " },
        { t: "var", v: "type" },
        { t: "punct", v: ": " },
        { t: "str", v: '"string"' },
        { t: "punct", v: ", " },
        { t: "var", v: "default" },
        { t: "punct", v: ": " },
        { t: "str", v: '"#CFFE25"', slot: "accentColor" },
        { t: "plain", v: " " },
        { t: "punct", v: "} }," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "edit" },
        { t: "punct", v: ": " },
        { t: "var", v: "CoverEdit" },
        { t: "punct", v: "," },
      ],
      [
        { t: "plain", v: "  " },
        { t: "var", v: "save" },
        { t: "punct", v: ": " },
        { t: "var", v: "CoverSave" },
        { t: "punct", v: "," },
      ],
      [{ t: "punct", v: "});" }],
];

const EASE = [0.16, 1, 0.3, 1] as const;

const TYPING_PHRASES = [
  "ship with care.",
  "engineered in the open.",
  "MIT, no surprises.",
];

function useTypingCycle(phrases: string[], reduce: boolean | null) {
  const [text, setText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    if (reduce) return;

    let phraseIdx = 0;
    let charIdx = 0;
    let phase: "type" | "hold" | "delete" = "type";
    let timer: ReturnType<typeof setTimeout>;

    const advance = () => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      phase = "type";
      charIdx = 0;
      setCurrentPhrase(phrases[phraseIdx]);
    };

    const tick = () => {
      const phrase = phrases[phraseIdx];
      if (phase === "type") {
        charIdx += 1;
        setText(phrase.slice(0, charIdx));
        if (charIdx >= phrase.length) {
          phase = "hold";
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 90);
      } else if (phase === "hold") {
        phase = "delete";
        timer = setTimeout(tick, 350);
      } else {
        charIdx -= 1;
        setText(phrase.slice(0, Math.max(0, charIdx)));
        if (charIdx <= 0) {
          advance();
          timer = setTimeout(tick, 90);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };

    timer = setTimeout(tick, 90);

    return () => clearTimeout(timer);
  }, [reduce, phrases]);

  return {
    text: reduce ? phrases[0] : text,
    currentPhrase,
  };
}

function TypingMono({
  phrases,
  reduce,
}: {
  phrases: string[];
  reduce: boolean | null;
}) {
  const { text, currentPhrase } = useTypingCycle(phrases, reduce);
  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b));
  const visible = text || "\u00A0";

  return (
    <div className="mt-5 font-mono text-sm tracking-tight sm:text-base">
      <span className="sr-only" aria-live="polite">
        Tagline: {currentPhrase}
      </span>
      <span className="relative inline-block whitespace-pre">
        <span aria-hidden className="invisible">
          {"> "}
          {longest}
        </span>
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 inline-flex items-baseline text-foreground/90"
        >
          <span className="text-brand-bright">{">"}</span>
          <span className="ml-1.5 inline-flex items-baseline">
            <span>{visible}</span>
            {reduce ? null : (
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.5, 1],
                }}
                className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-brand-bright"
              />
            )}
          </span>
        </span>
      </span>
    </div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(207,254,37,0.10),transparent_65%)]" />
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(207,254,37,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <RevealItem className="mx-auto mb-6 inline-flex h-7 items-center gap-2 rounded-full border border-brand-bright/25 bg-brand-muted px-3.5 font-mono text-sm font-medium uppercase tracking-[0.15em] text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright lg:mx-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-bright" />
            </span>
            Crafted for the WordPress community
          </RevealItem>

          <RevealItem delay={0.08} className="mb-6" amount={0.2}>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Modern WordPress,{" "}
              <span className="text-brand">without the ceremony</span>.
            </h1>
          </RevealItem>

          <TypingMono phrases={TYPING_PHRASES} reduce={reduce} />

          <RevealItem delay={0.18} className="mt-5 mx-auto max-w-xl lg:mx-0">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Open-source themes, plugins, and tooling — type-safe,
              MIT-licensed, and built for engineers who care about the platform.
            </p>
          </RevealItem>

          <RevealItem delay={0.28} className="mt-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <ButtonLink
                size="lg"
                href="/products"
                className="group h-11 bg-brand-bright px-7 font-mono text-sm font-semibold text-brand-foreground shadow-[0_8px_30px_-12px_rgba(207,254,37,0.45)] transition-all duration-300 hover:bg-brand-bright/90 hover:shadow-[0_12px_36px_-12px_rgba(207,254,37,0.65)] hover:-translate-y-px"
              >
                Explore Products
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink
                variant="outline"
                size="lg"
                href="/feedback"
                className="h-11 px-7 font-mono text-sm font-medium"
              >
                Share Feedback
              </ButtonLink>
            </div>
          </RevealItem>

          <RevealItem delay={0.38} className="mt-7 lg:mt-8">
            <Link
              href="/changelog"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-bright" />
              v1.0.0 · Nextora
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </RevealItem>
        </div>

        <CodePanel reduce={reduce} />
      </div>
    </section>
  );
}

const SLOT_VALUES: Record<string, Token[]> = {
  blockName: [
    { t: "str", v: '"beplus/cover"' },
    { t: "str", v: '"beplus/hero"' },
    { t: "str", v: '"beplus/navbar"' },
    { t: "str", v: '"beplus/footer"' },
  ],
  title: [
    { t: "str", v: '"Cover"' },
    { t: "str", v: '"Hero"' },
    { t: "str", v: '"Navbar"' },
    { t: "str", v: '"Footer"' },
  ],
  description: [
    { t: "str", v: '"A vibrant full-width cover block"' },
    { t: "str", v: '"A bold hero section with CTA"' },
    { t: "str", v: '"A responsive navigation block"' },
    { t: "str", v: '"A flexible site footer block"' },
  ],
  category: [
    { t: "str", v: '"media"' },
    { t: "str", v: '"layout"' },
    { t: "str", v: '"design"' },
    { t: "str", v: '"text"' },
  ],
  accentColor: [
    { t: "str", v: '"#CFFE25"' },
    { t: "str", v: '"#FF6B6B"' },
    { t: "str", v: '"#4ECDC4"' },
    { t: "str", v: '"#45B7D1"' },
  ],
};

const SLOT_NAMES = Object.keys(SLOT_VALUES);
const VALUE_COUNT = SLOT_VALUES[SLOT_NAMES[0]].length;

function maxSlotLen(valueSet: number) {
  return Math.max(
    ...SLOT_NAMES.map((name) => SLOT_VALUES[name][valueSet].v.length),
  );
}

function useCodeTyping(reduce: boolean | null) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [valueSet, setValueSet] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) {
      setVisibleChars(maxSlotLen(0));
      return;
    }

    if (started.current) return;
    started.current = true;

    const initialLen = maxSlotLen(0);
    let current = initialLen;
    setVisibleChars(initialLen);

    let phase: "hold" | "delete" | "pause" | "type" = "hold";
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const len = maxSlotLen(valueSet);
      if (phase === "hold") {
        phase = "delete";
        timer = setTimeout(tick, 2800);
      } else if (phase === "delete") {
        current -= 1;
        setVisibleChars(current);
        if (current <= 0) {
          phase = "pause";
          timer = setTimeout(tick, 500);
          return;
        }
        timer = setTimeout(tick, 20 + Math.random() * 14);
      } else if (phase === "pause") {
        setValueSet((prev) => (prev + 1) % VALUE_COUNT);
        current = 0;
        phase = "type";
        timer = setTimeout(tick, 400);
      } else {
        current += 1;
        setVisibleChars(current);
        if (current >= len) {
          phase = "hold";
          timer = setTimeout(tick, 2800);
          return;
        }
        timer = setTimeout(tick, 35 + Math.random() * 22);
      }
    };

    timer = setTimeout(tick, 2500);

    return () => clearTimeout(timer);
  }, [reduce]);

  return { visibleChars: reduce ? maxSlotLen(valueSet) : visibleChars, valueSet };
}

function BlinkingCursor() {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.5, 1],
      }}
      className="inline-block h-[1.15em] w-[1.5px] translate-y-[0.15em] bg-brand-bright align-baseline"
    />
  );
}

function CodePanel({ reduce }: { reduce: boolean | null }) {
  const { visibleChars, valueSet } = useCodeTyping(reduce);
  const maxLen = maxSlotLen(valueSet);

  let cursorLine = -1;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
    >
      <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_50%_30%,rgba(207,254,37,0.10),transparent_60%)]" />

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.18)] ring-1 ring-zinc-900/[0.04] overflow-hidden dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] dark:ring-white/5">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-white/10">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </div>
          <span className="ml-2 font-mono text-[12px] text-zinc-700 dark:text-foreground/80">
            cover.ts
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-muted-foreground/70">
            main
          </span>
        </div>

        <div className="font-mono text-[12.5px] leading-[1.65] px-4 py-4 sm:px-5 sm:py-5">
          {CODE.map((tokens, i) => (
            <div key={i} className="flex gap-4">
                <span className="select-none text-right text-zinc-400 tabular-nums w-5 shrink-0 sm:w-6 dark:text-muted-foreground/30">
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {tokens.length === 0
                    ? "\u00A0"
                    : tokens.map((original, j) => {
                        if (original.slot) {
                          const tok =
                            SLOT_VALUES[original.slot][valueSet];
                          const slotLen = tok.v.length;
                          const shown = reduce
                            ? slotLen
                            : Math.min(
                                slotLen,
                                Math.ceil(
                                  (slotLen * visibleChars) / maxLen,
                                ),
            )
                          const partial =
                            shown < slotLen ? tok.v.slice(0, shown) : null;

                          if (cursorLine === -1 && shown < slotLen) {
                            cursorLine = i;
                          }

                          if (shown === 0) return null;

                          if (shown >= slotLen) {
                            return (
                              <span key={j} className={TOKEN_CLASS[tok.t]}>
                                {tok.v}
                              </span>
                            );
                          }

                          return (
                            <span key={j} className={TOKEN_CLASS[tok.t]}>
                              {partial}
                            </span>
                          );
                        }

                        return (
                          <span key={j} className={TOKEN_CLASS[original.t]}>
                            {original.v}
                          </span>
                        );
                      })}
                  {cursorLine === i &&
                    visibleChars < maxLen &&
                    !reduce && <BlinkingCursor />}
                </span>
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-100/70 px-4 py-2 font-mono text-[11px] text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-muted-foreground/75">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="h-3 w-3" /> main
            </span>
            <span>TypeScript · MIT</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span className="text-lime-700 dark:text-brand-bright">v1.0.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
