"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Cpu, Network, Terminal, Video, HardDrive, Map } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const SKILL_CATEGORIES = [
  { id: "backend", title: "BACKEND", icon: Server, color: "text-blue-500", size: "lg", skills: ["FastAPI", "Python", "Node.js", "PostgreSQL", "Redis", "REST APIs", "WebSockets"] },
  { id: "ai", title: "AI", icon: Cpu, color: "text-purple-500", size: "lg", skills: ["Local LLMs", "Ollama", "RAG Systems", "LangChain", "Agentic Workflows"] },
  { id: "noc", title: "NOC", icon: Network, color: "text-cyan-500", size: "md", skills: ["MikroTik", "Cisco", "BGP / OSPF", "DNS & DHCP", "Network Monitoring", "Zabbix", "Grafana"] },
  { id: "ops", title: "OPS", icon: Terminal, color: "text-emerald-500", size: "md", skills: ["Docker", "Linux (Ubuntu/Debian)", "Bash Scripting", "CI/CD", "Nginx", "Systemd"] },
  { id: "media", title: "MEDIA", icon: Video, color: "text-pink-500", size: "sm", skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "OBS Studio", "Live Broadcasting"] },
  { id: "hardware", title: "HARDWARE", icon: HardDrive, color: "text-orange-500", size: "sm", skills: ["PC Building", "Server Racks", "Cable Management", "Hardware Diagnostics"] },
  { id: "maps", title: "MAPS", icon: Map, color: "text-yellow-500", size: "sm", skills: ["Google Maps Contributor", "Local Guides", "OSM", "Spatial Data"] },
];

export function SkillsBento() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="skills" className="relative w-full max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <SectionReveal className="w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-4">
          CAPABILITIES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">MATRIX</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">An interactive breakdown of technical domains and proficiencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]">
        {SKILL_CATEGORIES.map((cat) => {
          const isHovered = hoveredId === cat.id;
          const isOtherHovered = hoveredId !== null && hoveredId !== cat.id;
          
          return (
            <motion.div
              layout
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "relative cursor-pointer transition-all duration-500",
                cat.size === "lg" ? "md:col-span-2 md:row-span-2" :
                cat.size === "md" ? "md:col-span-2 md:row-span-1" :
                "md:col-span-1 md:row-span-1",
                isHovered ? "z-10 scale-[1.02]" : "z-0 scale-100",
                isOtherHovered ? "opacity-40 scale-[0.98] filter grayscale-[50%]" : "opacity-100 filter grayscale-0"
              )}
            >
              <GlassCard heavy className="w-full h-full p-6 flex flex-col transition-colors border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10", cat.color)}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{cat.title}</h3>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <div className="flex flex-wrap gap-2">
                    {/* Always show a few skills */}
                    {cat.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10">
                        {skill}
                      </span>
                    ))}
                    
                    {/* Expand rest on hover */}
                    <AnimatePresence>
                      {isHovered && cat.skills.slice(3).map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-black/10 dark:bg-white/10 text-gray-900 dark:text-gray-100 border border-black/20 dark:border-white/20"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Gradient mask to hint more content if not hovered and has more items */}
                  {!isHovered && cat.skills.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[rgba(255,255,255,0.9)] dark:from-[rgba(20,20,30,0.8)] to-transparent pointer-events-none flex items-end justify-center pb-1">
                      <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 tracking-widest uppercase">+{cat.skills.length - 3} More</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </SectionReveal>
    </section>
  );
}
