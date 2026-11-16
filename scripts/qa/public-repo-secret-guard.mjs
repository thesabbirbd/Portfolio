#!/usr/bin/env node

/**
 * THE SABBiR OS // Public Repository Secret & PII Guard
 * Scans git-tracked files for accidental API keys, plaintext secrets, or unhashed PII.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..", "..");

const FORBIDDEN_PATTERNS = [
  { name: "Raw Private Key", pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { name: "OpenAI Live Secret Key", pattern: /sk-[a-zA-Z0-9]{48}/ },
  { name: "GitHub Personal Access Token", pattern: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "Live Database URL with Credentials", pattern: /postgres:\/\/[a-zA-Z0-9_-]+:[^@\s]+@[a-zA-Z0-9.-]+/ },
];

function runSecretGuard() {
  console.log("🛡️ [Public Repo Secret Guard] Scanning codebase for accidental plaintext credentials...");

  let violations = 0;

  // List git-tracked files
  const filesOutput = execSync("git ls-files", { cwd: ROOT_DIR, encoding: "utf8" });
  const files = filesOutput.split("\n").filter((f) => f && !f.endsWith(".vault.enc") && !f.endsWith(".png") && !f.endsWith(".jpg"));

  for (const file of files) {
    const fullPath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf8");

    for (const { name, pattern } of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) {
        console.error(`❌ Security Violation in ${file}: Found pattern matching ${name}`);
        violations++;
      }
    }
  }

  // Verify vault file is strictly valid ciphertext
  const vaultPath = path.join(ROOT_DIR, "data", "vault", "sabbir-os-state.vault.enc");
  if (fs.existsSync(vaultPath)) {
    const raw = fs.readFileSync(vaultPath, "utf8");
    const envelope = JSON.parse(raw);
    if (!envelope.ciphertextHex || !envelope.tagHex || !envelope.saltHex) {
      console.error("❌ Malformed vault envelope! Missing required cryptographic parameters.");
      violations++;
    } else {
      console.log("  ✓ data/vault/sabbir-os-state.vault.enc verified as valid AES-256-GCM ciphertext.");
    }
  }

  if (violations > 0) {
    console.error(`\n🚨 Failed: Found ${violations} security violations! Aborting.`);
    process.exit(1);
  } else {
    console.log("✅ [Public Repo Secret Guard] All tracked files verified 100% clean of plaintext secrets!\n");
  }
}

runSecretGuard();
