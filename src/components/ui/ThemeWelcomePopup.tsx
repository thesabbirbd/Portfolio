"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { GlassButton } from "./glass/GlassButton";
import { sound } from "@/lib/sound";

export function ThemeWelcomePopup() {
  const { resolvedTheme, theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenPopup = sessionStorage.getItem("hasSeenThemePopup");
    
    if (!hasSeenPopup) {
      const show = setTimeout(() => setIsVisible(true), 1800);
      // Informational only: dismiss itself so it never lingers over content.
      const hide = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("hasSeenThemePopup", "true");
      }, 11000);
      return () => {
        clearTimeout(show);
        clearTimeout(hide);
      };
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
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-[calc(0.75rem+env(safe-area-inset-top))] inset-x-3 md:inset-x-auto md:top-auto md:bottom-24 md:right-6 z-[100] md:w-80 p-3.5 md:p-4 rounded-2xl bg-background/80 backdrop-blur-2xl border border-[var(--color-primary)]/25 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] print:hidden"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Welcome to THE SABBiR</p>
              <p className="text-xs text-foreground/75 leading-relaxed mt-0.5">
                {theme === "system" ? "Theme matched to your system" : "Theme set to"}{" "}
                <strong className="text-[var(--color-primary)] font-semibold capitalize">{resolvedTheme}</strong>. Change it anytime from the nav or Settings.
              </p>
            </div>
            <GlassButton
              onClick={handleClose}
              variant="primary"
              size="sm"
              magnetic={false}
              className="shrink-0 font-semibold text-[11px]"
            >
              Got it
            </GlassButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
