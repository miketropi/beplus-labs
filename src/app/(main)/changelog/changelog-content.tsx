"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, Paintbrush, Menu, Sparkles, Search, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TYPE_LABELS, type Product, type ChangelogEntry, type ProductChangelogGroup } from "@/lib/data";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  menu: Menu,
  sparkles: Sparkles,
  search: Search,
};

const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  feature: "default",
  fix: "secondary",
  improvement: "outline",
};

function groupEntries(entries: ChangelogEntry[], products: Product[]): ProductChangelogGroup[] {
  const grouped = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    if (!grouped.has(entry.productSlug)) {
      grouped.set(entry.productSlug, []);
    }
    grouped.get(entry.productSlug)!.push(entry);
  }
  return products
    .filter((p) => grouped.has(p.slug))
    .map((p) => ({ product: p, entries: grouped.get(p.slug)! }));
}

interface Props {
  entries: ChangelogEntry[];
  products: Product[];
  latest?: ChangelogEntry;
}

export function ChangelogContent({ entries, products, latest }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  const groups = groupEntries(entries, products);

  const filtered = filter
    ? groups.filter((g) => g.product.slug === filter)
    : groups;

  const allDate = latest
    ? new Date(latest.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Dia-style metadata bar */}
      {latest && (
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-muted/30 px-5 py-3">
          <div>
            <p className="meta-label">Latest release</p>
            <p className="meta-value mt-0.5 text-xs">{allDate}</p>
          </div>
          <div>
            <p className="meta-label">Product</p>
            <p className="meta-value mt-0.5 text-xs">
              {products.find((p) => p.slug === latest.productSlug)?.name ?? "—"}
            </p>
          </div>
          <div>
            <p className="meta-label">Version</p>
            <p className="meta-value mt-0.5 text-xs">{latest.version}</p>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="-mx-1 flex flex-wrap items-center gap-1">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "inline-flex h-7 items-center rounded-full border px-3 font-mono text-sm font-medium transition-colors",
            !filter
              ? "border-brand-500 bg-brand-100 text-brand-foreground dark:bg-brand-bright/15 dark:text-brand-bright dark:border-brand-bright/40"
              : "border-border bg-card text-muted-foreground hover:border-brand-bright/30 hover:text-foreground",
          )}
        >
          All
        </button>

        {groups.map(({ product }) => (
          <button
            key={product.slug}
            onClick={() => setFilter(filter === product.slug ? null : product.slug)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 font-mono text-sm font-medium transition-colors",
              filter === product.slug
                ? "border-brand-500 bg-brand-100 text-brand-foreground dark:bg-brand-bright/15 dark:text-brand-bright dark:border-brand-bright/40"
                : "border-border bg-card text-muted-foreground hover:border-brand-bright/30 hover:text-foreground",
            )}
          >
            {product.name}
            {filter === product.slug && <X className="h-3 w-3" />}
          </button>
        ))}
      </div>

      {/* Changelog entries */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center font-mono text-xs text-muted-foreground">
          No releases yet.
        </p>
      ) : (
        <div className="mt-8 space-y-14">
          {filtered.map(({ product, entries: productEntries }) => {
            const Icon = ICON_MAP[product.icon];
            const sorted = [...productEntries].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            );

            return (
              <section key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group mb-5 inline-flex items-center gap-3"
                >
                  {Icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                      <Icon className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                      {product.name}
                    </h2>
                    <p className="meta-label">
                      {sorted.length} release{sorted.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>

                <div className="space-y-3">
                  {sorted.map((entry, idx) => {
                    const date = new Date(entry.date);
                    const issueNo = String(sorted.length - idx).padStart(3, "0");
                    const verChars = entry.version.split("");

                    return (
                      <Link
                        key={`${entry.date}-${entry.title}`}
                        href={`/changelog/${entry.date}`}
                        className="card-dia block p-5"
                      >
                        {/* Dia-style metadata row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="meta-label">
                            {date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="meta-label">Issue No. {issueNo}</span>
                        </div>

                        <div className="mt-3 flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-mono text-sm font-semibold text-foreground leading-snug">
                              {entry.title}
                            </h3>
                            {entry.content && (
                              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {entry.content}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={TYPE_VARIANT[entry.type]}
                            className="shrink-0 text-xs"
                          >
                            {TYPE_LABELS[entry.type]}
                          </Badge>
                        </div>

                        {/* Version with character spacing */}
                        <div className="mt-3 flex items-center gap-3">
                          <span className="meta-label">App Version</span>
                          <span className="meta-digit text-xs">{entry.version}</span>
                        </div>

                        <div className="mt-3 flex items-center gap-1 font-mono text-sm font-medium text-brand">
                          Read more <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
