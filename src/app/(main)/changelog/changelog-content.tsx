"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import {
  Paintbrush,
  Menu,
  Sparkles,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllProducts, TYPE_LABELS, type ChangelogEntry, type ProductChangelogGroup } from "@/lib/data";

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

function groupEntries(entries: ChangelogEntry[]): ProductChangelogGroup[] {
  const products = getAllProducts();

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
}

export function ChangelogContent({ entries }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  const groups = groupEntries(entries);

  const filtered = filter
    ? groups.filter((g) => g.product.slug === filter)
    : groups;

  return (
    <>
      {/* Filter bar */}
      <div className="mt-8 -mx-1 flex flex-wrap items-center gap-1">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
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
            onClick={() =>
              setFilter(filter === product.slug ? null : product.slug)
            }
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
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

      {/* Changelog list */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No releases yet.
        </p>
      ) : (
        <div className="mt-10 space-y-16">
          {filtered.map(({ product, entries }) => {
            const Icon = ICON_MAP[product.icon];
            return (
              <section key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group mb-6 inline-flex items-center gap-3"
                >
                  {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-brand">
                      {product.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {entries.length} release{entries.length !== 1 ? "s" : ""}
                      <span className="ml-1 text-brand">· live</span>
                    </p>
                  </div>
                </Link>

                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Link
                      key={`${entry.date}-${entry.title}`}
                      href={`/changelog/${entry.date}`}
                      className="block rounded-lg border bg-card p-5 transition-colors hover:border-brand-bright/30"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={TYPE_VARIANT[entry.type]}
                          className="text-xs"
                        >
                          {TYPE_LABELS[entry.type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entry.version}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="mt-2 font-semibold text-foreground leading-snug">
                        {entry.title}
                      </h3>
                      {entry.content && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-sm font-medium text-brand">
                        Read more <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
