export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { ProductCoverImage } from "@/components/shared/product-cover-image";
import { getAllProducts, STATUS_LABELS } from "@/lib/data";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  dev: "secondary",
  beta: "default",
  launched: "outline",
};

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore all BePlus Labs products — deployment, analytics, authentication, monitoring, and more.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Products
          </h1>
          <p className="mt-3 text-muted-foreground">
            WordPress themes, plugins, and tools — open-source, rigorously tested.
          </p>
        </div>

        <div className="mb-10 rounded-xl border border-brand-bright/30 bg-brand-muted p-5 dark:bg-brand-bright/5">
          <div className="flex items-start gap-3">
            <MessageSquareText className="mt-0.5 size-5 shrink-0 text-brand-foreground dark:text-brand-bright" />
            <p className="text-sm leading-relaxed text-foreground">
              We encourage users to download and try out the products below and share their
              feedback during use. This will greatly help us develop a more complete product
              that truly meets the needs of end users.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-brand-bright/30 hover:shadow-md"
            >
              {/* Cover image */}
              <div className="p-4">
                <ProductCoverImage
                  src={product.coverImage}
                  alt={product.name}
                  iconName={product.icon}
                />
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                    {product.name}
                  </h2>
                  <Badge
                    variant={STATUS_VARIANT[product.status]}
                    className="shrink-0 text-[10px]"
                  >
                    {STATUS_LABELS[product.status]}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
                  Details <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink
            size="lg"
            href="/feedback"
            className="h-12 bg-brand-bright px-8 text-sm font-semibold text-brand-foreground hover:bg-brand-bright/90"
          >
            Share Your Feedback <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
