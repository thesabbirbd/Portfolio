"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Keyboard,
  RotateCcw,
  Trophy,
  Award,
  Download,
  Share2,
  Sparkles,
  Timer,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  TYPING_PASSAGES,
  TypingPassage,
  calculateTypingMetrics,
  TypingMetrics,
} from "@/lib/typing/typing-arena-engine";

export function TypingSpeedArenaStudio() {
  const [selectedPassage, setSelectedPassage] = useState<TypingPassage>(TYPING_PASSAGES[0]);
  const [typedText, setTypedText] = useState("");
  const [isTestActive, setIsTestActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 15, 30, 60 seconds
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "typing-speed-arena",
    toolName: "Typing Speed Arena",
  });

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedText("");
    setIsTestActive(false);
    setIsCompleted(false);
    setTimeLeft(selectedDuration);
    setMetrics(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetTest();
  }, [selectedPassage, selectedDuration]);

  // Handle countdown
  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, timeLeft]);

  const finishTest = () => {
    setIsTestActive(false);
    setIsCompleted(true);
    sound.levelUp();

    const elapsed = selectedDuration - Math.max(0, timeLeft);
    const m = calculateTypingMetrics(typedText, selectedPassage.text, elapsed || selectedDuration);
    setMetrics(m);

    // Sync XP to Leaderboard (+50 XP)
    if (typeof window !== "undefined") {
      fetch("/api/workplace/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "typing_test_complete",
          xp: 50,
          wpm: m.netWpm,
          accuracy: m.accuracyPercent,
        }),
      }).catch(() => {});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;

    const val = e.target.value;
    if (!isTestActive && val.length > 0) {
      setIsTestActive(true);
    }

    sound.click();
    setTypedText(val);

    // Check if finished full passage early
    if (val.length >= selectedPassage.text.length) {
      finishTest();
    }
  };

  const generateCertificatePng = (): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 675);
    grad.addColorStop(0, "#090D16");
    grad.addColorStop(1, "#0F172A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 675);

    // Border Frame
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 615);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, 1110, 585);

    // Header Title
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THE SABBiR OS — OFFICIAL SPEED TYPIST CERTIFICATE", 600, 110);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Verified Typing Speed & Accuracy Benchmark", 600, 170);

    // Track Name
    ctx.fillStyle = "#94A3B8";
    ctx.font = "18px monospace";
    ctx.fillText(`Track: ${selectedPassage.title} (${selectedPassage.track.toUpperCase()})`, 600, 220);

    // Score Badges
    const finalWpm = metrics ? metrics.netWpm : 0;
    const finalAcc = metrics ? metrics.accuracyPercent : 100;

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 96px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${finalWpm}`, 440, 360);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("NET WPM", 440, 410);

    ctx.fillStyle = "#10B981";
    ctx.font = "bold 96px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${finalAcc}%`, 760, 360);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 22px monospace";
    ctx.fillText("ACCURACY", 760, 410);

    // Footer Imprint
    ctx.fillStyle = "#64748B";
    ctx.font = "14px monospace";
    ctx.fillText(`Verified on sabbir.nav.bd • Awarded +50 Leaderboard XP • ${new Date().toLocaleDateString()}`, 600, 560);

    return canvas.toDataURL("image/png");
  };

  const handleExportCertificate = () => {
    triggerGatedExport(() => {
      const dataUrl = generateCertificatePng();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `typing-certificate-${metrics?.netWpm || 0}wpm.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="typing-speed-arena"
        toolName="Typing Speed Arena"
        category="DevOps & Linux"
        onExportClick={isCompleted ? handleExportCertificate : undefined}
      />

      {/* Track & Duration Selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800">
        {/* Track Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TYPING_PASSAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                sound.click();
                setSelectedPassage(p);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedPassage.id === p.id
                  ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-sm"
                  : "bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              <span>{p.title}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">({p.difficulty})</span>
            </button>
          ))}
        </div>

        {/* Duration Presets & Restart */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            {[15, 30, 60].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedDuration(dur);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedDuration === dur
                    ? "bg-amber-500 text-neutral-950"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetTest}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
            title="Restart Test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown and Live Speed Strip */}
      <div className="flex items-center justify-between px-2 font-mono text-sm">
        <div className="flex items-center gap-2 text-amber-400">
          <Timer className="w-4 h-4" />
          <span className="font-bold text-lg">{timeLeft}s remaining</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <span>Target: {selectedPassage.track.toUpperCase()}</span>
          <span>•</span>
          <span>Leaderboard: +50 XP Reward</span>
        </div>
      </div>

      {/* Main Typing Passage Display Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 relative cursor-text min-h-[220px] font-mono text-base leading-relaxed tracking-wide select-none"
      >
        <div className="flex flex-wrap">
          {selectedPassage.text.split("").map((char, index) => {
            let color = "text-neutral-600";
            if (index < typedText.length) {
              color = typedText[index] === char ? "text-emerald-400 font-bold" : "text-rose-500 bg-rose-950/60 font-bold";
            } else if (index === typedText.length) {
              color = "text-amber-400 underline decoration-2 animate-pulse";
            }
            return (
              <span key={index} className={color}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden Native Textarea capturing user keyboard input */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleInputChange}
          disabled={isCompleted}
          className="absolute inset-0 opacity-0 cursor-text resize-none"
          autoFocus
        />
      </div>

      {/* Completed Scorecard Overlay */}
      {isCompleted && metrics && (
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">
                  Test Complete!
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  +50 XP Synced to Leaderboard
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {metrics.netWpm} WPM <span className="text-neutral-400 text-lg font-normal">at</span> {metrics.accuracyPercent}% Accuracy
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={resetTest}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={handleExportCertificate}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Verified Certificate (PNG)</span>
            </button>
          </div>
        </div>
      )}

      {AuthGateModalComponent}
    </div>
  );
}
