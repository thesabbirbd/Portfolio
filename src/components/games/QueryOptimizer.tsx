"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Flame,
  Snowflake,
  Cpu,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface QueryOptimizerProps {
  onComplete?: (data: ScorecardData) => void;
}

interface SlowQueryScenario {
  id: number;
  title: string;
  table: string;
  query: string;
  explainOutput: string[];
  initialLatencyMs: number;
  cpuTempCelsius: number;
  options: {
    label: string;
    action: string;
    isOptimal: boolean;
    resultExplain: string[];
    resultLatencyMs: number;
    explanation: string;
  }[];
}

const SCENARIOS: SlowQueryScenario[] = [
  {
    id: 1,
    title: "Scenario 1: Pharmacy Batch Expiry Filter",
    table: "inventory_batches (180,000 rows)",
    query: "SELECT * FROM inventory_batches WHERE shop_id = 42 AND expiry_date <= CURRENT_DATE + 30;",
    explainOutput: [
      "Seq Scan on inventory_batches (cost=0.00..8920.00 rows=1400)",
      "  Filter: ((shop_id = 42) AND (expiry_date <= (CURRENT_DATE + '30 days'::interval)))",
      "  Rows Removed by Filter: 178600",
      "Execution Time: 2,450.12 ms [CRITICAL]",
    ],
    initialLatencyMs: 2450,
    cpuTempCelsius: 96,
    options: [
      {
        label: "A. Composite B-Tree Index on (shop_id, expiry_date)",
        action: "CREATE INDEX idx_batches_shop_expiry ON inventory_batches(shop_id, expiry_date);",
        isOptimal: true,
        resultExplain: [
          "Index Scan using idx_batches_shop_expiry (cost=0.42..18.50 rows=1400)",
          "  Index Cond: ((shop_id = 42) AND (expiry_date <= ...))",
          "Execution Time: 0.88 ms [SPEEDUP: 2784x]",
        ],
        resultLatencyMs: 0.88,
        explanation: "Composite index on equality filter (shop_id) followed by range filter (expiry_date) enables pure Index Scan.",
      },
      {
        label: "B. Single Index on expiry_date only",
        action: "CREATE INDEX idx_batches_expiry ON inventory_batches(expiry_date);",
        isOptimal: false,
        resultExplain: [
          "Bitmap Heap Scan on inventory_batches (cost=45.20..1420.00 rows=1400)",
          "Execution Time: 84.15 ms",
        ],
        resultLatencyMs: 84.15,
        explanation: "Better than Seq Scan, but still filters shop_id in memory. Composite index is vastly superior.",
      },
      {
        label: "C. Increase PostgreSQL work_mem to 1GB",
        action: "SET work_mem = '1GB';",
        isOptimal: false,
        resultExplain: [
          "Seq Scan on inventory_batches (cost=0.00..8920.00 rows=1400)",
          "Execution Time: 2,410.00 ms",
        ],
        resultLatencyMs: 2410,
        explanation: "work_mem only affects in-memory sorts/hashes, not Sequential table scans.",
      },
    ],
  },
  {
    id: 2,
    title: "Scenario 2: Leading Wildcard Phone Search",
    table: "customer_profiles (450,000 rows)",
    query: "SELECT id, name, phone FROM customer_profiles WHERE phone LIKE '%01711%';",
    explainOutput: [
      "Seq Scan on customer_profiles (cost=0.00..22450.00 rows=120)",
      "  Filter: (phone ~~ '%01711%'::text)",
      "Execution Time: 1,840.40 ms [HIGH CPU]",
    ],
    initialLatencyMs: 1840,
    cpuTempCelsius: 92,
    options: [
      {
        label: "A. GIN Trigram Index (pg_trgm)",
        action: "CREATE EXTENSION pg_trgm; CREATE INDEX idx_trgm_phone ON customer_profiles USING gin (phone gin_trgm_ops);",
        isOptimal: true,
        resultExplain: [
          "Bitmap Index Scan on idx_trgm_phone (cost=0.00..15.20 rows=120)",
          "  Index Cond: (phone ~~ '%01711%'::text)",
          "Execution Time: 1.45 ms [SPEEDUP: 1269x]",
        ],
        resultLatencyMs: 1.45,
        explanation: "Standard B-tree cannot index leading wildcards ('%...'). pg_trgm decomposes strings into 3-character trigrams for instant fuzzy/substring lookups.",
      },
      {
        label: "B. Standard B-Tree Index on phone",
        action: "CREATE INDEX idx_phone ON customer_profiles(phone);",
        isOptimal: false,
        resultExplain: [
          "Seq Scan on customer_profiles (cost=0.00..22450.00 rows=120)",
          "Execution Time: 1,820.00 ms",
        ],
        resultLatencyMs: 1820,
        explanation: "B-tree indices cannot be traversed when the search term begins with a wildcard '%'.",
      },
      {
        label: "C. Cache whole table in Redis",
        action: "Cache entire 450k profiles in Redis key-value store",
        isOptimal: false,
        resultExplain: [
          "Redis memory overflow warning: 340MB consumed",
          "Execution Time: 15.00 ms",
        ],
        resultLatencyMs: 15,
        explanation: "Dumping entire mutable relational tables into Redis introduces sync drift and excessive RAM usage.",
      },
    ],
  },
  {
    id: 3,
    title: "Scenario 3: Unbounded Order Feed & Sorting",
    table: "ecommerce_orders (850,000 rows)",
    query: "SELECT id, customer_id, total_bdt, created_at FROM ecommerce_orders ORDER BY created_at DESC;",
    explainOutput: [
      "Sort (cost=145200.00..147325.00 rows=850000) (Memory Spill to Disk: 48MB)",
      "  Sort Key: created_at DESC",
      "  -> Seq Scan on ecommerce_orders",
      "Execution Time: 3,890.10 ms [OOM RISK]",
    ],
    initialLatencyMs: 3890,
    cpuTempCelsius: 98,
    options: [
      {
        label: "A. B-Tree Index on (created_at DESC) + LIMIT 25",
        action: "CREATE INDEX idx_orders_created_desc ON ecommerce_orders(created_at DESC); Add LIMIT 25.",
        isOptimal: true,
        resultExplain: [
          "Limit (cost=0.42..2.85 rows=25)",
          "  -> Index Scan Backward on idx_orders_created_desc",
          "Execution Time: 0.42 ms [SPEEDUP: 9260x]",
        ],
        resultLatencyMs: 0.42,
        explanation: "An index ordered by created_at DESC allows PostgreSQL to read exactly 25 leaf pages and halt immediately.",
      },
      {
        label: "B. Add OFFSET 10000 to paginate",
        action: "SELECT ... ORDER BY created_at DESC OFFSET 10000 LIMIT 25;",
        isOptimal: false,
        resultExplain: [
          "Index Scan Backward on idx_orders_created_desc",
          "  Rows Removed by Filter: 10000",
          "Execution Time: 45.20 ms",
        ],
        resultLatencyMs: 45.2,
        explanation: "High OFFSET still scans and discards 10,000 rows. Keyset/cursor pagination is much better.",
      },
    ],
  },
];

