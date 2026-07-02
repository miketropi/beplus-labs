import { prisma } from "@/lib/prisma";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  gallery: string[];
  status: "dev" | "beta" | "launched";
  publishStatus: "public" | "pending";
  icon: string;
  coverImage: string;
  category: string;
  github?: string;
  liveDemo?: string;
}

export async function getAllProducts(opts?: { publishedOnly?: boolean }): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    where: opts?.publishedOnly ? { publishStatus: "public" } : undefined,
  });
  return products.map((p) => ({
    ...p,
    features: p.features as string[],
    gallery: p.gallery as string[],
    github: p.github ?? undefined,
    liveDemo: p.liveDemo ?? undefined,
  }));
}

export async function getProduct(slug: string, opts?: { publishedOnly?: boolean }): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return undefined;
  if (opts?.publishedOnly && product.publishStatus !== "public") return undefined;
  return {
    ...product,
    features: product.features as string[],
    gallery: product.gallery as string[],
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

export interface ChangelogEntry {
  date: string;
  productSlug: string;
  title: string;
  content: string;
  version: string;
  type: "feature" | "fix" | "improvement";
}

export interface ProductChangelogGroup {
  product: Product;
  entries: ChangelogEntry[];
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
