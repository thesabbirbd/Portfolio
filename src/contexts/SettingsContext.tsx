"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { sound, type SoundLevel } from "@/lib/sound";

type ColorTheme = "orange" | "blue" | "green";
export type VisitorLens = "general" | "engineer" | "professional" | "explorer";

type SettingsContextType = {
  themeMode: "light" | "dark" | "system"; 
  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
  spatial3D: boolean;
  toggle3D: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  soundLevel: SoundLevel;
  setSoundLevel: (level: SoundLevel) => void;
  lens: VisitorLens;
  setLens: (lens: VisitorLens) => void;
  isHydrated: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [colorTheme, setLocalColorTheme] = useState<ColorTheme>("orange");
  const [spatial3D, setSpatial3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundLevel, setLocalSoundLevel] = useState<SoundLevel>("normal");
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

    const savedColor = localStorage.getItem("sabbir_color_theme") as ColorTheme;
    if (savedColor) {
      setLocalColorTheme(savedColor);
      document.documentElement.setAttribute("data-theme-color", savedColor);
    } else {
      document.documentElement.setAttribute("data-theme-color", "orange");
    }

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

  const setColorTheme = (color: ColorTheme) => {
    setLocalColorTheme(color);
    localStorage.setItem("sabbir_color_theme", color);
    document.documentElement.setAttribute("data-theme-color", color);
    
    // Palette tokens are defined in globals.css per [data-theme-color]; clear any legacy inline overrides.
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--accent');
  };

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
    setLocalSoundLevel(level);
  };

  const setLens = (newLens: VisitorLens) => {
    setLocalLens(newLens);
    localStorage.setItem("sabbir_visitor_lens", newLens);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        colorTheme, setColorTheme, 
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
