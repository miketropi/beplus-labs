import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    slug: "nextora",
    name: "Nextora",
    tagline: "WordPress block theme — modern FSE with Tailwind CSS v4",
    description:
      "Nextora is a modern WordPress Full Site Editing (FSE) block theme built with classic PHP templates, Tailwind CSS v4, and TypeScript. It combines the flexibility of blocks with modern frontend tooling.",
    features: [
      "Full Site Editing (FSE) block theme",
      "Tailwind CSS v4 integration",
      "TypeScript & PHPStan support",
      "First-party Gutenberg blocks",
      "Spotlight search modal",
      "GSAP scroll animations",
      "WooCommerce integration",
      "Mobile-responsive navigation",
      "Swiper carousel & image gallery",
      "PHPUnit test coverage",
    ],
    status: "launched" as const,
    icon: "paintbrush",
    coverImage: "https://i.pinimg.com/1200x/f3/62/b6/f362b6bc0fcede73bd91d4179536c936.jpg",
    category: "WordPress Theme",
    github: "miketropi/nextora",
  },
  {
    slug: "beplus-visual-mega-nav",
    name: "BePlus Visual Mega Nav",
    tagline: "Drag-and-drop mega menu builder for WordPress",
    description:
      "BePlus Visual Mega Nav transforms WordPress navigation into a visual drag-and-drop experience. Build complex mega menus with rows, columns, icons, images, and custom content — no code required.",
    features: [
      "Visual drag-and-drop builder",
      "Mega menu with rows & columns",
      "Icon & image support",
      "Custom content blocks",
      "Responsive by default",
      "WooCommerce integration",
      "Role-based menu visibility",
      "Multisite compatible",
      "WPML & Polylang support",
      "Developer-friendly API",
    ],
    status: "launched" as const,
    icon: "menu",
    coverImage: "https://i.pinimg.com/1200x/c2/7c/eb/c27ceb9be031dea4b4563c9bd88d1bfe.jpg",
    category: "WordPress Plugin",
    github: "miketropi/beplus-visual-mega-nav",
  },
  {
    slug: "prompt-to-pattern",
    name: "Prompt to Pattern",
    tagline: "AI-powered Gutenberg block pattern generator",
    description:
      "Prompt to Pattern lets you describe the layout you want in plain English and generates a fully functional Gutenberg block pattern — ready to use in the editor or export as code.",
    features: [
      "Natural language pattern generation",
      "OpenAI / Anthropic API integration",
      "Export as Gutenberg block pattern",
      "Copy-paste PHP/HTML output",
      "Pattern library browser",
      "Custom CSS output",
      "Supports all core blocks",
      "Synced pattern support",
      "Keyboard shortcuts",
      "Dark mode",
    ],
    status: "beta" as const,
    icon: "sparkles",
    coverImage: "https://i.pinimg.com/1200x/f7/a9/fc/f7a9fccd6d97fd805ade4e389a351f1a.jpg",
    category: "WordPress Plugin",
    github: "miketropi/prompt-to-pattern",
  },
  {
    slug: "beplus-fast-product-filter",
    name: "Fast Product Filter",
    tagline: "High-performance AJAX product filtering for WooCommerce",
    description:
      "Fast Product Filter adds instant, AJAX-powered filtering to your WooCommerce store. Filter by category, price, attributes, ratings, and more — with zero page reloads.",
    features: [
      "AJAX instant filtering",
      "Category & attribute filters",
      "Price range slider",
      "Rating filter",
      "Search-as-you-type",
      "Mobile-friendly",
      "Custom filter presets",
      "SEO-friendly URLs",
      "Cache-compatible",
      "Developer hooks & actions",
    ],
    status: "dev" as const,
    icon: "search",
    coverImage: "https://i.pinimg.com/1200x/04/46/f4/0446f413e618fe84341e27b3950547e7.jpg",
    category: "WooCommerce Plugin",
    github: "ducdung196qtr/beplus-fast-product-filter-live-search-for-woocommerce",
  },
];

async function main() {
  console.log("Seeding products...");

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log(`Seeded ${PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
