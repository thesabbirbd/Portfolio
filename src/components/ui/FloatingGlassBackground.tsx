// Site background: one static, filter-free atmosphere plus the theme-aware CSS backdrop.
//
// v4.0.1: the optional WebGL scene (three.js) and the parallax "IT widget" chips were removed
// at the owner's request — on desktop they were the heaviest thing on the page. Their role is
// now played by AmbientBackdrop: lightweight CSS-3D objects in the theme's colours that rise
// slowly as you scroll, on every device. No JS runs here.

import React from "react";
import { AmbientBackdrop } from "@/components/ui/AmbientBackdrop";

const ATMOSPHERE = [
  "radial-gradient(ellipse 42% 36% at 88% 10%, color-mix(in srgb, var(--vibrant-cyan) 20%, transparent), transparent 72%)",
  "radial-gradient(ellipse 38% 34% at 6% 46%, color-mix(in srgb, var(--vibrant-purple) 18%, transparent), transparent 72%)",
  "radial-gradient(ellipse 36% 32% at 86% 84%, color-mix(in srgb, var(--vibrant-emerald) 16%, transparent), transparent 72%)",
  "radial-gradient(ellipse 48% 40% at 50% 50%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 72%)",
].join(", ");

export function FloatingGlassBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-40 max-w-full">
      <div className="absolute inset-0" style={{ background: ATMOSPHERE }} />
      <AmbientBackdrop />
    </div>
  );
}
