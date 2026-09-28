"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING KERNEL...");

  useEffect(() => {
    // Check if the user has already visited in this session
    const hasVisited = sessionStorage.getItem("sabbir_visited");
    
    if (hasVisited) {
      setLoading(false);
      return;
    }

    const sequence = [
      { p: 14, text: "LOADING SPATIAL ENGINE...", time: 300 },
      { p: 45, text: "ESTABLISHING NEURAL LINK...", time: 600 },
      { p: 89, text: "MOUNTING 3D ASSETS...", time: 1000 },
      { p: 99, text: "CALIBRATING GLASS UI...", time: 1500 },
      { p: 100, text: "SYSTEM READY.", time: 2200 }
    ];

    let timeouts: NodeJS.Timeout[] = [];

    // Smooth counter animation
    const startTime = Date.now();
    const duration = 2200;
    
    const animateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Easing function for numbers
      setProgress(Math.floor(rawProgress));

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      } else {
        sessionStorage.setItem("sabbir_visited", "true");
        setTimeout(() => setLoading(false), 400); // Wait a bit at 100%
      }
    };

    requestAnimationFrame(animateProgress);

    sequence.forEach((step) => {
      timeouts.push(
        setTimeout(() => {
          setStatusText(step.text);
        }, step.time)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] text-white font-mono select-none overflow-hidden"
        >
          {/* Spatial Glowing Orbs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" 
          />

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">
            {/* Minimal Brand */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[10px] tracking-[0.4em] text-slate-700 dark:text-slate-300 mb-12 uppercase"
            >
              The Sabbir &bull; Spatial OS
            </motion.div>

            {/* Cinematic Progress Text */}
            <div className="w-full flex justify-between items-end mb-4">
              <motion.span 
                key={statusText}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-medium text-cyan-400 tracking-wider uppercase"
              >
                {statusText}
              </motion.span>
              <span className="text-3xl font-light tracking-tighter text-white/90">
                {progress.toString().padStart(2, '0')}<span className="text-sm text-white/40 ml-1">%</span>
              </span>
            </div>

            {/* Sleek Hardware Boot Track */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Hex Grid Background Subtle overlay */}
            <div className="absolute inset-0 z-[-1] opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAuNSI+CiAgICAgIDxwYXRoIGQ9Ik0xMy45OSAxMS45NWw2Ljk5NS00djhMMTQgMTl2OGw2Ljk5NS00djhsLTYuOTk1IDR2OGw2Ljk5NSA0djgtNi45OTUgNGgtMXYtOGwtNi45OTUtNHYtOGwxMy45OS04VjhMMTQgNHY4bC02Ljk5NSA0djhsNi45OTUgNHY4bDYuOTk1LTR2LThsLTYuOTk1LTR2LThMMCAyOCIgb3BhY2l0eT0iLjA3Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=')] pointer-events-none mix-blend-overlay"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
