import { prisma } from "@/lib/prisma";

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
  liveDemo?: string;
}

export interface ChangelogEntry {
  date: string;
  productSlug: string;
  title: string;
  content: string;
  version: string;
  type: "feature" | "fix" | "improvement";
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return products.map((p) => ({
    ...p,
    features: p.features as string[],
    github: p.github ?? undefined,
    liveDemo: p.liveDemo ?? undefined,
  }));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return undefined;
  return {
    ...product,
    features: product.features as string[],
    github: product.github ?? undefined,
    liveDemo: product.liveDemo ?? undefined,
  };
}

export async function getProductsByCategory(): Promise<Record<string, Product[]>> {
  const products = await getAllProducts();
  return products.reduce(
    (acc, product) => {
      const cat = product.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );
}

export async function getAllChangelogEntries(): Promise<ChangelogEntry[]> {
  const entries = await prisma.changelogEntry.findMany({
    orderBy: { date: "desc" },
  });
  return entries.map((e) => ({
    date: e.date.toISOString().slice(0, 10),
    productSlug: e.productSlug,
    title: e.title,
    content: e.content,
    version: e.version,
    type: e.type as ChangelogEntry["type"],
  }));
}

export async function getChangelogForProduct(slug: string): Promise<ChangelogEntry[]> {
  const all = await getAllChangelogEntries();
  return all.filter((e) => e.productSlug === slug);
}

export async function getChangelogByMonth(): Promise<Record<string, ChangelogEntry[]>> {
  const all = await getAllChangelogEntries();
  return all.reduce(
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

export async function getChangelogByProduct(): Promise<ProductChangelogGroup[]> {
  const [all, products] = await Promise.all([
    getAllChangelogEntries(),
    getAllProducts(),
  ]);

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
