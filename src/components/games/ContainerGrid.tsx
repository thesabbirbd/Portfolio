"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  HardDrive,
  Globe,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface ContainerGridProps {
  onComplete?: (data: ScorecardData) => void;
}

export interface ContainerService {
  id: string;
  name: string;
  image: string;
  type: "proxy" | "worker" | "cache" | "database" | "pooler";
  ramMb: number;
  capacityRps: number;
  desc: string;
  color: string;
}

const AVAILABLE_SERVICES: ContainerService[] = [
  {
    id: "nginx",
    name: "Nginx Gateway",
    image: "nginx:alpine",
    type: "proxy",
    ramMb: 128,
    capacityRps: 15000,
    desc: "Reverse proxy & load balancer on port 80/443. Required for all ingress.",
    color: "emerald",
  },
  {
    id: "worker",
    name: "FastAPI Worker",
    image: "api-worker:v2",
    type: "worker",
    ramMb: 384,
    capacityRps: 2000,
    desc: "App business logic. Requires DB access. Max 2,000 req/s per replica.",
    color: "blue",
  },
  {
    id: "redis",
    name: "Redis Cache",
    image: "redis:7-alpine",
    type: "cache",
    ramMb: 256,
    capacityRps: 25000,
    desc: "In-memory cache. Cuts database load by 75% and shaves 40ms latency.",
    color: "rose",
  },
  {
    id: "postgres",
    name: "Postgres Primary",
    image: "postgres:16",
    type: "database",
    ramMb: 512,
    capacityRps: 3000,
    desc: "ACID write database. Max 100 direct client connections without pooler.",
    color: "amber",
  },
  {
    id: "pg-replica",
    name: "Postgres Read Replica",
    image: "postgres:16-replica",
    type: "database",
    ramMb: 512,
    capacityRps: 6000,
    desc: "Read-only replica. Absorbs heavy SELECT and analytics traffic.",
    color: "amber",
  },
  {
    id: "pgbouncer",
    name: "PgBouncer Pooler",
    image: "pgbouncer:1.21",
    type: "pooler",
    ramMb: 128,
    capacityRps: 20000,
    desc: "Connection pooler. Multiplexes thousands of client conns to 50 DB sockets.",
    color: "violet",
  },
];

interface LevelDef {
  level: number;
  title: string;
  trafficRps: number;
  maxRamMb: number;
  maxSlots: number;
  scenario: string;
  validation: (cluster: ContainerService[]) => { success: boolean; message: string };
  hint: string;
}

