"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Heart,
  Trophy,
  Play,
  RotateCcw,
  Activity,
  Layers,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface PacketDefenderProps {
  onComplete?: (data: ScorecardData) => void;
}

interface Packet {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100%
  type: "clean" | "malicious";
  label: string;
  proto: string;
  speed: number;
}

const CLEAN_PROTOCOLS = [
  { proto: "HTTPS 443", label: "GET /api/checkout" },
  { proto: "Postgres 5432", label: "SELECT * FROM orders" },
  { proto: "DNS 53", label: "A sabbir.nav.bd" },
  { proto: "SSH 22", label: "PubKey Auth: root" },
  { proto: "WSS 8443", label: "Realtime Telemetry" },
];

const ATTACK_PROTOCOLS = [
  { proto: "SYN-Flood", label: "DDoS 100k SYN/s" },
  { proto: "SQLi 80", label: "UNION SELECT password" },
  { proto: "SSH-Brute", label: "Failed root login x50" },
  { proto: "NTP-Amp", label: "UDP Amp reflection" },
  { proto: "XSS 443", label: "<script>alert(1)</script>" },
];

export function PacketDefender({ onComplete }: PacketDefenderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [shieldHealth, setShieldHealth] = useState(100);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [packetsProcessed, setPacketsProcessed] = useState(0);
  const [packetsCorrect, setPacketsCorrect] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isBossWave, setIsBossWave] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const packetIdCounter = useRef<number>(1);
  const gameStartTimeRef = useRef<number>(0);

  const endGame = useCallback(
    (finalScore: number, correct: number, total: number, durationSec: number) => {
      setIsPlaying(false);
      setIsGameOver(true);
      sound.gameOver();

      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
      const rankTier =
        finalScore >= 6000
          ? "S-Tier // Kernel Master"
          : finalScore >= 3500
          ? "SQL Architect"
          : "NOC Specialist";

      if (finalScore >= 4000) {
        osStore.unlockBadge("firewall-hero");
      }

      if (onComplete) {
        onComplete({
          gameId: "packet-defender",
          gameTitle: "Packet Defender: NOC DDoS Firewall",
          playerHandle: osStore.getState().handle,
          score: finalScore,
          rankTier,
          accuracyPct: accuracy,
          timeTakenSeconds: durationSec,
          xpEarned: Math.round(finalScore * 0.1),
        });
      }
    },
    [onComplete]
  );

  const startGame = () => {
    sound.click();
    sound.launch();
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setStreak(1);
    setShieldHealth(100);
    setPackets([]);
    setPacketsProcessed(0);
    setPacketsCorrect(0);
    setGameTime(0);
    setIsBossWave(false);
    lastSpawnRef.current = performance.now();
    gameStartTimeRef.current = performance.now();
  };

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let localPackets = [...packets];
    let localScore = score;
    let localHealth = shieldHealth;
    let localStreak = streak;
    let localProcessed = packetsProcessed;
    let localCorrect = packetsCorrect;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsedSec = Math.floor((now - gameStartTimeRef.current) / 1000);
      setGameTime(elapsedSec);

      // Check Boss Wave every 20 seconds
      const bossActive = elapsedSec > 0 && elapsedSec % 20 < 7;
      setIsBossWave(bossActive);

      // Spawn packet
      const spawnInterval = bossActive ? 450 : 900;
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const lane = Math.floor(Math.random() * 3);
        const isMalicious = Math.random() < (bossActive ? 0.75 : 0.45);
        const protoPool = isMalicious ? ATTACK_PROTOCOLS : CLEAN_PROTOCOLS;
        const selected = protoPool[Math.floor(Math.random() * protoPool.length)];

        const newPacket: Packet = {
          id: packetIdCounter.current++,
          lane,
          y: 0,
          type: isMalicious ? "malicious" : "clean",
          label: selected.label,
          proto: selected.proto,
          speed: (bossActive ? 2.2 : 1.4) + Math.random() * 0.4,
        };

        localPackets.push(newPacket);
      }

      // Move packets down
      const updated: Packet[] = [];
      for (const p of localPackets) {
        const nextY = p.y + p.speed;
        if (nextY >= 92) {
          // Packet reached firewall boundary without player intervention
          localProcessed++;
          if (p.type === "malicious") {
            // Malicious packet hit server!
            sound.error();
            localHealth = Math.max(0, localHealth - 15);
            localStreak = 1;
          } else {
            // Clean packet passed naturally through firewall
            localScore += 50;
            localCorrect++;
          }
        } else {
          updated.push({ ...p, y: nextY });
        }
      }

      localPackets = updated;
      setPackets(updated);
      setScore(localScore);
      setShieldHealth(localHealth);
      setStreak(localStreak);
      setPacketsProcessed(localProcessed);
      setPacketsCorrect(localCorrect);

      // Game Over check
      if (localHealth <= 0) {
        clearInterval(interval);
        endGame(localScore, localCorrect, localProcessed, elapsedSec);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, endGame]);

  // Action: Filter packet in lane (DROP malicious vs ALLOW clean)
  const handleAction = (lane: number, action: "allow" | "drop") => {
    if (!isPlaying) return;

    // Find nearest packet in lane closest to firewall threshold (y > 40)
    const inLane = packets
      .filter((p) => p.lane === lane && p.y > 35)
      .sort((a, b) => b.y - a.y);

    if (inLane.length === 0) {
      sound.miss();
      return;
    }

    const target = inLane[0];
    const isCorrect =
      (action === "drop" && target.type === "malicious") ||
      (action === "allow" && target.type === "clean");

    setPacketsProcessed((prev) => prev + 1);

    if (isCorrect) {
      sound.combo(streak);
      const points = action === "drop" ? 250 : 150;
      const bonus = points * streak;
      setScore((s) => s + bonus);
      setStreak((st) => Math.min(10, st + 1));
      setPacketsCorrect((c) => c + 1);
    } else {
      sound.error();
      setStreak(1);
      setShieldHealth((h) => Math.max(0, h - 12));
    }

    // Remove filtered packet
    setPackets((prev) => prev.filter((p) => p.id !== target.id));
  };

  // Keyboard Shortcuts (1, 2, 3 to Drop, Q, W, E to Allow)
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") handleAction(0, "drop");
      if (e.key === "2") handleAction(1, "drop");
      if (e.key === "3") handleAction(2, "drop");
      if (e.key.toLowerCase() === "q") handleAction(0, "allow");
      if (e.key.toLowerCase() === "w") handleAction(1, "allow");
      if (e.key.toLowerCase() === "e") handleAction(2, "allow");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, packets, streak]);

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-ink">
            Packet Defender // NOC DDoS Firewall
          </span>
          {isBossWave && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/40 animate-pulse">
              ⚠️ Boss Wave: Botnet SYN Flood
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}x Combo</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-ink-2">
            <Heart className={`w-3.5 h-3.5 ${shieldHealth < 30 ? "text-red-500 animate-ping" : "text-emerald-500"}`} />
            <span>{shieldHealth}% Shield</span>
          </div>
        </div>
      </div>

      {/* Main Arcade Arena */}
      <div className="relative bg-zinc-950 min-h-[380px] p-4 flex flex-col justify-between overflow-hidden">
        {/* Subtle Network Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* 3-Lane Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3 flex-1 h-[280px]">
          {[0, 1, 2].map((laneIdx) => (
            <div
              key={laneIdx}
              className="relative h-full rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-2 text-center text-[11px] font-mono text-zinc-400 border-b border-zinc-800/80 bg-zinc-950/60">
                Lane {laneIdx + 1}: {laneIdx === 0 ? "WAN 1" : laneIdx === 1 ? "WAN 2" : "DMZ Inbound"}
              </div>

              {/* Falling Packets */}
              <div className="relative flex-1">
                {packets
                  .filter((p) => p.lane === laneIdx)
                  .map((p) => (
                    <div
                      key={p.id}
                      style={{ top: `${p.y}%` }}
                      className={`absolute left-2 right-2 p-1.5 rounded-lg border text-[11px] font-mono shadow-md transition-all duration-75 ${
                        p.type === "malicious"
                          ? "bg-red-950/80 border-red-500 text-red-300"
                          : "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{p.proto}</span>
                        <span className="text-[9px] uppercase px-1 rounded bg-black/40">
                          {p.type === "malicious" ? "DROP" : "ALLOW"}
                        </span>
                      </div>
                      <div className="text-[10px] opacity-80 truncate">{p.label}</div>
                    </div>
                  ))}
              </div>

              {/* Firewall Threshold Line */}
              <div className="border-t-2 border-red-500/40 bg-red-500/10 px-2 py-1 text-[9px] font-mono text-red-400 text-center uppercase tracking-wider">
                Firewall Drop Zone
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls for each lane */}
        <div className="relative z-10 grid grid-cols-3 gap-3 pt-3">
          {[0, 1, 2].map((laneIdx) => (
            <div key={laneIdx} className="flex gap-1.5">
              <button
                onClick={() => handleAction(laneIdx, "allow")}
                disabled={!isPlaying}
                className="flex-1 py-2 px-1 text-center rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold transition disabled:opacity-40"
              >
                ALLOW <span className="hidden sm:inline">[{laneIdx === 0 ? "Q" : laneIdx === 1 ? "W" : "E"}]</span>
              </button>
              <button
                onClick={() => handleAction(laneIdx, "drop")}
                disabled={!isPlaying}
                className="flex-1 py-2 px-1 text-center rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500 text-red-400 font-mono text-xs font-bold transition disabled:opacity-40"
              >
                DROP <span className="hidden sm:inline">[{laneIdx + 1}]</span>
              </button>
            </div>
          ))}
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-sm text-center">
            {isGameOver ? (
              <>
                <h4 className="text-xl font-extrabold text-white mb-1">Firewall Breached!</h4>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Final Score: <span className="text-primary font-bold">{score.toLocaleString()} PTS</span> • Time: {gameTime}s
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4" /> Defend Again
                </button>
              </>
            ) : (
              <>
                <ShieldAlert className="w-12 h-12 text-primary mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Packet Defender NOC Firewall</h4>
                <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
                  Route clean traffic (HTTPS, PostgreSQL, DNS) and DROP malicious packets (SYN DDoS, SQLi) across 3 router lanes!
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                  >
                    <Play className="w-4 h-4 fill-white" /> Engage Firewall
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
