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

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const latest = sorted[0];

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="meta-label mb-2">Release Notes</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Changelog
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Live updates from GitHub — the latest releases across all BePlus Labs products.
          </p>
        </div>

        <ChangelogContent entries={entries} products={products} latest={latest} />
      </div>
    </div>
  );
}
