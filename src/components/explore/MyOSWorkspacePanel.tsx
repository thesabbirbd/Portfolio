"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Bot,
  Award,
  Terminal,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Download,
  Trophy,
  ShieldAlert,
  Link2,
  Lock,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useOSStore } from "@/lib/os-store";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { CareerPassportModal } from "@/components/games/CareerPassportModal";
import { PinnedAndRecentBar } from "@/components/workplace/PinnedAndRecentBar";

const FREQUENT_TOOLS = [
  { slug: "gov-photo-sizer", name: "BCS & Visa Photo", icon: "📸" },
  { slug: "remittance-calculator", name: "2.5% Remittance", icon: "💵" },
  { slug: "unit-land-converter", name: "Land & Gold Vori", icon: "📐" },
  { slug: "document-scanner", name: "Document Scanner", icon: "📄" },
  { slug: "typing-speed-arena", name: "Typing WPM Arena", icon: "⌨️" },
  { slug: "color-design-lab", name: "Color & WCAG Lab", icon: "🎨" },
  { slug: "email-signature", name: "HTML Signature", icon: "✉️" },
  { slug: "quick-reply-hub", name: "F-Commerce Macros", icon: "💬" },
  { slug: "image-editor", name: "Pro Image Editor", icon: "🖼️" },
  { slug: "story-maker", name: "Story & Banner", icon: "📱" },
  { slug: "audio-editor", name: "Audio DAW", icon: "🎧" },
  { slug: "spreadsheet-grid", name: "Smart Khata Grid", icon: "📊" },
];

const QUICK_SWARMS = [
  { id: "autonomous-seo-viral", name: "Autonomous SEO & Viral Swarm", icon: "🤖" },
  { id: "family-wealth-audit", name: "Family Wealth & Zakat Swarm", icon: "💰" },
  { id: "freelancer-career", name: "Freelancer Career Swarm", icon: "🌐" },
  { id: "brand-launch", name: "Brand & Media Launch Swarm", icon: "🌟" },
  { id: "ecommerce-launch", name: "E-Commerce Launch Swarm", icon: "🚀" },
  { id: "daily-closing", name: "Daily Shop Closing Swarm", icon: "🧾" },
  { id: "devops-release", name: "DevOps Release Swarm", icon: "🛡️" },
];

