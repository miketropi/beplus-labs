import Link from "next/link";
import { ArrowRight, GitBranch, Star, Package, Zap, Paintbrush, Menu, Sparkles, Search, MessageSquareText, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/shared/hero-section";
import { FAqSection } from "@/components/shared/faq-section";
import { getAllProducts, STATUS_LABELS } from "@/lib/data";

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
  const products = await getAllProducts();

  const STATS = [
    { icon: Package, label: "Products", value: String(products.length) },
    { icon: GitBranch, label: "Repositories", value: String(products.filter((p) => p.github).length) },
    { icon: Star, label: "Active Installs", value: "1K+" },
    { icon: Zap, label: "Total Releases", value: "28" },
  ];

  return (
    <div>
      <HeroSection />

      {/* Stats */}
      <section className="border-y bg-muted/20 px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              Download and try out the products below — your{" "}
              <Link href="/feedback" className="text-brand hover:underline">feedback</Link>{" "}
              helps us build better tools for everyone.
            </p>
          </div>

          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Products
            </h2>
            <p className="mt-4 text-muted-foreground">
              WordPress themes, plugins, and tools — built open, tested
              rigorously.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {products.map((product) => {
              const Icon = ICON_MAP[product.icon];
              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:border-brand-bright/30 hover:shadow-sm"
                >
                  {Icon && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors truncate">
                        {product.name}
                      </h3>
                      <Badge
                        variant={STATUS_VARIANT[product.status]}
                        className="shrink-0 text-xs"
                      >
                        {STATUS_LABELS[product.status]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {product.tagline}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <ButtonLink variant="outline" size="lg" href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <FAqSection />

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(207,254,37,0.1),transparent_60%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built in the open
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every product is open-source on GitHub. Star the repos, open issues,
            submit PRs — help shape the WordPress ecosystem.
          </p>
          <div className="mt-8">
            <ButtonLink
              size="lg"
              href="/feedback"
              className="h-12 bg-brand-bright px-8 text-sm font-semibold text-brand-foreground hover:bg-brand-bright/90"
            >
              Send Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
