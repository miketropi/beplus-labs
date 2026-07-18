export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/shared/hero-section";
import { HomeStats } from "@/components/shared/home-stats";
import { HomeValues } from "@/components/shared/home-values";
import { HomeCta } from "@/components/shared/home-cta";
import { FAqSection } from "@/components/shared/faq-section";
import { ProductCoverImage } from "@/components/shared/product-cover-image";
import { RevealItem } from "@/components/shared/reveal";
import { getAllProducts, STATUS_LABELS } from "@/lib/data";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  dev: "secondary",
  beta: "default",
  launched: "outline",
};

export default async function HomePage() {
  const products = await getAllProducts({ publishedOnly: true });

  const STATS = [
    { label: "Products", value: String(products.length) },
    {
      label: "Repositories",
      value: String(products.filter((p) => p.github).length),
    },
    { label: "Active Installs", value: "1K+" },
    { label: "Total Releases", value: "28" },
  ];

  return (
    <div>
      <HeroSection />

      <HomeStats stats={STATS} />

      {/* ── Products ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <RevealItem className="mx-auto mb-14 max-w-2xl text-center">
            <p className="meta-label mb-3">Open Source</p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our products
            </h2>
            <p className="mt-3 text-muted-foreground">
              WordPress themes, plugins, and tools — built open, tested
              rigorously.
            </p>
          </RevealItem>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <RevealItem key={product.slug} delay={i * 0.06} y={20}>
                <Link
                  href={`/products/${product.slug}`}
                  className="card-dia group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(207,254,37,0.35)]"
                >
                  <div className="p-4">
                    <ProductCoverImage
                      src={product.coverImage}
                      alt={product.name}
                      iconName={product.icon}
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2.5 p-4 pt-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                        {product.name}
                      </h3>
                      <Badge
                        variant={STATUS_VARIANT[product.status]}
                        className="shrink-0 text-xs"
                      >
                        {STATUS_LABELS[product.status]}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {product.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {product.features.slice(0, 2).map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {f}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          +{product.features.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-1 pt-1 text-sm font-medium text-brand transition-all group-hover:gap-2">
                      Details
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </div>

          <RevealItem delay={0.2} className="mt-12 text-center">
            <ButtonLink
              variant="outline"
              size="lg"
              href="/products"
              className="group h-11 px-7 font-mono text-xs"
            >
              View All Products
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </ButtonLink>
          </RevealItem>
        </div>
      </section>

      <HomeValues />

      <FAqSection />

      <HomeCta />
    </div>
  );
}