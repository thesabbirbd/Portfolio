"use client";

import { MotionConfig } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

/** Applies the site's "Smooth Animations" toggle to every Framer Motion animation (OS preference still honoured). */
export function MotionPreferences({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useSettings();
  return <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>{children}</MotionConfig>;
}
