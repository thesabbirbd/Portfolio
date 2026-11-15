"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Server,
  Zap,
  Activity,
  Battery,
  Cpu,
  HardDrive,
  RotateCcw,
  Play,
  AlertTriangle,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface UptimeArchitectProps {
  onComplete?: (data: ScorecardData) => void;
}

interface ChaosEvent {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  active: boolean;
  requiredFix: "cache" | "workers" | "backup_wan" | "sqlite_replica" | "ups_switch";
  impact: string;
}

export function UptimeArchitect({ onComplete }: UptimeArchitectProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [uptimePct, setUptimePct] = useState(100.0);
  const [ramUsedGb, setRamUsedGb] = useState(4.2);
  const [cpuLoadPct, setCpuLoadPct] = useState(24);
  const [upsBatteryPct, setUpsBatteryPct] = useState(100);
  const [currentEvent, setCurrentEvent] = useState<ChaosEvent | null>(null);
  const [solvedEventsCount, setSolvedEventsCount] = useState(0);

  // Active mitigations
  const [cacheActive, setCacheActive] = useState(false);
  const [workerCount, setWorkerCount] = useState(2);
  const [backupWanActive, setBackupWanActive] = useState(false);
  const [sqliteReplicaActive, setSqliteReplicaActive] = useState(false);
  const [upsActive, setUpsActive] = useState(false);

  const totalDowntimeSecRef = useRef<number>(0);
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);

  const CHAOS_POOL: Omit<ChaosEvent, "active">[] = [
    {
      id: "grid_power_loss",
      title: "⚡ DC Grid Power Outage",
      description: "Main power feed lost at Dhaka DC! Switch to Custom DC-UPS battery immediately.",
      durationSec: 10,
      requiredFix: "ups_switch",
      impact: "Power Loss",
    },
    {
      id: "traffic_surge",
      title: "📈 Flash Sale Traffic Surge",
      description: "12,000 requests/sec flooding backend! Enable Redis Cache layer to absorb hits.",
      durationSec: 10,
      requiredFix: "cache",
      impact: "CPU 98%",
    },
    {
      id: "wan_fiber_cut",
      title: "🌐 Primary ISP Fiber Cut",
      description: "BDIX upstream packet loss detected! Switch router to MikroTik Backup WAN.",
      durationSec: 10,
      requiredFix: "backup_wan",
      impact: "Packet Drop",
    },
    {
      id: "db_saturation",
      title: "🗄️ PostgreSQL Read Saturation",
      description: "Relational read pool saturated! Activate Local SQLite Read Replica.",
      durationSec: 10,
      requiredFix: "sqlite_replica",
      impact: "DB Timeouts",
    },
    {
      id: "worker_bottleneck",
      title: "⚙️ FastAPI Concurrency Queue",
      description: "Async event loop saturated. Scale up worker processes to handle throughput.",
      durationSec: 10,
      requiredFix: "workers",
      impact: "Queue Lag",
    },
  ];

  const startGame = () => {
    sound.launch();
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setUptimePct(100.0);
    setRamUsedGb(4.2);
    setCpuLoadPct(24);
    setUpsBatteryPct(100);
    setCurrentEvent(null);
    setSolvedEventsCount(0);
    setCacheActive(false);
    setWorkerCount(2);
    setBackupWanActive(false);
    setSqliteReplicaActive(false);
    setUpsActive(false);
    totalDowntimeSecRef.current = 0;
  };

  const endGame = (finalScore: number, finalUptime: number) => {
    setIsPlaying(false);
    setIsGameOver(true);
    sound.gameOver();

    const rankTier =
      finalUptime >= 99.5
        ? "S-Tier // Kernel Master"
        : finalUptime >= 95.0
        ? "SQL Architect"
        : "NOC Specialist";

    if (finalUptime >= 99.0) {
      osStore.unlockBadge("chaos-master");
    }

    if (onComplete) {
      onComplete({
        gameId: "uptime-architect",
        gameTitle: "Uptime Architect: Chaos Simulator",
        playerHandle: osStore.getState().handle,
        score: finalScore,
        rankTier,
        accuracyPct: Math.round(finalUptime),
        timeTakenSeconds: 60,
        xpEarned: Math.round(finalScore * 0.1),
      });
    }
  };

  // Main 1-second simulation clock
  useEffect(() => {
    if (!isPlaying) return;

    const clock = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(clock);
          endGame(score, uptimePct);
          return 0;
        }

        // Check if event is active and unmitigated
        if (currentEvent) {
          totalDowntimeSecRef.current += 1;
          const currentUptime = Math.max(80.0, 100.0 - (totalDowntimeSecRef.current / 60) * 20);
          setUptimePct(Number(currentUptime.toFixed(2)));
          sound.error();
        } else {
          setScore((s) => s + 50);
        }

        // Drain battery if UPS is active
        if (upsActive) {
          setUpsBatteryPct((b) => Math.max(0, b - 2));
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(clock);
  }, [isPlaying, currentEvent, upsActive, score, uptimePct]);

  // Periodic Chaos Generator
  useEffect(() => {
    if (!isPlaying) return;

    const chaosTimer = setInterval(() => {
      if (!currentEvent && Math.random() > 0.3) {
        const picked = CHAOS_POOL[Math.floor(Math.random() * CHAOS_POOL.length)];
        setCurrentEvent({ ...picked, active: true });
        sound.error();
      }
    }, 8000);

    return () => clearInterval(chaosTimer);
  }, [isPlaying, currentEvent]);

  // Action Triggers
  const triggerMitigation = (action: ChaosEvent["requiredFix"]) => {
    if (!isPlaying) return;
    sound.click();

    if (action === "cache") {
      setCacheActive(true);
      setRamUsedGb((r) => Math.min(16, r + 2.0));
      setCpuLoadPct((c) => Math.max(15, c - 30));
    } else if (action === "workers") {
      setWorkerCount((w) => Math.min(8, w + 2));
      setRamUsedGb((r) => Math.min(16, r + 1.5));
    } else if (action === "backup_wan") {
      setBackupWanActive(true);
    } else if (action === "sqlite_replica") {
      setSqliteReplicaActive(true);
      setRamUsedGb((r) => Math.min(16, r + 0.8));
    } else if (action === "ups_switch") {
      setUpsActive(true);
    }

    if (currentEvent && currentEvent.requiredFix === action) {
      sound.levelUp();
      setScore((s) => s + 1500);
      setSolvedEventsCount((c) => c + 1);
      setCurrentEvent(null);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-ink">
            Uptime Architect // Chaos Simulator
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            {uptimePct}% SLA Uptime
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>

          <div className="text-ink-2 font-bold">{timeLeft}s Left</div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="relative bg-zinc-950 min-h-[380px] p-5 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Hardware & System Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>RAM Allocation</span>
                <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {ramUsedGb.toFixed(1)} / 16 GB
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  style={{ width: `${(ramUsedGb / 16) * 100}%` }}
                  className="bg-sky-400 h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>FastAPI Workers</span>
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {workerCount} Processes
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">Uvicorn Master Loop</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>DC-UPS Battery</span>
                <Battery className={`w-3.5 h-3.5 ${upsBatteryPct < 30 ? "text-red-500 animate-ping" : "text-emerald-400"}`} />
              </div>
              <div className="text-lg font-bold text-white mt-1">{upsBatteryPct}%</div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  style={{ width: `${upsBatteryPct}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Active WAN Link</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {backupWanActive ? "MikroTik LTE" : "Primary Fiber"}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                {backupWanActive ? "WAN 2 Engaged" : "WAN 1 Online"}
              </div>
            </div>
          </div>

          {/* Active Chaos Alert Box */}
          {currentEvent ? (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-500 text-red-200 animate-pulse flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-white">{currentEvent.title}</div>
                <div className="text-xs text-red-300 mt-0.5 leading-relaxed">
                  {currentEvent.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All microservices operational. Traffic flow within acceptable thresholds.
            </div>
          )}

          {/* Operator Action Controls */}
          <div>
            <div className="text-xs font-mono text-zinc-400 mb-2">SRE Mitigation Controls:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => triggerMitigation("cache")}
                disabled={!isPlaying || cacheActive}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition ${
                  cacheActive
                    ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-900 border-zinc-700 hover:border-primary text-white"
                }`}
              >
                <div className="font-bold">Add Redis Cache</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">+2.0 GB RAM, -30% CPU</div>
              </button>

              <button
                onClick={() => triggerMitigation("workers")}
                disabled={!isPlaying}
                className="p-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-primary text-white text-left font-mono text-xs transition"
              >
                <div className="font-bold">Scale FastAPI +2</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">+1.5 GB RAM, expands queue</div>
              </button>

              <button
                onClick={() => triggerMitigation("backup_wan")}
                disabled={!isPlaying || backupWanActive}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition ${
                  backupWanActive
                    ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-900 border-zinc-700 hover:border-primary text-white"
                }`}
              >
                <div className="font-bold">Switch MikroTik WAN</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Route to LTE Backup</div>
              </button>

              <button
                onClick={() => triggerMitigation("sqlite_replica")}
                disabled={!isPlaying || sqliteReplicaActive}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition ${
                  sqliteReplicaActive
                    ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-900 border-zinc-700 hover:border-primary text-white"
                }`}
              >
                <div className="font-bold">SQLite Read Replica</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Offload read pool</div>
              </button>

              <button
                onClick={() => triggerMitigation("ups_switch")}
                disabled={!isPlaying || upsActive}
                className={`p-3 rounded-xl border text-left font-mono text-xs transition ${
                  upsActive
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                    : "bg-zinc-900 border-zinc-700 hover:border-primary text-white"
                }`}
              >
                <div className="font-bold">Engage DC-UPS</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">DC Battery Active</div>
              </button>
            </div>
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-sm text-center">
            {isGameOver ? (
              <>
                <Server className="w-12 h-12 text-primary mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Chaos Simulation Complete!</h4>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Final Uptime: <span className="text-emerald-400 font-bold">{uptimePct}%</span> • Solved Outages: {solvedEventsCount}
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4" /> Simulate Again
                </button>
              </>
            ) : (
              <>
                <Activity className="w-12 h-12 text-primary mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Uptime Architect: Chaos Simulator</h4>
                <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
                  Survive 60 seconds of infrastructure chaos: grid power cuts, traffic spikes, and fiber failures while holding 99.99% uptime!
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Chaos Run
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
