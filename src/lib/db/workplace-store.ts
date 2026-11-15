import { db } from "@/db";
import {
  workspaceUsers,
  xpLedger,
  ephemeralShares,
  toolPermissions,
  securityAuditLogs,
} from "./schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { generateEphemeralToken } from "../security/crypto-auth";

export interface WorkspaceUser {
  id: string;
  handle: string;
  displayName: string;
  email?: string | null;
  passHash?: string | null;
  role: "guest" | "member" | "pro" | "superadmin";
  totalXp: number;
  exportsCount: number;
  status: "active" | "banned";
  createdAt: string;
}

export interface XpLedgerItem {
  id: number;
  userHandle: string;
  displayName: string;
  actionType: string;
  targetSlug: string;
  xpDelta: number;
  createdAt: string;
}

export interface EphemeralShare {
  token: string;
  creatorName: string;
  toolSlug: string;
  title: string;
  contentType: string;
  payloadJson: string;
  previewDataUrl?: string | null;
  pinCode?: string | null;
  viewsCount: number;
  maxViews?: number | null;
  expiresAt: string;
  createdAt: string;
}

export interface ToolPermission {
  toolSlug: string;
  accessMode: "open" | "gated" | "members_only" | "maintenance";
  dailyLimit: number;
  updatedAt: string;
}

/* =========================================================================
 * DETERMINISTIC IN-MEMORY STORAGE CACHE (Resilient Dual-Engine Fallback)
 * ========================================================================= */

const memoryUsers = new Map<string, WorkspaceUser>();
const memoryXpLedger: XpLedgerItem[] = [];
const memoryShares = new Map<string, EphemeralShare>();
const memoryPermissions = new Map<string, ToolPermission>();
let memoryPurgedCount = 0;

// Seed Initial SuperAdmin & Community Records
function seedInitialData() {
  if (memoryUsers.size > 0) return;

  const initialSuperAdmin: WorkspaceUser = {
    id: "usr-admin-sabbir",
    handle: "thesabbirbd",
    displayName: "Md Sabbirul Islam Khan",
    email: "thesabbir.bd@gmail.com",
    role: "superadmin",
    totalXp: 3500,
    exportsCount: 142,
    status: "active",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  };

  const seedMember1: WorkspaceUser = {
    id: "usr-mem-tanvir",
    handle: "tanvir_dev",
    displayName: "Tanvir Ahmed",
    email: "tanvir@devbd.io",
    role: "pro",
    totalXp: 1850,
    exportsCount: 64,
    status: "active",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  };

  const seedMember2: WorkspaceUser = {
    id: "usr-mem-nusrat",
    handle: "nusrat_ux",
    displayName: "Nusrat Jahan",
    email: "nusrat@designlab.bd",
    role: "member",
    totalXp: 1250,
    exportsCount: 38,
    status: "active",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  };

  const seedGuest: WorkspaceUser = {
    id: "usr-gst-rahim",
    handle: "rahim_coder",
    displayName: "Rahim Al-Hasan",
    role: "guest",
    totalXp: 450,
    exportsCount: 12,
    status: "active",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  };

  memoryUsers.set(initialSuperAdmin.handle.toLowerCase(), initialSuperAdmin);
  memoryUsers.set(seedMember1.handle.toLowerCase(), seedMember1);
  memoryUsers.set(seedMember2.handle.toLowerCase(), seedMember2);
  memoryUsers.set(seedGuest.handle.toLowerCase(), seedGuest);
}

seedInitialData();

/**
 * Auto-purge expired 24h shares to keep storage minimal.
 */
export async function purgeExpiredShares(): Promise<number> {
  const now = new Date();
  let purged = 0;

  // 1. Purge memory shares
  for (const [token, share] of memoryShares.entries()) {
    if (new Date(share.expiresAt) <= now) {
      memoryShares.delete(token);
      purged++;
    }
  }

  // 2. Purge DB if configured
  if (db) {
    try {
      await db.delete(ephemeralShares).where(sql`${ephemeralShares.expiresAt} <= ${now}`);
    } catch {
      // Fallback silently
    }
  }

  memoryPurgedCount += purged;
  return purged;
}

/* =========================================================================
 * 1. WORKSPACE USERS & GUESTS REPOSITORY
 * ========================================================================= */