const LEVELS: LevelDef[] = [
  {
    level: 1,
    title: "Morning Traffic Ingress",
    trafficRps: 1500,
    maxRamMb: 1024,
    maxSlots: 4,
    scenario: "Morning users are opening the app. We need an ingress gateway and enough workers to handle 1,500 req/s, backed by a persistent primary database.",
    hint: "Place 1x Nginx Gateway, 1x FastAPI Worker, and 1x Postgres Primary.",
    validation: (cluster) => {
      const hasNginx = cluster.some((c) => c.type === "proxy");
      const workers = cluster.filter((c) => c.type === "worker");
      const hasDb = cluster.some((c) => c.id === "postgres");

      if (!hasNginx) return { success: false, message: "502 Bad Gateway: Ingress port 80/443 has no Nginx reverse proxy!" };
      if (workers.length < 1) return { success: false, message: "503 Service Unavailable: No application workers running to process business logic." };
      if (!hasDb) return { success: false, message: "500 Internal Error: Database connection refused (Postgres Primary missing)." };
      return { success: true, message: "Cluster healthy! 1,500 req/s routed cleanly with 0% dropped packets." };
    },
  },
  {
    level: 2,
    title: "Flash Sale Surge (Cache Layer)",
    trafficRps: 4500,
    maxRamMb: 1792,
    maxSlots: 5,
    scenario: "A flash sale started! Traffic jumped to 4,500 req/s. Workers will crash under database connection saturation unless an in-memory cache is present.",
    hint: "Nginx Gateway + at least 2 FastAPI Workers + Redis Cache + Postgres Primary.",
    validation: (cluster) => {
      const hasNginx = cluster.some((c) => c.type === "proxy");
      const workers = cluster.filter((c) => c.type === "worker");
      const hasRedis = cluster.some((c) => c.type === "cache");
      const hasDb = cluster.some((c) => c.id === "postgres");

      if (!hasNginx) return { success: false, message: "502 Bad Gateway: No reverse proxy configured." };
      if (workers.length < 2) return { success: false, message: "504 Gateway Timeout: Single worker CPU bottlenecked at 4,500 req/s. Scale to at least 2 workers." };
      if (!hasRedis) return { success: false, message: "Postgres Connection Exhaustion: DB CPU hit 100%! Add Redis Cache to offload read queries." };
      if (!hasDb) return { success: false, message: "500 Error: No database for user transactions." };
      return { success: true, message: "Cache hit ratio 78%! All 4,500 req/s served in < 18ms latency." };
    },
  },
  {
    level: 3,
    title: "Heavy Read Spikes & Replica Splitting",
    trafficRps: 8000,
    maxRamMb: 2400,
    maxSlots: 6,
    scenario: "Users are refreshing product catalog pages repeatedly (8,000 req/s). Primary DB writes will lock unless read traffic is diverted to a Read Replica.",
    hint: "Nginx + 3x FastAPI Workers + Redis Cache + Postgres Primary + Postgres Read Replica.",
    validation: (cluster) => {
      const hasNginx = cluster.some((c) => c.type === "proxy");
      const workers = cluster.filter((c) => c.type === "worker");
      const hasRedis = cluster.some((c) => c.type === "cache");
      const hasPrimary = cluster.some((c) => c.id === "postgres");
      const hasReplica = cluster.some((c) => c.id === "pg-replica");

      if (!hasNginx) return { success: false, message: "No Ingress Proxy found." };
      if (workers.length < 3) return { success: false, message: "Worker saturation: 8,000 req/s requires at least 3 API worker replicas." };
      if (!hasRedis) return { success: false, message: "High latency: Redis cache missing." };
      if (!hasPrimary) return { success: false, message: "Missing primary database for order placements." };
      if (!hasReplica) return { success: false, message: "Deadlock Detected: Read queries starved write transactions. Add a Postgres Read Replica!" };
      return { success: true, message: "CQRS split active! Reads served by replica, writes committed to primary in 4ms." };
    },
  },
  {
    level: 4,
    title: "High-Concurrency Connection Pooling",
    trafficRps: 15000,
    maxRamMb: 2800,
    maxSlots: 6,
    scenario: "15,000 concurrent socket connections opened! Without PgBouncer, each worker thread spawns raw TCP postgres sockets, triggering Linux socket leak.",
    hint: "Nginx + 3x FastAPI Workers + Redis Cache + PgBouncer + Postgres Primary.",
    validation: (cluster) => {
      const hasNginx = cluster.some((c) => c.type === "proxy");
      const workers = cluster.filter((c) => c.type === "worker");
      const hasPooler = cluster.some((c) => c.id === "pgbouncer");
      const hasDb = cluster.some((c) => c.id === "postgres" || c.id === "pg-replica");

      if (!hasNginx) return { success: false, message: "Nginx Ingress missing." };
      if (workers.length < 2) return { success: false, message: "Worker capacity exceeded." };
      if (!hasPooler) return { success: false, message: "FATAL: sorry, too many clients already! Postgres socket limit exceeded. Add PgBouncer Pooler." };
      if (!hasDb) return { success: false, message: "Database missing." };
      return { success: true, message: "PgBouncer multiplexed 15,000 connections into 50 pooled DB sockets with 0 errors!" };
    },
  },
  {
    level: 5,
    title: "The Zero-Downtime High-Availability Mesh",
    trafficRps: 22000,
    maxRamMb: 3072,
    maxSlots: 7,
    scenario: "Final Challenge: 22,000 req/s mega peak under a tight 3,072 MB memory envelope. Architect the ultimate full-stack cluster: Ingress + Multi-worker + Cache + Pooling + Primary & Replica.",
    hint: "1x Nginx, 2x Workers, 1x Redis, 1x PgBouncer, 1x Primary, 1x Read Replica (RAM must stay <= 3072 MB).",
    validation: (cluster) => {
      const totalRam = cluster.reduce((sum, c) => sum + c.ramMb, 0);
      if (totalRam > 3072) return { success: false, message: `OOM Killer Alert! Total memory (${totalRam}MB) exceeded node threshold of 3,072MB.` };

      const hasNginx = cluster.some((c) => c.type === "proxy");
      const workers = cluster.filter((c) => c.type === "worker");
      const hasRedis = cluster.some((c) => c.type === "cache");
      const hasPooler = cluster.some((c) => c.id === "pgbouncer");
      const hasPrimary = cluster.some((c) => c.id === "postgres");
      const hasReplica = cluster.some((c) => c.id === "pg-replica");

      if (!hasNginx || workers.length < 2 || !hasRedis || !hasPooler || !hasPrimary || !hasReplica) {
        return { success: false, message: "Cluster topology incomplete: Needs Nginx, 2x Workers, Redis, PgBouncer, Primary DB, and Read Replica." };
      }
      return { success: true, message: "Perfection! 22,000 req/s sustained, 99.999% SLA, 0 dropped packets, 0 OOM kills." };
    },
  },
];

