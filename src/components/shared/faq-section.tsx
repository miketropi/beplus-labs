"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is BePlus Labs?",
    a: "We build open-source WordPress themes, plugins, and tools with modern development workflows — TypeScript, Tailwind CSS v4, PHPStan, and automated testing. Every product is MIT-licensed and available on GitHub.",
  },
  {
    q: "Are your products free?",
    a: "Yes. All our products are open-source and free to use. You can download them from GitHub, self-host them, and modify them to fit your needs. We believe in giving back to the WordPress community.",
  },
  {
    q: "How do I get started?",
    a: "Browse our products, pick one that fits your needs, and download the latest release from GitHub. Each product includes a README with setup instructions. If you get stuck, open an issue on GitHub or send us feedback.",
  },
  {
    q: "Can I contribute?",
    a: "Absolutely. Star the repos, submit pull requests, report bugs, or suggest features. All our projects are open to community contributions. Check the contributing guide in each repository.",
  },
  {
    q: "Do you offer support?",
    a: "We provide community support through GitHub issues. For critical bugs, open an issue and we'll respond promptly. We don't offer paid support plans at this time, but your feedback helps us prioritize improvements.",
  },
];

export function FAqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about our products and how we work.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border bg-card transition-shadow",
                  isOpen && "shadow-sm",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:text-brand"
                >
                  <span className="text-sm font-medium text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
