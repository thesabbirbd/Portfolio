"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Terminal, Database, Server, Cpu, Cloud, Shield } from "lucide-react";

const ORBITING_NODES = [
  { label: "FastAPI", icon: Server, color: "#009688", angle: 0, distance: 135 },
  { label: "Docker", icon: Cloud, color: "#2496ED", angle: 60, distance: 145 },
  { label: "PostgreSQL", icon: Database, color: "#4169E1", angle: 120, distance: 135 },
  { label: "Ollama / AI", icon: Cpu, color: "#9333EA", angle: 180, distance: 140 },
  { label: "Ubuntu / Linux", icon: Terminal, color: "#E95420", angle: 240, distance: 135 },
  { label: "NOC & Mikrotik", icon: Shield, color: "#00B4D8", angle: 300, distance: 140 },
];

export function SpatialCore() {
  const [mounted, setMounted] = useState(false);

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-200, 200], [10, -10]);
  const rotateY = useTransform(smoothX, [-200, 200], [-10, 10]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) {
    return <div className="w-72 h-72 rounded-full bg-blue-500/10 animate-pulse mx-auto" />;
  }

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000">
      {/* Ambient Core Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-400/20 to-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse-soft pointer-events-none" />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Outer Orbiting Ring 1 */}
        <div className="absolute w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] rounded-full border border-dashed border-cyan-500/20 dark:border-cyan-400/15 animate-[spin_40s_linear_infinite]" />

        {/* Outer Orbiting Ring 2 (Counter-rotation) */}
        <div className="absolute w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] rounded-full border border-blue-500/20 dark:border-blue-400/15 animate-[spin_25s_linear_infinite_reverse]" />

        {/* Central Glass Sphere / Core Shield */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full p-2 glass-panel border border-white/40 dark:border-white/20 shadow-[0_20px_50px_rgba(0,114,255,0.3)] dark:shadow-[0_20px_60px_rgba(0,240,255,0.25)] flex items-center justify-center overflow-hidden group"
        >
          {/* Internal Specular Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-cyan-400/20 pointer-events-none rounded-full" />
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/40 dark:bg-white/20 blur-xl rounded-full pointer-events-none" />

          {/* Authentic Portrait Image of SABBiR */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
            <Image
              src="/assets/sabbir-portrait.png"
              alt="Md Sabbirul Islam Khan (SABBiR)"
              fill
              priority
              sizes="(max-width: 640px) 176px, 208px"
              className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Floating Status Pill on Center Core */}
          <div className="absolute bottom-2 inset-x-0 mx-auto w-fit px-3 py-0.5 rounded-full glass-panel border border-white/30 dark:border-cyan-400/30 text-[10px] font-mono font-semibold tracking-wider text-slate-800 dark:text-cyan-300 shadow-md flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SABBiR // CORE</span>
          </div>
        </motion.div>

        {/* Orbiting Telemetry Tech Nodes */}
        {ORBITING_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * node.distance;
          const y = Math.sin(rad) * node.distance;
          const Icon = node.icon;

          return (
            <motion.div
              key={node.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              whileHover={{ scale: 1.15 }}
              className="absolute z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-panel border border-slate-200/70 dark:border-white/15 shadow-md hover:border-cyan-400/60 transition-all cursor-default group"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <Icon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[11px] font-mono font-medium text-slate-800 dark:text-slate-200 group-hover:text-cyan-400 transition-colors">
                {node.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
