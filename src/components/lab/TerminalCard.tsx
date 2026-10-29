"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { APP_VERSION } from "@/lib/version";
import { MotionLoopVideo } from "@/components/ui/MotionLoopVideo";
import { Terminal } from "lucide-react";
import { sound } from "@/lib/sound";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";
import { useRouter } from "next/navigation";
import { goToSection } from "@/lib/ui-events";

type Log = { id: number; text: string; isCommand: boolean };

export function TerminalCard() {
  const { theme, setTheme } = useTheme();
  const { spatial3D, toggle3D } = useSettings();
  const router = useRouter();
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<Log[]>([
    { id: 0, text: `Welcome to SABBiR_OS [Version ${APP_VERSION}]`, isCommand: false },
    { id: 1, text: "Type 'help' to see available commands.", isCommand: false },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only scroll the terminal body container to prevent full page jump
    if (endRef.current && endRef.current.parentElement) {
      endRef.current.parentElement.scrollTo({
        top: endRef.current.parentElement.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sound.terminalSubmit();
    const cmd = input.trim().toLowerCase();
    const newLogs = [...logs, { id: Date.now(), text: `guest@sabbir.nav.bd:~$ ${input}`, isCommand: true }];
    
    setTimeout(() => {
      let response = "";
      switch (cmd) {
        case "whoami":
          response = "THE SABBiR — Backend & DevOps learner, digital explorer.";
          break;
        case "focus":
          response = "CURRENT FOCUS: Backend, DevOps, AI, Spatial Interfaces.";
          break;
        case "status":
          response = "STATUS: BUILDING... Systems Operational.";
          break;
        case "projects":
          response = "Navigating to Projects showcase...";
          goToSection("projects", "/projects", router.push);
          break;
        case "skills":
          response = "Opening skills by area...";
          goToSection("skills", "/experience#skills", router.push);
          break;
        case "contact":
          response = "Opening contact...";
          goToSection("contact", "/contact", router.push);
          break;
        case "clear":
          setLogs([]);
          setInput("");
          return;
        case "help":
          response = "COMMANDS: whoami, focus, projects, skills, status, contact, clear";
          break;
        default:
          sound.error();
          response = `Command not found: ${cmd}. Type 'help' for options.`;
      }
      setLogs((prev) => [...prev, { id: Date.now() + 1, text: response, isCommand: false }]);
    }, 300);

    setLogs(newLogs);
    setInput("");
  };

  return (
    <GlassCard heavy className="w-full max-w-4xl mx-auto mb-8 sm:mb-16 overflow-hidden rounded-card signal-edge shadow-e3 bg-[#0b0d12] border-white/10">
      {/* Terminal Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.04] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Terminal className="w-3.5 h-3.5" />
          sabbir.nav.bd — bash
        </div>
      </div>

      {/* Terminal Body */}
      <div className="relative bg-[#0a0a0f]/80 backdrop-blur-md">
      {/* Telemetry loop as a quiet live-monitor backdrop (decorative, pauses off-screen) */}
      <MotionLoopVideo
        src="/assets/videos/omnidesk-telemetry-loop"
        className="hidden md:block absolute inset-0 w-full h-full opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
      />
      <div className="relative p-4 sm:p-6 h-56 sm:h-64 overflow-y-auto font-mono text-[13px] sm:text-sm">
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className={log.isCommand ? "text-cyan-400" : "text-slate-300"}
            >
              {log.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
          <span className="text-emerald-400 shrink-0"><span className="hidden sm:inline">guest@sabbir.nav.bd</span>:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); sound.type(); }}
            aria-label="Lab terminal command"
            className="flex-1 min-w-0 min-h-7 bg-transparent outline-none text-slate-200"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />
        </form>
      </div>
      </div>
    </GlassCard>
  );
}