export async function getUser(handleOrId: string): Promise<WorkspaceUser | null> {
  if (!handleOrId) return null;
  const key = handleOrId.toLowerCase().trim();

  // Try DB
  if (db) {
    try {
      const res = await db
        .select()
        .from(workspaceUsers)
        .where(sql`lower(${workspaceUsers.handle}) = ${key} OR ${workspaceUsers.id} = ${handleOrId}`)
        .limit(1);
      if (res.length > 0) {
        const u = res[0];
        return {
          id: u.id,
          handle: u.handle,
          displayName: u.displayName,
          email: u.email,
          passHash: u.passHash,
          role: u.role as WorkspaceUser["role"],
          totalXp: u.totalXp,
          exportsCount: u.exportsCount,
          status: u.status as WorkspaceUser["status"],
          createdAt: u.createdAt.toISOString(),
        };
      }
    } catch {
      // Fallback to memory
    }
  }

  // Memory fallback
  for (const user of memoryUsers.values()) {
    if (user.handle.toLowerCase() === key || user.id === handleOrId) {
      return user;
    }
  }
  return null;
}

export async function createUser(input: {
  handle: string;
  displayName: string;
  email?: string | null;
  passHash?: string | null;
  role?: WorkspaceUser["role"];
  welcomeXp?: number;
}): Promise<WorkspaceUser> {
  const cleanHandle = input.handle.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 40) || `user_${Date.now().toString(36)}`;
  const cleanName = input.displayName.trim().slice(0, 80) || "Anonymous Creator";
  const role = input.role || "guest";
  const welcomeXp = input.welcomeXp ?? (role === "guest" ? 25 : 50);

  const newUser: WorkspaceUser = {
    id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    handle: cleanHandle,
    displayName: cleanName,
    email: input.email || null,
    passHash: input.passHash || null,
    role,
    totalXp: welcomeXp,
    exportsCount: 0,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Try DB insert
  if (db) {
    try {
      await db.insert(workspaceUsers).values({
        id: newUser.id,
        handle: newUser.handle,
        displayName: newUser.displayName,
        email: newUser.email,
        passHash: newUser.passHash,
        role: newUser.role,
        totalXp: newUser.totalXp,
        exportsCount: newUser.exportsCount,
        status: newUser.status,
      });

      // Record welcome XP in ledger
      await db.insert(xpLedger).values({
        userHandle: newUser.handle,
        displayName: newUser.displayName,
        actionType: role === "guest" ? "guest_bonus" : "signup_bonus",
        targetSlug: "welcome",
        xpDelta: welcomeXp,
      });
    } catch {
      // DB insert failed or unique constraint violated; fallback below
    }
  }

  // Save to memory
  memoryUsers.set(newUser.handle.toLowerCase(), newUser);
  memoryXpLedger.unshift({
    id: memoryXpLedger.length + 1,
    userHandle: newUser.handle,
    displayName: newUser.displayName,
    actionType: role === "guest" ? "guest_bonus" : "signup_bonus",
    targetSlug: "welcome",
    xpDelta: welcomeXp,
    createdAt: new Date().toISOString(),
  });

  return newUser;
}

export async function updateUser(handle: string, updates: Partial<WorkspaceUser>): Promise<WorkspaceUser | null> {
  const existing = await getUser(handle);
  if (!existing) return null;

  const updated: WorkspaceUser = {
    ...existing,
    ...updates,
    handle: existing.handle, // immutable handle
  };

  if (db) {
    try {
      await db
        .update(workspaceUsers)
        .set({
          displayName: updated.displayName,
          role: updated.role,
          totalXp: updated.totalXp,
          exportsCount: updated.exportsCount,
          status: updated.status,
        })
        .where(eq(workspaceUsers.handle, existing.handle));
    } catch {
      // fallback
    }
  }

  memoryUsers.set(existing.handle.toLowerCase(), updated);
  return updated;
}

export async function listUsers(filter?: {
  role?: string;
  search?: string;
  limit?: number;
}): Promise<WorkspaceUser[]> {
  const limit = filter?.limit || 50;

  // DB path
  if (db) {
    try {
      let query = db.select().from(workspaceUsers);
      const rows = await query.orderBy(desc(workspaceUsers.totalXp)).limit(limit);
      return rows.map((u) => ({
        id: u.id,
        handle: u.handle,
        displayName: u.displayName,
        email: u.email,
        passHash: u.passHash,
        role: u.role as WorkspaceUser["role"],
        totalXp: u.totalXp,
        exportsCount: u.exportsCount,
        status: u.status as WorkspaceUser["status"],
        createdAt: u.createdAt.toISOString(),
      }));
    } catch {
      // fallback
    }
  }

  // Memory path
  let list = Array.from(memoryUsers.values());
  if (filter?.role && filter.role !== "all") {
    list = list.filter((u) => u.role === filter.role);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((u) => u.handle.includes(q) || u.displayName.toLowerCase().includes(q));
  }
  list.sort((a, b) => b.totalXp - a.totalXp);
  return list.slice(0, limit);
}

