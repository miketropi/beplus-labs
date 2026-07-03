import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product, ChangelogEntry } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface Props {
  entries: ChangelogEntry[];
  products: Product[];
}

export function ChangelogSidebar({ entries, products }: Props) {
  const grouped = entries.reduce(
    (acc, entry) => {
      const key = `${entry.productSlug}-${entry.version}`;
      if (!acc.has(key)) {
        acc.set(key, entry);
      }
      return acc;
    },
    new Map<string, ChangelogEntry>(),
  );

  const unique = Array.from(grouped.values()).slice(0, 8);

  return (
    <div>
      <h3 className="meta-label">Past Issues</h3>

      {unique.length === 0 ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          No past issues.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {unique.map((entry) => {
            const date = new Date(entry.date);
            const product = products.find((p) => p.slug === entry.productSlug);

            return (
              <Link
                key={`${entry.date}-${entry.title}`}
                href={`/changelog/${entry.date}`}
                className="card-dia group block p-3"
              >
                <p className="font-mono text-xs font-semibold text-foreground leading-tight">
                  {entry.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="meta-label text-[9px]">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {product && (
                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-auto leading-normal">
                      {product.name}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 font-mono text-[9px] text-brand">
                  Read <ArrowRight className="h-2.5 w-2.5" />
                </div>
              </Link>
            );
          })}

          <Link
            href="/changelog"
            className="mt-4 flex items-center gap-1 font-mono text-xs font-medium text-brand hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
