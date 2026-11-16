import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export interface VaultStatePayload {
  version: string;
  timestamp: string;
  users: Array<{
    id: string;
    handle: string;
    displayName: string;
    role: string;
    totalXp: number;
    exportsCount: number;
    hasPassword: boolean;
    recoveryPhoneHash?: string | null;
    recoveryCityHash?: string | null;
    status: string;
    createdAt: string;
  }>;
  jobs: Array<{
    id: string;
    agentId: string;
    agentName: string;
    userHandle: string;
    status: "queued" | "running_local" | "running_github" | "completed" | "failed";
    createdAt: string;
    completedAt?: string;
    executionTimeMs?: number;
    artifactFilename?: string;
    artifactSummary?: string;
  }>;
  shares: Array<{
    token: string;
    toolSlug: string;
    title: string;
    creatorName: string;
    hasVisualPreview: boolean;
    createdAt: string;
    expiresAt: string;
    viewsCount: number;
  }>;
  superadminConfig: {
    maintenanceMode: boolean;
    autoBackupEnabled: boolean;
    lastBackupTimestamp?: string;
    activeAgentsCount: number;
  };
}

export interface EncryptedVaultEnvelope {
  format: "THE_SABBIR_OS_ENCRYPTED_VAULT_V1";
  algorithm: "AES-256-GCM";
  kdf: "PBKDF2-SHA256";
  iterations: number;
  saltHex: string;
  ivHex: string;
  tagHex: string;
  ciphertextHex: string;
  payloadSha256: string;
  encryptedAt: string;
  version: string;
}

const DEFAULT_VAULT_FALLBACK_KEY = "the-sabbir-os-zero-knowledge-vault-master-2026";
const KDF_ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits

export function getVaultMasterSecret(): string {
  return process.env.VAULT_MASTER_SECRET || DEFAULT_VAULT_FALLBACK_KEY;
}

/**
 * Derives a 256-bit AES key using PBKDF2 with SHA-256 and 100,000 iterations
 */
export function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, KDF_ITERATIONS, KEY_LEN, "sha256");
}

/**
 * Encrypts arbitrary state using AES-256-GCM with authenticated tag
 */
export function encryptState(
  payload: Record<string, unknown>,
  secret: string = getVaultMasterSecret()
): EncryptedVaultEnvelope {
  const jsonStr = JSON.stringify(payload);
  const payloadSha256 = crypto.createHash("sha256").update(jsonStr, "utf8").digest("hex");

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12); // GCM standard 96-bit IV
  const key = deriveKey(secret, salt);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(jsonStr, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    format: "THE_SABBIR_OS_ENCRYPTED_VAULT_V1",
    algorithm: "AES-256-GCM",
    kdf: "PBKDF2-SHA256",
    iterations: KDF_ITERATIONS,
    saltHex: salt.toString("hex"),
    ivHex: iv.toString("hex"),
    tagHex: tag.toString("hex"),
    ciphertextHex: encrypted.toString("hex"),
    payloadSha256,
    encryptedAt: new Date().toISOString(),
    version: "5.2.15",
  };
}

/**
 * Decrypts an EncryptedVaultEnvelope and validates GCM auth tag
 */
export function decryptState<T = VaultStatePayload>(
  envelope: EncryptedVaultEnvelope,
  secret: string = getVaultMasterSecret()
): T {
  if (envelope.format !== "THE_SABBIR_OS_ENCRYPTED_VAULT_V1") {
    throw new Error(`Unsupported vault format: ${(envelope as any).format}`);
  }

  const salt = Buffer.from(envelope.saltHex, "hex");
  const iv = Buffer.from(envelope.ivHex, "hex");
  const tag = Buffer.from(envelope.tagHex, "hex");
  const ciphertext = Buffer.from(envelope.ciphertextHex, "hex");

  const key = deriveKey(secret, salt);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const decryptedStr = decrypted.toString("utf8");

  // Verify SHA-256 hash
  const computedHash = crypto.createHash("sha256").update(decryptedStr, "utf8").digest("hex");
  if (computedHash !== envelope.payloadSha256) {
    throw new Error("Integrity verification failed: SHA-256 checksum mismatch");
  }

  return JSON.parse(decryptedStr) as T;
}

/**
 * Public Sanitization Guard:
 * Scrubs any sensitive phone numbers, raw passwords, or private data
 * before projecting public-safe statistics.
 */
export function sanitizeForPublicRepo(state: VaultStatePayload): Record<string, unknown> {
  return {
    version: state.version,
    timestamp: state.timestamp,
    totalUsersCount: state.users.length,
    usersPublicSummary: state.users.map((u) => {
      const isGuest = u.handle.startsWith("SB-") || u.id.startsWith("SB-");
      const guestKey = u.handle.startsWith("SB-") ? u.handle : u.id;
      return {
        handle: u.handle,
        displayName: u.displayName,
        role: u.role,
        totalXp: u.totalXp,
        hasPassword: u.hasPassword,
        guestIdMasked: isGuest ? `${guestKey.slice(0, 4)}***` : undefined,
      };
    }),
    totalCompletedJobs: state.jobs.filter((j) => j.status === "completed").length,
    activeSharesCount: state.shares.length,
    superadminConfig: {
      maintenanceMode: state.superadminConfig.maintenanceMode,
      activeAgentsCount: state.superadminConfig.activeAgentsCount,
    },
  };
}

/**
 * Default filesystem path for the encrypted vault file
 */
export function getVaultFilePath(): string {
  return path.resolve(process.cwd(), "data", "vault", "sabbir-os-state.vault.enc");
}

/**
 * Writes encrypted envelope to disk
 */
export function saveVaultToDisk(envelope: EncryptedVaultEnvelope, filepath: string = getVaultFilePath()): void {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, JSON.stringify(envelope, null, 2), "utf8");
}

/**
 * Reads and decrypts vault from disk if present
 */
export function loadVaultFromDisk<T = VaultStatePayload>(
  filepath: string = getVaultFilePath(),
  secret: string = getVaultMasterSecret()
): T | null {
  if (!fs.existsSync(filepath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filepath, "utf8");
    const envelope = JSON.parse(raw) as EncryptedVaultEnvelope;
    return decryptState<T>(envelope, secret);
  } catch (err) {
    console.warn("Failed to decrypt vault file:", (err as Error).message);
    return null;
  }
}
