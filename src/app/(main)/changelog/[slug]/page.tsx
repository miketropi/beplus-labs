import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/shared/button-link";
import { fetchGitHubChangelog } from "@/lib/github";
import {
  getProduct,
  TYPE_LABELS,
} from "@/lib/data";

const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  feature: "default",
  fix: "secondary",
  improvement: "outline",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entries = await fetchGitHubChangelog();
  const entry = entries.find((e) => e.date === slug);
  if (!entry) return { title: "Not Found" };

  return {
    title: entry.title,
    description: (entry.content || "").slice(0, 160),
  };
}

export default async function ChangelogEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await fetchGitHubChangelog();
  const entry = entries.find((e) => e.date === slug);

  if (!entry) notFound();

  const product = getProduct(entry.productSlug);
  const idx = entries.findIndex((e) => e.date === slug);
  const prev = idx < entries.length - 1 ? entries[idx + 1] : null;
  const next = idx > 0 ? entries[idx - 1] : null;

  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <ButtonLink variant="ghost" size="sm" href="/changelog" className="mb-8 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Changelog
        </ButtonLink>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={TYPE_VARIANT[entry.type]} className="text-xs">
            {TYPE_LABELS[entry.type]}
          </Badge>
          <span className="text-xs text-muted-foreground">{entry.version}</span>
          {product && (
            <Link
              href={`/products/${product.slug}`}
              className="text-xs font-medium text-brand hover:underline"
            >
              {product.name}
            </Link>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {entry.title}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {entry.content && (
          <div className="mt-8 text-foreground leading-relaxed whitespace-pre-line">
            {entry.content}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t pt-6">
          {prev ? (
            <Link
              href={`/changelog/${prev.date}`}
              className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/changelog/${next.date}`}
              className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Next
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
