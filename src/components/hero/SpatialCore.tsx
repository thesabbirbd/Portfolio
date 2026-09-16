"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Terminal, Database, Server, Cpu, Cloud, Shield } from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(false);

  // 3D Parallax & Gyro Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-180, 180], [16, -16]);
  const rotateY = useTransform(smoothX, [-180, 180], [-16, 16]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const { innerWidth, innerHeight } = window;
        const touch = e.touches[0];
        const x = touch.clientX - innerWidth / 2;
        const y = touch.clientY - innerHeight / 2;
        mouseX.set(x * 0.7);
        mouseY.set(y * 0.7);
      }
    };

    window.addEventListener("resize", checkMobile);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  const shouldReduceMotion = useReducedMotion();

  if (!mounted) {
    return <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-cyan-500/10 animate-pulse mx-auto" />;
  }

  const orbitRadius = isMobile ? 95 : 140;

  return (
    <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000">
      {/* 3 Vibrant Ambient Glow Backdrops */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-cyan-400/20 to-purple-600/25 rounded-full blur-2xl sm:blur-3xl -z-10 animate-pulse-soft pointer-events-none" />

      <motion.div
        style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* ================= 3D GYROSCOPIC GIMBAL RINGS ================= */}
        {/* Ring 1: Electric Cyan (XY Plane) */}
        <div className="absolute w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full border border-dashed border-cyan-400/30 animate-[spin_36s_linear_infinite]" />

        {/* Ring 2: Neon Purple (Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateX(68deg)" }}
          className="absolute w-[230px] sm:w-[340px] h-[230px] sm:h-[340px] rounded-full border border-purple-500/30 animate-[spin_24s_linear_infinite_reverse]"
        />

        {/* Ring 3: Radiant Emerald (Opposite Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateY(68deg)" }}
          className="absolute w-[210px] sm:w-[310px] h-[210px] sm:h-[310px] rounded-full border border-emerald-400/30 animate-[spin_30s_linear_infinite]"
        />

        {/* ================= CENTRAL SPATIAL GLASS SPHERE ================= */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-36 sm:w-52 h-36 sm:h-52 rounded-full p-2 glass-spatial border border-white/50 dark:border-cyan-400/35 shadow-[0_20px_50px_rgba(0,114,255,0.25)] dark:shadow-[0_20px_60px_rgba(0,240,255,0.25)] flex items-center justify-center overflow-hidden group glass-specular-top"
        >
          {/* Specular Edge Highlight Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-cyan-400/25 pointer-events-none rounded-full" />
          <div className="absolute -top-8 -left-8 w-20 sm:w-28 h-20 sm:h-28 bg-white/40 dark:bg-cyan-400/20 blur-xl rounded-full pointer-events-none" />

          {/* Authentic Portrait Image of THE SABBiR */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 bg-slate-950">
            <Image
              src="/assets/sabbir-portrait-v2.png"
              alt="Md Sabbirul Islam Khan (THE SABBiR)"
              fill
              priority
              sizes="(max-width: 640px) 144px, 208px"
              className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Floating Status Pill on Center Core */}
          <div className="absolute bottom-2 inset-x-0 mx-auto w-fit px-2.5 sm:px-3 py-0.5 rounded-full glass-spatial border border-white/40 dark:border-cyan-400/40 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-slate-800 dark:text-cyan-300 shadow-md flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
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
                transform: `translate(${x}px, ${y}px)`,
              }}
              whileHover={{ scale: 1.15 }}
              className="absolute z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-spatial border border-slate-200/70 dark:border-white/20 shadow-md hover:border-cyan-400/70 transition-all cursor-default group"
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