export async function deleteUser(handle: string): Promise<boolean> {
  const key = handle.toLowerCase();
  memoryUsers.delete(key);

  if (db) {
    try {
      await db.delete(workspaceUsers).where(eq(workspaceUsers.handle, handle));
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

/* =========================================================================
 * 2. GAMIFIED XP LEDGER & LEADERBOARD
 * ========================================================================= */

export async function recordXpEvent(event: {
  userHandle: string;
  displayName: string;
  actionType: string;
  targetSlug: string;
  xpDelta: number;
}): Promise<{ newTotalXp: number }> {
  let user = await getUser(event.userHandle);
  if (!user) {
    user = await createUser({
      handle: event.userHandle,
      displayName: event.displayName,
      role: "guest",
      welcomeXp: 0,
    });
  }

  const newTotalXp = Math.max(0, user.totalXp + event.xpDelta);
  const newExportsCount = event.actionType.includes("export") ? user.exportsCount + 1 : user.exportsCount;

  await updateUser(user.handle, {
    totalXp: newTotalXp,
    exportsCount: newExportsCount,
  });

  const ledgerEntry: XpLedgerItem = {
    id: memoryXpLedger.length + 1,
    userHandle: user.handle,
    displayName: user.displayName,
    actionType: event.actionType,
    targetSlug: event.targetSlug,
    xpDelta: event.xpDelta,
    createdAt: new Date().toISOString(),
  };

  memoryXpLedger.unshift(ledgerEntry);
  if (memoryXpLedger.length > 500) {
    memoryXpLedger.pop();
  }

  if (db) {
    try {
      await db.insert(xpLedger).values({
        userHandle: user.handle,
        displayName: user.displayName,
        actionType: event.actionType,
        targetSlug: event.targetSlug,
        xpDelta: event.xpDelta,
      });
    } catch {
      // fallback
    }
  }

  return { newTotalXp };
}

export async function getLeaderboard(options?: {
  type?: "all" | "members" | "guests";
  limit?: number;
}): Promise<Array<WorkspaceUser & { rank: number; tier: string }>> {
  const users = await listUsers({
    role: options?.type === "members" ? "member" : options?.type === "guests" ? "guest" : undefined,
    limit: options?.limit || 50,
  });

  return users.map((u, idx) => {
    let tier = "Novice Scout";
    if (u.totalXp >= 3000) tier = "Kernel Legend";
    else if (u.totalXp >= 1500) tier = "System Architect";
    else if (u.totalXp >= 500) tier = "Active Builder";

    return {
      ...u,
      rank: idx + 1,
      tier,
    };
  });
}

export async function getRecentXpEvents(limit = 20): Promise<XpLedgerItem[]> {
  if (db) {
    try {
      const rows = await db.select().from(xpLedger).orderBy(desc(xpLedger.id)).limit(limit);
      return rows.map((r) => ({
        id: r.id,
        userHandle: r.userHandle,
        displayName: r.displayName,
        actionType: r.actionType,
        targetSlug: r.targetSlug,
        xpDelta: r.xpDelta,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      // fallback
    }
  }
  return memoryXpLedger.slice(0, limit);
}

/* =========================================================================
 * 3. 24-HOUR EPHEMERAL SHARE ENGINE
 * ========================================================================= */

export async function createShare(share: {
  creatorName: string;
  toolSlug: string;
  title: string;
  contentType?: string;
  payloadJson: string;
  previewDataUrl?: string | null;
  pinCode?: string | null;
  maxViews?: number | null;
  durationHours?: number;
}): Promise<{ token: string; expiresAt: string }> {
  // Run auto-purge first
  await purgeExpiredShares();

  const token = generateEphemeralToken(10);
  const durationHours = share.durationHours || 24;
  const expiresAtDate = new Date(Date.now() + durationHours * 3600_000);
  const expiresAt = expiresAtDate.toISOString();

  const record: EphemeralShare = {
    token,
    creatorName: share.creatorName.trim().slice(0, 80) || "Anonymous",
    toolSlug: share.toolSlug.toLowerCase().trim(),
    title: share.title.trim().slice(0, 160) || "Shared Studio Output",
    contentType: share.contentType || "application/json",
    payloadJson: share.payloadJson,
    previewDataUrl: share.previewDataUrl || null,
    pinCode: share.pinCode || null,
    viewsCount: 0,
    maxViews: share.maxViews || null,
    expiresAt,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.insert(ephemeralShares).values({
        token: record.token,
        creatorName: record.creatorName,
        toolSlug: record.toolSlug,
        title: record.title,
        contentType: record.contentType,
        payloadJson: record.payloadJson,
        previewDataUrl: record.previewDataUrl,
        pinCode: record.pinCode,
        viewsCount: record.viewsCount,
        maxViews: record.maxViews,
        expiresAt: expiresAtDate,
      });
    } catch {
      // fallback
    }
  }

  memoryShares.set(token, record);
  return { token, expiresAt };
}

export async function getShare(token: string): Promise<EphemeralShare | null> {
  if (!token) return null;
  const cleanToken = token.trim();
  const now = new Date();

  // Try DB
  if (db) {
    try {
      const rows = await db.select().from(ephemeralShares).where(eq(ephemeralShares.token, cleanToken)).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        if (r.expiresAt <= now || (r.maxViews && r.viewsCount >= r.maxViews)) {
          // expired or reached max views -> delete and return null
          await db.delete(ephemeralShares).where(eq(ephemeralShares.token, cleanToken));
          return null;
        }

        // Increment views
        await db
          .update(ephemeralShares)
          .set({ viewsCount: r.viewsCount + 1 })
          .where(eq(ephemeralShares.token, cleanToken));

        return {
          token: r.token,
          creatorName: r.creatorName,
          toolSlug: r.toolSlug,
          title: r.title,
          contentType: r.contentType,
          payloadJson: r.payloadJson,
          previewDataUrl: r.previewDataUrl,
          pinCode: r.pinCode,
          viewsCount: r.viewsCount + 1,
          maxViews: r.maxViews,
          expiresAt: r.expiresAt.toISOString(),
          createdAt: r.createdAt.toISOString(),
        };
      }
    } catch {
      // fallback
    }
  }

  // Memory fallback
  const share = memoryShares.get(cleanToken);
  if (!share) return null;

  if (new Date(share.expiresAt) <= now || (share.maxViews && share.viewsCount >= share.maxViews)) {
    memoryShares.delete(cleanToken);
    return null;
  }

  share.viewsCount += 1;
  return share;
}

export async function listActiveShares(limit = 50): Promise<EphemeralShare[]> {
  await purgeExpiredShares();
  const now = new Date();

  if (db) {
    try {
      const rows = await db
        .select()
        .from(ephemeralShares)
        .where(sql`${ephemeralShares.expiresAt} > ${now}`)
        .orderBy(desc(ephemeralShares.createdAt))
        .limit(limit);

      return rows.map((r) => ({
        token: r.token,
        creatorName: r.creatorName,
        toolSlug: r.toolSlug,
        title: r.title,
        contentType: r.contentType,
        payloadJson: r.payloadJson,
        previewDataUrl: r.previewDataUrl,
        pinCode: r.pinCode,
        viewsCount: r.viewsCount,
        maxViews: r.maxViews,
        expiresAt: r.expiresAt.toISOString(),
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      // fallback
    }
  }

  return Array.from(memoryShares.values())
    .filter((s) => new Date(s.expiresAt) > now)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function extendShare(token: string, hours = 24): Promise<boolean> {
  const share = await getShare(token);
  if (!share) return false;

  const newExpires = new Date(Date.now() + hours * 3600_000);

  if (db) {
    try {
      await db
        .update(ephemeralShares)
        .set({ expiresAt: newExpires })
        .where(eq(ephemeralShares.token, token));
    } catch {
      // fallback
    }
  }

  share.expiresAt = newExpires.toISOString();
  memoryShares.set(token, share);
  return true;
}

export async function revokeShare(token: string): Promise<boolean> {
  memoryShares.delete(token);
  if (db) {
    try {
      await db.delete(ephemeralShares).where(eq(ephemeralShares.token, token));
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

/* =========================================================================
 * 4. SAAS TOOL PERMISSIONS MATRIX
 * ========================================================================= */

export async function getToolPermission(toolSlug: string): Promise<ToolPermission> {
  const slug = toolSlug.toLowerCase().trim();

  if (memoryPermissions.has(slug)) {
    return memoryPermissions.get(slug)!;
  }

  if (db) {
    try {
      const rows = await db.select().from(toolPermissions).where(eq(toolPermissions.toolSlug, slug)).limit(1);
      if (rows.length > 0) {
        const p = rows[0];
        const perm: ToolPermission = {
          toolSlug: p.toolSlug,
          accessMode: p.accessMode as ToolPermission["accessMode"],
          dailyLimit: p.dailyLimit,
          updatedAt: p.updatedAt.toISOString(),
        };
        memoryPermissions.set(slug, perm);
        return perm;
      }
    } catch {
      // fallback
    }
  }

  const defaultPerm: ToolPermission = {
    toolSlug: slug,
    accessMode: "gated", // default: guest or signup gate
    dailyLimit: 100,
    updatedAt: new Date().toISOString(),
  };
  memoryPermissions.set(slug, defaultPerm);
  return defaultPerm;
}

export async function setToolPermission(
  toolSlug: string,
  accessMode: ToolPermission["accessMode"],
  dailyLimit = 100
): Promise<ToolPermission> {
  const slug = toolSlug.toLowerCase().trim();
  const perm: ToolPermission = {
    toolSlug: slug,
    accessMode,
    dailyLimit,
    updatedAt: new Date().toISOString(),
  };

  memoryPermissions.set(slug, perm);

  if (db) {
    try {
      await db
        .insert(toolPermissions)
        .values({
          toolSlug: slug,
          accessMode,
          dailyLimit,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: toolPermissions.toolSlug,
          set: {
            accessMode,
            dailyLimit,
            updatedAt: new Date(),
          },
        });
    } catch {
      // fallback
    }
  }

  return perm;
}

export async function listAllToolPermissions(): Promise<Record<string, ToolPermission>> {
  const result: Record<string, ToolPermission> = {};
  for (const [slug, perm] of memoryPermissions.entries()) {
    result[slug] = perm;
  }
  return result;
}

/* =========================================================================
 * 5. SUPERADMIN METRICS & DATABASE BACKUP/RESTORE
 * ========================================================================= */

export async function getStorageStats(): Promise<{
  totalUsers: number;
  guestsCount: number;
  membersCount: number;
  totalExports: number;
  activeSharesCount: number;
  expiredSharesPurged: number;
  estimatedStorageKb: number;
  freeTierLimitKb: number;
}> {
  await purgeExpiredShares();

  const allUsers = Array.from(memoryUsers.values());
  const guests = allUsers.filter((u) => u.role === "guest").length;
  const members = allUsers.filter((u) => u.role !== "guest").length;
  const totalExports = allUsers.reduce((acc, u) => acc + (u.exportsCount || 0), 0);
  const activeShares = memoryShares.size;

  // Approximate storage math: ~1.2 KB per user, ~0.4 KB per XP entry, ~4.5 KB per share
  const estimatedStorageKb = Math.round(allUsers.length * 1.2 + memoryXpLedger.length * 0.4 + activeShares * 4.5);

  return {
    totalUsers: allUsers.length,
    guestsCount: guests,
    membersCount: members,
    totalExports,
    activeSharesCount: activeShares,
    expiredSharesPurged: memoryPurgedCount,
    estimatedStorageKb,
    freeTierLimitKb: 512_000, // 500 MB Neon free limit
  };
}

export async function exportDatabaseDump(): Promise<{
  version: string;
  exportedAt: string;
  users: WorkspaceUser[];
  xpLedger: XpLedgerItem[];
  shares: EphemeralShare[];
  permissions: Record<string, ToolPermission>;
}> {
  return {
    version: "5.2.12",
    exportedAt: new Date().toISOString(),
    users: Array.from(memoryUsers.values()),
    xpLedger: [...memoryXpLedger],
    shares: Array.from(memoryShares.values()),
    permissions: await listAllToolPermissions(),
  };
}

export async function importDatabaseDump(dump: any): Promise<boolean> {
  if (!dump || typeof dump !== "object") return false;

  if (Array.isArray(dump.users)) {
    for (const u of dump.users) {
      if (u.handle) memoryUsers.set(u.handle.toLowerCase(), u);
    }
  }

  if (Array.isArray(dump.shares)) {
    for (const s of dump.shares) {
      if (s.token) memoryShares.set(s.token, s);
    }
  }

  return true;
}
