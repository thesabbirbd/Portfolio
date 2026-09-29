"use client";

import React, { useRef } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Briefcase, Monitor, Network, Terminal, Code, Cpu, Server, Workflow } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const JOURNEY_STEPS = [
  { id: "management", title: "MANAGEMENT", icon: Briefcase, color: "text-blue-500", desc: "Started with BBA in Management. Built the foundation of business economics, resource allocation, and strategic leadership." },
  { id: "support", title: "IT SUPPORT", icon: Monitor, color: "text-cyan-500", desc: "Provided Level 1 & 2 support. Mastered troubleshooting, hardware repair, and understanding end-user pain points." },
  { id: "networking", title: "NETWORKING", icon: Network, color: "text-emerald-500", desc: "Configured MikroTik routers, managed DNS, DHCP, and enterprise network architectures for 10,000+ users." },
  { id: "linux", title: "LINUX", icon: Terminal, color: "text-orange-500", desc: "Dived deep into Ubuntu & Debian. Bash scripting, kernel tuning, and server hardening became second nature." },
  { id: "python", title: "PYTHON", icon: Code, color: "text-yellow-500", desc: "Automated workflows. Built data pipelines, scrapers, and internal tools to eliminate repetitive network tasks." },
  { id: "ai", title: "AI", icon: Cpu, color: "text-purple-500", desc: "Integrated local LLMs via Ollama. Built RAG systems and autonomous agents to assist in network operations." },
  { id: "backend", title: "BACKEND", icon: Server, color: "text-indigo-500", desc: "Architected high-performance APIs with FastAPI. Implemented PostgreSQL databases and Redis caching." },
  { id: "devops", title: "DEVOPS", icon: Workflow, color: "text-pink-500", desc: "Containerized everything with Docker. Built CI/CD pipelines and infrastructure as code to deploy seamlessly." },
];

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  return (
    <div id="timeline" ref={containerRef} className="relative w-full max-w-5xl mx-auto py-24">
      <div className="text-center mb-24">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
          THE ENGINEERING <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">EVOLUTION</span>
        </h2>
        <p className="text-slate-700 dark:text-slate-300 max-w-xl mx-auto">A continuous journey from business strategy to systems architecture.</p>
      </div>

      <div className="relative flex gap-12">
        {/* Sticky Progress Line */}
        <div className="hidden md:block w-1 bg-slate-200 dark:bg-white/10 rounded-full relative ml-8 shrink-0">
          <motion.div 
            className="absolute top-0 w-full bg-gradient-to-b from-blue-500 via-cyan-400 to-purple-500 rounded-full"
            style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        {/* Cinematic Scroll Items */}
        <div className="flex-1 space-y-32">
          {JOURNEY_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <JourneyNode 
                key={step.id} 
                step={step} 
                index={i} 
                total={JOURNEY_STEPS.length} 
                scrollYProgress={smoothProgress} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JourneyNode({ step, index, total, scrollYProgress }: any) {
  const Icon = step.icon;
  // Calculate when this specific node should be active based on scroll progress
  const start = index / total;
  const end = (index + 1) / total;
  
  const opacity = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start, end, Math.min(1, end + 0.1)], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [Math.max(0, start - 0.1), start, end, Math.min(1, end + 0.1)], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [Math.max(0, start - 0.2), start], [50, 0]);
  
  return (
    <motion.div style={{ opacity, scale, y }} className="relative flex items-center gap-8">
      {/* Mobile-only connector dot */}
      <div className="md:hidden absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      
      <GlassCard heavy hoverEffect={true} className="p-8 w-full backdrop-blur-xl border-white/10 hover:border-[var(--color-primary)]/50 transition-colors group/card">
        <div className="flex items-center gap-6 mb-4">
          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg ${step.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-mono tracking-widest text-slate-700 dark:text-slate-300 mb-1">PHASE 0{index + 1}</div>
            <h3 className="text-2xl font-black tracking-tight text-white">{step.title}</h3>
          </div>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
          {step.desc}
        </p>
      </GlassCard>
    </motion.div>
  );
}