export function ContainerGrid({ onComplete }: ContainerGridProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [cluster, setCluster] = useState<ContainerService[]>([]);
  const [simulationState, setSimulationState] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [testStats, setTestStats] = useState({ rpsHandled: 0, errorRate: 0, latencyMs: 0 });

  const currentLevel = LEVELS[currentLevelIdx];
  const totalRamUsed = cluster.reduce((sum, c) => sum + c.ramMb, 0);
  const totalRpsCapacity = cluster.reduce((sum, c) => sum + c.capacityRps, 0);

  // Add container to cluster
  const handleAddService = (service: ContainerService) => {
    if (cluster.length >= currentLevel.maxSlots) {
      sound.error();
      setFeedbackMessage(`Slot Limit Reached: Level ${currentLevel.level} allows max ${currentLevel.maxSlots} containers.`);
      return;
    }
    sound.type();
    setCluster((prev) => [...prev, service]);
    setSimulationState("idle");
  };

  // Remove container from cluster
  const handleRemoveService = (index: number) => {
    sound.toggleSwitch();
    setCluster((prev) => prev.filter((_, i) => i !== index));
    setSimulationState("idle");
  };

  // Clear entire cluster
  const handleClear = () => {
    sound.toggleSwitch();
    setCluster([]);
    setSimulationState("idle");
    setFeedbackMessage("");
  };

  // Deploy and simulate traffic
  const handleDeployAndBenchmark = () => {
    sound.launch();
    setSimulationState("running");
    setFeedbackMessage("Simulating traffic spike... routing TCP packets across cluster...");

    setTimeout(() => {
      // Memory check
      if (totalRamUsed > currentLevel.maxRamMb) {
        sound.gameOver();
        setSimulationState("failed");
        setFeedbackMessage(`OOM Killer Invoked: Total RAM (${totalRamUsed} MB) exceeded node budget (${currentLevel.maxRamMb} MB)! Linux kernel killed container process.`);
        setTestStats({ rpsHandled: Math.floor(currentLevel.trafficRps * 0.3), errorRate: 70, latencyMs: 1450 });
        return;
      }

      // Logical topology check
      const result = currentLevel.validation(cluster);

      if (result.success) {
        sound.levelUp();
        setSimulationState("success");
        setFeedbackMessage(result.message);
        const levelBonus = 400 + (currentLevel.maxRamMb - totalRamUsed) + (currentLevel.level * 100);
        setScore((prev) => prev + levelBonus);
        osStore.addXp(120);

        setTestStats({
          rpsHandled: currentLevel.trafficRps,
          errorRate: 0,
          latencyMs: cluster.some((c) => c.type === "cache") ? 8 : 42,
        });
      } else {
        sound.error();
        setSimulationState("failed");
        setFeedbackMessage(result.message);
        setTestStats({
          rpsHandled: Math.floor(currentLevel.trafficRps * 0.45),
          errorRate: 55,
          latencyMs: 820,
        });
      }
    }, 1200);
  };

  // Next level or finish game
  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      sound.combo();
      setCurrentLevelIdx((prev) => prev + 1);
      setCluster([]);
      setSimulationState("idle");
      setFeedbackMessage("");
    } else {
      // Game Complete!
      sound.shutter();
      const finalScore = score + 500;
      osStore.recordGameScore("container-grid", finalScore);
      osStore.addXp(300);

      const scorecard: ScorecardData = {
        gameId: "container-grid",
        gameTitle: "Container Grid: Docker & K8s Puzzle",
        score: finalScore,
        rankTier: finalScore >= 2400 ? "S-Tier // Kernel Master" : finalScore >= 1800 ? "SQL Architect" : "NOC Specialist",
        accuracyPct: 100,
        timeTakenSeconds: 45,
        xpEarned: 300,
        playerHandle: osStore.getState().handle,
      };

      if (onComplete) {
        onComplete(scorecard);
      }
    }
  };

  return (
    <div className="w-full bg-surface border border-line rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm">
      {/* Top Header & Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold font-mono text-ink tracking-tight">
              Container Grid: Docker &amp; Load-Balancer Puzzle
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Stage {currentLevel.level} of {LEVELS.length}: {currentLevel.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            <span className="text-ink-3 block text-[10px] uppercase">Score</span>
            <span className="font-bold text-primary">{score.toLocaleString()} PTS</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            <span className="text-ink-3 block text-[10px] uppercase">Incoming Traffic</span>
            <span className="font-bold text-ink">{currentLevel.trafficRps.toLocaleString()} req/s</span>
          </div>
        </div>
      </div>

      {/* Scenario Box & Hint */}
      <div className="p-4 rounded-xl bg-muted/30 border border-line space-y-2">
        <div className="flex items-start gap-2">
          <Server className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-ink-2 leading-relaxed">
            <strong className="text-ink">Traffic Scenario:</strong> {currentLevel.scenario}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span><strong>DevOps Hint:</strong> {currentLevel.hint}</span>
        </div>
      </div>

      {/* Node Resource Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-muted/20 border border-line">
          <span className="text-[10px] text-ink-3 uppercase block mb-1">RAM Budget</span>
          <div className="flex items-baseline justify-between">
            <span className={`font-bold ${totalRamUsed > currentLevel.maxRamMb ? "text-rose-500" : "text-ink"}`}>
              {totalRamUsed} MB
            </span>
            <span className="text-[10px] text-ink-3">/ {currentLevel.maxRamMb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-300 ${
                totalRamUsed > currentLevel.maxRamMb ? "bg-rose-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, (totalRamUsed / currentLevel.maxRamMb) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-line">
          <span className="text-[10px] text-ink-3 uppercase block mb-1">Cluster Slots</span>
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-ink">{cluster.length}</span>
            <span className="text-[10px] text-ink-3">/ {currentLevel.maxSlots} pods</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(cluster.length / currentLevel.maxSlots) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-line">
          <span className="text-[10px] text-ink-3 uppercase block mb-1">Total Capacity</span>
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-ink">{totalRpsCapacity.toLocaleString()}</span>
            <span className="text-[10px] text-ink-3">req/s</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (totalRpsCapacity / (currentLevel.trafficRps || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-line">
          <span className="text-[10px] text-ink-3 uppercase block mb-1">HTTP Health</span>
          <div className="flex items-center gap-1.5 font-bold">
            {simulationState === "success" ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 200 OK
              </span>
            ) : simulationState === "failed" ? (
              <span className="text-rose-500 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {testStats.errorRate}% Errors
              </span>
            ) : (
              <span className="text-ink-3 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Standby
              </span>
            )}
          </div>
          <span className="text-[10px] text-ink-3 block mt-1">
            {simulationState === "success" ? `${testStats.latencyMs}ms latency` : "Awaiting deploy"}
          </span>
        </div>
      </div>

      {/* Cluster Node Canvas (Active Pods) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-ink flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" /> Active Cluster Topology ({cluster.length}/{currentLevel.maxSlots})
          </span>
          {cluster.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Pods
            </button>
          )}
        </div>

        <div className="min-h-[140px] p-4 rounded-xl bg-muted/40 border-2 border-dashed border-line grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cluster.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-ink-3 text-xs">
              <Layers className="w-8 h-8 mb-2 opacity-30 text-ink-3" />
              <span>No containers scheduled on node.</span>
              <span className="text-[10px] text-ink-3/80 mt-0.5">Click any service from the catalog below to deploy.</span>
            </div>
          ) : (
            cluster.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 rounded-xl bg-surface border border-line shadow-sm flex flex-col justify-between group hover:border-primary/50 transition-all duration-150 animate-in fade-in"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-ink-3 font-semibold">
                      {item.type}
                    </span>
                    <button
                      onClick={() => handleRemoveService(idx)}
                      className="text-ink-3 hover:text-rose-500 text-xs px-1"
                      title="Kill container"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs font-bold text-ink truncate">{item.name}</div>
                  <div className="text-[10px] font-mono text-ink-3 truncate mt-0.5">{item.image}</div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-line text-[10px] font-mono text-ink-3">
                  <span>{item.ramMb} MB</span>
                  <span className="text-primary font-semibold">+{item.capacityRps} rps</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Container Services Catalog */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-ink block">
          Available Service Images (Click to Provision)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {AVAILABLE_SERVICES.map((srv) => (
            <button
              key={srv.id}
              onClick={() => handleAddService(srv)}
              disabled={cluster.length >= currentLevel.maxSlots || simulationState === "running"}
              className="p-3 rounded-xl border border-line bg-surface hover:bg-muted/40 hover:border-primary/40 text-left transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
                    {srv.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-ink-3">
                    {srv.ramMb} MB
                  </span>
                </div>
                <div className="text-[10px] font-mono text-primary mb-1">{srv.image}</div>
                <p className="text-[11px] text-ink-3 line-clamp-2 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-ink-3">
                <span>Cap: {srv.capacityRps.toLocaleString()} rps</span>
                <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">+ Deploy</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deploy & Diagnostic Banner */}
      <div className="space-y-3 pt-2">
        {feedbackMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed animate-in fade-in flex items-start gap-2.5 ${
              simulationState === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : simulationState === "failed"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : "bg-blue-500/10 border-blue-500/30 text-blue-500"
            }`}
          >
            {simulationState === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            ) : simulationState === "failed" ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            ) : (
              <Activity className="w-4 h-4 shrink-0 mt-0.5 text-blue-500 animate-spin" />
            )}
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-ink-3">
            Docker Engine v26 • Linux cgroup v2 • Kubernetes Sched
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {simulationState === "success" ? (
              <button
                onClick={handleNextLevel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{currentLevelIdx < LEVELS.length - 1 ? "Next Traffic Level" : "Claim Final SRE Certificate"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleDeployAndBenchmark}
                disabled={cluster.length === 0 || simulationState === "running"}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-mono text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{simulationState === "running" ? "Simulating Ingress..." : "Deploy & Benchmark Cluster"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
