"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Zap,
  Flame,
  Trophy,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface SubnetSprintProps {
  onComplete?: (data: ScorecardData) => void;
}

interface BinaryBit {
  val: number;
  active: boolean;
}

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

interface CIDRQuestion {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  category?: "cidr" | "regex";
}

const CIDR_QUESTIONS: CIDRQuestion[] = [
  {
    question: "How many usable IPv4 hosts in a /27 subnet?",
    options: ["30 hosts", "32 hosts", "62 hosts", "14 hosts"],
    correct: "30 hosts",
    explanation: "2^(32-27) - 2 = 2^5 - 2 = 32 - 2 = 30 usable hosts (RFC 791).",
    category: "cidr",
  },
  {
    question: "What is the subnet mask for a /26 prefix?",
    options: ["255.255.255.192", "255.255.255.224", "255.255.255.128", "255.255.255.240"],
    correct: "255.255.255.192",
    explanation: "First 2 host bits = 128 + 64 = 192 -> 255.255.255.192.",
    category: "cidr",
  },
  {
    question: "Branch office needs 58 physical hosts. What is the minimum CIDR prefix?",
    options: ["/26 (62 hosts)", "/27 (30 hosts)", "/25 (126 hosts)", "/28 (14 hosts)"],
    correct: "/26 (62 hosts)",
    explanation: "/26 gives 62 usable hosts (62 >= 58 with only 4 wasted).",
    category: "cidr",
  },
  {
    question: "Broadcast IP for network 192.168.10.0/28?",
    options: ["192.168.10.15", "192.168.10.16", "192.168.10.31", "192.168.10.255"],
    correct: "192.168.10.15",
    explanation: "/28 block size is 16. Subnet spans .0 to .15. Broadcast is .15.",
    category: "cidr",
  },
  {
    question: "Point-to-point router link between two MikroTik routers requires which CIDR?",
    options: ["/30 (2 hosts)", "/29 (6 hosts)", "/31 (RFC 3021)", "/28 (14 hosts)"],
    correct: "/30 (2 hosts)",
    explanation: "Standard /30 allocates 4 IPs: 1 network, 2 usable router endpoints, 1 broadcast.",
    category: "cidr",
  },
  {
    question: "Which Regex pattern matches standard 4xx and 5xx HTTP error codes?",
    options: ["^[45]\\d{2}$", "^400|500$", "^[4-5]{3}$", "^\\d{4,5}$"],
    correct: "^[45]\\d{2}$",
    explanation: "^[45]\\d{2}$ matches any 3-digit status starting with 4 or 5 (400..599).",
    category: "regex",
  },
  {
    question: "Which Regex validates an ISO-8601 server date (YYYY-MM-DD)?",
    options: ["^\\d{4}-\\d{2}-\\d{2}$", "^[0-9]{2}-[0-9]{2}-[0-9]{4}$", "^\\w{4}-\\w{2}-\\w{2}$", "^\\d+-\\d+$"],
    correct: "^\\d{4}-\\d{2}-\\d{2}$",
    explanation: "\\d{4} matches 4 year digits, followed by hyphen and two digits each for month and day.",
    category: "regex",
  },
  {
    question: "Which Regex pattern safely extracts a Docker image tag after a colon (e.g. :latest)?",
    options: ["(?<=:)[a-zA-Z0-9_.-]+$", "^.*:", ":[0-9]+", "@[a-z]+$"],
    correct: "(?<=:)[a-zA-Z0-9_.-]+$",
    explanation: "Positive lookbehind (?<=:) matches the alphanumeric tag following the image colon delimiter.",
    category: "regex",
  },
];

