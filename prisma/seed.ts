import { PrismaClient } from "@prisma/client";
import products from "../src/data/products.json";
import changelog from "../src/data/changelog.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        features: p.features,
        status: p.status as "dev" | "beta" | "launched",
        icon: p.icon,
        coverImage: p.coverImage,
        category: p.category,
        github: p.github ?? null,
      },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        features: p.features,
        status: p.status as "dev" | "beta" | "launched",
        icon: p.icon,
        coverImage: p.coverImage,
        category: p.category,
        github: p.github ?? null,
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);

  console.log("Seeding changelog entries...");

  for (const entry of changelog) {
    await prisma.changelogEntry.create({
      data: {
        date: new Date(entry.date),
        productSlug: entry.productSlug,
        title: entry.title,
        content: entry.content,
        version: entry.version,
        type: entry.type as "feature" | "fix" | "improvement",
      },
    });
  }

  console.log(`Seeded ${changelog.length} changelog entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
