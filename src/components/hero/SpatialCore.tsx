"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Terminal, Database, Server, Cpu, Cloud, Shield } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

const ORBITING_NODES = [
  { label: "FastAPI", icon: Server, color: "#00f0ff", angle: 30 },
  { label: "Docker", icon: Cloud, color: "#2496ED", angle: 90 },
  { label: "PostgreSQL", icon: Database, color: "#4169E1", angle: 150 },
  { label: "Ollama / AI", icon: Cpu, color: "#a855f7", angle: 210 },
  { label: "Ubuntu / Linux", icon: Terminal, color: "#E95420", angle: 270 },
  { label: "NOC & Network", icon: Shield, color: "#00f5a0", angle: 330 },
];

export function SpatialCore() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 639px)', false);

  // 3D Parallax & Gyro Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-250, 250], [16, -16]);
  const rotateY = useTransform(smoothX, [-250, 250], [-16, 16]);

  useEffect(() => {
    setMounted(true);
  }, [mouseX, mouseY]);

  const shouldReduceMotion = useReducedMotion();

  if (!mounted) {
    return <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[var(--color-secondary)]/10 animate-pulse mx-auto" />;
  }

  const orbitRadius = isMobile ? 115 : 175;

  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Fix direction: usually moving mouse right should tilt it to the right (rotateY positive)
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[500px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000"
    >

      {/* 3 Vibrant Ambient Glow Backdrops */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-cyan-400/20 to-purple-600/25 rounded-full blur-2xl sm:blur-3xl -z-10 animate-pulse-soft pointer-events-none" />

      <motion.div
        style={shouldReduceMotion || isMobile ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* ================= 3D GYROSCOPIC GIMBAL RINGS ================= */}
        {/* Ring 1: Electric Cyan (XY Plane) */}
        <div className="absolute w-[min(240px,70vw)] xs:w-[min(280px,75vw)] sm:w-[440px] h-[min(240px,70vw)] xs:h-[min(280px,75vw)] sm:h-[440px] rounded-full border border-dashed border-[var(--color-secondary)]/30 animate-[spin_36s_linear_infinite]" />

        {/* Ring 2: Neon Purple (Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateX(68deg)" }}
          className="absolute w-[min(220px,65vw)] xs:w-[min(250px,70vw)] sm:w-[400px] h-[min(220px,65vw)] xs:h-[min(250px,70vw)] sm:h-[400px] rounded-full border border-purple-500/30 animate-[spin_24s_linear_infinite_reverse]"
        />

        {/* Ring 3: Radiant Emerald (Opposite Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateY(68deg)" }}
          className="absolute w-[min(170px,50vw)] xs:w-[min(190px,55vw)] sm:w-[310px] h-[min(170px,50vw)] xs:h-[min(190px,55vw)] sm:h-[310px] rounded-full border border-[var(--color-accent)]/30 animate-[spin_30s_linear_infinite]"
        />

        {/* ================= CENTRAL SPATIAL GLASS SPHERE ================= */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-[min(160px,45vw)] xs:w-[min(190px,50vw)] sm:w-80 h-[min(160px,45vw)] xs:h-[min(190px,50vw)] sm:h-80 rounded-full p-2 glass-spatial border border-white/50 dark:border-[var(--color-secondary)]/35 shadow-[0_20px_50px_rgba(0,114,255,0.25)] dark:shadow-[0_20px_60px_rgba(0,240,255,0.25)] flex items-center justify-center overflow-hidden group glass-specular-top"
        >
          {/* Specular Edge Highlight Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-cyan-400/25 pointer-events-none rounded-full" />
          <div className="absolute -top-8 -left-8 w-20 sm:w-28 h-20 sm:h-28 bg-white/40 dark:bg-[var(--color-secondary)]/10 blur-xl rounded-full pointer-events-none" />

          {/* Authentic Portrait Image of THE SABBiR */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 bg-slate-950">
            <Image
              src="/assets/sabbir-stylish-portrait.jpg"
              alt="Md Sabbirul Islam Khan (THE SABBiR)"
              fill
              priority
              draggable={false}
              sizes="(max-width: 768px) 300px, 600px"
              quality={100}
              className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Floating Status Pill on Center Core */}
          <div className="absolute bottom-2 inset-x-0 mx-auto w-fit px-2.5 sm:px-3 py-0.5 rounded-full glass-spatial border border-white/40 dark:border-[var(--color-secondary)]/40 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-slate-800 dark:text-cyan-300 shadow-md flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-ping" />
            <span>THE SABBiR // CORE</span>
          </div>
        </motion.div>

        {/* ================= 3D ORBITING TECH NODES ================= */}
        {ORBITING_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * orbitRadius;
          const y = Math.sin(rad) * orbitRadius;
          const Icon = node.icon;

          return (
            <motion.div
              key={node.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              style={{
                left: "50%",
                top: "50%",
                marginLeft: x,
                marginTop: y,
                x: "-50%",
                y: "-50%",
              }}
              whileHover={{ scale: 1.15 }}
              className="absolute z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-spatial border border-slate-200/70 dark:border-white/20 shadow-md hover:border-[var(--color-secondary)]/70 transition-all cursor-default group"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <Icon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200 group-hover:text-[var(--color-secondary)] transition-colors" />
              <span className="text-[11px] font-mono font-medium text-slate-800 dark:text-slate-200 group-hover:text-[var(--color-secondary)] transition-colors">
                {node.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
