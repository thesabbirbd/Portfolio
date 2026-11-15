"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  Copy,
  Check,
  FolderOpen,
  FileCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface SandboxFile {
  name: string;
  lang: string;
  code: string;
}

interface ProjectInteractiveSandboxProps {
  projectSlug: string;
  projectTitle: string;
  githubRepoName?: string;
  cliCommand?: string;
  files: SandboxFile[];
  liveOutput?: string;
}

export function ProjectInteractiveSandbox({
  projectSlug,
  projectTitle,
  githubRepoName,
  cliCommand = `npx ${projectSlug}@latest`,
  files,
  liveOutput = "Process initialized successfully. Zero runtime warnings.",
}: ProjectInteractiveSandboxProps) {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const activeFile = files[selectedFileIdx] || files[0];

  const handleRunDemo = () => {
    sound.launch();
    setIsRunning(true);
    setTerminalOutput("Initializing sandbox runtime sandbox container...\nMounting source files...");

    setTimeout(() => {
      setTerminalOutput(
        `$ ${cliCommand}\n[INIT] Loading ${activeFile?.name || "main"}...\n[EXEC] Running simulation test...\n${liveOutput}\n[DONE] Execution completed in 42ms.`
      );
      setIsRunning(false);
      sound.levelUp();
      osStore.addXp(20, `Executed Sandbox: ${projectTitle}`);
    }, 600);
  };

  const handleCopyCli = async () => {
    sound.copy();
    await navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-ink tracking-tight">
              Interactive Source Explorer &amp; Live CLI Sandbox
            </h3>
          </div>
          <p className="text-[11px] text-ink-3 mt-0.5">
            Browse source implementation and execute in-browser sandbox simulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {githubRepoName && (
            <a
              href={`https://github.com/thesabbir/${githubRepoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink flex items-center gap-1.5 transition"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-ink-3" />
            </a>
          )}
          <button
            onClick={handleRunDemo}
            disabled={isRunning}
            className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5 transition shadow disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Running..." : "Run Sandbox Demo"}</span>
          </button>
        </div>
      </div>

      {/* CLI Copy Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-line">
        <div className="flex items-center gap-2 text-[11px] text-ink-2 truncate">
          <span className="text-primary font-bold">$</span>
          <span className="font-bold text-ink truncate">{cliCommand}</span>
        </div>
        <button
          onClick={handleCopyCli}
          className="text-primary hover:underline flex items-center gap-1 text-[11px] shrink-0"
        >
          {copiedCli ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span>{copiedCli ? "Copied" : "Copy CLI"}</span>
        </button>
      </div>

      {/* Dual File Explorer & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Tabs */}
        <div className="lg:col-span-4 space-y-1">
          <span className="text-[10px] text-ink-3 font-bold uppercase block px-1 pb-1">
            Source Tree ({files.length} Files)
          </span>
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => {
                sound.toggleSwitch();
                setSelectedFileIdx(idx);
              }}
              className={`w-full p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                selectedFileIdx === idx
                  ? "bg-primary/10 border-primary text-primary font-bold"
                  : "bg-surface border-line text-ink-2 hover:bg-muted"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        {/* Code & Terminal Container */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[10px] text-neutral-400">
              <span className="font-bold text-neutral-200">{activeFile?.name}</span>
              <span className="uppercase">{activeFile?.lang}</span>
            </div>
            <pre className="p-4 text-[11px] font-mono text-neutral-200 leading-relaxed overflow-x-auto max-h-56 select-all">
              <code>{activeFile?.code}</code>
            </pre>
          </div>

          {/* Terminal Output */}
          {terminalOutput && (
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[11px] space-y-1">
              <span className="text-[9px] uppercase font-bold text-emerald-400 block">
                Sandbox Execution Console:
              </span>
              <pre className="whitespace-pre-wrap leading-relaxed">{terminalOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
