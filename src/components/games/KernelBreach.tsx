"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Trophy,
  ArrowRight,
  Lightbulb,
  Clock,
  Flame,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface KernelBreachProps {
  onComplete?: (data: ScorecardData) => void;
}

interface CTFLevel {
  id: number;
  title: string;
  domain: string;
  difficulty: "Easy" | "Medium" | "Hard";
  scenario: string;
  initialOutput: string[];
  hint: string;
  quickCommand: string;
  solutionRegex: RegExp;
  successOutput: string[];
  flag: string;
}

const LEVELS: CTFLevel[] = [
  {
    id: 1,
    title: "Mission 1: Systemd Daemon Triage",
    domain: "Linux SysAdmin",
    difficulty: "Easy",
    scenario: "The background API daemon 'aiyaar-api.service' has failed to start due to port 8000 being occupied by a rogue zombie process (PID 4120). Terminate the PID or restart cleanly.",
    initialOutput: [
      "[SYSTEM] Loading systemd journal logs...",
      "● aiyaar-api.service - Aiyaar Core API Daemon",
      "     Loaded: loaded (/etc/systemd/system/aiyaar-api.service; enabled)",
      "     Active: failed (Result: exit-code) since Mon 2026-11-14 14:02:10 UTC",
      "    Process: 9481 ExecStart=/usr/bin/uvicorn app:main --port 8000 (code=exited, status=1)",
      "      Error: [Errno 98] Address already in use: 0.0.0.0:8000",
      "  Conflicting: PID 4120 (/usr/local/bin/zombie-listener) holding tcp:8000",
      "Hint: Kill the conflicting PID 4120 and restart the service.",
    ],
    hint: "Use `kill -9 4120` or `systemctl restart aiyaar-api` to clear the blocked socket.",
    quickCommand: "kill -9 4120 && systemctl restart aiyaar-api",
    solutionRegex: /(kill\s+(-9\s+)?4120|systemctl\s+restart|fuser\s+-k\s+8000)/i,
    successOutput: [
      "[OK] Sending SIGKILL to PID 4120... Done.",
      "[OK] Socket tcp:0.0.0.0:8000 freed.",
      "[OK] Executing: systemctl restart aiyaar-api.service",
      "● aiyaar-api.service - Aiyaar Core API Daemon",
      "     Active: active (running) [PID 9510]",
      "✅ FLAG CAPTURED: FLAG{SYSTEMD_DAEMON_RESTORED_2026}",
    ],
    flag: "FLAG{SYSTEMD_DAEMON_RESTORED_2026}",
  },
  {
    id: 2,
    title: "Mission 2: Branch Router Subnet Sizing",
    domain: "NOC & Networking",
    difficulty: "Medium",
    scenario: "A new branch office requires a dedicated IPv4 subnet for 58 physical devices (workstations, POS terminals, and barcode printers). What is the minimum CIDR prefix (e.g. /26) providing >= 58 usable hosts with minimal wastage?",
    initialOutput: [
      "[NOC LAB] Branch Router Interface: ether2 (Local LAN)",
      "Required Usable Hosts: 58 hosts",
      "Constraint: Reserve 1 network address + 1 broadcast address (RFC 791).",
      "Formula: Usable Hosts = (2^(32 - Prefix)) - 2 >= 58",
      "Enter the prefix (e.g. /26) or subnet mask to allocate the subnet.",
    ],
    hint: "A /27 has 32-2=30 usable hosts (too small). A /26 has 64-2=62 usable hosts (62 >= 58).",
    quickCommand: "/26",
    solutionRegex: /(\/26\b|^26$|255\.255\.255\.192)/i,
    successOutput: [
      "[OK] Evaluating CIDR prefix /26...",
      "     Host bits: 32 - 26 = 6 bits",
      "     Total addresses: 2^6 = 64",
      "     Usable host addresses: 62 (Allocates 58 hosts with only 4 spare)",
      "     Subnet Mask: 255.255.255.192",
      "✅ FLAG CAPTURED: FLAG{CIDR_SLASH_26_ALLOCATED_2026}",
    ],
    flag: "FLAG{CIDR_SLASH_26_ALLOCATED_2026}",
  },
  {
    id: 3,
    title: "Mission 3: PostgreSQL Slow Query Optimization",
    domain: "SQL Architecture",
    difficulty: "Medium",
    scenario: "An inventory query is running a slow Sequential Scan over 120,000 batch rows: `SELECT * FROM inventory_batches WHERE expiry_date <= CURRENT_DATE + 30`. Write the SQL DDL command to create a B-tree index on `expiry_date`.",
    initialOutput: [
      "[POSTGRES EXPLAIN ANALYZE]",
      "Seq Scan on inventory_batches (cost=0.00..8450.00 rows=120000) (actual time=142.12..147.80 ms)",
      "Filter: (expiry_date <= (CURRENT_DATE + '30 days'::interval))",
      "Execution Time: 148.24 ms [CRITICAL: Target is < 2.0 ms]",
      "Write: CREATE INDEX ... ON inventory_batches(expiry_date)",
    ],
    hint: "Type: `CREATE INDEX idx_inventory_expiry ON inventory_batches(expiry_date);`",
    quickCommand: "CREATE INDEX idx_inventory_expiry ON inventory_batches(expiry_date);",
    solutionRegex: /create\s+index.*on\s+inventory_batches\s*\(\s*expiry_date\s*\)/i,
    successOutput: [
      "[OK] Executing: CREATE INDEX idx_inventory_expiry ON inventory_batches(expiry_date);",
      "[OK] Index created in 18.2 ms.",
      "[VERIFY] EXPLAIN ANALYZE re-run:",
      "         Bitmap Index Scan on idx_inventory_expiry (cost=0.00..12.40 rows=450)",
      "         Execution Time: 0.84 ms (176x speedup!)",
      "✅ FLAG CAPTURED: FLAG{INDEX_SCAN_0_MS_ACHIEVED}",
    ],
    flag: "FLAG{INDEX_SCAN_0_MS_ACHIEVED}",
  },
  {
    id: 4,
    title: "Mission 4: Docker Container Port Binding",
    domain: "DevOps & Containers",
    difficulty: "Medium",
    scenario: "A containerized PostgreSQL instance was started with isolated internal networking: `docker run -d --name pg-local postgres:16`. Fix it by mapping host port 5432 to container port 5432 with `-p` flag.",
    initialOutput: [
      "[DOCKER ENGINE] Inspected container 'pg-local':",
      "  Ports: 5432/tcp (Not published to host 0.0.0.0)",
      "  Status: Up 4 minutes",
      "  Error: psql: error: connection to server at '127.0.0.1', port 5432 failed: Connection refused",
      "Command needed: docker run with port publish flag -p 5432:5432",
    ],
    hint: "Run: `docker run -d -p 5432:5432 --name pg-local postgres:16`",
    quickCommand: "docker run -d -p 5432:5432 --name pg-local postgres:16",
    solutionRegex: /docker\s+run.*-p\s+5432:5432/i,
    successOutput: [
      "[OK] Re-creating container with host port binding...",
      "     Published: 0.0.0.0:5432 -> 5432/tcp",
      "[TEST] psql -h 127.0.0.1 -p 5432 -U postgres -c 'SELECT version();'",
      "       PostgreSQL 16.4 on x86_64-pc-linux-gnu",
      "✅ FLAG CAPTURED: FLAG{DOCKER_PORT_PUBLISH_5432}",
    ],
    flag: "FLAG{DOCKER_PORT_PUBLISH_5432}",
  },
  {
    id: 5,
    title: "Mission 5: Linux File Permissions Hardening",
    domain: "Security Engineering",
    difficulty: "Hard",
    scenario: "A private SSL key file `/etc/ssl/private/api.key` was accidentally given world-writable permissions (`777` / `-rwxrwxrwx`). Harden its chmod permission so ONLY the owner has read & write (`600` / `-rw-------`).",
    initialOutput: [
      "[AUDIT] File: /etc/ssl/private/api.key",
      "Current Permissions: 0777 (-rwxrwxrwx)",
      "WARNING: Private key file is accessible and modifiable by any unprivileged user!",
      "Hardening rule: Owner read/write only, zero group/other access.",
    ],
    hint: "Use: `chmod 600 /etc/ssl/private/api.key`",
    quickCommand: "chmod 600 /etc/ssl/private/api.key",
    solutionRegex: /chmod\s+(0?600|u=rw,[go]=-*)\s+(\/etc\/ssl\/private\/api\.key|api\.key)/i,
    successOutput: [
      "[OK] Applying permission mask: chmod 600 /etc/ssl/private/api.key",
      "[VERIFY] ls -la /etc/ssl/private/api.key",
      "         -rw------- 1 root root 1675 Nov 14 14:30 /etc/ssl/private/api.key",
      "         Security audit PASS (0 warnings).",
      "✅ FLAG CAPTURED: FLAG{KEY_PERMISSIONS_HARDENED_600}",
    ],
    flag: "FLAG{KEY_PERMISSIONS_HARDENED_600}",
  },
];

