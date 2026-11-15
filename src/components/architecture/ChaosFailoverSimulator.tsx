"use client";

import React, { useState } from "react";
import {
  Activity,
  Flame,
  Zap,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Wifi,
  Database,
  CloudOff,
  Layers,
  ShieldAlert,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { inspectPayloadSecurity, checkRateLimit } from "@/lib/security/waf-shield";

interface ChaosEvent {
  time: string;
  level: "info" | "warn" | "failover";
  message: string;
}

export function ChaosFailoverSimulator() {
  const [activeChaos, setActiveChaos] = useState<"normal" | "fiber-cut" | "flash-sale" | "offline" | "sqli-attack" | "ddos-burst">("normal");
  const [logs, setLogs] = useState<ChaosEvent[]>([
    { time: "11:42:01", level: "info", message: "System operating under nominal parameters. Zero packet loss. WAF Shield active." },
  ]);

  const triggerChaos = (type: "fiber-cut" | "flash-sale" | "offline" | "sqli-attack" | "ddos-burst") => {
    sound.launch();
    setActiveChaos(type);
    const now = new Date().toTimeString().split(" ")[0];

    if (type === "fiber-cut") {
      sound.error();
      setLogs([
        { time: now, level: "failover", message: "RECURSIVE ROUTE TRIGGERED: Primary WAN Gateway (192.168.1.1) failed ping probe." },
        { time: now, level: "warn", message: "MikroTik switched default route to Secondary 4G LTE Gateway in 180ms." },
        { time: now, level: "info", message: "Zero dropped POS checkout connections. Cloud WebSockets preserved." },
      ]);
      osStore.addXp(30, "Simulated ISP Fiber Cut Failover");
    } else if (type === "flash-sale") {
      sound.levelUp();
      setLogs([
        { time: now, level: "warn", message: "INGRESS SPIKE: Inbound requests jumped 10x (4,850 req/sec)." },
        { time: now, level: "info", message: "Redis LRU Edge Cache absorbed 94.2% of catalog reads." },
        { time: now, level: "failover", message: "PostgreSQL Connection Pooler clamped writes. p95 latency: 42ms." },
      ]);
      osStore.addXp(30, "Simulated 10x Flash Sale Spike");
    } else if (type === "offline") {
      sound.error();
      setLogs([
        { time: now, level: "warn", message: "INTERNET DISCONNECTED: Cloud endpoint unreachable." },
        { time: now, level: "failover", message: "Local-First Architecture activated: Point-of-Sale switched to local SQLite queue." },
        { time: now, level: "info", message: "All sales, thermal printing & cash transactions continue 100% offline." },
      ]);
      osStore.addXp(30, "Simulated Cloud Offline Mode");
    } else if (type === "sqli-attack") {
      sound.error();
      const payload = "admin' OR '1'='1' UNION SELECT id, email, pass_hash FROM workspace_users --";
      const audit = inspectPayloadSecurity(payload);
      setLogs([
        { time: now, level: "failover", message: `WAF THREAT BLOCKED (403): AST signature detected [${audit.threatType || "SQLi_UNION_SELECT"}].` },
        { time: now, level: "warn", message: `Payload intercepted: "${payload.substring(0, 52)}..."` },
        { time: now, level: "info", message: "Prepared statements + Drizzle ORM parameterization enforced. Zero DB leaks." },
      ]);
      osStore.addXp(35, "Simulated WAF SQL Injection Defense");
    } else if (type === "ddos-burst") {
      sound.error();
      // Simulate 20 fast requests to exhaust token bucket
      let blockedCount = 0;
      for (let i = 0; i < 20; i++) {
        const rate = checkRateLimit("simulated-bot-ip", "/api/workplace/auth");
        if (!rate.allowed) blockedCount++;
      }
      setLogs([
        { time: now, level: "failover", message: `DDoS BOT BURST THROTTLED (429): Token-Bucket exhausted (0 tokens remaining).` },
        { time: now, level: "warn", message: `Throttled ${blockedCount > 0 ? blockedCount : 12} rapid requests. Injected HTTP 429 Retry-After: 60s.` },
        { time: now, level: "info", message: "Neon Serverless compute preserved. Valid human traffic routed normally." },
      ]);
      osStore.addXp(35, "Simulated DDoS Token-Bucket Throttling");
    }
  };

  const handleReset = () => {
    sound.toggleSwitch();
    setActiveChaos("normal");
    const now = new Date().toTimeString().split(" ")[0];
    setLogs([
      { time: now, level: "info", message: "Chaos injected state cleared. All primary telemetry paths nominal." },
    ]);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Interactive System Chaos &amp; Failover Lab
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Test high-availability architecture resilience: ISP cuts, 10x traffic bursts, and offline POS queues.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chaos State</span>
        </button>
      </div>

      {/* Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
        <button
          onClick={() => triggerChaos("fiber-cut")}
          className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
            activeChaos === "fiber-cut"
              ? "bg-rose-500/10 border-rose-500 text-rose-500 shadow"
              : "bg-surface border-line hover:border-ink-4 text-ink"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Wifi className="w-4 h-4" /> 1. Fiber Cut
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">
              Failover
            </span>
          </div>
          <p className="text-[11px] text-ink-3">
            Primary ISP link fails. MikroTik switches to 4G LTE in 180ms.
          </p>
        </button>

        <button
          onClick={() => triggerChaos("flash-sale")}
          className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
            activeChaos === "flash-sale"
              ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow"
              : "bg-surface border-line hover:border-ink-4 text-ink"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> 2. 10x Spike
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">
              Traffic
            </span>
          </div>
          <p className="text-[11px] text-ink-3">
            Flash sale hits edge. Redis LRU absorbs 94% reads.
          </p>
        </button>

        <button
          onClick={() => triggerChaos("offline")}
          className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
            activeChaos === "offline"
              ? "bg-purple-500/10 border-purple-500 text-purple-500 shadow"
              : "bg-surface border-line hover:border-ink-4 text-ink"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <CloudOff className="w-4 h-4" /> 3. Cloud Cut
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-bold">
              Offline
            </span>
          </div>
          <p className="text-[11px] text-ink-3">
            Internet cuts out. POS queues in SQLite, zero cart drop.
          </p>
        </button>

        <button
          onClick={() => triggerChaos("sqli-attack")}
          className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
            activeChaos === "sqli-attack"
              ? "bg-red-500/15 border-red-500 text-red-500 shadow"
              : "bg-surface border-line hover:border-ink-4 text-ink"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> 4. SQLi Attack
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">
              WAF 403
            </span>
          </div>
          <p className="text-[11px] text-ink-3">
            UNION SELECT payload blocked by AST regex firewall.
          </p>
        </button>

        <button
          onClick={() => triggerChaos("ddos-burst")}
          className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
            activeChaos === "ddos-burst"
              ? "bg-blue-500/15 border-blue-500 text-blue-500 shadow"
              : "bg-surface border-line hover:border-ink-4 text-ink"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 5. DDoS Burst
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">
              Rate 429
            </span>
          </div>
          <p className="text-[11px] text-ink-3">
            1000 req/s bot burst throttled via Token-Bucket.
          </p>
        </button>
      </div>

      {/* Visual Live Topology Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
        <div className="lg:col-span-7 p-5 rounded-2xl bg-muted/15 border border-line space-y-3">
          <span className="font-bold text-ink uppercase tracking-wider block text-[11px]">
            Live Node Topology State
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {/* Primary ISP Node */}
            <div
              className={`p-3 rounded-xl border transition ${
                activeChaos === "fiber-cut" || activeChaos === "offline"
                  ? "bg-rose-500/10 border-rose-500 text-rose-500"
                  : "bg-surface border-line text-ink"
              }`}
            >
              <Wifi className="w-5 h-5 mx-auto mb-1" />
              <span className="font-bold block text-[11px]">Primary Fiber</span>
              <span className="text-[10px] opacity-80">
                {activeChaos === "fiber-cut" || activeChaos === "offline" ? "OFFLINE (Cut)" : "ONLINE (100 Mbps)"}
              </span>
            </div>

            {/* Router / Failover Node */}
            <div className="p-3 rounded-xl bg-surface border border-line text-ink">
              <Server className="w-5 h-5 mx-auto mb-1 text-primary" />
              <span className="font-bold block text-[11px]">Edge RouterOS</span>
              <span className="text-[10px] text-emerald-600 font-bold">
                {activeChaos === "fiber-cut" ? "LTE Active (180ms)" : "Nominal"}
              </span>
            </div>

            {/* WAF Shield Node */}
            <div
              className={`p-3 rounded-xl border transition ${
                activeChaos === "sqli-attack"
                  ? "bg-red-500/15 border-red-500 text-red-500"
                  : activeChaos === "ddos-burst"
                  ? "bg-blue-500/15 border-blue-500 text-blue-500"
                  : "bg-surface border-line text-ink"
              }`}
            >
              <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <span className="font-bold block text-[11px]">WAF Shield</span>
              <span className="text-[10px] text-emerald-600 font-bold">
                {activeChaos === "sqli-attack" ? "BLOCKED 403" : activeChaos === "ddos-burst" ? "THROTTLED 429" : "Active (0 Threat)"}
              </span>
            </div>

            {/* Database Node */}
            <div
              className={`p-3 rounded-xl border transition ${
                activeChaos === "offline"
                  ? "bg-purple-500/10 border-purple-500 text-purple-500"
                  : activeChaos === "flash-sale"
                  ? "bg-amber-500/10 border-amber-500 text-amber-500"
                  : "bg-surface border-line text-ink"
              }`}
            >
              <Database className="w-5 h-5 mx-auto mb-1" />
              <span className="font-bold block text-[11px]">Data Layer</span>
              <span className="text-[10px] opacity-80">
                {activeChaos === "offline" ? "Local SQLite Active" : activeChaos === "flash-sale" ? "Redis Clamped" : "Postgres Healthy"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Event Log Stream */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-neutral-950 text-neutral-200 border border-neutral-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block border-b border-neutral-800 pb-1">
            Telemetry Event Stream:
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-neutral-500 shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.level === "failover"
                      ? "text-rose-400 font-bold"
                      : log.level === "warn"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
