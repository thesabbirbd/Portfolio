"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Terminal,
  ShieldAlert,
  Zap,
  Database,
  Server,
  Trophy,
  Sparkles,
  Flame,
  Gamepad2,
  Calendar,
  Award,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useOSStore, osStore } from "@/lib/os-store";
import { CareerPassportModal } from "./CareerPassportModal";
import { SqlDetective } from "./SqlDetective";
import { KernelBreach } from "./KernelBreach";
import { PacketDefender } from "./PacketDefender";
import { ContainerGrid } from "./ContainerGrid";
import { SubnetSprint } from "./SubnetSprint";
import { QueryOptimizer } from "./QueryOptimizer";
import { UptimeArchitect } from "./UptimeArchitect";
import { GameEndScorecard } from "./GameEndScorecard";
import { GlobalLeaderboard } from "./GlobalLeaderboard";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export type ArcadeGameId =
  | "sql-detective"
  | "kernel-breach"
  | "packet-defender"
  | "container-grid"
  | "subnet-sprint"
  | "query-optimizer"
  | "uptime-architect";

interface GameTab {
  id: ArcadeGameId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  desc: string;
}

const ARCADE_GAMES: GameTab[] = [
  {
    id: "sql-detective",
    name: "SQL Detective",
    icon: Database,
    tag: "Server Heist Mystery",
    desc: "Investigate a 03:15 AM database heist across VPN and audit logs to catch the culprit.",
  },
  {
    id: "kernel-breach",
    name: "Kernel Breach",
    icon: Terminal,
    tag: "Terminal & SQL CTF",
    desc: "Diagnose systemd failures, subnet sizes, and SQL indices in a terminal shell.",
  },
  {
    id: "packet-defender",
    name: "Packet Defender",
    icon: ShieldAlert,
    tag: "NOC DDoS Firewall",
    desc: "3-lane real-time arcade: allow clean traffic and DROP botnet floods.",
  },
  {
    id: "container-grid",
    name: "Container Grid",
    icon: Server,
    tag: "Docker & K8s Puzzle",
    desc: "Wire Nginx, FastAPI, Redis, and Postgres replicas without 502 or OOM errors.",
  },
  {
    id: "subnet-sprint",
    name: "Subnet Sprint",
    icon: Zap,
    tag: "60s Binary & Regex",
    desc: "Toggle 8-bit switches (128..1) and solve high-speed CIDR & regex questions.",
  },
  {
    id: "uptime-architect",
    name: "Uptime Architect",
    icon: Server,
    tag: "Chaos Simulator",
    desc: "Balance RAM, FastAPI workers, and DC-UPS battery to hold 99.99% uptime.",
  },
  {
    id: "query-optimizer",
    name: "Query Optimizer",
    icon: Database,
    tag: "Slow-Log Rescue",
    desc: "Postgres CPU is 96°C! Read EXPLAIN plans and apply B-tree indices.",
  },
];

