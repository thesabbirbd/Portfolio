"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { THEME_META, THEME_TOAST_KEY } from "@/lib/theme-color";
import { useThemeColor, useThemeSource } from "@/lib/theme-color-store";
import { openSettings } from "@/lib/ui-events";
import { cn } from "@/lib/utils";

const SHOW_AFTER_MS = 900;
const AUTO_HIDE_MS = 7000;

/**
 * One small, theme-aware notice per browser session: "Studio theme: Emerald — switch anytime in
 * Settings." It appears once on entry (never again on other routes or reloads of the session),
 * sits below the desktop nav / at the top on phones (where the nav is at the bottom), hides
 * itself after a few seconds (paused while hovered or focused) and can be dismissed.
 * Client-only: nothing renders on the server, so there is no hydration mismatch.
 */
export function ThemeToast() {
  const color = useThemeColor();
  const source = useThemeSource();
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pathname = usePathname();

  // Decide once per session whether to show.
  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(THEME_TOAST_KEY) === "1";
      if (!seen) sessionStorage.setItem(THEME_TOAST_KEY, "1");
    } catch { /* storage blocked: skip the notice rather than risk repeating it */ }
    if (seen) return;
    const t = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  // Auto-hide unless the visitor is hovering/focusing it.
  useEffect(() => {
    if (!visible || paused) return;
    hideTimer.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer.current);
  }, [visible, paused]);

  // It is an entry notice: once the visitor moves to another route it has done its job.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setVisible(false);
  }

  const dismiss = useCallback(() => setVisible(false), []);

  if (!color) return null;
  const meta = THEME_META[color];

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      data-state={visible ? "open" : "closed"}
      className={cn(
        "theme-toast fixed z-[60] print:hidden",
        // phones: top (the nav lives at the bottom); md+: below the top nav, right side
        "inset-x-4 top-[calc(0.75rem+env(safe-area-inset-top))] md:inset-x-auto md:right-6 md:top-[6.25rem] short-landscape:top-[4.5rem] md:w-[22rem]",
        visible ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {visible && (
        <div className="flex items-center gap-3 rounded-2xl surface-control border-primary/30 px-3.5 py-3 shadow-e3">
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full ring-4 ring-primary/15" style={{ background: meta.swatch }} />
          <p className="min-w-0 flex-1 text-sm leading-snug text-ink-2">
            <strong className="font-semibold text-ink">{meta.family} theme: {meta.detail}</strong>
            {" — "}
            {source === "saved" ? "your saved choice." : "picked for this visit."}{" "}
            <span className="whitespace-nowrap">Switch anytime in Settings.</span>
          </p>
          <button
            type="button"
            onClick={() => { dismiss(); openSettings(); }}
            className="shrink-0 min-h-9 rounded-lg px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Change
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss theme notice"
            className="shrink-0 grid h-9 w-9 place-items-center rounded-lg text-ink-3 hover:text-ink hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
