import type { MetadataRoute } from "next";
import { getAllProducts, getAllChangelogEntries } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://beplus.dev";

  const [productPages, changelogPages] = await Promise.all([
    getAllProducts().then((products) =>
      products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ),
    getAllChangelogEntries().then((entries) =>
      entries.map((e) => ({
        url: `${baseUrl}/changelog/${e.date}`,
        lastModified: new Date(e.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
  ]);

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/beta`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...productPages,
    ...changelogPages,
  ];
}
