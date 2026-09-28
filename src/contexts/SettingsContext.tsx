"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { sound } from "@/lib/sound";

type ColorTheme = "orange" | "blue" | "green";

type SettingsContextType = {
  themeMode: "light" | "dark" | "system"; // Managed by next-themes natively, but we expose toggle here? Actually we rely on next-themes for this.
  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
  spatial3D: boolean;
  toggle3D: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  isHydrated: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [colorTheme, setLocalColorTheme] = useState<ColorTheme>("orange");
  const [spatial3D, setSpatial3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Load preferences
    const saved3D = localStorage.getItem("sabbir_spatial_3d");
    if (saved3D !== null) setSpatial3D(saved3D === "true");

    const savedMotion = localStorage.getItem("sabbir_reduced_motion");
    if (savedMotion !== null) setReducedMotion(savedMotion === "true");

    const savedColor = localStorage.getItem("sabbir_color_theme") as ColorTheme;
    if (savedColor) {
      setLocalColorTheme(savedColor);
      document.documentElement.setAttribute("data-theme-color", savedColor);
    } else {
      document.documentElement.setAttribute("data-theme-color", "orange");
    }

    setSoundEnabled(sound.isEnabled());
    setIsHydrated(true);
  }, []);

  const setColorTheme = (color: ColorTheme) => {
    setLocalColorTheme(color);
    localStorage.setItem("sabbir_color_theme", color);
    document.documentElement.setAttribute("data-theme-color", color);
    
    // Globally update CSS variables for the color system
    if (color === "orange") {
      document.documentElement.style.setProperty('--primary', '255 106 0');
      document.documentElement.style.setProperty('--accent', '255 184 0');
    } else if (color === "blue") {
      document.documentElement.style.setProperty('--primary', '59 130 246');
      document.documentElement.style.setProperty('--accent', '139 92 246');
    } else if (color === "green") {
      document.documentElement.style.setProperty('--primary', '16 185 129');
      document.documentElement.style.setProperty('--accent', '52 211 153');
    }
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
      return next;
    });
  };

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        colorTheme, setColorTheme, 
        spatial3D, toggle3D, 
        reducedMotion, toggleMotion, 
        soundEnabled, toggleSound,
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
