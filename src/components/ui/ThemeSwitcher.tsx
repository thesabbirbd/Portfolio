"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={cycleTheme}
      className={`relative p-2 rounded-full glass-panel hover:border-[var(--color-secondary)]/40 transition-colors text-slate-700 dark:text-slate-200 flex items-center justify-center ${className || ""}`}
      title={`Current: ${theme || "system"}. Click to toggle.`}
      aria-label="Toggle color theme"
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-[var(--color-secondary)] transition-transform duration-300" />}
      {theme === "system" && <Laptop className="w-4 h-4 text-blue-500 transition-transform duration-300" />}
    </motion.button>
  );
}
