"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { RevealItem } from "@/components/shared/reveal";

export function HomeCta() {
  return (
    <section className="border-t bg-muted/20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <RevealItem className="text-center">
          <p className="meta-label mb-4">Get involved</p>
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Built in the <span className="text-brand">open</span>.
            <br />
            Shaped <span className="text-brand">together</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            Star the repos, open issues, submit PRs — help us build the
            WordPress ecosystem the community deserves.
          </p>
        </RevealItem>

        <RevealItem
          delay={0.15}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <ButtonLink
            size="lg"
            href="/feedback"
            className="group h-11 bg-brand-bright px-7 font-mono text-sm font-semibold text-brand-foreground shadow-[0_8px_30px_-12px_rgba(207,254,37,0.45)] transition-all duration-300 hover:bg-brand-bright/90 hover:shadow-[0_12px_36px_-12px_rgba(207,254,37,0.65)] hover:-translate-y-px"
          >
            Send Feedback
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </ButtonLink>
          <ButtonLink
            variant="outline"
            size="lg"
            href="/about"
            className="h-11 px-7 font-mono text-sm font-medium"
          >
            About Us
          </ButtonLink>
        </RevealItem>

        <RevealItem delay={0.25} className="text-center">
          <p className="meta-label mt-12 inline-flex items-center gap-2 sm:mt-16">
            <span className="text-brand-bright">●</span> 24-hour issue response
            · Community-first · No paywalls
          </p>
        </RevealItem>
      </div>
    </section>
  );
}
