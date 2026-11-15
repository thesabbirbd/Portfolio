"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Trophy, ArrowRight, Lightbulb } from "lucide-react";
import { sound } from "@/lib/sound";

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
    title: "Level 1: Systemd Daemon Triage",
    domain: "Linux SysAdmin",
    difficulty: "Easy",
    scenario: "The background API daemon 'aiyaar-api.service' has failed to start due to port 8000 being occupied by a zombie process (PID 4120). Terminate the rogue PID or restart the unit cleanly.",
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
    title: "Level 2: Branch Router Subnet Sizing",
    domain: "NOC & Networking",
    difficulty: "Medium",
    scenario: "A new branch office requires a dedicated IPv4 subnet for 58 physical devices (workstations, POS terminals, and barcode printers). What is the minimum CIDR prefix length (e.g. /26) that provides at least 58 usable hosts with minimal wastage?",
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
    title: "Level 3: PostgreSQL Slow Query Optimization",
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
    title: "Level 4: Docker Container Port Forwarding",
    domain: "DevOps & Containers",
    difficulty: "Easy",
    scenario: "A microservice container listens internally on port 3000. You need to bind it to host port 8080 so external requests on :8080 reach container :3000. Specify the `-p` port mapping argument.",
    initialOutput: [
      "[DOCKER RUN]",
      "Service Target: Web Application listening on tcp:3000 inside container",
      "Host Target: Bind to 0.0.0.0:8080 on the host machine",
      "Rule syntax: -p <host_port>:<container_port>",
      "Enter the port flag (e.g. -p 8080:3000 or 8080:3000)",
    ],
    hint: "Host port comes first, container port second: `-p 8080:3000`.",
    quickCommand: "-p 8080:3000",
    solutionRegex: /(-p\s+)?8080:3000(\/tcp)?/i,
    successOutput: [
      "[OK] Applying port mapping: 0.0.0.0:8080 -> 3000/tcp",
      "[OK] Starting container: sha256:7c9e1189ac...",
      "[OK] Probing http://localhost:8080... HTTP 200 OK (latency: 1.2ms)",
      "✅ FLAG CAPTURED: FLAG{DOCKER_PORT_8080_3000}",
    ],
    flag: "FLAG{DOCKER_PORT_8080_3000}",
  },
  {
    id: 5,
    title: "Level 5: Base64 Config Secret Extraction",
    domain: "Security & Auth",
    difficulty: "Medium",
    scenario: "An obfuscated JWT root secret was captured in a staging environment: `RkxBR3tUSEVfU0FCQklSX05FT05fRk9SR0VfMjAyNn0=`. Decode this Base64 payload to retrieve the final root flag.",
    initialOutput: [
      "[SECURITY AUDIT]",
      "Obfuscated Token: RkxBR3tUSEVfU0FCQklSX05FT05fRk9SR0VfMjAyNn0=",
      "Format: Standard Base64 encoded ASCII string",
      "Decode the string or use the decoded value to claim the final trophy.",
    ],
    hint: "Decode in your terminal with `echo <token> | base64 -d` or use our /tools Base64 decoder.",
    quickCommand: "FLAG{THE_SABBIR_NEON_FORGE_2026}",
    solutionRegex: /(FLAG\{THE_SABBIR_NEON_FORGE_2026\}|base64\s+-d)/i,
    successOutput: [
      "[OK] Decoding Base64 buffer...",
      "     Input:  RkxBR3tUSEVfU0FCQklSX05FT05fRk9SR0VfMjAyNn0=",
      "     Decoded: FLAG{THE_SABBIR_NEON_FORGE_2026}",
      "[ROOT] ALL CHALLENGES OVERCOME! FULL SUITE UNLOCKED.",
      "🏆 ROOT PRIVILEGES GRANTED: 1000/1000 POINTS",
    ],
    flag: "FLAG{THE_SABBIR_NEON_FORGE_2026}",
  },
];