export function QueryOptimizer({ onComplete }: QueryOptimizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [cpuTemp, setCpuTemp] = useState(96);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [startTime] = useState<number>(() => Date.now());

  const current = SCENARIOS[scenarioIdx];

  const startGame = () => {
    sound.launch();
    setIsPlaying(true);
    setIsGameOver(false);
    setScenarioIdx(0);
    setScore(0);
    setCpuTemp(96);
    setSelectedOpt(null);
    setResolved(false);
  };

  const handleSelectOption = (idx: number) => {
    if (!isPlaying || resolved) return;
    setSelectedOpt(idx);
    setResolved(true);

    const opt = current.options[idx];
    if (opt.isOptimal) {
      sound.levelUp();
      const points = 2000;
      setScore((s) => s + points);
      setCpuTemp((t) => Math.max(38, t - 20));
    } else {
      sound.error();
      setScore((s) => Math.max(0, s + 300));
      setCpuTemp((t) => Math.min(100, t + 2));
    }
  };

  const handleNext = () => {
    sound.click();
    if (scenarioIdx < SCENARIOS.length - 1) {
      setScenarioIdx((s) => s + 1);
      setSelectedOpt(null);
      setResolved(false);
      setCpuTemp(SCENARIOS[scenarioIdx + 1].cpuTempCelsius);
    } else {
      // Game Complete
      setIsPlaying(false);
      setIsGameOver(true);
      osStore.unlockBadge("index-wizard");

      const durationSec = Math.round((Date.now() - startTime) / 1000);
      const finalScore = score + Math.max(0, 100 - durationSec) * 10;

      if (onComplete) {
        onComplete({
          gameId: "query-optimizer",
          gameTitle: "Query Optimizer: Slow-Log Rescue",
          playerHandle: osStore.getState().handle,
          score: finalScore,
          rankTier: finalScore >= 5500 ? "S-Tier // Kernel Master" : "SQL Architect",
          accuracyPct: 100,
          timeTakenSeconds: durationSec,
          xpEarned: Math.round(finalScore * 0.1),
        });
      }
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-ink">
            Query Optimizer // Slow-Log Rescue
          </span>
          <span className="text-[10px] font-mono text-ink-3">
            Case {scenarioIdx + 1}/{SCENARIOS.length}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>

          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-ink-3" />
            <span
              className={`font-bold ${
                cpuTemp > 80 ? "text-red-500 animate-pulse" : cpuTemp > 60 ? "text-amber-500" : "text-emerald-500"
              }`}
            >
              {cpuTemp}°C CPU Temp
            </span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="relative bg-zinc-950 min-h-[380px] p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
              Target Table: {current.table}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{current.title}</h3>
          </div>

          {/* Slow SQL Box */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-amber-300">
            <div className="text-[10px] uppercase text-zinc-500 mb-1">Slow Query Log</div>
            {current.query}
          </div>

          {/* EXPLAIN ANALYZE Output */}
          <div className="p-3 rounded-xl bg-black border border-zinc-800/80 font-mono text-[11px] text-zinc-300 space-y-1">
            <div className="text-[10px] uppercase text-zinc-500 mb-1">EXPLAIN ANALYZE Output</div>
            {current.explainOutput.map((line, i) => (
              <div key={i} className={line.includes("CRITICAL") ? "text-red-400 font-bold" : ""}>
                {line}
              </div>
            ))}
          </div>

          {/* Tuning Options */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-zinc-400">Select Database Optimization Strategy:</div>
            <div className="grid grid-cols-1 gap-2">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={!isPlaying || resolved}
                  className={`p-3 rounded-xl border text-left font-mono text-xs transition ${
                    selectedOpt === idx
                      ? opt.isOptimal
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                        : "bg-red-950/80 border-red-500 text-red-200"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-primary/60 hover:bg-zinc-850"
                  }`}
                >
                  <div className="font-bold text-white">{opt.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{opt.action}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Solution Explanation if resolved */}
          {resolved && selectedOpt !== null && (
            <div className="p-3 rounded-xl bg-muted/20 border border-line space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                {current.options[selectedOpt].isOptimal ? "Optimal Index Plan Executed!" : "Sub-optimal Strategy Applied"}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {current.options[selectedOpt].explanation}
              </p>
              <button
                onClick={handleNext}
                className="mt-2 px-4 py-2 rounded-xl bg-primary text-white font-medium text-xs hover:bg-primary-hover transition"
              >
                {scenarioIdx < SCENARIOS.length - 1 ? "Next Query Case →" : "Finish Triage & View Scorecard"}
              </button>
            </div>
          )}
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-sm text-center">
            {isGameOver ? (
              <>
                <Snowflake className="w-12 h-12 text-sky-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Database CPU Stabilized!</h4>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Final Score: <span className="text-primary font-bold">{score.toLocaleString()} PTS</span> • CPU: {cpuTemp}°C
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4" /> Optimize Again
                </button>
              </>
            ) : (
              <>
                <Database className="w-12 h-12 text-primary mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Query Optimizer: Slow-Log Rescue</h4>
                <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
                  PostgreSQL database CPU is spiking to 96°C! Read EXPLAIN plans, apply B-tree, trigram or composite indexes to rescue the server.
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-white" /> Launch Rescue Mission
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