export function KernelBreach({ onComplete }: KernelBreachProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [capturedFlags, setCapturedFlags] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(1);
  const [score, setScore] = useState(0);
  const [startTime] = useState<number>(() => Date.now());
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const level = LEVELS[currentLevelIdx];
  const isFinished = completedLevels.length === LEVELS.length;

  useEffect(() => {
    setLogs(level.initialOutput);
    setShowHint(false);
  }, [currentLevelIdx, level.initialOutput]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    sound.terminalSubmit();
    setAttempts((prev) => prev + 1);

    const newLogs = [...logs, `$ ${cmd}`];

    if (level.solutionRegex.test(cmd)) {
      sound.combo(streak);
      const pointsEarned = Math.round(1000 * (1 + (streak - 1) * 0.25));
      const nextScore = score + pointsEarned;
      setScore(nextScore);
      setStreak((s) => s + 1);

      newLogs.push(...level.successOutput);
      newLogs.push(`⚡ Streak Bonus! +${pointsEarned} PTS`);

      if (!capturedFlags.includes(level.flag)) {
        setCapturedFlags((prev) => [...prev, level.flag]);
        setCompletedLevels((prev) => {
          const updated = [...prev, level.id];
          if (updated.length === LEVELS.length) {
            sound.levelUp();
            osStore.unlockBadge("first-breach");
            const durationSec = Math.round((Date.now() - startTime) / 1000);
            const totalScore = nextScore + Math.max(0, 300 - durationSec) * 5;
            const accuracy = Math.round((LEVELS.length / Math.max(LEVELS.length, attempts + 1)) * 100);

            if (onComplete) {
              setTimeout(() => {
                onComplete({
                  gameId: "kernel-breach",
                  gameTitle: "Kernel Breach: Terminal & SQL CTF",
                  playerHandle: osStore.getState().handle,
                  score: totalScore,
                  rankTier: totalScore > 6000 ? "S-Tier // Kernel Master" : "SQL Architect",
                  accuracyPct: accuracy,
                  timeTakenSeconds: durationSec,
                  xpEarned: Math.round(totalScore * 0.1),
                });
              }, 600);
            }
          }
          return updated;
        });
      }
    } else {
      sound.error();
      setStreak(1);
      newLogs.push(
        `[FAIL] Command failed to satisfy objective. Check syntax or read the mission scenario.`,
        `Type 'hint' or click 'Show Hint' if stuck.`
      );
    }

    setLogs(newLogs);
    setInputVal("");
  };

  const handleNextLevel = () => {
    sound.click();
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    sound.click();
    setCurrentLevelIdx(0);
    setCapturedFlags([]);
    setCompletedLevels([]);
    setScore(0);
    setStreak(1);
    setAttempts(0);
    setLogs(LEVELS[0].initialOutput);
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-xs font-semibold text-ink flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-primary" />
            Kernel Breach // Terminal &amp; SQL CTF
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-amber-500 font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}x Combo</span>
            </div>
          )}
          <span className="text-ink-3">
            Mission {currentLevelIdx + 1}/{LEVELS.length}
          </span>
        </div>
      </div>

      {/* Level Info Bar */}
      <div className="px-4 py-3 bg-muted/10 border-b border-line/60 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
            {level.domain} • {level.difficulty}
          </span>
          <h3 className="text-sm font-bold text-ink">{level.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.click();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-line bg-muted/40 text-ink-2 hover:text-ink transition"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            {showHint ? "Hide Hint" : "Hint"}
          </button>
          <button
            onClick={() => {
              sound.click();
              setInputVal(level.quickCommand);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition"
          >
            Fill Solution
          </button>
        </div>
      </div>

      {showHint && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 font-mono">
          💡 {level.hint}
        </div>
      )}

      {/* Terminal Viewport */}
      <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-300 min-h-[260px] max-h-[360px] overflow-y-auto space-y-1.5 scrollbar-thin">
        <div className="text-zinc-500 pb-1 border-b border-zinc-800">
          # Scenario: {level.scenario}
        </div>
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log.startsWith("$")
                ? "text-primary font-semibold"
                : log.includes("✅")
                ? "text-emerald-400 font-bold"
                : log.includes("[FAIL]")
                ? "text-red-400"
                : log.includes("⚡")
                ? "text-amber-400 font-bold"
                : "text-zinc-300"
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input Bar */}
      <form
        onSubmit={handleCommandSubmit}
        className="flex items-center gap-2 p-3 bg-muted/30 border-t border-line"
      >
        <span className="font-mono text-primary font-bold text-sm">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            sound.type();
            setInputVal(e.target.value);
          }}
          disabled={completedLevels.includes(level.id)}
          placeholder={
            completedLevels.includes(level.id)
              ? "Mission completed! Proceed to next level →"
              : "Enter shell command or SQL..."
          }
          className="flex-1 bg-transparent border-0 outline-none font-mono text-xs text-ink placeholder:text-ink-3"
        />
        {completedLevels.includes(level.id) ? (
          currentLevelIdx < LEVELS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextLevel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition"
            >
              Next Mission <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replay All
            </button>
          )
        ) : (
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition"
          >
            Execute
          </button>
        )}
      </form>
    </div>
  );
}
