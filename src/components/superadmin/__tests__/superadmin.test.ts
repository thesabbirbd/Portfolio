import { describe, it, expect, beforeEach } from "vitest";
import {
  createUser,
  getUser,
  updateUser,
  setToolPermission,
  getToolPermission,
  createShare,
  getShare,
  revokeShare,
  getStorageStats,
} from "@/lib/db/workplace-store";
import { inspectPayloadSecurity, getThreatLogs, clearThreatLogs } from "@/lib/security/waf-shield";

describe("SuperAdmin SaaS Control Plane & RBAC (superadmin.test.ts)", () => {
  beforeEach(() => {
    clearThreatLogs();
  });

  it("updates tool permissions and switches access modes dynamically", async () => {
    // Default mode is gated
    const initial = await getToolPermission("image-editor");
    expect(initial.accessMode).toBe("gated");

    // SuperAdmin sets to members_only
    const updated = await setToolPermission("image-editor", "members_only", 50);
    expect(updated.accessMode).toBe("members_only");
    expect(updated.dailyLimit).toBe(50);

    const recheck = await getToolPermission("image-editor");
    expect(recheck.accessMode).toBe("members_only");

    // Restore to gated
    await setToolPermission("image-editor", "gated");
  });

  it("updates user roles between guest, member, and superadmin", async () => {
    const handle = `guest_admin_test_${Date.now()}`;
    const user = await createUser({
      handle,
      displayName: "Guest Test Subject",
      role: "guest",
    });
    expect(user.role).toBe("guest");

    // Promote to pro member
    const promoted = await updateUser(handle, { role: "pro" });
    expect(promoted?.role).toBe("pro");

    const recheck = await getUser(handle);
    expect(recheck?.role).toBe("pro");
  });

  it("revokes single 24-hour share links on demand", async () => {
    const share = await createShare({
      creatorName: "SuperAdmin Tester",
      toolSlug: "video-clipper",
      title: "Clips for Socials",
      payloadJson: "{}",
    });

    const activeBefore = await getShare(share.token);
    expect(activeBefore).not.toBeNull();

    // Revoke share
    const revoked = await revokeShare(share.token);
    expect(revoked).toBe(true);

    const activeAfter = await getShare(share.token);
    expect(activeAfter).toBeNull();
  });

  it("captures SQLi payload in WAF threat logs during simulated penetration", () => {
    const attackPayload = "' UNION SELECT null, username, password FROM workspace_users--";
    const res = inspectPayloadSecurity(attackPayload, "/api/superadmin/simulator", "10.10.10.10");

    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("sqli");

    const logs = getThreatLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].threatType).toBe("sqli");
    expect(logs[0].route).toBe("/api/superadmin/simulator");
  });

  it("computes database storage stats within 500 MB free limits", async () => {
    const stats = await getStorageStats();
    expect(stats.totalUsers).toBeGreaterThanOrEqual(1);
    expect(stats.freeTierLimitKb).toBe(512_000);
    expect(stats.estimatedStorageKb).toBeGreaterThan(0);
    expect(stats.estimatedStorageKb).toBeLessThan(stats.freeTierLimitKb);
  });
});
