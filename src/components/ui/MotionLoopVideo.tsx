"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

interface MotionLoopVideoProps {
  /** Base path without extension, e.g. "/assets/videos/ambient-cyber-loop" (expects .webm + .mp4). */
  src: string;
  /** Pre-rendered light-theme variant (avoids a per-frame CSS filter on the video). */
  lightSrc?: string;
  className?: string;
}

/**
 * Decorative looping video rendered by scripts/generate-videos.js.
 * - Sources attach only once the element nears the viewport (no bytes spent above/below the fold).
 * - Playback pauses whenever it scrolls off-screen or the tab is hidden (battery guard).
 * - Never plays when the visitor prefers reduced motion (OS setting or the site's Motion toggle).
 */
export function MotionLoopVideo({ src, lightSrc, className }: MotionLoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const prefersReduced = useReducedMotion();
  const { reducedMotion } = useSettings();
  const motionOff = prefersReduced || reducedMotion;
  const { resolvedTheme } = useTheme();
  const activeSrc = lightSrc && resolvedTheme !== "dark" ? lightSrc : src;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // <source> children added or swapped after mount are ignored until load() is called.
  useEffect(() => {
    if (near) ref.current?.load();
  }, [near, activeSrc]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    const sync = () => {
      if (inView && !motionOff && document.visibilityState === "visible") {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [near, inView, motionOff, activeSrc]);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      className={cn(
        "pointer-events-none select-none object-cover transition-opacity duration-1000",
        motionOff && "hidden",
        className
      )}
    >
      {near && (
        <>
          <source src={`${activeSrc}.webm`} type="video/webm" />
          <source src={`${activeSrc}.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  );
}
