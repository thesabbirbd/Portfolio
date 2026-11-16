"use client";

import React, { useState } from "react";
import {
  FLEET_A_INPUT_TO_ACTION_AGENTS,
  FLEET_B_SCHEDULED_BOTS,
  type AgentSystemDef,
} from "@/lib/agents/agent-fleet-registry";
import {
  Bot,
  Terminal,
  Cpu,
  Zap,
  Play,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { sound } from "@/lib/sound";
import type { JobTicket, JobExecutionMode } from "@/lib/agents/input-to-action-dispatcher";

export function AgentInputToActionStudio() {
  const [selectedAgent, setSelectedAgent] = useState<AgentSystemDef>(FLEET_A_INPUT_TO_ACTION_AGENTS[0]);
  const [activeTab, setActiveTab] = useState<"fleet-a" | "fleet-b">("fleet-a");
  const [inputPayload, setInputPayload] = useState<string>(FLEET_A_INPUT_TO_ACTION_AGENTS[0].sampleInput);
  const [executionMode, setExecutionMode] = useState<JobExecutionMode>("instant_local");
  const [isRunning, setIsRunning] = useState(false);
  const [activeJob, setActiveJob] = useState<JobTicket | null>(null);

  const handleSelectAgent = (agent: AgentSystemDef) => {
    sound.click();
    setSelectedAgent(agent);
    setInputPayload(agent.sampleInput);
  };

  const handleDispatchJob = async () => {
    if (!inputPayload.trim()) return;

    sound.click();
    setIsRunning(true);
    setActiveJob(null);

    try {
      const res = await fetch("/api/jobs/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          inputPayload,
          mode: executionMode,
          userId: "current-user",
          username: "Guest Member",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch job");
      }

      setActiveJob(data.job);
      if (data.job?.status === "completed") {
        sound.complete();
      } else {
        sound.pop();
      }
    } catch (err: any) {
      sound.alert();
      alert(`Job dispatch error: ${err?.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadArtifact = () => {
    if (!activeJob?.artifact) return;
    sound.shutter();

    const blob = new Blob([activeJob.artifact.content || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeJob.artifact.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-7 backdrop-blur-md">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>30 Real-World Agentic Systems · Dual-Mode Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ইনপুট-টু-অ্যাকশন এজেন্ট স্টুডিও (Input-to-Action Studio)
          </h2>
          <p className="text-xs text-neutral-400">
            শুধু চ্যাট নয় — ফাইল দিন, কনভার্ট/অডিট করুন এবং সরাসরি ডাউনলোডযোগ্য ফলাফল নিন।
          </p>
        </div>

        {/* Tab Toggle: Fleet A vs Fleet B */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setActiveTab("fleet-a")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "fleet-a"
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>১৫ টি ওয়ার্কার এজেন্ট</span>
          </button>
          <button
            onClick={() => setActiveTab("fleet-b")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "fleet-b"
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>১৫ টি ব্যাকগ্রাউন্ড বট</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent Selector List */}
        <div className="lg:col-span-5 space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {(activeTab === "fleet-a" ? FLEET_A_INPUT_TO_ACTION_AGENTS : FLEET_B_SCHEDULED_BOTS).map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                selectedAgent.id === agent.id
                  ? "bg-neutral-800/90 border-amber-500/50 shadow-md"
                  : "bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-900/60 hover:border-neutral-700"
              }`}
            >
              <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-xs font-bold">
                #{String(agent.number).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">{agent.category}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{agent.banglaName}</p>
                <p className="text-[10px] font-mono text-amber-400/80 mt-1">
                  {agent.cronSchedule ? `⏰ ${agent.cronSchedule}` : `📦 ${agent.outputDeliverableDesc.slice(0, 45)}...`}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Active Agent Execution Deck */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  ACTIVE TICKET: #{String(selectedAgent.number).padStart(2, "0")}
                </span>
                <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                <p className="text-xs text-neutral-400">{selectedAgent.tagline}</p>
              </div>

              {/* Execution Mode Selector */}
              {selectedAgent.fleet === "input-to-action" && (
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                  <button
                    onClick={() => setExecutionMode("instant_local")}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium transition-all ${
                      executionMode === "instant_local"
                        ? "bg-amber-500 text-neutral-950 font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    ⚡ Instant WASM
                  </button>
                  <button
                    onClick={() => setExecutionMode("github_action_cloud")}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium transition-all ${
                      executionMode === "github_action_cloud"
                        ? "bg-blue-600 text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    ☁️ GitHub Action
                  </button>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>ইনপুট প্যারামিটার বা ফাইল ডেটা</span>
                <button
                  onClick={() => setInputPayload(selectedAgent.sampleInput)}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  ⚡ ডেমো লোড করুন
                </button>
              </label>
              <textarea
                rows={4}
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                placeholder="ইনপুট লিখুন অথবা পেস্ট করুন..."
                className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleDispatchJob}
              disabled={isRunning || !inputPayload.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>প্রসেস হচ্ছে (Processing)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {executionMode === "instant_local"
                      ? "⚡ ইনস্ট্যান্ট ব্রাউজার ওয়ার্কার চালু করুন"
                      : "☁️ গিটহাব অ্যাকশনে জব সিঙ্ক ও রান করুন"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Terminal & Progress Display */}
          {activeJob && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-white font-bold">{activeJob.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeJob.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {activeJob.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-neutral-400">{activeJob.durationMs ? `${activeJob.durationMs}ms` : "Active"}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${activeJob.progressPercent}%` }}
                />
              </div>

              {/* Terminal Logs */}
              <div className="bg-neutral-900 p-3 rounded-xl max-h-36 overflow-y-auto space-y-1 text-[11px] text-neutral-300">
                {activeJob.terminalLogs.map((log, i) => (
                  <div key={i} className="text-emerald-400/90 leading-tight">
                    {log}
                  </div>
                ))}
              </div>

              {/* Deliverable Download Strip */}
              {activeJob.artifact && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">READY DELIVERABLE</span>
                    <p className="text-xs font-bold text-white">{activeJob.artifact.filename}</p>
                  </div>
                  <button
                    onClick={handleDownloadArtifact}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ডাউনলোড ({activeJob.artifact.sizeBytes} B)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
