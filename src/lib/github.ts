import type { ChangelogEntry } from "./data";

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
  zipball_url: string;
  assets: Array<{ browser_download_url: string; name: string }>;
}

export async function fetchReleases(
  owner: string,
  repo: string,
): Promise<GitHubRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=20`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`GitHub API error for ${owner}/${repo}: ${res.status}`);
    return [];
  }

  return res.json();
}

export interface LatestRelease {
  tag: string;
  downloadUrl: string;
  pageUrl: string;
}

export async function getLatestRelease(
  github: string,
): Promise<LatestRelease | null> {
  const [owner, repo] = github.split("/");
  const releases = await fetchReleases(owner, repo);
  if (releases.length === 0) return null;

  const latest = releases[0];
  const zipAsset = latest.assets?.find((a) =>
    a.name.toLowerCase().endsWith(".zip"),
  );

  return {
    tag: latest.tag_name,
    downloadUrl: zipAsset?.browser_download_url ?? latest.zipball_url,
    pageUrl: latest.html_url,
  };
}

export function mapRelease(
  release: GitHubRelease,
  productSlug: string,
): ChangelogEntry {
  const type = inferType(release.body, release.tag_name);

  return {
    date: release.published_at.slice(0, 10),
    productSlug,
    title: release.name || release.tag_name,
    content: truncateBody(release.body),
    version: release.tag_name,
    type,
  };
}

function inferType(body: string, tag: string): ChangelogEntry["type"] {
  const lower = (body + tag).toLowerCase();
  if (/\bfix\b|\bbug\b|\bpatch\b|\bresolve\b/.test(lower)) return "fix";
  if (
    /\bperf\b|\bimprove\b|\brefactor\b|\bupdate\b|\boptimize\b/.test(lower)
  )
    return "improvement";
  return "feature";
}

function truncateBody(body: string): string {
  if (!body) return "";
  const cleaned = body.replace(/^##?\s*.*$/gm, "").trim();
  const firstPara = cleaned.split("\n\n")[0] || cleaned;
  if (firstPara.length <= 300) return firstPara;
  return firstPara.slice(0, 300) + "…";
}

export async function fetchGitHubChangelog(): Promise<ChangelogEntry[]> {
  const { getAllProducts } = await import("./data");
  const allProducts = await getAllProducts();
  const products = allProducts.filter((p) => p.github);

  const promises = products.map(async (product) => {
    const [owner, repo] = product.github!.split("/");
    const releases = await fetchReleases(owner, repo);
    return releases.map((r) => mapRelease(r, product.slug));
  });

  const results = await Promise.all(promises);
  return results
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