export function MyOSWorkspacePanel() {
  const profile = useOSStore();
  const { user, isGuest } = useWorkplaceAuth();
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const activeHandle = user?.handle || profile.handle;
  const activeName = user?.displayName || profile.handle;
  const totalXp = Math.max(user?.totalXp || 0, profile.totalXp);
  const userRole = user?.role || (isGuest ? "guest" : "member");

  // Calculate XP Tier Progress
  const nextTierXp = totalXp < 100 ? 100 : totalXp < 300 ? 300 : totalXp < 700 ? 700 : 1500;
  const prevTierXp = totalXp < 100 ? 0 : totalXp < 300 ? 100 : totalXp < 700 ? 300 : 700;
  const progressPct = Math.min(100, Math.round(((totalXp - prevTierXp) / (nextTierXp - prevTierXp)) * 100));

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 font-sans">
      {/* Header Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-inner">
            {totalXp >= 700 ? "👑" : totalXp >= 300 ? "⚡" : profile.rank.badge || "🛡️"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-ink">My OS Workplace</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/15 text-primary uppercase">
                @{activeHandle} · {userRole}
              </span>
            </div>
            <p className="text-xs text-ink-3 mt-0.5">
              Rank: <span className="text-primary font-semibold">{totalXp >= 700 ? "Kernel Legend" : totalXp >= 300 ? "Architect" : totalXp >= 100 ? "Builder" : "Novice"}</span> · Neon DB &amp; WAF Shield
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/leaderboard"
            onClick={() => sound.click()}
            className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </Link>
          <Link
            href="/superadmin"
            onClick={() => sound.click()}
            className="px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition"
            title="SuperAdmin Console (Master Passcode)"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <button
            onClick={() => {
              sound.launch();
              setIsPassportOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Passport</span>
          </button>
        </div>
      </div>

      {/* Live XP Level Progress Bar */}
      <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-ink font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Workplace XP: {totalXp} / {nextTierXp} XP
          </span>
          <span className="text-primary font-bold">{progressPct}% to Next Tier</span>
        </div>
        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Pinned & Recent Tools Bar in My OS Panel */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>My Dock Pinned &amp; Recent Tools</span>
        </h4>
        <PinnedAndRecentBar />
      </div>

      {/* Earned Badges Strip */}
      <div className="p-3.5 rounded-2xl bg-muted/20 border border-line flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-ink">Earned Badges:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
            🛡️ Security Auditor
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            ⚡ Speed Typist
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
            🏗️ Studio Builder
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold">
            🌐 Swarm Commander
          </span>
        </div>
      </div>

      {/* 3 Quick Highlight Cards: OS Brain, Hacks, and Embed Studio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/os-brain"
          onClick={() => sound.click()}
          className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h5 className="text-xs font-bold text-ink group-hover:text-amber-400">Autonomous OS Brain</h5>
              <span className="text-[10px] text-ink-3">Self-Evolving Discovery Engine</span>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 font-mono mt-2 flex items-center gap-1 font-semibold">
            <span>Explore Telemetry</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/hacks"
          onClick={() => sound.click()}
          className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <div>
              <h5 className="text-xs font-bold text-ink group-hover:text-emerald-400">36 Everyday Hacks</h5>
              <span className="text-[10px] text-ink-3">AI Prompts &amp; Linux One-Liners</span>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 flex items-center gap-1 font-semibold">
            <span>Browse Catalog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/tools/embed-widget-studio"
          onClick={() => sound.click()}
          className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🧩</span>
            <div>
              <h5 className="text-xs font-bold text-ink group-hover:text-purple-400">Micro-SaaS Embeds</h5>
              <span className="text-[10px] text-ink-3">8 Free Iframe Widgets</span>
            </div>
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 flex items-center gap-1 font-semibold">
            <span>Generate Snippets</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Grid: Pinned Everyday Studios & Multi-Agent Swarms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Launch Everyday Studios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Everyday App-Replacement Studios</span>
            </h4>
            <Link href="/tools" className="text-[11px] font-mono text-ink-3 hover:text-primary transition">
              All 55 Tools →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {FREQUENT_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                onClick={() => sound.click()}
                className="p-2.5 rounded-xl border border-line bg-muted/20 hover:bg-muted/60 hover:border-primary/40 transition flex items-center gap-2 group"
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="text-xs font-medium text-ink group-hover:text-primary truncate">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Autonomous Swarms & Pipelines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>Multi-Agent Swarm Pipelines (8 Active)</span>
            </h4>
            <Link href="/agents" className="text-[11px] font-mono text-ink-3 hover:text-primary transition">
              Launch Studio →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK_SWARMS.map((swarm) => (
              <Link
                key={swarm.id}
                href="/agents"
                onClick={() => sound.click()}
                className="p-2.5 rounded-xl border border-line bg-muted/20 hover:bg-muted/60 hover:border-primary/40 transition flex items-center gap-2 group"
              >
                <span className="text-lg">{swarm.icon}</span>
                <span className="text-xs font-medium text-ink group-hover:text-primary truncate">
                  {swarm.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* PWA & System Telemetry Footer */}
      <div className="pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>THE SABBiR OS · Client-Side WASM Engine Online · 43 Studios · 20 Agents · 6 Swarms</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/leaderboard" className="hover:text-ink transition flex items-center gap-1 text-amber-400">
            🏆 Global Leaderboard
          </Link>
          <span>•</span>
          <Link href="/games" className="hover:text-ink transition">
            🎮 6 Games Arcade
          </Link>
        </div>
      </div>

      <CareerPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />
    </div>
  );
}
