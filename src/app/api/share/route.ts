import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, inspectPayloadSecurity } from "@/lib/security/waf-shield";
import { hashPassword, verifyPassword } from "@/lib/security/crypto-auth";
import { createShare, getShare, revokeShare } from "@/lib/db/workplace-store";
import { generateSvgDataUrl, extractHighlights } from "@/lib/share/visual-snapshot-generator";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  // WAF Rate Limiting
  const rateLimit = checkRateLimit(ip, "share");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many share links created recently. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // WAF AST Inspection
  const inspection = inspectPayloadSecurity(body, "/api/share", ip);
  if (!inspection.safe) {
    return NextResponse.json(
      { error: "Content blocked by security shield.", threats: inspection.threats },
      { status: 403 }
    );
  }

  const {
    creatorName,
    toolSlug,
    title,
    contentType,
    payloadJson,
    previewDataUrl,
    pinCode,
    maxViews,
    durationHours,
  } = body;

  if (!payloadJson || !toolSlug) {
    return NextResponse.json({ error: "Missing required fields: payloadJson, toolSlug" }, { status: 400 });
  }

  // Check payload size (max 5 MB for storage safety)
  if (typeof payloadJson === "string" && payloadJson.length > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Payload exceeds 5MB limit for 24h ephemeral links." }, { status: 413 });
  }

  try {
    const hashedPin = pinCode ? hashPassword(String(pinCode).trim()) : undefined;
    const serializedPayload = typeof payloadJson === "string" ? payloadJson : JSON.stringify(payloadJson);
    const safeCreator = String(creatorName || "Anonymous Creator").slice(0, 80);
    const safeTitle = String(title || "Shared Studio Output").slice(0, 160);
    const safeSlug = String(toolSlug).slice(0, 60);

    const resolvedPreviewDataUrl = typeof previewDataUrl === "string" && previewDataUrl.length > 20
      ? previewDataUrl.slice(0, 1_500_000)
      : generateSvgDataUrl({
          title: safeTitle,
          toolSlug: safeSlug,
          creatorName: safeCreator,
          highlights: extractHighlights(serializedPayload),
        });

    const result = await createShare({
      creatorName: safeCreator,
      toolSlug: safeSlug,
      title: safeTitle,
      contentType: String(contentType || "application/json").slice(0, 50),
      payloadJson: serializedPayload,
      previewDataUrl: resolvedPreviewDataUrl,
      pinCode: hashedPin,
      maxViews: maxViews ? Math.max(1, parseInt(maxViews, 10)) : undefined,
      durationHours: durationHours ? Math.min(72, Math.max(1, parseInt(durationHours, 10))) : 24,
    });

    const origin = req.nextUrl.origin || "https://sabbir.nav.bd";
    const shareUrl = `${origin}/s/${result.token}`;

    return NextResponse.json({
      success: true,
      token: result.token,
      shareUrl,
      expiresAt: result.expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create share link" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip, "general");
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const providedPin = searchParams.get("pin");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const share = await getShare(token);
    if (!share) {
      return NextResponse.json(
        { error: "Share link has expired or reached maximum views (410 Gone)." },
        { status: 410 }
      );
    }

    // Check PIN protection
    if (share.pinCode) {
      if (!providedPin || !verifyPassword(providedPin.trim(), share.pinCode)) {
        // Return metadata only without sensitive payload
        return NextResponse.json({
          locked: true,
          token: share.token,
          title: share.title,
          toolSlug: share.toolSlug,
          creatorName: share.creatorName,
          expiresAt: share.expiresAt,
          viewsCount: share.viewsCount,
        });
      }
    }

    return NextResponse.json({
      locked: false,
      share,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to retrieve share" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip, "share");
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token;
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const success = await revokeShare(token);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to revoke share" }, { status: 500 });
  }
}
