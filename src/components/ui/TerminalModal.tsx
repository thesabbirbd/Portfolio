"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, CornerDownLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useNavVisibility } from "@/hooks/useNavVisibility";
import { CONTROL_SPRING, MOBILE_CORNER_RAISE } from "@/lib/fixed-controls";
import { OPEN_TERMINAL, isTypingTarget } from "@/lib/ui-events";
import { sound } from "@/lib/sound";
import { SKILL_CATEGORIES } from "@/data/skills";
import { AIYAAR } from "@/data/aiyaar";
import { APP_VERSION } from "@/lib/version";

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
      output: `THE SABBiR CORE TERMINAL v${APP_VERSION}\nType 'help' to inspect available system commands.`,
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isNavHidden } = useNavVisibility();
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  // Backtick toggles the terminal (Ctrl/⌘+K belongs to the Command Menu). Ignored while typing.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(OPEN_TERMINAL, handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_TERMINAL, handleOpen);
    };
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
          "Available Commands:\n- whoami       : Identity & background (alias: about)\n- skills       : Skill map by discipline\n- status       : Site & setup info\n- omnidesk     : Flagship build overview\n- lab          : Engineering Lab experiments\n- maps         : Google Local Guide & 360° VR details\n- mission      : 100-day engineering sprint\n- community    : Campus leadership & volunteering\n- contact      : Official communication channels\n- clear        : Clear terminal output\n- exit         : Terminate session";
        break;
      case "skills":
        output = SKILL_CATEGORIES.map(
          (c) => `${c.title}\n  ${c.skills.map((sk) => sk.level ? `${sk.name} [${sk.level}]` : sk.name).join(", ")}`
        ).join("\n");
        break;
      case "about":
      case "whoami":
        output =
          `THE SABBiR — Md Sabbirul Islam Khan\n${AIYAAR.role} @ ${AIYAAR.name} · aiyaar.ltd · /aiyaar\nBBA Management (Rajshahi College) × Backend & DevOps Engineering Focus\nLocation: Rajshahi, Bangladesh\nFocus: learning backend & DevOps by building — FastAPI, PostgreSQL, Docker, local AI.`;
        break;
      case "status":
        output =
          "[OK] sabbir.nav.bd is online.\nRuntime: Next.js 16 + React 19 on Vercel\nDaily driver: Ubuntu Linux + Docker\nLocal AI: Ollama experiments on personal hardware\nUI audio: Web Audio API synth (off by default)";
        break;
      case "omnidesk":
        output =
          "Omnidesk BD: local-first learning & engineering workspace\nStack: FastAPI, PostgreSQL, Redis, Ollama, React, Tauri, Docker\nCase study: /projects/omnidesk\nRepo: github.com/thesabbirbd/Omnidesk-BD";
        break;
      case "lab":
        output =
          "Engineering Lab Disciplines:\n1. Infrastructure Lab (Headless displays, SSH tunnels)\n2. AI Lab (Offline LLMs, VRAM tuning)\n3. Systems Lab (Linux virtual drivers)\n4. Hardware Lab (DIY UPS, DC power circuits)\n5. Creative Lab (OBS streaming, 360° Street View)";
        break;
      case "maps":
        output =
          "Google Maps Local Guide & 360° Street View contributor (Rajshahi)\nRecognition: received a gift from Google HQ as a Local Guide\nMore: /exploration";
        break;
      case "mission":
        output =
          "100-day backend & DevOps sprint (in progress):\nFastAPI APIs · Docker & Compose · Linux & Bash automation · networking foundations · local AI\nMore: /experience#mission";
        break;
      case "community":
        output =
          "Collegiate Leadership & Volunteering:\n- RCPC: IT Secretary\n- RCBC: Official Member\n- VBD: Youth Volunteer\n- BFFR: Blood Donor";
        break;
      case "contact":
        output =
          "Email: iamthesabbir@gmail.com\nGitHub: github.com/thesabbirbd\nLinkedIn: linkedin.com/in/thesabbirbd\nCV: /cv/Md-Sabbirul-Islam-Khan-CV-2026.pdf\nFacebook: facebook.com/iamthesabbir\nGoogle Maps: google.com/maps/contrib/115922089427483699024";
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

    if (isError) sound.error(); else sound.terminalSubmit();
    setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    setInput("");
  };

  return (
    <>
      {/* Floating Mini Launcher Pill in bottom left */}
      <motion.div
        initial={false}
        animate={{ y: (!isDesktop && !isNavHidden) ? -MOBILE_CORNER_RAISE : 0 }}
        transition={CONTROL_SPRING}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 short-landscape:bottom-3 short-landscape:left-3 z-40 mb-[env(safe-area-inset-bottom)] ml-[env(safe-area-inset-left)] print:hidden will-change-transform"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { sound.launch(); setIsOpen(true); }}
          aria-label="Open terminal"
          className="flex items-center justify-center gap-2 p-3 md:px-3 md:py-1.5 short-landscape:p-3 rounded-full surface-control text-xs font-mono text-ink-2 hover:border-signal/40 transition-colors"
          title="Open Terminal (press `)"
        >
          <Terminal className="w-5 h-5 md:w-3.5 md:h-3.5 short-landscape:w-5 short-landscape:h-5 text-signal" />
          <span className="hidden md:inline short-landscape:hidden">terminal</span>
          <span className="hidden md:inline short-landscape:hidden text-[11px] px-1.5 py-0.5 rounded bg-muted text-ink-2">
            `
          </span>
        </motion.button>
      </motion.div>

      {/* Terminal Overlay Window */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl h-[min(420px,calc(100svh-2rem))] rounded-card border border-white/10 bg-[#0b0d12] text-slate-100 shadow-e3 signal-edge flex flex-col overflow-hidden font-mono text-xs"
            >
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 text-xs text-slate-400">
                    sabbir@host:~$ (Interactive CLI)
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                      <div className="flex items-center gap-2 text-[rgb(34_211_238)] font-bold">
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
                <span className="text-[rgb(34_211_238)] font-bold">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); sound.type(); }}
                  placeholder="type 'help', 'whoami', 'omnidesk'..."
                  aria-label="Terminal command"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-base sm:text-xs"
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
