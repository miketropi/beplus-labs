import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Download, ExternalLink } from "lucide-react";
import { Paintbrush, Menu, Sparkles, Search, Rocket, BarChart3, Shield, MessageSquare, Activity, Flag, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { getProduct, getAllProducts, STATUS_LABELS } from "@/lib/data";
import { getLatestRelease, fetchReleases, mapRelease } from "@/lib/github";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  menu: Menu,
  sparkles: Sparkles,
  search: Search,
  rocket: Rocket,
  "bar-chart-3": BarChart3,
  shield: Shield,
  "message-square": MessageSquare,
  activity: Activity,
  flag: Flag,
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  dev: "secondary",
  beta: "default",
  launched: "outline",
};

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };

  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getAllProducts(),
  ]);

  if (!product) notFound();

  const Icon = ICON_MAP[product.icon];
  const otherProducts = allProducts.filter((p) => p.slug !== slug);

  // Fetch GitHub releases for this product
  let release = null;
  let changelogEntries: ReturnType<typeof mapRelease>[] = [];
  if (product.github) {
    const [owner, repo] = product.github.split("/");
    try {
      const releases = await fetchReleases(owner, repo);
      release = releases.length > 0 ? await getLatestRelease(product.github) : null;
      changelogEntries = releases.slice(0, 4).map((r) => mapRelease(r, slug));
    } catch {
      // GitHub fetch failed — show empty state
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {Icon && (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright sm:size-14">
              <Icon className="size-6 sm:size-7" />
            </div>
          )}
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[product.status]} className="text-xs">
                  {STATUS_LABELS[product.status]}
                </Badge>
                {release && (
                  <>
                    <a
                      href={release.downloadUrl}
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-bright px-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/80"
                    >
                      <Download className="size-3.5" />
                      Download {release.tag}
                    </a>
                    <a
                      href={release.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-bright/40 hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </>
                )}
                {product.liveDemo && (
                  <a
                    href={product.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-bright px-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/80"
                  >
                    <ExternalLink className="size-3.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              {product.github && (
                <a
                  href={`https://github.com/${product.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  <ExternalLink className="size-3" />
                  {product.github}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl leading-relaxed text-foreground">{product.tagline}</p>
        <div className="tiptap-rendered" dangerouslySetInnerHTML={{ __html: product.description }} />

        {/* Features */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Features</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {product.status !== "launched" && (
          <div className="mt-10 rounded-xl border border-brand-bright/30 bg-brand-muted p-6 dark:bg-brand-bright/5">
            <p className="font-semibold text-brand-foreground dark:text-brand-bright">
              {product.status === "beta"
                ? "This product is in beta."
                : "This product is under active development."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be among the first to try it. Join our beta program for early access.
            </p>
            <div className="mt-4">
              <ButtonLink
                size="sm"
                href="/beta"
                className="bg-brand-bright text-brand-foreground hover:bg-brand-bright/90"
              >
                Request Access <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        )}

        {/* Changelog */}
        {changelogEntries.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Updates
              </h2>
              <Link
                href="/changelog"
                className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {changelogEntries.map((entry) => (
                <Link
                  key={`${entry.date}-${entry.title}`}
                  href={`/changelog/${entry.date}`}
                  className="block rounded-lg border bg-card p-4 transition-colors hover:border-brand-bright/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{entry.version}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-foreground">{entry.title}</p>
                  {entry.content && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Products */}
        <div className="mt-14 border-t pt-10">
          <h2 className="text-lg font-semibold text-foreground">Other Products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {otherProducts.slice(0, 4).map((p) => {
              const OtherIcon = ICON_MAP[p.icon];
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-brand-bright/30"
                >
                  {OtherIcon && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                      <OtherIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
