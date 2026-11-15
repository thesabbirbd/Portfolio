"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, Type, Sparkles, Volume2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  script: string;
  duration?: string;
}

export function TeleprompterModal({
  isOpen,
  onClose,
  title,
  script,
  duration = "60s",
}: TeleprompterModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(28);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let lastTime = performance.now();

    const step = (time: number) => {
      if (isPlaying && scrollContainer) {
        const delta = (time - lastTime) / 1000;
        // speed pixels per second: speed * 30
        scrollContainer.scrollTop += scrollSpeed * 35 * delta;

        // Auto stop at bottom
        if (
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 5
        ) {
          setIsPlaying(false);
          sound.confirm();
        }
      }
      lastTime = time;
      if (isPlaying) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    if (isPlaying) {
      animRef.current = requestAnimationFrame(step);
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, scrollSpeed, isOpen]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    sound.click();
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    sound.click();
    setIsPlaying(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between text-white font-sans animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> THE SABBiR OS Teleprompter · Target: {duration}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-md mt-0.5">
            {title}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Font Size */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl text-xs font-mono">
            <Type className="w-3.5 h-3.5 text-white/60" />
            <button
              onClick={() => setFontSize((s) => Math.max(18, s - 2))}
              className="px-1.5 py-0.5 hover:text-primary transition"
            >
              A-
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => setFontSize((s) => Math.min(48, s + 2))}
              className="px-1.5 py-0.5 hover:text-primary transition"
            >
              A+
            </button>
          </div>

          {/* Speed */}
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl text-xs font-mono">
            <span className="text-white/60">Speed:</span>
            {[1, 2, 3, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  sound.toggleSwitch();
                  setScrollSpeed(spd);
                }}
                className={`px-1.5 py-0.5 rounded ${
                  scrollSpeed === spd ? "bg-primary text-white font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            aria-label="Close teleprompter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Scrolling Text Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 sm:px-16 md:px-28 lg:px-44 py-20 scroll-smooth leading-relaxed text-center select-none"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="max-w-3xl mx-auto space-y-8 font-medium">
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
            [ READY · COUNTDOWN 3... 2... 1... START READING ]
          </p>
          <div className="whitespace-pre-wrap text-white drop-shadow-sm font-sans tracking-wide">
            {script}
          </div>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase pt-20">
            [ END OF SCRIPT · HIT RECORD STOP ]
          </p>
        </div>
      </div>

      {/* Bottom Floating Play/Pause Action Bar */}
      <div className="py-4 border-t border-white/10 bg-black/60 flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition flex items-center gap-2 text-xs font-mono"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleTogglePlay}
          className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-2 transition shadow-lg shadow-primary/30"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Scroll (Space)</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Auto-Scroll</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
