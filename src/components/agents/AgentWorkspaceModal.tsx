"use client";

import React, { useState } from "react";
import {
  X,
  Play,
  Terminal,
  Download,
  Check,
  Copy,
  Sparkles,
  Bot,
  Zap,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { executeAgentTask, type AgentExecutionResult } from "@/lib/agents/agent-runtime";
import type { DomainAgent, AgentTraceStep, AgentArtifact } from "@/lib/agents/agent-types";

interface AgentWorkspaceModalProps {
  agent: DomainAgent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentWorkspaceModal({ agent, isOpen, onClose }: AgentWorkspaceModalProps) {
  const [userInput, setUserInput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [traces, setTraces] = useState<AgentTraceStep[]>([]);
  const [result, setResult] = useState<AgentExecutionResult | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen || !agent) return null;

  const handleSelectPreset = (presetText: string) => {
    sound.toggleSwitch();
    setUserInput(presetText);
    setResult(null);
    setTraces([]);
  };

  const handleRunTask = async () => {
    if (!userInput.trim()) return;
    sound.launch();
    setIsRunning(true);
    setResult(null);
    setTraces([]);

    try {
      const res = await executeAgentTask(agent.id, userInput, (step) => {
        sound.type();
        setTraces((prev) => [...prev, step]);
      });
      sound.levelUp();
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyArtifact = async () => {
    if (!result?.artifact) return;
    sound.copy();
    await navigator.clipboard.writeText(result.artifact.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadArtifact = () => {
    if (!result?.artifact) return;
    sound.shutter();
    const blob = new Blob([result.artifact.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.artifact.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${agent.color}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-mono text-ink tracking-tight">
                  {agent.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase">
                  Active Agent
                </span>
              </div>
              <p className="text-xs text-ink-3 mt-0.5">{agent.tagline}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.toggleSwitch();
              onClose();
            }}
            className="p-1.5 rounded-xl border border-line hover:bg-muted text-ink-3 hover:text-ink transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scoped Skills & System Rules Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-muted/30 border border-line space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">Scoped Pipeline Skills</span>
            <div className="flex flex-wrap gap-1">
              {agent.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-muted text-[10px] text-ink-2">
                  #{skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-line space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">Deterministic Brain Rules</span>
            <p className="text-[11px] text-ink-3 line-clamp-2 leading-relaxed">
              {agent.systemRules[0]}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Select Real Task Preset (1-Click Test)</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {agent.presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset.input)}
                className="p-2.5 rounded-xl border border-line bg-muted/20 hover:bg-muted/50 hover:border-primary/40 text-left transition flex flex-col justify-between group"
              >
                <span className="text-xs font-bold text-ink group-hover:text-primary transition truncate">
                  {preset.label}
                </span>
                <span className="text-[10px] text-ink-3 line-clamp-1 mt-0.5">
                  {preset.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-ink block">
            Agent Input Directive / Raw Content
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={4}
            placeholder={`Instruct ${agent.name} or type raw data...`}
            className="w-full p-3.5 rounded-2xl bg-muted/30 border border-line text-xs font-mono text-ink placeholder:text-ink-3 focus:outline-none focus:border-primary leading-relaxed shadow-inner"
          />
        </div>

        {/* Dispatch Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-mono text-ink-3 hidden sm:inline">
            Zero Cloud Tokens • 100% In-Browser Execution
          </span>
          <button
            onClick={handleRunTask}
            disabled={!userInput.trim() || isRunning}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Executing Scoped Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Dispatch Agent Task (+35 XP)</span>
              </>
            )}
          </button>
        </div>

        {/* Live Reasoning Terminal Trace */}
        {traces.length > 0 && (
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2 text-zinc-400">
              <span className="flex items-center gap-2 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>Agent Live Reasoning Trace</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                Steps: {traces.length}/5
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {traces.map((t) => (
                <div key={t.step} className="flex items-start gap-2 text-zinc-300 text-[11px]">
                  <span className="text-primary font-bold shrink-0">[{t.step}/5]</span>
                  <span className="flex-1">{t.message}</span>
                  <span className="text-[10px] text-zinc-500 shrink-0">{t.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Artifact Viewer */}
        {result?.artifact && (
          <div className="p-4 rounded-2xl bg-surface border border-primary/30 space-y-3 animate-in fade-in shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
              <div>
                <span className="text-xs font-bold font-mono text-ink">
                  Generated Artifact: {result.artifact.title}
                </span>
                <span className="text-[10px] font-mono text-ink-3 block">
                  File: {result.artifact.filename} ({result.artifact.filetype.toUpperCase()})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyArtifact}
                  className="px-3 py-1.5 rounded-lg border border-line bg-muted hover:bg-muted/80 text-xs font-mono flex items-center gap-1.5 transition"
                  title="Copy artifact content"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={handleDownloadArtifact}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <pre className="max-h-60 overflow-y-auto p-3 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
              {result.artifact.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
