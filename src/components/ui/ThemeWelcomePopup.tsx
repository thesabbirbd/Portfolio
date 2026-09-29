"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { GlassButton } from "./glass/GlassButton";
import { sound } from "@/lib/sound";

export function ThemeWelcomePopup() {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenPopup = sessionStorage.getItem("hasSeenThemePopup");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Play subtle sound if allowed/desired
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sound.click();
    setIsVisible(false);
    sessionStorage.setItem("hasSeenThemePopup", "true");
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] inset-x-4 sm:inset-x-auto sm:bottom-10 sm:right-10 z-[100] w-auto sm:w-96 mx-auto sm:mx-0 p-6 rounded-3xl bg-background/70 backdrop-blur-2xl border border-[var(--primary)]/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] spatial-glass"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Welcome to THE SABBiR OS
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              We noticed your system prefers{" "}
              <strong className="text-[var(--primary)] font-semibold uppercase tracking-wide">
                {resolvedTheme}
              </strong>{" "}
              mode, so we've synced the environment for you. You can change this anytime using the theme toggle in the navigation.
            </p>
            
            <div className="mt-2 flex justify-end">
              <GlassButton 
                onClick={handleClose} 
                variant="primary"
                size="sm"
                className="font-bold uppercase tracking-widest text-[10px]"
              >
                Got it
              </GlassButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
