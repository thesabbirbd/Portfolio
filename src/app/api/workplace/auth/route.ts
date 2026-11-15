import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, inspectPayloadSecurity } from "@/lib/security/waf-shield";
import { hashPassword, verifyPassword, signHmacToken, verifyHmacToken } from "@/lib/security/crypto-auth";
import { getUser, createUser, updateUser, WorkspaceUser } from "@/lib/db/workplace-store";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  // 1. WAF Rate Limiting
  const rateLimit = checkRateLimit(ip, "auth");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later.", retryAfter: rateLimit.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSec || 60) } }
    );
  }

  // 2. Parse & WAF Payload Inspection
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const inspection = inspectPayloadSecurity(body, "/api/workplace/auth", ip);
  if (!inspection.safe) {
    return NextResponse.json(
      { error: "Request blocked by enterprise security shield (WAF).", threats: inspection.threats },
      { status: 403 }
    );
  }

  const { action } = body;

  // 3. Action Handlers
  try {
    if (action === "guest") {
      const displayName = String(body.displayName || "").trim().slice(0, 80) || "Guest Creator";
      // Generate unique handle
      const baseHandle = displayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .slice(0, 16) || "guest";
      const randomSuffix = Math.random().toString(36).slice(2, 6);
      const handle = `${baseHandle}_${randomSuffix}`;

      const user = await createUser({
        handle,
        displayName,
        role: "guest",
        welcomeXp: 25,
      });

      const sessionToken = signHmacToken({
        id: user.id,
        handle: user.handle,
        role: user.role,
        displayName: user.displayName,
      });

      return NextResponse.json({
        success: true,
        user,
        sessionToken,
        welcomeBonus: 25,
      });
    }

    if (action === "signup") {
      const displayName = String(body.displayName || "").trim().slice(0, 80);
      const email = String(body.email || "").trim().slice(0, 160);
      const password = String(body.password || "");
      let handle = String(body.handle || "")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 32);

      if (!displayName) {
        return NextResponse.json({ error: "Display name is required" }, { status: 400 });
      }

      if (!handle) {
        handle = displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20) || `user_${Date.now().toString(36)}`;
      }

      // Check if handle already exists
      const existing = await getUser(handle);
      if (existing) {
        handle = `${handle}_${Math.random().toString(36).slice(2, 5)}`;
      }

      const passHash = password ? hashPassword(password) : null;

      const user = await createUser({
        handle,
        displayName,
        email: email || null,
        passHash,
        role: "member",
        welcomeXp: 50,
      });

      const sessionToken = signHmacToken({
        id: user.id,
        handle: user.handle,
        role: user.role,
        displayName: user.displayName,
      });

      return NextResponse.json({
        success: true,
        user,
        sessionToken,
        welcomeBonus: 50,
      });
    }

    if (action === "login") {
      const handleOrEmail = String(body.handle || body.email || "").trim().toLowerCase();
      const password = String(body.password || "");

      if (!handleOrEmail || !password) {
        return NextResponse.json({ error: "Handle/email and password are required" }, { status: 400 });
      }

      const user = await getUser(handleOrEmail);
      if (!user || !user.passHash) {
        return NextResponse.json({ error: "Invalid credentials or user not found" }, { status: 401 });
      }

      const valid = verifyPassword(password, user.passHash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const sessionToken = signHmacToken({
        id: user.id,
        handle: user.handle,
        role: user.role,
        displayName: user.displayName,
      });

      return NextResponse.json({
        success: true,
        user,
        sessionToken,
      });
    }

    if (action === "me") {
      const token = body.sessionToken || req.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) {
        return NextResponse.json({ error: "Missing session token" }, { status: 401 });
      }

      const payload = verifyHmacToken<{ handle: string }>(token);
      if (!payload || !payload.handle) {
        return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
      }

      const user = await getUser(payload.handle);
      if (!user) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: "Unsupported auth action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal auth error" }, { status: 500 });
  }
}
