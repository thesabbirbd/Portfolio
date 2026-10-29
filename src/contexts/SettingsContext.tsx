"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { sound, DEFAULT_LEVEL, type SoundLevel } from "@/lib/sound";

export type VisitorLens = "general" | "engineer" | "professional" | "explorer";

type SettingsContextType = {
  themeMode: "light" | "dark" | "system";
  spatial3D: boolean;
  toggle3D: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  /** Sound FX level; "off" is soundEnabled = false. */
  soundLevel: SoundLevel;
  setSoundLevel: (level: SoundLevel) => void;
  lens: VisitorLens;
  setLens: (lens: VisitorLens) => void;
  isHydrated: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [spatial3D, setSpatial3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundLevel, setLocalSoundLevel] = useState<SoundLevel>(DEFAULT_LEVEL);
  const [lens, setLocalLens] = useState<VisitorLens>("general");

  useEffect(() => {
    // Load preferences
    const saved3D = localStorage.getItem("sabbir_spatial_3d");
    if (saved3D !== null) setSpatial3D(saved3D === "true");

    const savedMotion = localStorage.getItem("sabbir_reduced_motion");
    if (savedMotion !== null) setReducedMotion(savedMotion === "true");
    document.documentElement.dataset.motion = savedMotion === "true" ? "reduced" : "full";

    const savedLens = localStorage.getItem("sabbir_visitor_lens") as VisitorLens;
    if (savedLens) setLocalLens(savedLens);

    // Colour theme (Orange / Green / Blue) is applied before paint by THEME_INIT_SCRIPT and
    // managed by src/lib/theme-color-store.ts — not here, so switching it re-renders nothing else.

    setSoundEnabled(sound.isEnabled());
    setLocalSoundLevel(sound.getLevel());
    setIsHydrated(true);
  }, []);

  // Career-timeline milestones (dispatched by JourneyTimeline) get a tiny tonal accent when
  // sound is on. The sound module throttles it and never unlocks audio from scroll alone.
  useEffect(() => {
    const onMilestone = (e: Event) => sound.milestone(String((e as CustomEvent).detail ?? ""));
    window.addEventListener("sabbir:milestone", onMilestone);
    return () => window.removeEventListener("sabbir:milestone", onMilestone);
  }, []);

  const toggle3D = () => {
    setSpatial3D((prev) => {
      const next = !prev;
      localStorage.setItem("sabbir_spatial_3d", String(next));
      return next;
    });
  };

  const toggleMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem("sabbir_reduced_motion", String(next));
      // CSS scroll-driven reveals read this (they cannot see React state).
      document.documentElement.dataset.motion = next ? "reduced" : "full";
      return next;
    });
  };

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const setSoundLevel = (level: SoundLevel) => {
    sound.setLevel(level);
    setLocalSoundLevel(sound.getLevel());
  };

  const setLens = (newLens: VisitorLens) => {
    setLocalLens(newLens);
    localStorage.setItem("sabbir_visitor_lens", newLens);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        spatial3D, toggle3D, 
        reducedMotion, toggleMotion, 
        soundEnabled, toggleSound,
        soundLevel, setSoundLevel,
        lens, setLens,
        isHydrated,
        themeMode: "system" 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
