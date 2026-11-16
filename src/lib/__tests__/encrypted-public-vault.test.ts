import { describe, it, expect } from "vitest";
import {
  encryptState,
  decryptState,
  sanitizeForPublicRepo,
  VaultStatePayload,
} from "../security/encrypted-public-vault";

describe("Zero-Knowledge Encrypted Public Vault", () => {
  const sampleState: VaultStatePayload = {
    version: "5.2.15",
    timestamp: "2026-11-16T12:00:00.000Z",
    users: [
      {
        id: "usr-admin-sabbir",
        handle: "thesabbirbd",
        displayName: "Md Sabbirul Islam Khan",
        role: "superadmin",
        totalXp: 3500,
        exportsCount: 142,
        hasPassword: true,
        recoveryPhoneHash: "a3f5...",
        recoveryCityHash: "b8c2...",
        status: "active",
        createdAt: "2026-10-15T00:00:00.000Z",
      },
      {
        id: "usr-guest-4829",
        handle: "SB-4829",
        displayName: "Guest User",
        role: "guest",
        totalXp: 50,
        exportsCount: 2,
        hasPassword: false,
        status: "active",
        createdAt: "2026-11-16T12:00:00.000Z",
      },
    ],
    jobs: [
      {
        id: "JOB-9999",
        agentId: "image-converter-agent",
        agentName: "OmniFormat Image Converter",
        userHandle: "thesabbirbd",
        status: "completed",
        createdAt: "2026-11-16T12:00:00.000Z",
        completedAt: "2026-11-16T12:01:00.000Z",
        executionTimeMs: 450,
        artifactFilename: "test.zip",
        artifactSummary: "Bundle completed",
      },
    ],
    shares: [],
    superadminConfig: {
      maintenanceMode: false,
      autoBackupEnabled: true,
      lastBackupTimestamp: "2026-11-16T12:00:00.000Z",
      activeAgentsCount: 30,
    },
  };

  it("encrypts state with AES-256-GCM and decrypts back to exact structure", () => {
    const secret = "test-super-secret-key-123456789";
    const envelope = encryptState(sampleState as any, secret);

    expect(envelope.algorithm).toBe("AES-256-GCM");
    expect(envelope.kdf).toBe("PBKDF2-SHA256");
    expect(envelope.iterations).toBe(100000);
    expect(envelope.ciphertextHex).toBeTruthy();
    expect(envelope.tagHex).toBeTruthy();
    expect(envelope.saltHex).toBeTruthy();

    const decrypted = decryptState<VaultStatePayload>(envelope, secret);
    expect(decrypted.version).toBe("5.2.15");
    expect(decrypted.users.length).toBe(2);
    expect(decrypted.users[0].handle).toBe("thesabbirbd");
    expect(decrypted.jobs[0].id).toBe("JOB-9999");
  });

  it("fails decryption when an invalid key is provided", () => {
    const correctSecret = "correct-secret-password";
    const wrongSecret = "wrong-secret-password";
    const envelope = encryptState(sampleState as any, correctSecret);

    expect(() => {
      decryptState(envelope, wrongSecret);
    }).toThrow();
  });

  it("detects cryptographic tampering and rejects corrupted ciphertext", () => {
    const secret = "tamper-test-secret";
    const envelope = encryptState(sampleState as any, secret);

    // Tamper with the ciphertext by flipping characters in hex
    const originalCiphertext = envelope.ciphertextHex;
    const tamperedCiphertext =
      (originalCiphertext[0] === "a" ? "b" : "a") + originalCiphertext.slice(1);

    const tamperedEnvelope = {
      ...envelope,
      ciphertextHex: tamperedCiphertext,
    };

    expect(() => {
      decryptState(tamperedEnvelope, secret);
    }).toThrow();
  });

  it("sanitizes state for public repo projection without leaking private data", () => {
    const sanitized = sanitizeForPublicRepo(sampleState);
    expect(sanitized.totalUsersCount).toBe(2);
    expect(sanitized.totalCompletedJobs).toBe(1);

    const usersSummary = sanitized.usersPublicSummary as any[];
    expect(usersSummary[0].recoveryPhoneHash).toBeUndefined();
    expect(usersSummary[0].recoveryCityHash).toBeUndefined();
    expect(usersSummary[1].guestIdMasked).toBe("SB-4***");
  });
});
