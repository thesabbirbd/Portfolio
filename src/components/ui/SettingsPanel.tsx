"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Volume2, VolumeX, Sun, Moon, Monitor, Eye, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { sound } from "@/lib/sound";

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorTheme, setColorTheme] = useState("orange");
  const [spatial3D, setSpatial3D] = useState(true);

  useEffect(() => {
    setSoundEnabled(sound.isEnabled());
    const storedMotion = localStorage.getItem("sabbir_reduced_motion");
    if (storedMotion) setReducedMotion(storedMotion === "true");
    const stored3D = localStorage.getItem("sabbir_spatial_3d");
    if (stored3D) setSpatial3D(stored3D !== "false");

    const storedColor = localStorage.getItem("sabbir_color_theme");
    if (storedColor) setColorTheme(storedColor);
  }, []);

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const toggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem("sabbir_reduced_motion", next ? "true" : "false");
    sound.click();
  };

  const toggle3D = () => {
    const next = !spatial3D;
    setSpatial3D(next);
    localStorage.setItem("sabbir_spatial_3d", next ? "true" : "false");
    sound.click();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sound.click();
        }}
        aria-label="Open System Settings"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 rounded-full glass-interactive shadow-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-2xl glass-spatial border border-[var(--border-glass)] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-glass)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">System Experience Settings</h3>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    sound.click();
                  }}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Close Settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="py-4 space-y-4 text-sm">
                {/* Theme Selector */}
                <div>
                  <label className="block mb-2 font-medium text-[var(--text-secondary)]">Interface Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setTheme("light");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                        theme === "light"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                          : "border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                        theme === "dark"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                          : "border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                        theme === "system"
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                          : "border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <Monitor className="w-4 h-4" /> System
                    </button>
                  </div>
                </div>

                
                {/* Color Theme Selector */}
                <div>
                  <label className="block mb-2 font-medium text-[var(--text-secondary)]">Vibrant Color Palette</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setColorTheme("orange");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
                        colorTheme === "orange"
                          ? "border-orange-500 bg-orange-500/10 text-orange-500 font-bold"
                          : "border-[var(--border-glass)] hover:border-orange-500/50 text-[var(--text-secondary)]"
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,106,0,0.8)]" /> Orange
                    </button>
                    <button
                      onClick={() => {
                        setColorTheme("blue");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
                        colorTheme === "blue"
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-500 font-bold dark:text-cyan-400"
                          : "border-[var(--border-glass)] hover:border-cyan-400/50 text-[var(--text-secondary)]"
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" /> Blue
                    </button>
                    <button
                      onClick={() => {
                        setColorTheme("green");
                        sound.click();
                      }}
                      className={`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
                        colorTheme === "green"
                          ? "border-emerald-400 bg-emerald-400/10 text-emerald-500 font-bold dark:text-emerald-400"
                          : "border-[var(--border-glass)] hover:border-emerald-400/50 text-[var(--text-secondary)]"
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Green
                    </button>
                  </div>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-glass)] bg-white/5 dark:bg-black/10">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">UI Sound Effects</div>
                      <div className="text-xs text-[var(--text-muted)]">Subtle synthesizer audio feedback</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      soundEnabled
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-[var(--border-glass)] text-[var(--text-muted)]"
                    }`}
                  >
                    {soundEnabled ? "ENABLED" : "MUTED"}
                  </button>
                </div>

                {/* 3D Spatial Effects */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-glass)] bg-white/5 dark:bg-black/10">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[var(--color-secondary)]" />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">3D Spatial Core</div>
                      <div className="text-xs text-[var(--text-muted)]">Interactive 3D particle nodes & parallax</div>
                    </div>
                  </div>
                  <button
                    onClick={toggle3D}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      spatial3D
                        ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-[var(--border-glass)] text-[var(--text-muted)]"
                    }`}
                  >
                    {spatial3D ? "ACTIVE" : "REDUCED"}
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-glass)] bg-white/5 dark:bg-black/10">
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">Smooth Animations</div>
                    <div className="text-xs text-[var(--text-muted)]">Respect system motion sensitivity</div>
                  </div>
                  <button
                    onClick={toggleMotion}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      !reducedMotion
                        ? "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)] text-[var(--color-secondary)]"
                        : "border-[var(--border-glass)] text-[var(--text-muted)]"
                    }`}
                  >
                    {!reducedMotion ? "STANDARD" : "REDUCED"}
                  </button>
                </div>
              </div>

              {/* Footer status */}
              <div className="pt-3 border-t border-[var(--border-glass)] text-center text-xs text-[var(--text-muted)]">
                Preferences persisted locally &bull; THE SABBiR Digital Space v2.0
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
