import type { Metadata } from "next";
import { fetchGitHubChangelog } from "@/lib/github";
import { getAllProducts, type ChangelogEntry } from "@/lib/data";
import { ChangelogContent } from "./changelog-content";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Stay up to date with the latest product updates, features, and fixes from BePlus Labs.",
};

export default async function ChangelogPage() {
  let entries: ChangelogEntry[];
  try {
    entries = await fetchGitHubChangelog();
  } catch {
    entries = [];
  }

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts({ publishedOnly: true });
  } catch {
    // DB not connected
  }

  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-muted-foreground">
          Live updates from GitHub — the latest releases across all BePlus Labs products.
        </p>

        <ChangelogContent entries={entries} products={products} />
      </div>
    </div>
  );
}
