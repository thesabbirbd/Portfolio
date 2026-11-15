"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  ArrowRight,
  Flame,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { AUTONOMOUS_AGENTS, type DomainAgent, type AgentCategory } from "@/lib/agents/agent-types";
import { SWARM_PIPELINES } from "@/lib/agents/swarm-orchestrator";
import { AgentWorkspaceModal } from "@/components/agents/AgentWorkspaceModal";
import { SwarmExecutionStudio } from "@/components/agents/SwarmExecutionStudio";
import { UniversalFilterSortBar } from "@/components/system/UniversalFilterSortBar";
import { PopularNewTabsBar } from "@/components/system/PopularNewTabsBar";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";

const CATEGORIES: AgentCategory[] = [
  "All",
  "Everyday & Family",
  "Business & Accounting",
  "Education & Career",
  "Media & Vision",
  "Privacy & Documents",
  "Voice & Notes",
  "Creator & Social",
  "DevOps & Linux",
  "Database & SQL",
];

export function AgentsDirectoryHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popular"); // STRICT DEFAULT: Most Popular
  const [activeModalAgent, setActiveModalAgent] = useState<DomainAgent | null>(null);

  const filteredAndSortedAgents = useMemo(() => {
    // 1. Filter by category & search
    const filtered = AUTONOMOUS_AGENTS.filter((agent) => {
      if (selectedCategory !== "All" && agent.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = agent.name.toLowerCase().includes(q);
        const matchTag = agent.tagline.toLowerCase().includes(q);
        const matchDesc = agent.description.toLowerCase().includes(q);
        const matchSkill = agent.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchTag && !matchDesc && !matchSkill) return false;
      }
      return true;
    });

    // 2. Sort using universal ranker with popular as default
    return sortItems(filtered, sortBy, {
      getPopularity: (agent) => agent.viralityPoints,
      getImpact: (agent) => agent.viralityPoints,
      getTitle: (agent) => agent.name,
      getDate: () => "2026-11-15",
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleOpenAgent = (agent: DomainAgent) => {
    sound.modalOpen();
    setActiveModalAgent(agent);
  };

  return (
    <div className="space-y-8">
      {/* Agents Telemetry Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface border border-line shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-ink-3 block">Micro-Agents</span>
            <span className="text-xl font-bold font-mono text-ink">{AUTONOMOUS_AGENTS.length} Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-ink-3 block">Cloud Egress</span>
            <span className="text-xl font-bold font-mono text-emerald-500">0% (Local)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-ink-3 block">Swarm Pipelines</span>
            <span className="text-xl font-bold font-mono text-amber-500">{SWARM_PIPELINES.length} Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-ink-3 block">Reasoning Trace</span>
            <span className="text-xl font-bold font-mono text-sky-500">Live Terminal</span>
          </div>
        </div>
      </div>

      {/* Autonomous Multi-Agent Swarms Section */}
      <section className="space-y-4">
        <SwarmExecutionStudio />
      </section>

      {/* Popular and New Quick Switcher Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4 pt-2">
        <PopularNewTabsBar
          activeTab={sortBy === "newest" ? "new" : "popular"}
          onTabChange={(tab) => setSortBy(tab === "new" ? "newest" : "popular")}
          showPersonaChips={false}
        />
        <span className="text-xs font-mono text-ink-3">
          {filteredAndSortedAgents.length} of {AUTONOMOUS_AGENTS.length} Autonomous Agents
        </span>
      </div>

      {/* Universal Category Filter, Search & Sorting Bar */}
      <UniversalFilterSortBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search agents by name, domain, or skills..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={AUTONOMOUS_AGENTS.length}
        filteredCount={filteredAndSortedAgents.length}
      />

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-5 sm:p-6 rounded-2xl border border-line surface-card flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm group space-y-4"
          >
            <div>
              {/* Card Top Meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${agent.color}`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-primary font-bold">
                      {agent.category}
                    </span>
                    <h3 className="text-base font-bold font-mono text-ink group-hover:text-primary transition leading-tight">
                      {agent.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-ink-3 font-mono text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{agent.viralityPoints} Runs</span>
                </div>
              </div>

              {/* Tagline & Description */}
              <p className="text-xs font-semibold text-ink-2 mt-3 leading-snug">
                {agent.tagline}
              </p>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                {agent.description}
              </p>

              {/* Scoped Skills Pills */}
              <div className="flex flex-wrap gap-1 mt-3">
                {agent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-ink-3"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button & Presets Hint */}
            <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-ink-3">
                {agent.presets.length} one-click presets available
              </span>

              <button
                onClick={() => handleOpenAgent(agent)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
              >
                <span>Launch Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Modal */}
      <AgentWorkspaceModal
        agent={activeModalAgent}
        isOpen={!!activeModalAgent}
        onClose={() => setActiveModalAgent(null)}
      />
    </div>
  );
}
