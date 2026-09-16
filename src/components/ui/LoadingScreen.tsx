"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast initializing simulation: 0 to 100% in ~600ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        return prev + 25;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white font-mono select-none"
        >
          <div className="w-full max-w-xs px-6 space-y-4 text-center">
            {/* Glowing Brand Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,240,255,0.4)] text-xl font-bold"
            >
              S
            </motion.div>

            <div className="space-y-1">
              <p className="text-xs text-[var(--color-secondary)] font-semibold tracking-wider animate-pulse">
                SYSTEM INITIALIZING...
              </p>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">
                THE SABBiR // PORTFOLIO
              </h1>
              <p className="text-[10px] text-slate-500">
                sabbir.nav.bd • Edge Network
              </p>
            </div>

            {/* Progress Track */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>BOOT_SEQUENCE</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
