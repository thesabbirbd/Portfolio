"use client";

import React, { useState } from "react";
import {
  Play,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Terminal,
  FileText,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import {
  SWARM_PIPELINES,
  executeSwarmPipeline,
  type SwarmPipeline,
  type SwarmExecutionResult,
} from "@/lib/agents/swarm-orchestrator";
import { useGatedExport } from "@/hooks/useGatedExport";
import { ShareContentModal } from "@/components/workplace/ShareContentModal";
import { Link2 } from "lucide-react";

export function SwarmExecutionStudio() {
  const [selectedSwarmId, setSelectedSwarmId] = useState<string>(SWARM_PIPELINES[0].id);
  const [inputGoal, setInputGoal] = useState<string>("Smart Bluetooth Watch with Bangla Display (3450 BDT, Offer 2290 BDT)");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(-1);
  const [result, setResult] = useState<SwarmExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const selectedPipeline = SWARM_PIPELINES.find((p) => p.id === selectedSwarmId) || SWARM_PIPELINES[0];

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "swarm-orchestrator",
    toolName: "Multi-Agent Swarm Orchestrator",
  });

  const handleLaunchSwarm = async () => {
    sound.launch();
    setIsRunning(true);
    setResult(null);
    setActiveStageIdx(0);

    try {
      const res = await executeSwarmPipeline(
        selectedSwarmId,
        inputGoal,
        (idx) => setActiveStageIdx(idx)
      );
      setResult(res);
      sound.levelUp();
      osStore.addXp(50, `Completed ${selectedPipeline.title}`);
      osStore.incrementToolRun();
    } catch {
      // Handled
    } finally {
      setIsRunning(false);
      setActiveStageIdx(-1);
    }
  };

  const handleCopyBundle = async () => {
    if (!result) return;
    sound.copy();
    await navigator.clipboard.writeText(result.combinedBundleMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeDownload = () => {
    if (!result) return;
    sound.shutter();
    osStore.addXp(25, "Downloaded Swarm Release Bundle");

    const blob = new Blob([result.combinedBundleMarkdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swarm-release-${result.swarmId}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBundle = () => {
    triggerExport(executeDownload, "swarm-orchestrator", "Multi-Agent Swarm Orchestrator");
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Multi-Agent Autonomous Swarm Orchestrator
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Chain 3 Specialized Agents (Agent 1 ➔ Agent 2 ➔ Agent 3) into an end-to-end automated production pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Share (24h)</span>
              </button>
              <button
                onClick={handleCopyBundle}
                className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Bundle"}</span>
              </button>
              <button
                onClick={handleDownloadBundle}
                className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
            </>
          )}

          <button
            onClick={handleLaunchSwarm}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? `Executing Stage ${activeStageIdx + 1}...` : "Execute Swarm Pipeline"}</span>
          </button>
        </div>
      </div>

      {/* Swarm Pipeline Cards Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
        {SWARM_PIPELINES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              sound.toggleSwitch();
              setSelectedSwarmId(p.id);
              setResult(null);
              if (p.id === "ecommerce-launch") {
                setInputGoal("Smart Bluetooth Watch with Bangla Display (3450 BDT, Offer 2290 BDT)");
              } else if (p.id === "daily-closing") {
                setInputGoal("চাল ৫ কেজি ৩৫০ টাকা (PAID), তেল ২ লিটার ৩৭৫ টাকা (BAKI), চিনি ২ কেজি ২৬০ টাকা (BAKI)");
              } else if (p.id === "devops-release") {
                setInputGoal("PostgreSQL order queries with customer join, Docker Node app, and MikroTik LTE failover");
              } else if (p.id === "brand-launch") {
                setInputGoal("THE SABBiR OS v5.2 SaaS Workplace launch with 35 everyday studios and WAF security shield");
              } else {
                setInputGoal("How to run local AI models on your laptop without paying cloud subscriptions");
              }
            }}
            className={`p-3.5 rounded-2xl border text-left transition space-y-1.5 ${
              selectedSwarmId === p.id
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-surface border-line hover:border-ink-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-primary">{p.category}</span>
              <span className="text-[10px] text-ink-3">~{p.estimatedSec}s</span>
            </div>
            <h3 className="font-bold text-ink text-sm">{p.title}</h3>
            <p className="text-[11px] text-ink-3 line-clamp-2">{p.tagline}</p>
          </button>
        ))}
      </div>

      {/* Input & Visual Execution DAG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
        {/* Left Input Pane */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line">
          <div className="space-y-1">
            <span className="font-bold text-ink uppercase block">Initial Project Mission / Goal:</span>
            <textarea
              rows={4}
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface border border-line text-ink leading-relaxed"
            />
          </div>

          {/* Sequential Stage Blueprint */}
          <div className="space-y-2 pt-2 border-t border-line">
            <span className="text-[10px] font-bold uppercase text-ink-3 block">
              Sequential Execution Pipeline:
            </span>
            <div className="space-y-2">
              {selectedPipeline.stages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition flex items-center gap-3 ${
                    activeStageIdx === idx
                      ? "bg-primary text-white border-primary shadow"
                      : activeStageIdx > idx || result
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                      : "bg-surface border-line text-ink-2"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="flex-1 truncate">
                    <span className="font-bold block text-[11px] truncate">{stage.stageName}</span>
                    <span className="text-[10px] opacity-70 block truncate">{stage.roleDescription}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Artifacts Display */}
        <div className="lg:col-span-7 space-y-4">
          {isRunning ? (
            <div className="p-8 rounded-2xl bg-muted/10 border border-line flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
              <Sparkles className="w-8 h-8 text-primary animate-spin" />
              <div>
                <p className="font-bold text-ink text-sm">
                  Orchestrating {selectedPipeline.stages[activeStageIdx]?.stageName}...
                </p>
                <p className="text-[11px] text-ink-3 mt-1">
                  Agent handoff in progress • Intermediate artifacts synthesized in memory
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[11px]">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Swarm Execution Completed Successfully!
                </span>
                <span>{result.durationMs}ms Total Compute</span>
              </div>

              {/* Artifacts Tabs */}
              <div className="space-y-3">
                {result.artifacts.map((art, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-surface border border-line space-y-2">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <span className="font-bold text-ink text-[11px] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        Stage {idx + 1}: {art.title}
                      </span>
                      <span className="text-[10px] font-mono text-ink-3">
                        {art.filename}
                      </span>
                    </div>
                    <p className="text-[10px] text-ink-3">{art.summary}</p>
                    <pre className="p-3 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 text-[10px] font-mono leading-relaxed overflow-x-auto max-h-36 select-all">
                      <code>{art.content}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-muted/10 border border-line flex flex-col items-center justify-center min-h-[300px] text-center space-y-2">
              <Terminal className="w-8 h-8 text-ink-4" />
              <p className="font-bold text-ink text-xs">Swarm Pipeline Ready</p>
              <p className="text-[11px] text-ink-3 max-w-sm">
                Click &quot;Execute Swarm Pipeline&quot; to run the 3 specialized agents in sequence and generate your unified artifact release bundle.
              </p>
            </div>
          )}
        </div>
      </div>

      {GateModal}
      <ShareContentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        toolSlug="swarm-orchestrator"
        toolName={`Swarm: ${selectedPipeline.title}`}
        payload={{
          swarmId: selectedSwarmId,
          title: selectedPipeline.title,
          bundleMarkdown: result?.combinedBundleMarkdown || "",
          timestamp: Date.now(),
        }}
        defaultTitle={`${selectedPipeline.title} Bundle`}
      />
    </div>
  );
}