export function SubnetSprint({ onComplete }: SubnetSprintProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState<"bits" | "cidr">("bits");
  const [targetNumber, setTargetNumber] = useState(192);
  const [bits, setBits] = useState<BinaryBit[]>(
    BIT_VALUES.map((val) => ({ val, active: false }))
  );
  const [currentCidrIdx, setCurrentCidrIdx] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const isOverclock = streak >= 3;

  const currentSum = bits.reduce((acc, b) => acc + (b.active ? b.val : 0), 0);

  const generateNewTarget = () => {
    // Generate interesting network octets (192, 224, 240, 248, 252, or random 1..255)
    const common = [128, 192, 224, 240, 248, 252, 254, 255, 168, 172, 10, 147, 85, 170];
    const picked = common[Math.floor(Math.random() * common.length)];
    setTargetNumber(picked);
    setBits(BIT_VALUES.map((val) => ({ val, active: false })));
  };

  const startGame = () => {
    sound.launch();
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setSolvedCount(0);
    setTotalAttempts(0);
    setMode("bits");
    generateNewTarget();
  };

  const endGame = (finalScore: number, solved: number, attempts: number) => {
    setIsPlaying(false);
    setIsGameOver(true);
    sound.gameOver();

    const accuracy = attempts > 0 ? Math.round((solved / attempts) * 100) : 100;
    const rankTier =
      finalScore >= 7000
        ? "S-Tier // Kernel Master"
        : finalScore >= 4000
        ? "SQL Architect"
        : "NOC Specialist";

    if (finalScore >= 5000) {
      osStore.unlockBadge("binary-blitz");
    }

    if (onComplete) {
      onComplete({
        gameId: "subnet-sprint",
        gameTitle: "Subnet & Regex Blitz: 60s Overclock",
        playerHandle: osStore.getState().handle,
        score: finalScore,
        rankTier,
        accuracyPct: accuracy,
        timeTakenSeconds: 60 - timeLeft,
        xpEarned: Math.round(finalScore * 0.1),
      });
    }
  };

  // Timer Tick
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          endGame(score, solvedCount, totalAttempts);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score, solvedCount, totalAttempts]);

  // Toggle Bit Switch
  const toggleBit = (idx: number) => {
    if (!isPlaying) return;
    sound.toggleSwitch();

    const nextBits = [...bits];
    nextBits[idx].active = !nextBits[idx].active;
    setBits(nextBits);

    const newSum = nextBits.reduce((acc, b) => acc + (b.active ? b.val : 0), 0);
    if (newSum === targetNumber) {
      // Bit target matched!
      handleSuccess();
    }
  };

  const handleCidrOption = (option: string) => {
    if (!isPlaying) return;
    const q = CIDR_QUESTIONS[currentCidrIdx];
    setTotalAttempts((a) => a + 1);

    if (option === q.correct) {
      handleSuccess();
      setCurrentCidrIdx((idx) => (idx + 1) % CIDR_QUESTIONS.length);
    } else {
      sound.error();
      setStreak(0);
    }
  };

  const handleSuccess = () => {
    const nextStreak = streak + 1;
    sound.combo(nextStreak);
    setStreak(nextStreak);
    setSolvedCount((c) => c + 1);
    setTotalAttempts((a) => a + 1);

    const basePoints = 200;
    const multiplier = nextStreak >= 3 ? 3 : 1;
    const earned = basePoints * multiplier;
    setScore((s) => s + earned);

    if (nextStreak === 3) {
      sound.levelUp();
      setTimeLeft((t) => Math.min(60, t + 5)); // +5s Overclock bonus
    }

    // Alternate between bit matching and CIDR questions every 2 solves
    if (Math.random() > 0.4) {
      setMode("bits");
      generateNewTarget();
    } else {
      setMode("cidr");
      setCurrentCidrIdx((idx) => (idx + 1) % CIDR_QUESTIONS.length);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-mono text-xs font-semibold text-ink">
            Subnet &amp; Regex Blitz // 60s Overclock
          </span>
          {isOverclock && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/40 animate-pulse flex items-center gap-1">
              <Flame className="w-3 h-3" /> Overclock 3x Active (+5s Bonus)
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>

          <div className="flex items-center gap-1 text-ink-2">
            <Timer className={`w-3.5 h-3.5 ${timeLeft < 15 ? "text-red-500 animate-ping" : "text-sky-400"}`} />
            <span className={`font-bold ${timeLeft < 15 ? "text-red-500" : ""}`}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="relative bg-zinc-950 min-h-[340px] p-5 flex flex-col justify-between">
        {mode === "bits" ? (
          /* Mode 1: 8-Bit Binary Switches */
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="text-center">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Match Decimal Target</span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1 tracking-wider">
                {targetNumber}
              </div>
              <div className="text-xs font-mono mt-1 text-zinc-400">
                Current Sum:{" "}
                <span className={`font-bold ${currentSum === targetNumber ? "text-emerald-400" : "text-amber-400"}`}>
                  {currentSum}
                </span>{" "}
                / {targetNumber}
              </div>
            </div>

            {/* 8 Binary Bit Switches */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full max-w-xl">
              {bits.map((b, idx) => (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => toggleBit(idx)}
                  disabled={!isPlaying}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center font-mono transition-all duration-150 ${
                    b.active
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,106,0,0.4)] scale-105"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-extrabold">{b.val}</span>
                  <span className={`text-[10px] mt-1 font-bold ${b.active ? "text-white" : "text-zinc-600"}`}>
                    {b.active ? "1" : "0"}
                  </span>
                </button>
              ))}
            </div>

            {/* Instant Bit Math Breakdown */}
            <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/80">
              Calculation:{" "}
              {bits.filter((b) => b.active).map((b) => b.val).join(" + ") || "0"} = {currentSum}
            </div>
          </div>
        ) : (
          /* Mode 2: CIDR Question */
          <div className="flex flex-col items-center justify-center flex-1 space-y-5 max-w-lg mx-auto w-full">
            <div className="text-center">
              <span className="text-[11px] font-mono uppercase text-amber-400">Rapid CIDR Question</span>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                {CIDR_QUESTIONS[currentCidrIdx].question}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {CIDR_QUESTIONS[currentCidrIdx].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleCidrOption(opt)}
                  disabled={!isPlaying}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/90 hover:border-primary/60 text-white font-mono text-xs font-semibold text-left transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-sm text-center">
            {isGameOver ? (
              <>
                <h4 className="text-xl font-extrabold text-white mb-1">Time Elapsed!</h4>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Final Score: <span className="text-primary font-bold">{score.toLocaleString()} PTS</span> • Solved: {solvedCount}
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4" /> Sprint Again
                </button>
              </>
            ) : (
              <>
                <Zap className="w-12 h-12 text-amber-500 mb-2 animate-bounce" />
                <h4 className="text-xl font-extrabold text-white mb-1">Subnet Sprint: 60s Binary Blitz</h4>
                <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
                  Toggle 8 binary switches (128|64|32|16|8|4|2|1) to match decimal targets and answer rapid CIDR questions. 3 in a row unlocks 3x Overclock!
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-white" /> Start 60s Blitz
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
