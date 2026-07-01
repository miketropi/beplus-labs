import type { Metadata } from "next";
import { Check, Rocket } from "lucide-react";
import { BetaForm } from "./beta-form";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Beta Program",
  description:
    "Get early access to BePlus Labs WordPress products. Join our beta program and help shape the future of open-source WordPress tooling.",
};

export default async function BetaPage() {
  const products = await getAllProducts();

  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
            <Rocket className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Join the Beta Program
          </h1>
          <p className="mt-4 text-muted-foreground">
            Get early access, test new features before launch, and help shape
            the roadmap for our open-source WordPress products.
          </p>
        </div>

        <BetaForm products={products} />

        {/* Perks */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Early Access",
              desc: "Test new blocks, features, and releases before they hit the WordPress.org repo.",
            },
            {
              title: "Direct Influence",
              desc: "Your feedback shapes priorities. Beta testers have driven features in every product we ship.",
            },
            {
              title: "GitHub Access",
              desc: "Get access to private repos, pre-release builds, and direct communication with the team.",
            },
          ].map((perk) => (
            <div key={perk.title} className="rounded-lg border p-5">
              <Check className="h-5 w-5 text-brand" />
              <h3 className="mt-3 font-semibold text-foreground">
                {perk.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
