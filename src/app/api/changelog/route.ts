import { NextResponse } from "next/server";
import { fetchGitHubChangelog } from "@/lib/github";

export async function GET() {
  try {
    const entries = await fetchGitHubChangelog();
    return NextResponse.json(entries, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Failed to fetch GitHub changelog:", err);
    return NextResponse.json(
      { error: "Failed to fetch from GitHub" },
      { status: 502 },
    );
  }
}
