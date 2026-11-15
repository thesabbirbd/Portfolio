import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, inspectPayloadSecurity } from "@/lib/security/waf-shield";
import { getLeaderboard, getRecentXpEvents, recordXpEvent } from "@/lib/db/workplace-store";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip, "general");
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type");
  const type = typeParam === "members" || typeParam === "guests" ? typeParam : "all";
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  try {
    const leaderboard = await getLeaderboard({ type, limit });
    const recentEvents = await getRecentXpEvents(15);
    return NextResponse.json({
      success: true,
      leaderboard,
      recentEvents,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch leaderboard" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip, "export");
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const inspection = inspectPayloadSecurity(body, "/api/workplace/leaderboard", ip);
  if (!inspection.safe) {
    return NextResponse.json({ error: "Blocked by WAF security shield", threats: inspection.threats }, { status: 403 });
  }

  const { userHandle, displayName, actionType, targetSlug, xpDelta } = body;

  if (!userHandle || !displayName) {
    return NextResponse.json({ error: "Missing userHandle or displayName" }, { status: 400 });
  }

  // Cap delta to reasonable range (max 100 XP per single event)
  const safeDelta = Math.min(100, Math.max(5, parseInt(xpDelta || "25", 10)));

  try {
    const res = await recordXpEvent({
      userHandle: String(userHandle).slice(0, 40),
      displayName: String(displayName).slice(0, 80),
      actionType: String(actionType || "tool_export").slice(0, 50),
      targetSlug: String(targetSlug || "general").slice(0, 60),
      xpDelta: safeDelta,
    });

    return NextResponse.json({
      success: true,
      newTotalXp: res.newTotalXp,
      awardedXp: safeDelta,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record XP event" }, { status: 500 });
  }
}
