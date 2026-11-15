"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Bot,
  Gamepad2,
  Route,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { sound } from "@/lib/sound";

const TELEMETRY_METRICS = [
  {
    label: "Client-Side Tools",
    value: "43",
    sub: "34 Studios + 9 Sandboxes",
    href: "/tools",
    icon: Wrench,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Autonomous Domain Agents",
    value: "20",
    sub: "6 Swarm Orchestrators",
    href: "/agents",
    icon: Bot,
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    label: "Engineering Arcade",
    value: "6",
    sub: "Interactive CTF & WPM",
    href: "/games",
    icon: Gamepad2,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    label: "Static & Edge Routes",
    value: "137+",
    sub: "Zero Dead Ends, Full SEO",
    href: "/explore",
    icon: Route,
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    label: "Privacy & Cloud Cost",
    value: "0ms",
    sub: "Zero Server File Uploads",
    href: "/architecture",
    icon: ShieldCheck,
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
];

export function PlatformScaleTelemetryCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-5 sm:p-7 rounded-3xl bg-surface border border-line shadow-sm space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink">
              Platform Scale &amp; Engineering Telemetry
            </h3>
            <p className="text-xs text-ink-3">
              Real-time platform metrics powered by client-side WebAssembly, Canvas, and Edge Runtime.
            </p>
          </div>
        </div>

        <Link
          href="/architecture"
          onClick={() => sound.navigate()}
          className="text-xs font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View Architecture Docs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TELEMETRY_METRICS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => sound.click()}
              className="p-3.5 rounded-2xl bg-muted/20 border border-line hover:border-primary/50 hover:bg-muted/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className={`p-1.5 rounded-lg border text-xs ${item.accent}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-bold font-mono text-ink group-hover:text-primary transition-colors">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-ink-2 mt-0.5 truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-ink-3 mt-0.5 truncate font-mono">
                  {item.sub}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
