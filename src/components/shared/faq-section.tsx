"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HelpCircle, Package, Download, GitFork, MessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    icon: HelpCircle,
    q: "What is BePlus Labs?",
    a: "We're a small team of WordPress developers building open-source themes, plugins, and tools that bring modern engineering practices to the WordPress ecosystem. Every product is MIT-licensed, fully documented, and available on GitHub. Think TypeScript instead of vanilla JS, PHPStan instead of guesswork, and proper CI/CD instead of FTP uploads.",
  },
  {
    icon: Package,
    q: "Are your products really free?",
    a: "Absolutely. All our products are open-source and free to use — no hidden tiers, no premium upgrades, no license keys. You can download them from GitHub, self-host them, modify them to fit your needs, and even use them in commercial projects. We believe the WordPress community thrives when quality tooling is accessible to everyone.",
  },
  {
    icon: Download,
    q: "How do I get started with a product?",
    a: "Browse our products, pick one that fits your project, and download the latest release from its GitHub repository. Every product ships with a comprehensive README that walks you through setup, configuration, and common use cases. Running into trouble? Open an issue on GitHub or send us feedback — we typically respond within 24 hours.",
  },
  {
    icon: GitFork,
    q: "Can I contribute to your projects?",
    a: "Absolutely — we welcome contributions from the community. Star the repos to show your support, submit pull requests with improvements, report bugs you find, or suggest features you'd like to see. Each repository has a contributing guide to help you get started. Whether you're a seasoned WordPress developer or just getting started, there's a place for you here.",
  },
  {
    icon: MessageSquare,
    q: "What kind of support do you offer?",
    a: "We provide community support through GitHub issues for all our products. Found a bug? Open an issue with steps to reproduce and we'll investigate promptly. Have a question about configuration? The community and maintainers are happy to help. While we don't offer paid support plans at this time, your feedback directly shapes our roadmap and helps us prioritize what matters most.",
  },
];

export function FAqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <p className="meta-label mb-2">Support</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about our products and how we work.
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-brand hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            const Icon = faq.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border bg-card transition-all",
                  isOpen && "shadow-sm border-brand-bright/30",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:text-brand"
                >
                  <Icon className={cn(
                    "mt-0.5 h-5 w-5 shrink-0 transition-colors",
                    isOpen ? "text-brand" : "text-muted-foreground",
                  )} />
                  <span className="flex-1 font-medium text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
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
