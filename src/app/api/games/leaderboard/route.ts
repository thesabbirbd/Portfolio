import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface LeaderboardEntry {
  id: number | string;
  gameId: string;
  playerHandle: string;
  score: number;
  rankTier: string;
  accuracyPct: number;
  survivalSeconds: number;
  createdAt: string;
}

// Baseline records for instant interactive display even before DB connection
const SEED_LEADERBOARD: Record<string, LeaderboardEntry[]> = {
  "kernel-breach": [
    { id: "kb-1", gameId: "kernel-breach", playerHandle: "sysadmin_prime", score: 6850, rankTier: "S-Tier // Kernel Master", accuracyPct: 100, survivalSeconds: 84, createdAt: "2026-11-14T10:15:00Z" },
    { id: "kb-2", gameId: "kernel-breach", playerHandle: "bash_guru", score: 5400, rankTier: "SQL Architect", accuracyPct: 92, survivalSeconds: 110, createdAt: "2026-11-14T14:30:00Z" },
    { id: "kb-3", gameId: "kernel-breach", playerHandle: "devops_rakib", score: 4950, rankTier: "SQL Architect", accuracyPct: 88, survivalSeconds: 135, createdAt: "2026-11-14T18:00:00Z" },
  ],
  "packet-defender": [
    { id: "pd-1", gameId: "packet-defender", playerHandle: "noc_guardian", score: 7200, rankTier: "S-Tier // Kernel Master", accuracyPct: 98, survivalSeconds: 155, createdAt: "2026-11-14T11:20:00Z" },
    { id: "pd-2", gameId: "packet-defender", playerHandle: "packet_ninja", score: 5800, rankTier: "SQL Architect", accuracyPct: 94, survivalSeconds: 128, createdAt: "2026-11-14T16:45:00Z" },
    { id: "pd-3", gameId: "packet-defender", playerHandle: "syn_filter", score: 4600, rankTier: "NOC Specialist", accuracyPct: 90, survivalSeconds: 102, createdAt: "2026-11-14T20:10:00Z" },
  ],
  "subnet-sprint": [
    { id: "ss-1", gameId: "subnet-sprint", playerHandle: "cidr_lightning", score: 8100, rankTier: "S-Tier // Kernel Master", accuracyPct: 100, survivalSeconds: 60, createdAt: "2026-11-14T12:05:00Z" },
    { id: "ss-2", gameId: "subnet-sprint", playerHandle: "binary_whiz", score: 6250, rankTier: "SQL Architect", accuracyPct: 95, survivalSeconds: 60, createdAt: "2026-11-14T15:20:00Z" },
    { id: "ss-3", gameId: "subnet-sprint", playerHandle: "net_admin", score: 5100, rankTier: "NOC Specialist", accuracyPct: 89, survivalSeconds: 60, createdAt: "2026-11-14T19:30:00Z" },
  ],
  "query-optimizer": [
    { id: "qo-1", gameId: "query-optimizer", playerHandle: "btree_expert", score: 6900, rankTier: "S-Tier // Kernel Master", accuracyPct: 100, survivalSeconds: 72, createdAt: "2026-11-14T09:40:00Z" },
    { id: "qo-2", gameId: "query-optimizer", playerHandle: "pg_tuner", score: 5500, rankTier: "SQL Architect", accuracyPct: 96, survivalSeconds: 98, createdAt: "2026-11-14T13:10:00Z" },
    { id: "qo-3", gameId: "query-optimizer", playerHandle: "index_crafter", score: 4800, rankTier: "SQL Architect", accuracyPct: 91, survivalSeconds: 114, createdAt: "2026-11-14T17:50:00Z" },
  ],
  "uptime-architect": [
    { id: "ua-1", gameId: "uptime-architect", playerHandle: "sre_survivor", score: 7500, rankTier: "S-Tier // Kernel Master", accuracyPct: 100, survivalSeconds: 60, createdAt: "2026-11-14T08:30:00Z" },
    { id: "ua-2", gameId: "uptime-architect", playerHandle: "failover_champ", score: 6100, rankTier: "SQL Architect", accuracyPct: 97, survivalSeconds: 60, createdAt: "2026-11-14T12:50:00Z" },
    { id: "ua-3", gameId: "uptime-architect", playerHandle: "ups_operator", score: 5300, rankTier: "NOC Specialist", accuracyPct: 92, survivalSeconds: 60, createdAt: "2026-11-14T16:15:00Z" },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("game");

    if (db) {
      const query = db
        .select()
        .from(schema.gameScores)
        .orderBy(desc(schema.gameScores.score))
        .limit(20);

      const rows = gameId
        ? await db
            .select()
            .from(schema.gameScores)
            .where(eq(schema.gameScores.gameId, gameId))
            .orderBy(desc(schema.gameScores.score))
            .limit(10)
        : await query;

      if (rows && rows.length > 0) {
        return NextResponse.json({
          ok: true,
          scores: rows,
          source: "neon_database",
        });
      }
    }

    // Fallback to static seed data
    const list = gameId ? SEED_LEADERBOARD[gameId] || [] : Object.values(SEED_LEADERBOARD).flat();
    return NextResponse.json({
      ok: true,
      scores: list,
      source: "cached_fallback",
    });
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gameId, playerHandle, score, rankTier, accuracyPct, survivalSeconds } = body;

    if (!gameId || typeof score !== "number" || score < 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload parameters" }, { status: 400 });
    }

    // Anti-cheat maximum reasonable bounds check (max 50,000 pts per session)
    if (score > 50000) {
      return NextResponse.json({ ok: false, error: "Score exceeded theoretical maximum" }, { status: 422 });
    }

    const cleanHandle = String(playerHandle || "operative")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 30) || "operative";

    const cleanAccuracy = Math.min(100, Math.max(0, Number(accuracyPct) || 100));
    const cleanSeconds = Math.max(0, Number(survivalSeconds) || 0);
    const xpEarned = Math.round(score * 0.1);

    if (db) {
      const inserted = await db
        .insert(schema.gameScores)
        .values({
          gameId: String(gameId).slice(0, 50),
          playerHandle: cleanHandle,
          score,
          rankTier: String(rankTier || "Novice Scout").slice(0, 50),
          accuracyPct: cleanAccuracy,
          survivalSeconds: cleanSeconds,
          xpEarned,
        })
        .returning();

      return NextResponse.json({
        ok: true,
        entry: inserted[0],
        xpEarned,
      });
    }

    return NextResponse.json({
      ok: true,
      entry: {
        gameId,
        playerHandle: cleanHandle,
        score,
        rankTier: rankTier || "Novice Scout",
        accuracyPct: cleanAccuracy,
        survivalSeconds: cleanSeconds,
        xpEarned,
        createdAt: new Date().toISOString(),
      },
      xpEarned,
      source: "in_memory_offline",
    });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    return NextResponse.json({ ok: false, error: "Failed to submit score" }, { status: 500 });
  }
}
