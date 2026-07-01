import { NextResponse } from "next/server";
import { fetchGitHubChangelog } from "@/lib/github";
import { getAllChangelogEntries, type ChangelogEntry } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "static";

  let entries: ChangelogEntry[];

  if (source === "github") {
    try {
      entries = await fetchGitHubChangelog();
    } catch (err) {
      console.error("Failed to fetch GitHub changelog:", err);
      return NextResponse.json(
        { error: "Failed to fetch from GitHub" },
        { status: 502 },
      );
    }
  } else {
    entries = getAllChangelogEntries();
  }

  return NextResponse.json(entries, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
