"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useSpatialScroll } from "@/hooks/useSpatialScroll";
import { Terminal, X, CornerDownLeft, Sparkles } from "lucide-react";

interface LogEntry {
  command?: string;
  output: string;
  isError?: boolean;
}

export function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogEntry[]>([
    {
      output: "THE SABBiR CORE TERMINAL v1.2.0\nType 'help' to inspect available system commands.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut `~` or `Ctrl+K`

  const { scrollY } = useSpatialScroll();
  const [isNavHidden, setIsNavHidden] = useState(false);

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    // ⚡ Bolt: Use matchMedia instead of resize event for better performance
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, []);

  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) {
      setIsNavHidden(true); // scrolling down
    } else {
      setIsNavHidden(false); // scrolling up/idle
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output = "";
    let isError = false;

    switch (cmd) {
      case "help":
        output =
          "Available Commands:\n- whoami       : Identity & background\n- status       : Live system telemetry\n- omnidesk     : Flagship build overview\n- lab          : Engineering Lab experiments\n- maps         : Google Local Guide & 360° VR details\n- mission      : 100-day engineering sprint\n- community    : Campus leadership & volunteering\n- contact      : Official communication channels\n- clear        : Clear terminal output\n- exit         : Terminate session";
        break;
      case "whoami":
        output =
          "Md Sabbirul Islam Khan (THE SABBiR)\nBBA Management (Rajshahi College) × Backend & DevOps Engineering Focus\nLocation: Rajshahi, Bangladesh\nMission: Building resilient software architectures & local AI pipelines.";
        break;
      case "status":
        output =
          "[OK] All systems nominal.\nPlatform: sabbir.nav.bd\nRuntime: Next.js + React 19 + Turbopack\nDevOps: Docker + Linux Ubuntu\nLocal AI: Ollama Inference Active\nAudio System: Web Audio API Synthesizer";
        break;
      case "omnidesk":
        output =
          "Omnidesk BD: Local-First Universal Learning Engine & AI Study Workspace\nStack: FastAPI, PostgreSQL, Docker, Ollama, PWA\nRepo: github.com/thesabbirbd/Omnidesk-BD";
        break;
      case "lab":
        output =
          "Engineering Lab Disciplines:\n1. Infrastructure Lab (Headless displays, SSH tunnels)\n2. AI Lab (Offline LLMs, VRAM tuning)\n3. Systems Lab (Linux virtual drivers)\n4. Hardware Lab (DIY UPS, DC power circuits)\n5. Creative Lab (OBS streaming, 360° Street View)";
        break;
      case "maps":
        output =
          "Google Maps Local Guide & 360° Street View Photographer:\nStatus: Top Contributor\nRecognition: Direct Google Headquarters Recognition & Gifts Recipient 🎁\nLocal Guides Bangladesh Member & 360° VR contributor.";
        break;
      case "mission":
        output =
          "100-Day Engineering Mission:\nFocus: Asynchronous FastAPI endpoints, Docker containerization, Linux hardening, and NOC monitoring.";
        break;
      case "community":
        output =
          "Collegiate Leadership & Volunteering:\n- RCPC: IT Executive\n- RCBC: Official Member\n- VBD: Youth Volunteer\n- BFFR: Blood Donor";
        break;
      case "contact":
        output =
          "Email: iamthesabbir@gmail.com\nGitHub: github.com/thesabbirbd\nLinkedIn: linkedin.com/in/thesabbirbd\nFacebook: facebook.com/iamthesabbir\nGoogle Maps: google.com/maps/contrib/115922089427483699024";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        setIsOpen(false);
        setInput("");
        return;
      default:
        output = `command not recognized: '${cmd}'. Type 'help' for guidance.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    setInput("");
  };

  return (
    <>
      {/* Floating Mini Launcher Pill in bottom left */}
      <motion.div 
        animate={{ y: (!isDesktop && !isNavHidden) ? -76 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 p-3 sm:px-3 sm:py-1.5 rounded-full glass-panel border border-slate-200/80 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-md hover:border-[var(--color-secondary)]/50 transition-colors"
          title="Open Terminal (Press ` or Ctrl+K)"
        >
          <Terminal className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-[var(--color-secondary)]" />
          <span className="hidden sm:inline">terminal</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Ctrl+K
          </span>
        </motion.button>
      </motion.div>

      {/* Terminal Overlay Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl h-[420px] rounded-2xl glass-panel border border-slate-200/80 dark:border-white/15 bg-slate-900/95 text-slate-100 shadow-2xl flex flex-col overflow-hidden font-mono text-xs"
            >
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] inline-block" />
                  <span className="ml-2 text-xs text-slate-700 dark:text-slate-300">
                    sabbir@host:~$ (Interactive CLI)
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                  aria-label="Close terminal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Console Logs Area */}
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 select-text">
                {history.map((h, i) => (
                  <div key={i} className="space-y-1">
                    {h.command && (
                      <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold">
                        <span>&gt;</span>
                        <span>{h.command}</span>
                      </div>
                    )}
                    <pre className={`whitespace-pre-wrap ${h.isError ? "text-rose-400" : "text-slate-300"}`}>
                      {h.output}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Input Prompt */}
              <form
                onSubmit={handleCommand}
                className="flex items-center gap-2 px-4 py-3 bg-slate-950/90 border-t border-slate-800"
              >
                <span className="text-[var(--color-secondary)] font-bold">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type 'help', 'whoami', 'omnidesk'..."
                  className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none text-xs"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white"
                  title="Execute"
                  aria-label="Execute command"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