export function GameArcadeHub() {
  const searchParams = useSearchParams();
  const profile = useOSStore();

  const [activeGame, setActiveGame] = useState<ArcadeGameId>("kernel-breach");
  const [scorecardData, setScorecardData] = useState<ScorecardData | null>(null);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<{ game: string; target: number } | null>(null);

  // Deterministic daily seeded ops mission
  const todayStr = new Date().toISOString().split("T")[0];
  const dateSeed = todayStr.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0);
  const dailyGame = ARCADE_GAMES[dateSeed % ARCADE_GAMES.length];
  const dailyTarget = 1200 + (dateSeed % 6) * 300;
  const isDailyComplete = (profile.highScores[dailyGame.id] || 0) >= dailyTarget;

  // Check URL parameters for direct challenge links
  useEffect(() => {
    if (!searchParams) return;
    const challenge = searchParams.get("challenge") as ArcadeGameId | null;
    const target = searchParams.get("target");

    if (challenge && ARCADE_GAMES.some((g) => g.id === challenge)) {
      setActiveGame(challenge);
      if (target && !isNaN(Number(target))) {
        setChallengeTarget({ game: challenge, target: Number(target) });
      }
    }
  }, [searchParams]);

  const handleGameComplete = (data: ScorecardData) => {
    setScorecardData(data);
    setIsScorecardOpen(true);
  };

  const handleTabChange = (gameId: ArcadeGameId) => {
    sound.toggleSwitch();
    setActiveGame(gameId);
  };

  const activeTabMeta = ARCADE_GAMES.find((g) => g.id === activeGame) || ARCADE_GAMES[0];
  const personalBest = profile.highScores[activeGame] || 0;

  return (
    <div className="w-full space-y-8">
      {/* Challenge Notice if linked via query param */}
      {challengeTarget && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-500 font-mono text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
            <span>
              <strong>Challenge Received!</strong> Beat the target score of{" "}
              <strong>{challengeTarget.target.toLocaleString()} PTS</strong> in {challengeTarget.game}!
            </span>
          </div>
          <button
            onClick={() => setChallengeTarget(null)}
            className="text-[10px] uppercase underline hover:text-amber-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Daily Seeded Ops Challenge Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-surface to-surface border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-white shrink-0 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/15 text-primary font-bold">
                Daily Mission · {todayStr}
              </span>
              {isDailyComplete ? (
                <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                  ✓ COMPLETED (+150 XP)
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  REWARD: +150 OS XP
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-ink mt-0.5">
              Target: Score {dailyTarget.toLocaleString()}+ PTS in {dailyGame.name}
            </h4>
            <p className="text-xs text-ink-3">
              Seeded operational challenge refreshed every 24 hours UTC. Test your incident reaction time!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.launch();
            setActiveGame(dailyGame.id);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeGame === dailyGame.id
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-surface border border-line text-ink hover:border-primary"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{activeGame === dailyGame.id ? "Playing Today's Mission" : "Accept Mission →"}</span>
        </button>
      </div>

      {/* OS Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-line">
        <div className="flex items-center gap-3">
          <span className="text-xl">{profile.rank.badge}</span>
          <div>
            <div className="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
              <span>@{profile.handle}</span>
              <span className="text-[10px] font-normal text-ink-3">• {profile.rank.title}</span>
            </div>
            <div className="text-[11px] font-mono text-ink-3">
              Total OS XP: <span className="text-primary font-bold">{profile.totalXp} XP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-ink-3 uppercase block">Current Game High</span>
            <span className="font-bold text-primary">
              {personalBest > 0 ? `${personalBest.toLocaleString()} PTS` : "Unplayed"}
            </span>
          </div>

          <button
            onClick={() => {
              sound.launch();
              setIsPassportOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            <span>🪪 Career Passport (PNG)</span>
          </button>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2" role="tablist" aria-label="Engineering Arcade Games">
        {ARCADE_GAMES.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeGame;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 ${
                isActive
                  ? "bg-primary text-white border-primary shadow-[0_4px_16px_rgba(255,106,0,0.25)] scale-[1.02]"
                  : "bg-surface border-line text-ink-2 hover:text-ink hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary"}`} />
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  isActive ? "bg-white/20 text-white" : "bg-muted text-ink-3"
                }`}>
                  {tab.tag.split(" ")[0]}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{tab.name}</div>
                <div className={`text-[10px] mt-0.5 line-clamp-1 ${isActive ? "text-white/80" : "text-ink-3"}`}>
                  {tab.tag}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Display */}
      <div className="w-full">
        {activeGame === "sql-detective" && <SqlDetective onComplete={handleGameComplete} />}
        {activeGame === "kernel-breach" && <KernelBreach onComplete={handleGameComplete} />}
        {activeGame === "packet-defender" && <PacketDefender onComplete={handleGameComplete} />}
        {activeGame === "container-grid" && <ContainerGrid onComplete={handleGameComplete} />}
        {activeGame === "subnet-sprint" && <SubnetSprint onComplete={handleGameComplete} />}
        {activeGame === "uptime-architect" && <UptimeArchitect onComplete={handleGameComplete} />}
        {activeGame === "query-optimizer" && <QueryOptimizer onComplete={handleGameComplete} />}
      </div>

      {/* Scorecard Dialog */}
      {scorecardData && (
        <GameEndScorecard
          isOpen={isScorecardOpen}
          data={scorecardData}
          onClose={() => setIsScorecardOpen(false)}
          onPlayAgain={() => setIsScorecardOpen(false)}
        />
      )}

      {/* Global Arcade Leaderboard Table */}
      <GlobalLeaderboard />

      {/* Official Career Passport Holographic Modal */}
      <CareerPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />
    </div>
  );
}
