import { NextResponse } from "next/server";
import { db, schema } from "@/db";

const REPOS_TO_SYNC = [
  "thesabbirbd/Omnidesk-BD",
  "thesabbirbd/khata2sheet-ai",
  "thesabbirbd/sara-control-plane",
  "thesabbirbd/wa-reminder-companion",
  "thesabbirbd/web-to-app",
];

export async function GET() {
  try {
    if (db) {
      const records = await db.select().from(schema.githubReposCache);
      return NextResponse.json({
        ok: true,
        cachedCount: records.length,
        repositories: records,
      });
    }

    return NextResponse.json({
      ok: true,
      cachedCount: REPOS_TO_SYNC.length,
      repositories: REPOS_TO_SYNC.map((name) => ({
        repoName: name,
        starsCount: 0,
        forksCount: 0,
        openIssues: 0,
        primaryLanguage: "Python / TypeScript",
        syncedAt: new Date().toISOString(),
      })),
      note: "Database connection inactive; fallback schema returned.",
    });
  } catch (err) {
    console.error("github-sync GET error:", err);
    return NextResponse.json({ ok: false, error: "Failed to read repos cache" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Optional bearer auth for GitHub Action dispatch
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET || process.env.SYNC_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const syncedResults: { repo: string; status: string }[] = [];

    for (const repoFullName of REPOS_TO_SYNC) {
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "the-sabbir-portfolio-sync",
          },
          next: { revalidate: 3600 },
        });

        if (ghRes.ok) {
          const data = await ghRes.json();
          if (db) {
            await db
              .insert(schema.githubReposCache)
              .values({
                repoName: repoFullName,
                starsCount: data.stargazers_count ?? 0,
                forksCount: data.forks_count ?? 0,
                openIssues: data.open_issues_count ?? 0,
                latestCommitDate: data.pushed_at ? new Date(data.pushed_at) : null,
                primaryLanguage: data.language ?? "TypeScript",
                syncedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: schema.githubReposCache.repoName,
                set: {
                  starsCount: data.stargazers_count ?? 0,
                  forksCount: data.forks_count ?? 0,
                  openIssues: data.open_issues_count ?? 0,
                  latestCommitDate: data.pushed_at ? new Date(data.pushed_at) : null,
                  primaryLanguage: data.language ?? "TypeScript",
                  syncedAt: new Date(),
                },
              });
          }
          syncedResults.push({ repo: repoFullName, status: "synced" });
        } else {
          syncedResults.push({ repo: repoFullName, status: `github_api_${ghRes.status}` });
        }
      } catch (repoErr) {
        syncedResults.push({ repo: repoFullName, status: "fetch_failed" });
      }
    }

    return NextResponse.json({
      ok: true,
      syncedAt: new Date().toISOString(),
      results: syncedResults,
    });
  } catch (err) {
    console.error("github-sync POST error:", err);
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }
}
