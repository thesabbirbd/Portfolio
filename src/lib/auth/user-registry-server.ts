import crypto from "node:crypto";
import { loadVaultFromDisk, saveVaultToDisk, encryptState, VaultStatePayload } from "../security/encrypted-public-vault";

export interface ServerUserRecord {
  id: string;
  handle: string;
  displayName: string;
  email?: string | null;
  passHash?: string | null;
  role: "guest" | "member" | "pro" | "superadmin";
  totalXp: number;
  exportsCount: number;
  hasPassword: boolean;
  recoveryPhoneHash?: string | null;
  recoveryCityHash?: string | null;
  status: "active" | "banned";
  createdAt: string;
}

// In-memory registry cache
const usersMap = new Map<string, ServerUserRecord>();

function seedDefaultUsers() {
  if (usersMap.size > 0) return;

  // Try loading from vault
  const vault = loadVaultFromDisk();
  if (vault && Array.isArray(vault.users)) {
    for (const u of vault.users) {
      const record = u as ServerUserRecord;
      if (!record.passHash && record.handle === "thesabbirbd") {
        record.passHash = crypto.createHash("sha256").update("sabbir2026").digest("hex");
      }
      usersMap.set(u.handle.toLowerCase(), record);
    }
  }

  // Ensure default superadmin & sample accounts exist
  if (!usersMap.has("thesabbirbd")) {
    usersMap.set("thesabbirbd", {
      id: "usr-admin-sabbir",
      handle: "thesabbirbd",
      displayName: "Md Sabbirul Islam Khan",
      email: "thesabbir.bd@gmail.com",
      role: "superadmin",
      totalXp: 3500,
      exportsCount: 142,
      hasPassword: true,
      passHash: crypto.createHash("sha256").update("sabbir2026").digest("hex"),
      recoveryPhoneHash: crypto.createHash("sha256").update("01700000000").digest("hex"),
      recoveryCityHash: crypto.createHash("sha256").update("rajshahi").digest("hex"),
      status: "active",
      createdAt: "2026-10-15T00:00:00.000Z",
    });
  }

  // Blank-password sample user
  if (!usersMap.has("tanvir_dev")) {
    usersMap.set("tanvir_dev", {
      id: "usr-mem-tanvir",
      handle: "tanvir_dev",
      displayName: "Tanvir Ahmed",
      role: "pro",
      totalXp: 1850,
      exportsCount: 64,
      hasPassword: false, // Blank password user!
      status: "active",
      createdAt: "2026-11-01T00:00:00.000Z",
    });
  }

  // Blank-password sample guest
  if (!usersMap.has("sb-4829")) {
    usersMap.set("sb-4829", {
      id: "usr-guest-4829",
      handle: "SB-4829",
      displayName: "Guest Engineer",
      role: "guest",
      totalXp: 125,
      exportsCount: 5,
      hasPassword: false,
      status: "active",
      createdAt: "2026-11-15T00:00:00.000Z",
    });
  }
}

seedDefaultUsers();

export function findUserByIdentifier(identifier: string): ServerUserRecord | null {
  seedDefaultUsers();
  const key = identifier.toLowerCase().trim();
  for (const user of usersMap.values()) {
    if (
      user.handle.toLowerCase() === key ||
      user.id.toLowerCase() === key ||
      (user.email && user.email.toLowerCase() === key)
    ) {
      return user;
    }
  }
  return null;
}

export function registerOrUpdateUser(data: Partial<ServerUserRecord> & { handle: string }): ServerUserRecord {
  seedDefaultUsers();
  const key = data.handle.toLowerCase().trim();
  const existing = usersMap.get(key);

  const timestamp = new Date().toISOString();
  const user: ServerUserRecord = {
    id: existing?.id || (data.handle.startsWith("SB-") ? data.handle : `usr-${Date.now()}`),
    handle: data.handle,
    displayName: data.displayName || existing?.displayName || data.handle,
    email: data.email ?? existing?.email,
    passHash: data.passHash !== undefined ? data.passHash : existing?.passHash,
    role: data.role || existing?.role || "guest",
    totalXp: existing ? existing.totalXp + (data.totalXp || 0) : data.totalXp || 50,
    exportsCount: existing ? existing.exportsCount + (data.exportsCount || 0) : data.exportsCount || 0,
    hasPassword: data.hasPassword !== undefined ? data.hasPassword : existing?.hasPassword || false,
    recoveryPhoneHash: data.recoveryPhoneHash ?? existing?.recoveryPhoneHash,
    recoveryCityHash: data.recoveryCityHash ?? existing?.recoveryCityHash,
    status: existing?.status || "active",
    createdAt: existing?.createdAt || timestamp,
  };

  usersMap.set(key, user);
  return user;
}

export function verifyPasswordHash(password: string, storedHash?: string | null): boolean {
  if (!storedHash) return false;
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  return hash === storedHash;
}

export function hashRecoveryField(val: string): string {
  return crypto.createHash("sha256").update(val.toLowerCase().trim()).digest("hex");
}

export function getAllUsers(): ServerUserRecord[] {
  seedDefaultUsers();
  return Array.from(usersMap.values());
}
