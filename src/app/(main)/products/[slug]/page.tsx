export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink, MessageSquareText } from "lucide-react";
import { Paintbrush, Menu, Sparkles, Search, Rocket, BarChart3, Shield, MessageSquare, Activity, Flag, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { GalleryModal } from "@/components/shared/gallery-modal";
import { DownloadButton } from "@/components/shared/download-button";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug, { publishedOnly: true });
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
    getProduct(slug, { publishedOnly: true }),
    getAllProducts({ publishedOnly: true }),
  ]);

  if (!product) notFound();

  const Icon = ICON_MAP[product.icon];
  const otherProducts = allProducts.filter((p) => p.slug !== slug);

  let release = null;
  let changelogEntries: ReturnType<typeof mapRelease>[] = [];
  if (product.github) {
    const [owner, repo] = product.github.split("/");
    try {
      const releases = await fetchReleases(owner, repo);
      release = releases.length > 0 ? await getLatestRelease(product.github) : null;
      changelogEntries = releases.slice(0, 4).map((r) => mapRelease(r, slug));
    } catch {
      // GitHub fetch failed
    }
  }

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Product header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {Icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
              <Icon className="size-5" />
            </div>
          )}
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.name}
              </h1>
              <Badge variant={STATUS_VARIANT[product.status]} className="text-xs">
                {STATUS_LABELS[product.status]}
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <p className="meta-label">{product.category}</p>
              {product.github && (
                <a
                  href={`https://github.com/${product.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-brand"
                >
                  <ExternalLink className="size-3" />
                  {product.github}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {release && (
            <>
              <DownloadButton
                downloadUrl={release.downloadUrl}
                releaseTag={release.tag}
                productSlug={slug}
                productName={product.name}
              />
              <a
                href={release.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-brand-bright/40 hover:text-foreground"
              >
                <ExternalLink className="size-3" />
                Release
              </a>
            </>
          )}
          {product.liveDemo && (
            <a
              href={product.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-bright px-3 font-mono text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/80"
            >
              <ExternalLink className="size-3" />
              Live Demo
            </a>
          )}
        </div>

        {/* Tagline */}
        <p className="text-base leading-relaxed text-foreground sm:text-lg">{product.tagline}</p>
        <div className="tiptap-rendered mt-6" dangerouslySetInnerHTML={{ __html: product.description }} />

        {/* Gallery */}
        {product.gallery && product.gallery.length > 0 && (
          <div className="mt-10">
            <h2 className="meta-label">Gallery</h2>
            <div className="mt-3">
              <GalleryModal images={product.gallery} />
            </div>
          </div>
        )}

        {/* Feedback notice */}
        <div className="mt-10 card-dia p-5">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 size-4 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              We encourage users to download and try out this product and share their
              feedback during use. This will greatly help us develop a more complete product
              that truly meets the needs of end users.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10">
          <h2 className="meta-label">Features</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 rounded-lg border bg-card px-3.5 py-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span className="text-xs text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Status CTA */}
        {product.status !== "launched" && (
          <div className="mt-10 card-dia p-6">
            <p className="font-mono text-sm font-semibold text-foreground">
              {product.status === "beta"
                ? "This product is in beta."
                : "This product is under active development."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Help us improve. Your feedback shapes the roadmap.
            </p>
            <div className="mt-4">
              <ButtonLink
                size="sm"
                href="/feedback"
                className="bg-brand-bright font-mono text-sm text-brand-foreground hover:bg-brand-bright/90"
              >
                Give Feedback <ArrowRight className="ml-1.5 h-3 w-3" />
              </ButtonLink>
            </div>
          </div>
        )}

        {/* Changelog */}
        {changelogEntries.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="meta-label">Recent Updates</h2>
              <Link
                href="/changelog"
                className="flex items-center gap-1 font-mono text-sm font-medium text-brand hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {changelogEntries.map((entry) => (
                <Link
                  key={`${entry.date}-${entry.title}`}
                  href={`/changelog/${entry.date}`}
                  className="card-dia block p-4"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.type}
                    </Badge>
                    <span className="meta-value text-xs">{entry.version}</span>
                    <span className="meta-label">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-sm font-semibold text-foreground">{entry.title}</p>
                  {entry.content && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other products */}
        <div className="mt-14 border-t pt-10">
          <h2 className="meta-label">Other Products</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {otherProducts.slice(0, 4).map((p) => {
              const OtherIcon = ICON_MAP[p.icon];
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="card-dia flex items-center gap-3 p-3"
                >
                  {OtherIcon && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                      <OtherIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{p.tagline}</p>
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
