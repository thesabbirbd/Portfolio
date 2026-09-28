"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Terminal } from "lucide-react";
import { sound } from "@/lib/sound";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";

type Log = { id: number; text: string; isCommand: boolean };

export function TerminalCard() {
  const { theme, setTheme } = useTheme();
  const { spatial3D, toggle3D } = useSettings();
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<Log[]>([
    { id: 0, text: "Welcome to SABBiR_OS [Version 2.2.0]", isCommand: false },
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

    sound.click();
    const cmd = input.trim().toLowerCase();
    const newLogs = [...logs, { id: Date.now(), text: `guest@sabbir.nav.bd:~$ ${input}`, isCommand: true }];
    
    setTimeout(() => {
      let response = "";
      switch (cmd) {
        case "whoami":
          response = "THE SABBiR - Systems Architect & Digital Explorer.";
          break;
        case "focus":
          response = "CURRENT FOCUS: Backend, DevOps, AI, Spatial Interfaces.";
          break;
        case "status":
          response = "STATUS: BUILDING... Systems Operational.";
          break;
        case "projects":
          response = "Navigating to Projects showcase...";
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case "skills":
          response = "Accessing Capabilities Matrix...";
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case "contact":
          response = "Opening Transmission Channel...";
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case "clear":
          setLogs([]);
          setInput("");
          return;
        case "help":
          response = "COMMANDS: whoami, focus, projects, skills, status, contact, clear";
          break;
        default:
          response = `Command not found: ${cmd}. Type 'help' for options.`;
      }
      setLogs((prev) => [...prev, { id: Date.now() + 1, text: response, isCommand: false }]);
    }, 300);

    setLogs(newLogs);
    setInput("");
  };

  return (
    <GlassCard heavy className="w-full max-w-4xl mx-auto mb-16 overflow-hidden rounded-2xl border-white/10 shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-black/40 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
          <Terminal className="w-3.5 h-3.5" />
          sabbir.nav.bd — bash
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6 h-64 overflow-y-auto font-mono text-sm bg-[#0a0a0f]/80 backdrop-blur-md">
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
          <span className="text-emerald-400">guest@sabbir.nav.bd:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-200"
            
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </GlassCard>
  );
}
