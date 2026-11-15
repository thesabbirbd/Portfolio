import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, inspectPayloadSecurity, getThreatLogs, clearThreatLogs, logThreat } from "@/lib/security/waf-shield";
import { signHmacToken, verifyHmacToken } from "@/lib/security/crypto-auth";
import {
  listUsers,
  updateUser,
  deleteUser,
  recordXpEvent,
  listActiveShares,
  extendShare,
  revokeShare,
  purgeExpiredShares,
  listAllToolPermissions,
  setToolPermission,
  getStorageStats,
  exportDatabaseDump,
  importDatabaseDump,
  ToolPermission,
} from "@/lib/db/workplace-store";

const ADMIN_MASTER_PASSCODE = process.env.ADMIN_MASTER_KEY || "SABBIR-OS-ADMIN-2026";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "sabbir-os-superadmin-hmac-key";

function verifyAdminAuth(req: NextRequest, body?: any): boolean {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyHmacToken<{ admin: boolean }>(token, ADMIN_SECRET);
    if (decoded?.admin) return true;
  }

  // Check body passKey
  if (body?.masterKey && String(body.masterKey).trim() === ADMIN_MASTER_PASSCODE) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  // WAF Throttling
  const rateLimit = checkRateLimit(ip, "superadmin");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many SuperAdmin access attempts.", retryAfter: rateLimit.retryAfterSec },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  // 1. Initial Login / Key Verification
  if (action === "auth") {
    const pass = String(body.masterKey || "").trim();
    if (pass === ADMIN_MASTER_PASSCODE) {
      const adminToken = signHmacToken({ admin: true, timestamp: Date.now() }, ADMIN_SECRET);
      return NextResponse.json({
        success: true,
        adminToken,
        message: "Authenticated as SuperAdmin",
      });
    }
    return NextResponse.json({ error: "Invalid SuperAdmin master key" }, { status: 401 });
  }

  // 2. Validate Admin Authorization for all operational actions
  if (!verifyAdminAuth(req, body)) {
    return NextResponse.json({ error: "Unauthorized SuperAdmin access" }, { status: 401 });
  }

  // 3. Operational Dispatcher
  try {
    switch (action) {
      case "stats": {
        const stats = await getStorageStats();
        const threatLogs = getThreatLogs(15);
        return NextResponse.json({
          success: true,
          stats,
          threatsCount: threatLogs.length,
          threatLogs,
        });
      }

      case "users_list": {
        const users = await listUsers({
          role: body.roleFilter,
          search: body.search,
          limit: body.limit || 100,
        });
        return NextResponse.json({ success: true, users });
      }

      case "user_update_role": {
        const { handle, newRole } = body;
        const updated = await updateUser(handle, { role: newRole });
        return NextResponse.json({ success: !!updated, user: updated });
      }

      case "user_adjust_xp": {
        const { handle, xpDelta } = body;
        const res = await recordXpEvent({
          userHandle: handle,
          displayName: handle,
          actionType: "admin_adjustment",
          targetSlug: "superadmin",
          xpDelta: parseInt(xpDelta, 10) || 0,
        });
        return NextResponse.json({ success: true, newTotalXp: res.newTotalXp });
      }

      case "user_delete": {
        const { handle } = body;
        const deleted = await deleteUser(handle);
        return NextResponse.json({ success: deleted });
      }

      case "permissions_list": {
        const permissions = await listAllToolPermissions();
        return NextResponse.json({ success: true, permissions });
      }

      case "permission_set": {
        const { toolSlug, accessMode, dailyLimit } = body;
        const perm = await setToolPermission(toolSlug, accessMode, dailyLimit);
        return NextResponse.json({ success: true, permission: perm });
      }

      case "shares_list": {
        const shares = await listActiveShares(body.limit || 50);
        return NextResponse.json({ success: true, shares });
      }

      case "share_extend": {
        const { token, hours } = body;
        const ok = await extendShare(token, hours || 24);
        return NextResponse.json({ success: ok });
      }

      case "share_revoke": {
        const { token } = body;
        const ok = await revokeShare(token);
        return NextResponse.json({ success: ok });
      }

      case "shares_purge_expired": {
        const count = await purgeExpiredShares();
        return NextResponse.json({ success: true, purgedCount: count });
      }

      case "threats_get": {
        const logs = getThreatLogs(body.limit || 50);
        return NextResponse.json({ success: true, logs });
      }

      case "threats_clear": {
        clearThreatLogs();
        return NextResponse.json({ success: true });
      }

      case "simulate_threat": {
        const inspection = inspectPayloadSecurity(
          body.testPayload || "' UNION SELECT * FROM users--",
          "/api/superadmin/simulator",
          "127.0.0.1"
        );
        return NextResponse.json({
          success: true,
          inspection,
        });
      }

      case "db_export": {
        const dump = await exportDatabaseDump();
        return NextResponse.json({ success: true, dump });
      }

      case "db_import": {
        const ok = await importDatabaseDump(body.dump);
        return NextResponse.json({ success: ok });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal admin error" }, { status: 500 });
  }
}
