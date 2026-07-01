import products from "@/data/products.json";
import changelog from "@/data/changelog.json";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  status: "dev" | "beta" | "launched";
  icon: string;
  coverImage: string;
  category: string;
  github?: string;
}

export interface ChangelogEntry {
  date: string;
  productSlug: string;
  title: string;
  content: string;
  version: string;
  type: "feature" | "fix" | "improvement";
}

export function getAllProducts(): Product[] {
  return products as Product[];
}

export function getProduct(slug: string): Product | undefined {
  return (products as Product[]).find((p) => p.slug === slug);
}

export function getProductsByCategory(): Record<string, Product[]> {
  return (products as Product[]).reduce(
    (acc, product) => {
      const cat = product.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );
}

export function getAllChangelogEntries(): ChangelogEntry[] {
  return (changelog as ChangelogEntry[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getChangelogForProduct(slug: string): ChangelogEntry[] {
  return getAllChangelogEntries().filter((e) => e.productSlug === slug);
}

export function getChangelogByMonth(): Record<string, ChangelogEntry[]> {
  return getAllChangelogEntries().reduce(
    (acc, entry) => {
      const date = new Date(entry.date);
      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {} as Record<string, ChangelogEntry[]>,
  );
}

export interface ProductChangelogGroup {
  product: Product;
  entries: ChangelogEntry[];
}

export function getChangelogByProduct(): ProductChangelogGroup[] {
  const all = getAllChangelogEntries();
  const products = getAllProducts();

  const productOrder = products.filter((p) =>
    all.some((e) => e.productSlug === p.slug),
  );

  return productOrder.map((product) => ({
    product,
    entries: all.filter((e) => e.productSlug === product.slug),
  }));
}

export const STATUS_LABELS: Record<string, string> = {
  dev: "In Development",
  beta: "Beta",
  launched: "Launched",
};

export const TYPE_LABELS: Record<string, string> = {
  feature: "Feature",
  fix: "Fix",
  improvement: "Improvement",
};
