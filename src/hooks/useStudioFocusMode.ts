"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * THE SABBiR OS — Studio Focus Mode Hook
 * Detects active studio pages (/tools/[slug]) and suppresses floating UI elements
 * (like bottom modals, docked HUDs) to guarantee zero button overlap on mobile devices.
 */
export function useStudioFocusMode() {
  const pathname = usePathname();
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    // Check if path is a specific tool studio (e.g. /tools/image-editor, not the /tools hub)
    const isStudio = Boolean(pathname && pathname.startsWith("/tools/") && pathname !== "/tools");
    setIsStudioActive(isStudio);

    if (isStudio) {
      document.documentElement.classList.add("studio-workspace-active");
    } else {
      document.documentElement.classList.remove("studio-workspace-active");
    }

    return () => {
      document.documentElement.classList.remove("studio-workspace-active");
    };
  }, [pathname]);

  useEffect(() => {
    if (isZenMode) {
      document.documentElement.classList.add("studio-zen-mode");
    } else {
      document.documentElement.classList.remove("studio-zen-mode");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Zen mode with 'F' or 'f' when not focused on an input/textarea
      if (
        (e.key === "f" || e.key === "F") &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      } else if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("studio-zen-mode");
    };
  }, [isZenMode]);

  return {
    isStudioActive,
    isZenMode,
    setIsZenMode,
    toggleZenMode: () => setIsZenMode((prev) => !prev),
  };
}
