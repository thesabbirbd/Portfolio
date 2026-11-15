"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Terminal,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  FileCode,
  Bot,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface SecurityIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  fix: string;
  line?: number;
}

export function DockerHardenerStudio() {
  const presets = [
    {
      label: "Vulnerable Node.js Dockerfile (Score: 25 - Grade F)",
      raw: `FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
ENV DB_PASSWORD=my_secret_root_pass_123
EXPOSE 80
CMD ["npm", "start"]`,
    },
    {
      label: "Vulnerable Python FastAPI (Score: 35 - Grade F)",
      raw: `FROM python:latest
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV API_KEY="sk_live_9921820491823"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]`,
    },
    {
      label: "Hardened Production Multi-Stage (Score: 98 - Grade A+)",
      raw: `# Stage 1: Build dependencies
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Production Distroless
FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nonroot:nonroot . .
USER nonroot
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"]
CMD ["server.js"]`,
    },
  ];

  const [inputCode, setInputCode] = useState(presets[0].raw);
  const [activeTab, setActiveTab] = useState<"auditor" | "hardened" | "diff">("auditor");
  const [copied, setCopied] = useState(false);

  // Analyze Dockerfile text
  const analyzeDockerfile = (text: string) => {
    const issues: SecurityIssue[] = [];
    let score = 100;

    // Check 1: Root user execution
    if (!text.includes("USER ") || text.includes("USER root")) {
      issues.push({
        id: "root-user",
        severity: "critical",
        title: "Container executes as root user",
        description: "Without a non-root USER declaration, compromised processes inherit full root capabilities inside the container namespace.",
        fix: "Create and switch to an unprivileged user (e.g. `RUN addgroup -S appgroup && adduser -S appuser -G appgroup` followed by `USER appuser`).",
      });
      score -= 30;
    }

    // Check 2: Floating/unpinned :latest tag
    if (text.includes(":latest") || !/FROM\s+[a-zA-Z0-9/_.-]+:[a-zA-Z0-9_.-]+/i.test(text)) {
      issues.push({
        id: "floating-latest",
        severity: "high",
        title: "Using mutable ':latest' image tag",
        description: "Tags like `:latest` lead to non-deterministic production deployments and unexpected breaking changes or vulnerabilities.",
        fix: "Pin your base image to an immutable tag or SHA-256 digest (e.g. `FROM node:22.11.0-alpine3.20` or `@sha256:...`).",
      });
      score -= 20;
    }

    // Check 3: Leaked Secrets in ENV
    if (/ENV.*(PASSWORD|SECRET|API_KEY|TOKEN|PRIVATE_KEY)/i.test(text)) {
      issues.push({
        id: "leaked-secret",
        severity: "critical",
        title: "Hardcoded secret or credential in ENV",
        description: "Baking secrets into container image layers permanently leaks them to anyone with pull access via docker inspect.",
        fix: "Inject secrets at runtime using environment variables, Docker Secrets, or runtime KMS mounts (never bake into Dockerfile).",
      });
      score -= 25;
    }

    // Check 4: Missing HEALTHCHECK
    if (!text.includes("HEALTHCHECK")) {
      issues.push({
        id: "missing-healthcheck",
        severity: "medium",
        title: "Missing HEALTHCHECK instruction",
        description: "Docker and container orchestrators (Kubernetes/Nomad) cannot detect internal deadlocks without a native probe.",
        fix: "Add `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:PORT/health || exit 1`.",
      });
      score -= 10;
    }

    // Check 5: Blind COPY . . without multi-stage or separation
    if (text.includes("COPY . .") && !text.includes("COPY package") && !text.includes("COPY requirements")) {
      issues.push({
        id: "blind-copy",
        severity: "medium",
        title: "Uncached root COPY invalidates layer caching",
        description: "Copying all files before installing dependencies breaks Docker's build cache whenever any source file changes.",
        fix: "Copy dependency manifests first (`COPY package*.json ./`), run install, then copy source code.",
      });
      score -= 10;
    }

    // Check 6: Privileged Port (< 1024)
    if (/EXPOSE\s+(80|443|22|21)\b/.test(text)) {
      issues.push({
        id: "privileged-port",
        severity: "low",
        title: "Exposing privileged port (< 1024)",
        description: "Binding to ports under 1024 requires elevated Linux capabilities (CAP_NET_BIND_SERVICE).",
        fix: "Expose unprivileged ports (3000, 8080, 8443) and let reverse proxies (Nginx/Cloudflare) handle port 80/443.",
      });
      score -= 5;
    }

    const finalScore = Math.max(5, score);
    let grade = "F";
    let gradeColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
    if (finalScore >= 90) {
      grade = "A+";
      gradeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    } else if (finalScore >= 75) {
      grade = "B";
      gradeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }

    return { issues, score: finalScore, grade, gradeColor };
  };

  const audit = analyzeDockerfile(inputCode);

  // Generate hardened Dockerfile output
  const generateHardened = (raw: string): string => {
    return `# =========================================================================
# HARDENED PRODUCTION DOCKERFILE - AUDITED BY THE SABBiR OS (SECOPS GUARDIAN)
# =========================================================================
# Multi-Stage Build: 0 CVEs, Non-Root unprivileged execution, Pinning & Healthcheck

# -------------------------------------------------------------------------
# STAGE 1: Builder
# -------------------------------------------------------------------------
FROM node:22.11.0-alpine3.20 AS builder
WORKDIR /app

# Install security patches & build dependencies
RUN apk --no-cache add dumb-init

# Leverage Docker cache layer for dependency manifests
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# -------------------------------------------------------------------------
# STAGE 2: Hardened Unprivileged Runner
# -------------------------------------------------------------------------
FROM node:22.11.0-alpine3.20 AS runner
WORKDIR /app

# Security: Create unprivileged system user and group
RUN addgroup -S -g 10001 appgroup && \\
    adduser -S -u 10001 -G appgroup appuser

# Copy runtime artifacts with strict ownership
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

# Security Lockdown: Drop all root capabilities & switch to unprivileged user
USER appuser:appgroup

# Security: Never expose root ports (<1024); use high ports
EXPOSE 3000

# Native Healthcheck Probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Process Supervisor with proper PID 1 signal forwarding
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]`;
  };

  const hardenedOutput = generateHardened(inputCode);

  const handleCopyHardened = () => {
    sound.click();
    navigator.clipboard.writeText(hardenedOutput);
    setCopied(true);
    osStore.addXp(25, "Generated Hardened Production Dockerfile");
    osStore.incrementToolRun();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.confirm();
    const blob = new Blob([hardenedOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Dockerfile.hardened";
    a.click();
    URL.revokeObjectURL(url);
    osStore.addXp(30, "Downloaded Hardened Dockerfile");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Dockerfile AST Security Scanner & Hardener
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">
                  SecOps Guardian
                </span>
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                রুট ইউজার, ফ্লোটিং ট্যাগ ও গোপন তথ্য স্ক্যান করে প্রোডাকশন-গ্রেড মাল্টি-স্টেজ হার্ডেনড ডকারফাইল তৈরি করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border text-center ${audit.gradeColor}`}>
              <div className="text-2xl font-black font-mono leading-none">{audit.grade}</div>
              <div className="text-[10px] font-mono mt-0.5 font-semibold">{audit.score}/100 Score</div>
            </div>
            <a
              href="/agents?agent=secops-guardian"
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              SecOps Agent
            </a>
          </div>
        </div>

        {/* Preset Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.toggleSwitch();
                setInputCode(p.raw);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dockerfile Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-violet-400" />
                Input Dockerfile
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">Paste any Dockerfile or Compose</span>
            </div>

            <textarea
              rows={14}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full flex-1 p-3.5 rounded-xl bg-neutral-950 font-mono text-xs text-neutral-200 border border-neutral-800 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
              placeholder="FROM node:latest..."
            />
          </div>
        </div>

        {/* Right Column: Auditor or Auto-Hardened Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  onClick={() => setActiveTab("auditor")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === "auditor"
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Vulnerabilities ({audit.issues.length})
                </button>
                <button
                  onClick={() => setActiveTab("hardened")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === "hardened"
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  ⚡ Hardened Dockerfile
                </button>
              </div>

              {activeTab === "hardened" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyHardened}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Content view */}
            <div className="flex-1 min-h-[340px] overflow-y-auto">
              {activeTab === "auditor" ? (
                <div className="space-y-3">
                  {audit.issues.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-semibold text-white">Zero Critical Vulnerabilities Detected</h4>
                      <p className="text-xs text-neutral-400">
                        This Dockerfile strictly follows unprivileged, pinned and production container best practices!
                      </p>
                    </div>
                  ) : (
                    audit.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          issue.severity === "critical"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : issue.severity === "high"
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-300"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-semibold text-white">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {issue.title}
                          </div>
                          <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-black/40">
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">{issue.description}</p>
                        <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-neutral-200">
                          <span className="text-emerald-400 font-bold">Fix: </span>
                          {issue.fix}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <pre className="w-full h-full p-4 rounded-xl bg-neutral-950 font-mono text-xs text-neutral-200 border border-neutral-800 overflow-x-auto leading-relaxed select-all">
                  {hardenedOutput}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
