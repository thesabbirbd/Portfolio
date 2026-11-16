import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  getVaultFilePath,
  loadVaultFromDisk,
  encryptState,
  decryptState,
  saveVaultToDisk,
  getVaultMasterSecret,
  EncryptedVaultEnvelope,
  VaultStatePayload,
} from "@/lib/security/encrypted-public-vault";

const VAULT_DIR = path.resolve(process.cwd(), "data", "vault");
const BACKUP_LOG = path.join(VAULT_DIR, "backup-history.json");

const GOOGLE_APPS_SCRIPT_TEMPLATE = `
/**
 * THE SABBiR OS // Google Apps Script Receiver
 * Paste this into Google Apps Script (script.google.com) and deploy as Web App.
 * Set access to: "Anyone, even anonymous".
 * Add the generated Web App URL to GitHub Secrets as: GOOGLE_DRIVE_BACKUP_WEBHOOK_URL
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var folderName = "THE_SABBIR_OS_BACKUPS";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var file = folder.createFile(data.filename || "sabbir-os-backup.vault.enc", JSON.stringify(data.encryptedEnvelope), MimeType.PLAIN_TEXT);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", fileId: file.getId() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();

export async function GET(req: NextRequest) {
  const vaultPath = getVaultFilePath();
  const exists = fs.existsSync(vaultPath);

  let meta: any = {
    exists,
    vaultPath: "data/vault/sabbir-os-state.vault.enc",
    algorithm: "AES-256-GCM",
    kdf: "PBKDF2-SHA256 (100,000 iterations)",
    lastBackupTimestamp: null,
    fileSizeBytes: 0,
    payloadSha256: null,
    googleScriptTemplate: GOOGLE_APPS_SCRIPT_TEMPLATE,
    history: [],
  };

  if (exists) {
    try {
      const stats = fs.statSync(vaultPath);
      const raw = fs.readFileSync(vaultPath, "utf8");
      const envelope = JSON.parse(raw) as EncryptedVaultEnvelope;
      meta.fileSizeBytes = stats.size;
      meta.lastBackupTimestamp = envelope.encryptedAt;
      meta.payloadSha256 = envelope.payloadSha256;
      meta.version = envelope.version;
    } catch (err) {
      meta.readError = (err as Error).message;
    }
  }

  if (fs.existsSync(BACKUP_LOG)) {
    try {
      meta.history = JSON.parse(fs.readFileSync(BACKUP_LOG, "utf8")).slice(0, 10);
    } catch {}
  }

  return NextResponse.json({ ok: true, vault: meta });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, secret = getVaultMasterSecret(), envelope: customEnvelope } = body;

    if (action === "backup_now") {
      // Trigger instant backup
      const currentTimestamp = new Date().toISOString();
      const currentVaultState: VaultStatePayload = loadVaultFromDisk() || {
        version: "5.2.15",
        timestamp: currentTimestamp,
        users: [
          {
            id: "usr-admin-sabbir",
            handle: "thesabbirbd",
            displayName: "Md Sabbirul Islam Khan",
            role: "superadmin",
            totalXp: 3500,
            exportsCount: 142,
            hasPassword: true,
            status: "active",
            createdAt: currentTimestamp,
          },
        ],
        jobs: [],
        shares: [],
        superadminConfig: {
          maintenanceMode: false,
          autoBackupEnabled: true,
          lastBackupTimestamp: currentTimestamp,
          activeAgentsCount: 30,
        },
      };

      currentVaultState.timestamp = currentTimestamp;
      currentVaultState.superadminConfig.lastBackupTimestamp = currentTimestamp;

      const newEnvelope = encryptState(currentVaultState as any, secret);
      saveVaultToDisk(newEnvelope);

      return NextResponse.json({
        ok: true,
        message: "Encrypted backup successfully executed and stored on disk.",
        encryptedAt: newEnvelope.encryptedAt,
        sha256: newEnvelope.payloadSha256,
      });
    }

    if (action === "decrypt_preview") {
      const envelope = customEnvelope || JSON.parse(fs.readFileSync(getVaultFilePath(), "utf8"));
      const decrypted = decryptState<VaultStatePayload>(envelope, secret);
      return NextResponse.json({
        ok: true,
        state: decrypted,
      });
    }

    if (action === "restore_vault") {
      if (!customEnvelope) {
        return NextResponse.json({ ok: false, error: "Missing envelope payload for restore" }, { status: 400 });
      }
      // Validate by attempting decryption
      const state = decryptState<VaultStatePayload>(customEnvelope, secret);
      saveVaultToDisk(customEnvelope);

      return NextResponse.json({
        ok: true,
        message: "Vault state successfully verified, decrypted and restored.",
        restoredUsersCount: state.users.length,
        timestamp: state.timestamp,
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
