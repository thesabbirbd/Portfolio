"use client";

import React, { useState, useMemo, useEffect } from "react";
import { StudioWorkspaceShell } from "@/components/tools/StudioWorkspaceShell";
import {
  generateDicewarePassphrase,
  analyzePasswordEntropy,
  computeHash,
  sealSecretNote,
  unsealSecretNote,
} from "@/lib/security/crypto-vault-engine";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  FileCheck2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";

type VaultTab = "passphrase" | "vault" | "hasher";

export function PasswordVaultHashStudio() {
  const [activeTab, setActiveTab] = useState<VaultTab>("passphrase");

  // Diceware state
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [passphrase, setPassphrase] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Manual password strength input
  const [customPassword, setCustomPassword] = useState("");
  const [showCustomPass, setShowCustomPass] = useState(false);

  // Vault Seal / Unseal state
  const [vaultMode, setVaultMode] = useState<"seal" | "unseal">("seal");
  const [notePlaintext, setNotePlaintext] = useState("");
  const [vaultPassphrase, setVaultPassphrase] = useState("");
  const [sealedOutput, setSealedOutput] = useState("");
  const [unsealInput, setUnsealInput] = useState("");
  const [unsealedPlaintext, setUnsealedPlaintext] = useState("");
  const [vaultError, setVaultError] = useState("");
  const [isProcessingVault, setIsProcessingVault] = useState(false);

  // Hash state
  const [hashInputText, setHashInputText] = useState("The quick brown fox jumps over the lazy dog");
  const [hashAlgo, setHashAlgo] = useState<"SHA-256" | "SHA-512">("SHA-256");
  const [computedTextHash, setComputedTextHash] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [compareHash, setCompareHash] = useState("");

  // Initialize passphrase on client mount
  useEffect(() => {
    handleRegenerate();
  }, [wordCount, separator, capitalize, includeNumber]);

  // Compute text hash when input or algo changes
  useEffect(() => {
    computeHash(hashInputText, hashAlgo).then(setComputedTextHash);
  }, [hashInputText, hashAlgo]);

  const handleRegenerate = () => {
    const generated = generateDicewarePassphrase({
      wordCount,
      separator,
      capitalize,
      includeNumber,
    });
    setPassphrase(generated);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  const activePassphraseToAnalyze = customPassword.trim() || passphrase;
  const entropy = useMemo(() => {
    return analyzePasswordEntropy(activePassphraseToAnalyze);
  }, [activePassphraseToAnalyze]);

  const handleSeal = async () => {
    setVaultError("");
    if (!notePlaintext.trim()) {
      setVaultError("Please enter secret note text to encrypt");
      return;
    }
    if (!vaultPassphrase.trim()) {
      setVaultError("Please provide a strong encryption passphrase");
      return;
    }

    setIsProcessingVault(true);
    try {
      const sealed = await sealSecretNote(notePlaintext, vaultPassphrase);
      setSealedOutput(sealed);
    } catch (e: any) {
      setVaultError(e.message || "Encryption failed");
    } finally {
      setIsProcessingVault(false);
    }
  };

  const handleUnseal = async () => {
    setVaultError("");
    if (!unsealInput.trim()) {
      setVaultError("Please paste the sealed Base64 vault string");
      return;
    }
    if (!vaultPassphrase.trim()) {
      setVaultError("Please enter the decryption passphrase");
      return;
    }

    setIsProcessingVault(true);
    try {
      const plain = await unsealSecretNote(unsealInput, vaultPassphrase);
      setUnsealedPlaintext(plain);
    } catch (e: any) {
      setVaultError(e.message || "Failed to decrypt. Verify your passphrase.");
    } finally {
      setIsProcessingVault(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileHash("Calculating SHA-256...");

    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      if (typeof window !== "undefined" && window.crypto?.subtle) {
        const hashBuf = await window.crypto.subtle.digest("SHA-256", buffer);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        const hex = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
        setFileHash(hex);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const isHashMatched = useMemo(() => {
    if (!compareHash.trim()) return null;
    const target = fileHash || computedTextHash;
    return target.toLowerCase() === compareHash.trim().toLowerCase();
  }, [compareHash, fileHash, computedTextHash]);

  return (
    <StudioWorkspaceShell
      title="Crypto Vault, Passphrase & SHA-256 Studio"
      badge="Studio #45"
      category="Security & Privacy"
      description="Zero-knowledge, 100% in-browser Diceware passphrase generator, Shannon entropy crack-time calculator, AES-256-GCM secret note seal/unseal, and SHA-256 file checksum verifier."
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border/50 bg-card/40 p-1.5 rounded-xl gap-1 max-w-xl">
          <button
            onClick={() => setActiveTab("passphrase")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "passphrase"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Passphrase & Entropy</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "vault"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>AES-256 Secret Vault</span>
          </button>

          <button
            onClick={() => setActiveTab("hasher")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "hasher"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>SHA-256 Checksum</span>
          </button>
        </div>

        {/* TAB 1: Passphrase & Strength */}
        {activeTab === "passphrase" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    Diceware Passphrase Generator
                  </h3>
                  <button
                    onClick={handleRegenerate}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                </div>

                {/* Generated Result Box */}
                <div className="p-4 rounded-xl bg-background border border-border/80 flex items-center justify-between gap-3">
                  <span className="font-mono text-base sm:text-lg font-bold text-foreground break-all select-all">
                    {passphrase}
                  </span>
                  <button
                    onClick={() => copyToClipboard(passphrase, "passphrase")}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow"
                  >
                    {copiedKey === "passphrase" ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Generator Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Word Count ({wordCount} words)
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={6}
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Word Separator
                    </label>
                    <select
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="w-full p-2 rounded-lg bg-background border border-border text-xs"
                    >
                      <option value="-">Hyphen (-)</option>
                      <option value=".">Period (.)</option>
                      <option value="_">Underscore (_)</option>
                      <option value=" ">Space ( )</option>
                      <option value="">None</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="cap"
                      checked={capitalize}
                      onChange={(e) => setCapitalize(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <label htmlFor="cap" className="text-xs font-medium cursor-pointer">
                      Capitalize Each Word
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="num"
                      checked={includeNumber}
                      onChange={(e) => setIncludeNumber(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <label htmlFor="num" className="text-xs font-medium cursor-pointer">
                      Append 3-Digit Number
                    </label>
                  </div>
                </div>
              </div>

              {/* Custom Password Strength Auditor */}
              <div className="p-5 rounded-2xl border border-border bg-card/40 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Or Test Your Own Password / Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showCustomPass ? "text" : "password"}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Type or paste any password to audit bit entropy..."
                    className="w-full p-3 pr-10 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomPass(!showCustomPass)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showCustomPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Entropy & Crack-Time Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Entropy Security Score
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      entropy.score >= 4
                        ? "bg-emerald-500/10 text-emerald-500"
                        : entropy.score >= 3
                        ? "bg-blue-500/10 text-blue-500"
                        : entropy.score >= 2
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {entropy.strengthLabel}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Shannon Bit Entropy</span>
                    <span className="font-mono font-bold">{entropy.entropyBits} bits</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        entropy.score >= 4
                          ? "bg-emerald-500 w-full"
                          : entropy.score >= 3
                          ? "bg-blue-500 w-3/4"
                          : entropy.score >= 2
                          ? "bg-amber-500 w-1/2"
                          : "bg-red-500 w-1/4"
                      }`}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    Estimated Brute-Force Crack Time (10 Billion guesses/sec)
                  </span>
                  <p className="text-base font-bold text-foreground">{entropy.crackTimeDisplay}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-lg border text-center ${
                      entropy.hasLower ? "border-emerald-500/40 text-emerald-500" : "border-border text-muted-foreground/50"
                    }`}
                  >
                    Lowercase a-z
                  </div>
                  <div
                    className={`p-2 rounded-lg border text-center ${
                      entropy.hasUpper ? "border-emerald-500/40 text-emerald-500" : "border-border text-muted-foreground/50"
                    }`}
                  >
                    Uppercase A-Z
                  </div>
                  <div
                    className={`p-2 rounded-lg border text-center ${
                      entropy.hasDigit ? "border-emerald-500/40 text-emerald-500" : "border-border text-muted-foreground/50"
                    }`}
                  >
                    Numbers 0-9
                  </div>
                  <div
                    className={`p-2 rounded-lg border text-center ${
                      entropy.hasSpecial ? "border-emerald-500/40 text-emerald-500" : "border-border text-muted-foreground/50"
                    }`}
                  >
                    Symbols & Separators
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AES-256 Secret Vault */}
        {activeTab === "vault" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-xl bg-card border border-border">
                <button
                  onClick={() => setVaultMode("seal")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    vaultMode === "seal"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Seal Secret Note (Encrypt)
                </button>
                <button
                  onClick={() => setVaultMode("unseal")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    vaultMode === "unseal"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" /> Unseal Secret Note (Decrypt)
                </button>
              </div>
            </div>

            {vaultError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{vaultError}</span>
              </div>
            )}

            {vaultMode === "seal" ? (
              <div className="p-5 rounded-2xl border border-border bg-card/50 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Confidential Plaintext Note
                  </label>
                  <textarea
                    value={notePlaintext}
                    onChange={(e) => setNotePlaintext(e.target.value)}
                    placeholder="Enter confidential passwords, recovery phrases, or private notes..."
                    rows={4}
                    className="w-full p-3 rounded-xl bg-background border border-border text-sm font-mono outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Master Passphrase (PBKDF2 100k rounds)
                  </label>
                  <input
                    type="password"
                    value={vaultPassphrase}
                    onChange={(e) => setVaultPassphrase(e.target.value)}
                    placeholder="Secret passphrase to protect this note..."
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-sm font-mono"
                  />
                </div>

                <button
                  onClick={handleSeal}
                  disabled={isProcessingVault}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 shadow"
                >
                  <Lock className="w-4 h-4" /> Seal & Generate AES-256-GCM Package
                </button>

                {sealedOutput && (
                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        Sealed Base64 Package (Safe to store or send)
                      </span>
                      <button
                        onClick={() => copyToClipboard(sealedOutput, "sealed")}
                        className="px-2.5 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-medium flex items-center gap-1"
                      >
                        {copiedKey === "sealed" ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-2.5 bg-muted/40 rounded-lg text-xs font-mono break-all whitespace-pre-wrap select-all">
                      {sealedOutput}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl border border-border bg-card/50 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Paste Sealed Base64 Package
                  </label>
                  <textarea
                    value={unsealInput}
                    onChange={(e) => setUnsealInput(e.target.value)}
                    placeholder="Paste the Base64 JSON package..."
                    rows={4}
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs font-mono outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Master Passphrase
                  </label>
                  <input
                    type="password"
                    value={vaultPassphrase}
                    onChange={(e) => setVaultPassphrase(e.target.value)}
                    placeholder="Enter the passphrase used during sealing..."
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-sm font-mono"
                  />
                </div>

                <button
                  onClick={handleUnseal}
                  disabled={isProcessingVault}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 shadow"
                >
                  <Unlock className="w-4 h-4" /> Unseal & Reveal Note
                </button>

                {unsealedPlaintext && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                      Decrypted Secret Note
                    </span>
                    <pre className="p-3 bg-background rounded-lg text-sm font-mono whitespace-pre-wrap select-all">
                      {unsealedPlaintext}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHA-256 Checksum */}
        {activeTab === "hasher" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Text & String Checksum</h3>
                  <select
                    value={hashAlgo}
                    onChange={(e) => setHashAlgo(e.target.value as any)}
                    className="p-1.5 rounded-lg bg-background border border-border text-xs font-medium"
                  >
                    <option value="SHA-256">SHA-256</option>
                    <option value="SHA-512">SHA-512</option>
                  </select>
                </div>

                <textarea
                  value={hashInputText}
                  onChange={(e) => setHashInputText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                />

                <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                      {hashAlgo} Hex Digest
                    </span>
                    <button
                      onClick={() => copyToClipboard(computedTextHash, "text-hash")}
                      className="text-xs text-primary font-medium flex items-center gap-1"
                    >
                      {copiedKey === "text-hash" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-xs break-all select-all font-semibold text-foreground">
                    {computedTextHash}
                  </p>
                </div>
              </div>

              {/* Local File Hash Dropzone */}
              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-3">
                <h3 className="text-sm font-semibold">Local File SHA-256 Checksum</h3>
                <p className="text-xs text-muted-foreground">
                  Verify file integrity 100% locally in your browser without uploading to any server.
                </p>

                <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">
                    {fileName ? fileName : "Click to select a file"}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-1">
                    Calculated in chunks via WebCrypto API
                  </span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                {fileHash && (
                  <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                      File SHA-256 Digest
                    </span>
                    <p className="font-mono text-xs break-all select-all font-semibold text-foreground">
                      {fileHash}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Hash Comparison / Integrity Verification */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Verify Hash Match
                </h3>
                <p className="text-xs text-muted-foreground">
                  Paste the author or release checksum to verify if your text or file matches byte-for-byte.
                </p>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Expected Hash (from GitHub / official site)
                  </label>
                  <input
                    type="text"
                    value={compareHash}
                    onChange={(e) => setCompareHash(e.target.value)}
                    placeholder="Paste expected SHA-256 hash here..."
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                  />
                </div>

                {isHashMatched !== null && (
                  <div
                    className={`p-4 rounded-xl border flex items-center gap-3 ${
                      isHashMatched
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isHashMatched ? (
                      <>
                        <ShieldCheck className="w-6 h-6 shrink-0" />
                        <div>
                          <p className="text-sm font-bold">Checksums Match!</p>
                          <p className="text-xs opacity-90">
                            The file or text is identical and untampered.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <div>
                          <p className="text-sm font-bold">Checksum Mismatch!</p>
                          <p className="text-xs opacity-90">
                            The hash does not match. The file may be altered or corrupted.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudioWorkspaceShell>
  );
}