export function TerminalCTF() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(LEVELS[0].initialOutput);
  const [inputVal, setInputVal] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const level = LEVELS[currentLevelIdx];
  const isCurrentSolved = completedLevels.includes(level.id);
  const isAllSolved = completedLevels.length === LEVELS.length;
  const score = completedLevels.length * 200;

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Handle level change
  const handleSelectLevel = (idx: number) => {
    sound.click();
    setCurrentLevelIdx(idx);
    setShowHint(false);
    setInputVal("");
    const targetLevel = LEVELS[idx];
    if (completedLevels.includes(targetLevel.id)) {
      setTerminalLogs([...targetLevel.initialOutput, ...targetLevel.successOutput]);
    } else {
      setTerminalLogs(targetLevel.initialOutput);
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    sound.terminalSubmit();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const newLogs = [...terminalLogs, `guest@thesabbir-devbox:~$ ${trimmed}`];

    if (trimmed.toLowerCase() === "clear") {
      setTerminalLogs([]);
      setInputVal("");
      return;
    }

    if (trimmed.toLowerCase() === "help") {
      newLogs.push(
        "Available commands:",
        "  hint      - Show the level hint",
        "  clear     - Clear the terminal screen",
        "  reset     - Reset current level output",
        "  <solution> - Enter shell/SQL command to solve the challenge",
      );
      setTerminalLogs(newLogs);
      setInputVal("");
      return;
    }

    if (trimmed.toLowerCase() === "hint") {
      setShowHint(true);
      newLogs.push(`[HINT] ${level.hint}`);
      setTerminalLogs(newLogs);
      setInputVal("");
      return;
    }

    if (trimmed.toLowerCase() === "reset") {
      setTerminalLogs(level.initialOutput);
      setInputVal("");
      return;
    }

    // Check solution
    if (level.solutionRegex.test(trimmed)) {
      sound.success();
      newLogs.push(...level.successOutput);
      if (!completedLevels.includes(level.id)) {
        const nextCompleted = [...completedLevels, level.id];
        setCompletedLevels(nextCompleted);
        if (nextCompleted.length === LEVELS.length) {
          sound.milestone("ctf-complete");
        }
      }
    } else {
      sound.error();
      newLogs.push(
        `[FAIL] Command failed or condition not satisfied: "${trimmed}"`,
        "Try reviewing the scenario above, or type 'hint' for guidance.",
      );
    }

    setTerminalLogs(newLogs);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? commandHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Telemetry & Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl surface-card border border-line shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
              <TerminalIcon className="w-6 h-6" />
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse border-2 border-surface" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-ink text-base sm:text-lg">Terminal &amp; SQL CTF</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                v5.0 Neon Forge
              </span>
            </div>
            <p className="text-xs text-ink-3">Interactive in-browser sysadmin &amp; database troubleshooting lab</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-surface border border-line">
            <span className="text-ink-3">Score: </span>
            <span className="font-bold text-primary text-sm">{score} / 1000 PTS</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-surface border border-line">
            <span className="text-ink-3">Flags: </span>
            <span className="font-bold text-emerald-500 text-sm">
              🚩 {completedLevels.length} / {LEVELS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LEVELS.map((lvl, idx) => {
          const isSolved = completedLevels.includes(lvl.id);
          const isSelected = idx === currentLevelIdx;
          return (
            <button
              key={lvl.id}
              onClick={() => handleSelectLevel(idx)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : isSolved
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "surface-card text-ink-2 border-line hover:border-primary/40"
              }`}
            >
              {isSolved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-current opacity-60 text-[9px] grid place-items-center">
                  {lvl.id}
                </span>
              )}
              <span>Level {lvl.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Scenario Card */}
      <div className="rounded-2xl surface-card border border-line p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-ink text-base sm:text-lg">{level.title}</h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
              {level.domain}
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-ink-3">
            Difficulty: {level.difficulty}
          </span>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed">{level.scenario}</p>

        {/* Action / Help Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                setShowHint(!showHint);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line hover:border-gold/50 text-ink-2 hover:text-gold transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-gold" />
              <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setInputVal(level.quickCommand);
                inputRef.current?.focus();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line hover:border-primary/50 text-ink-2 hover:text-primary transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Auto-Fill Solution</span>
            </button>
          </div>

          {isCurrentSolved && (
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Level Completed (+200 pts)</span>
            </span>
          )}
        </div>

        {showHint && (
          <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-xs text-ink-2 leading-relaxed animate-in fade-in">
            <span className="font-bold text-gold">💡 Architectural Hint: </span>
            {level.hint}
          </div>
        )}
      </div>

      {/* Retro Interactive Terminal Box */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-zinc-400 text-[11px] font-medium hidden sm:inline">
              guest@thesabbir-devbox:~ (Level {level.id}/5 — {level.domain})
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span>bash 5.2</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setTerminalLogs(level.initialOutput);
              }}
              className="hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>reset</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen / Output Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-5 max-h-[360px] overflow-y-auto space-y-1.5 text-zinc-300 font-mono scrollbar-thin scrollbar-thumb-zinc-800 cursor-text"
        >
          {terminalLogs.map((log, i) => {
            const isPrompt = log.startsWith("guest@thesabbir-devbox:~$");
            const isSuccess = log.includes("FLAG CAPTURED") || log.includes("[OK]") || log.includes("active (running)");
            const isError = log.includes("[FAIL]") || log.includes("Error:") || log.includes("Active: failed");
            const isWarning = log.includes("Hint:") || log.includes("Constraint:");

            return (
              <div
                key={i}
                className={`leading-relaxed whitespace-pre-wrap break-all ${
                  isPrompt
                    ? "text-emerald-400 font-bold"
                    : isSuccess
                    ? "text-emerald-300"
                    : isError
                    ? "text-rose-400"
                    : isWarning
                    ? "text-amber-300"
                    : "text-zinc-300"
                }`}
              >
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="flex items-center px-4 py-3 bg-zinc-900 border-t border-zinc-800 text-zinc-200">
          <span className="text-emerald-400 font-bold shrink-0 mr-2 select-none">
            guest@thesabbir-devbox:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => {
              sound.type();
              setInputVal(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isCurrentSolved ? "Level solved! Type another command or proceed..." : "Type command, or click 'Auto-Fill Solution' above..."}
            className="w-full bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:ring-0"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => executeCommand(inputVal)}
            className="ml-2 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shrink-0 transition-colors"
          >
            Run
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          disabled={currentLevelIdx === 0}
          onClick={() => handleSelectLevel(currentLevelIdx - 1)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-medium border border-line surface-card text-ink-2 disabled:opacity-40 hover:border-primary/40 transition-colors"
        >
          ← Previous Level
        </button>

        {isAllSolved ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-bold">
            <Trophy className="w-4 h-4 text-gold" />
            <span>All 5 Flags Solved! Root Acquired.</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={currentLevelIdx === LEVELS.length - 1}
            onClick={() => handleSelectLevel(currentLevelIdx + 1)}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Next Level</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Victory Trophies Card when all 5 are solved */}
      {isAllSolved && (
        <div className="rounded-2xl surface-card border-2 border-emerald-500/40 p-6 sm:p-8 text-center space-y-4 animate-in zoom-in-95">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">CTF Root Certification Cleared!</h3>
          <p className="text-sm text-ink-2 max-w-lg mx-auto">
            You successfully solved all 5 real-world Linux, networking, PostgreSQL query tuning, Docker container mapping, and security challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {LEVELS.map((lvl) => (
              <span key={lvl.id} className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {lvl.flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
