"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";
import { sound } from "@/lib/sound";
import { formatTimeSeconds } from "@/lib/scorecard-canvas";

interface LeaderboardItem {
  id: number | string;
  gameId: string;
  playerHandle: string;
  score: number;
  rankTier: string;
  accuracyPct: number;
  survivalSeconds: number;
  createdAt: string;
}

const GAME_NAMES: Record<string, string> = {
  "kernel-breach": "Kernel Breach",
  "packet-defender": "Packet Defender",
  "subnet-sprint": "Subnet Sprint",
  "query-optimizer": "Query Optimizer",
  "uptime-architect": "Uptime Architect",
};

export function GlobalLeaderboard() {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [scores, setScores] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async (gameId: string) => {
    setLoading(true);
    try {
      const url = gameId === "all" ? "/api/games/leaderboard" : `/api/games/leaderboard?game=${gameId}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.ok && Array.isArray(json.scores)) {
        setScores(json.scores);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(selectedGame);
  }, [selectedGame]);

  const handleRefresh = () => {
    sound.click();
    fetchScores(selectedGame);
  };

  return (
    <section aria-labelledby="leaderboard-heading" className="pt-10 border-t border-line">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" /> High Score Hall
          </div>
          <h2 id="leaderboard-heading" className="text-xl sm:text-2xl font-bold text-ink">
            Global Arcade Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 mt-0.5">
            Verified speeds, terminal triages, and network routing scores across THE SABBiR OS.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-muted/40 hover:bg-muted text-xs font-mono text-ink-2 hover:text-ink transition"
          aria-label="Refresh Leaderboard"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Game Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4" role="tablist" aria-label="Leaderboard Game Filter">
        <button
          role="tab"
          aria-selected={selectedGame === "all"}
          onClick={() => {
            sound.toggleSwitch();
            setSelectedGame("all");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
            selectedGame === "all"
              ? "bg-primary text-white font-bold"
              : "border border-line text-ink-3 hover:text-ink hover:bg-muted"
          }`}
        >
          All Games
        </button>
        {Object.entries(GAME_NAMES).map(([key, name]) => (
          <button
            key={key}
            role="tab"
            aria-selected={selectedGame === key}
            onClick={() => {
              sound.toggleSwitch();
              setSelectedGame(key);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
              selectedGame === key
                ? "bg-primary text-white font-bold"
                : "border border-line text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-line overflow-hidden surface-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-line bg-muted/40 text-ink-3">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-3">Mission</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
                <th className="py-2.5 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {loading && scores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-3">
                    Loading telemetry records...
                  </td>
                </tr>
              ) : scores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-3">
                    No scores recorded yet. Play a game to claim Rank #1!
                  </td>
                </tr>
              ) : (
                scores.map((entry, idx) => (
                  <tr key={entry.id || idx} className="hover:bg-muted/20 transition">
                    <td className="py-2.5 px-3 text-center font-bold">
                      {idx === 0 ? (
                        <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs">
                          🥇
                        </span>
                      ) : idx === 1 ? (
                        <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 text-xs">
                          🥈
                        </span>
                      ) : idx === 2 ? (
                        <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 text-xs">
                          🥉
                        </span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-ink">
                      @{entry.playerHandle}
                      <span className="block text-[10px] text-ink-3 font-normal">{entry.rankTier}</span>
                    </td>
                    <td className="py-2.5 px-3 text-ink-2">
                      {GAME_NAMES[entry.gameId] || entry.gameId}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-primary">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-500">
                      {entry.accuracyPct}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-ink-3">
                      {formatTimeSeconds(entry.survivalSeconds)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
