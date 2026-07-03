export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Package, GitBranch, Star, Zap, Paintbrush, Menu, Sparkles, Search, Check, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/shared/hero-section";
import { FAqSection } from "@/components/shared/faq-section";
import { ProductCoverImage } from "@/components/shared/product-cover-image";
import { getAllProducts, STATUS_LABELS } from "@/lib/data";
import { fetchGitHubChangelog } from "@/lib/github";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  menu: Menu,
  sparkles: Sparkles,
  search: Search,
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  dev: "secondary",
  beta: "default",
  launched: "outline",
};

export default async function HomePage() {
  const products = await getAllProducts({ publishedOnly: true });

  let latestVersion = "—";
  try {
    const entries = await fetchGitHubChangelog();
    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    latestVersion = sorted[0]?.version ?? "—";
  } catch {}

  const STATS = [
    { label: "Products", value: String(products.length) },
    { label: "Repositories", value: String(products.filter((p) => p.github).length) },
    { label: "Active Installs", value: "1K+" },
    { label: "Total Releases", value: "28" },
  ];

  return (
    <div>
      <HeroSection />

      {/* ── Stats ── */}
      <section className="border-y bg-muted/20 px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="meta-value text-2xl font-bold">{stat.value}</p>
              <p className="meta-label mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="meta-label mb-2">Open Source</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Products
            </h2>
            <p className="mt-3 text-muted-foreground">
              WordPress themes, plugins, and tools — built open, tested rigorously.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="card-dia group flex flex-col overflow-hidden"
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
                    <h2 className="text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                      {product.name}
                    </h2>
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
                    Details <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink variant="outline" size="lg" href="/products" className="font-mono text-xs">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-y bg-muted/20 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="meta-label mb-2">Why Us</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built different
            </h2>
            <p className="mt-3 text-muted-foreground">
              Modern engineering practices for the WordPress ecosystem.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              {
                title: "Open Source First",
                desc: "All code is public on GitHub. MIT-licensed, community-driven, and transparent.",
              },
              {
                title: "Quality Gates",
                desc: "TypeScript, PHPStan, PHPUnit, and CI on every commit. No compromises.",
              },
              {
                title: "Modern Stack",
                desc: "Tailwind v4, esbuild, block editor APIs — modern tooling for modern WordPress.",
              },
            ].map((item) => (
              <div key={item.title} className="card-dia p-5 text-center">
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAqSection />

      {/* ── CTA ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="meta-label mb-2">Get Involved</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built in the open
          </h2>
          <p className="mt-3 text-muted-foreground">
            Star the repos, open issues, submit PRs — help shape the WordPress ecosystem.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink
              size="lg"
              href="/feedback"
              className="h-11 bg-brand-bright px-7 font-mono text-sm font-semibold text-brand-foreground hover:bg-brand-bright/85"
            >
              Send Feedback <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </ButtonLink>
            <ButtonLink
              variant="outline"
              size="lg"
              href="/about"
              className="h-11 px-7 font-mono text-sm font-medium"
            >
              About Us
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
