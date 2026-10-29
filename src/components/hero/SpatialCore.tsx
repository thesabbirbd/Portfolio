"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Terminal, Database, Server, Cpu, Cloud, Shield } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { sound } from "@/lib/sound";

// Each orbiting node opens the real evidence for that skill (purposeful, not decoration).
const ORBITING_NODES = [
  { label: "FastAPI", icon: Server, color: "#00f0ff", angle: 30, href: "/projects/omnidesk", hint: "Omnidesk BD case study" },
  { label: "Docker", icon: Cloud, color: "#2496ED", angle: 90, href: "/experience#skills", hint: "skills by area" },
  { label: "PostgreSQL", icon: Database, color: "#4169E1", angle: 150, href: "/projects/omnidesk", hint: "Omnidesk BD case study" },
  { label: "Ollama / AI", icon: Cpu, color: "#a855f7", angle: 210, href: "/projects/ollama-bench", hint: "local LLM benchmarks" },
  { label: "Ubuntu / Linux", icon: Terminal, color: "#E95420", angle: 270, href: "/journal/ubuntu-dev-environment", hint: "Ubuntu dev environment journal" },
  { label: "NOC & Network", icon: Shield, color: "#00f5a0", angle: 330, href: "/projects/noc-router", hint: "MikroTik NOC lab" },
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
  // Pointer tilt only after hydration and on pointer-capable layouts (keeps SSR markup stable).
  const tiltEnabled = mounted && !shouldReduceMotion && !isMobile;

  // Phones: nodes sit on the outer ring (ring ≈ min(250px, 68vw) wide → radius ≈ half).
  const orbitRadius = isMobile ? 112 : 175;

  
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
      className="cine-exit-fast relative w-full max-w-[220px] xs:max-w-[260px] sm:max-w-[500px] short-landscape:max-w-[240px] short-portrait:max-w-[170px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000"
    >

      {/* 3 Vibrant Ambient Glow Backdrops */}
      <div className="absolute -inset-[8%] bg-[radial-gradient(circle,rgb(var(--brand)/0.22),rgb(var(--brand-2)/0.10)_45%,transparent_70%)] rounded-full -z-10 pointer-events-none" />

      <motion.div
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* ================= 3D GYROSCOPIC GIMBAL RINGS ================= */}
        {/* Rings turn on every device (v4.0.1: owner wants the phone hero to match desktop); transform-only, motion-safe. */}
        {/* Ring 1: Electric Cyan (XY Plane) */}
        <div className="absolute w-[min(215px,60vw)] xs:w-[min(250px,68vw)] sm:w-[440px] short-landscape:w-[230px] short-portrait:w-[165px] h-[min(215px,60vw)] xs:h-[min(250px,68vw)] sm:h-[440px] short-landscape:h-[230px] short-portrait:h-[165px] rounded-full border border-dashed border-brand/35 motion-safe:animate-[spin_36s_linear_infinite]" />

        {/* Ring 2: Neon Purple (Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateX(68deg)" }}
          className="absolute w-[min(195px,55vw)] xs:w-[min(225px,62vw)] sm:w-[400px] short-landscape:w-[210px] short-portrait:w-[150px] h-[min(195px,55vw)] xs:h-[min(225px,62vw)] sm:h-[400px] short-landscape:h-[210px] short-portrait:h-[150px] rounded-full border border-ink-3/25 motion-safe:animate-[spin_24s_linear_infinite_reverse]"
        />

        {/* Ring 3: Radiant Emerald (Opposite Tilted Gimbal 3D) */}
        <div
          style={{ transform: "rotateY(68deg)" }}
          className="absolute w-[min(150px,42vw)] xs:w-[min(170px,48vw)] sm:w-[310px] short-landscape:w-[160px] short-portrait:w-[115px] h-[min(150px,42vw)] xs:h-[min(170px,48vw)] sm:h-[310px] short-landscape:h-[160px] short-portrait:h-[115px] rounded-full border border-brand-2/40 motion-safe:animate-[spin_30s_linear_infinite]"
        />

        {/* ================= CENTRAL SPATIAL GLASS SPHERE ================= */}
        {/* Bob is a CSS keyframe (compositor-only) on every device; stops under reduced motion. */}
        <div
          className="relative z-10 w-[min(145px,40vw)] xs:w-[min(170px,46vw)] sm:w-80 short-landscape:w-[150px] short-portrait:w-[115px] h-[min(145px,40vw)] xs:h-[min(170px,46vw)] sm:h-80 short-landscape:h-[150px] short-portrait:h-[115px] rounded-full p-2 bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/[0.03] border border-white/50 dark:border-brand/30 shadow-[0_24px_60px_-18px_rgb(var(--brand)/0.45)] flex items-center justify-center overflow-hidden group motion-safe:animate-bob"
        >
          {/* Specular Edge Highlight Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-brand-2/20 pointer-events-none rounded-full" />
          <div className="absolute -top-8 -left-8 w-20 sm:w-28 h-20 sm:h-28 bg-[radial-gradient(circle,rgb(255_255_255/0.5),transparent_70%)] dark:bg-[radial-gradient(circle,rgb(var(--brand-2)/0.12),transparent_70%)] rounded-full pointer-events-none" />

          {/* Authentic Portrait Image of THE SABBiR */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10 bg-slate-950">
            <Image
              src="/assets/sabbir-stylish-portrait.jpg"
              alt="Portrait of Md Sabbirul Islam Khan"
              fill
              priority
              draggable={false}
              // LCP image: rendered 115–215px on phones and 320px from `sm`; default quality keeps
              // it ~5× lighter than q100 (e.g. 640w WebP: 30 KB vs 150 KB).
              sizes="(max-width: 639px) 215px, 320px"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Floating Status Pill on Center Core */}
          <div className="absolute bottom-2 inset-x-0 mx-auto w-fit px-2.5 sm:px-3 py-0.5 rounded-full bg-surface border border-line text-[11px] font-mono font-bold tracking-wider text-ink shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok md:motion-safe:animate-ping" />
            <span>THE SABBiR</span>
          </div>
        </div>

        {/* ================= 3D ORBITING TECH NODES ================= */}
        {ORBITING_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * orbitRadius;
          const y = Math.sin(rad) * orbitRadius;
          const Icon = node.icon;

          return (
            <motion.div
              key={node.label}
              // Entrance is the CSS `rise` keyframe on the link (opacity/translate only): the chip is
              // full size from first paint, so it never overflows or shrinks below its tap target.
              style={{
                left: "50%",
                top: "50%",
                marginLeft: x,
                marginTop: y,
                x: "-50%",
                y: "-50%",
              }}
              whileHover={{ scale: 1.15 }}
              className="absolute z-20 flex short-landscape:hidden rounded-full"
            >
              <Link
                href={node.href}
                aria-label={`${node.label}: ${node.hint}`}
                title={node.hint}
                onMouseEnter={() => sound.hover()}
                onClick={() => sound.launch()}
                style={{ animationDelay: `${150 + i * 80}ms` }}
                className="motion-safe:animate-rise flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-surface border border-gold/40 shadow-e1 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors group"
              >
                <span
                  className="hidden sm:block w-2 h-2 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[var(--node)] sm:text-ink-2 group-hover:text-primary transition-colors" style={{ "--node": node.color } as React.CSSProperties} />
                {/* Phones: icon-only chips (the label is the link's aria-label/title). */}
                <span className="hidden sm:inline text-[11px] font-mono font-medium text-ink group-hover:text-primary transition-colors">
                  {node.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
