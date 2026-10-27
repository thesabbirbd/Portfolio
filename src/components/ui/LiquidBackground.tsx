"use client";

import React from "react";

/**
 * Base page surface + faint grid. Deliberately static: the previous version animated three
 * 100–120px blurred orbs with mix-blend modes forever, which re-composited full-screen
 * layers every frame. Ambient colour now comes from FloatingGlassBackground's static gradients.
 */
export function LiquidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-background transition-colors duration-500">
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.05] dark:opacity-[0.03] dark:invert-0 invert" />
    </div>
  );
}
