"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLORS, THEME_SESSION_KEY, THEME_STORAGE_KEY, isThemeColor, type ThemeColor, type ThemeSource } from "./theme-color";

// Client-side theme store: reads html[data-theme-color] (set before paint by THEME_INIT_SCRIPT),
// saves manual choices, and notifies only the components that subscribe.

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readColor(): ThemeColor {
  const v = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme-color") : null;
  return isThemeColor(v) ? v : "orange";
}
function readSource(): ThemeSource {
  const v = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme-source") : null;
  return v === "saved" || v === "session" || v === "random" ? v : "random";
}

function safe(fn: () => void) {
  try { fn(); } catch { /* storage blocked (private mode): the theme still applies for this page */ }
}

/** Apply a colour; cross-fades with the View Transitions API when motion is allowed. */
function apply(color: ThemeColor, source: ThemeSource) {
  const root = document.documentElement;
  const commit = () => {
    root.setAttribute("data-theme-color", color);
    root.setAttribute("data-theme-source", source);
    emit();
  };
  const reduced = root.dataset.motion === "reduced" || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  // Cross-fade only where it's cheap: a View Transition snapshots the whole page and blocks input
  // until it finishes, which on touch phones (and with the animated backdrop) can take ~1 s.
  const finePointer = window.matchMedia?.("(pointer: fine)")?.matches === true;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!reduced && finePointer && typeof doc.startViewTransition === "function") doc.startViewTransition(commit);
  else commit();
}

/** Manual choice: saved for future visits and used for the rest of this session. */
export function setThemeColor(color: ThemeColor) {
  safe(() => localStorage.setItem(THEME_STORAGE_KEY, color));
  safe(() => sessionStorage.setItem(THEME_SESSION_KEY, color));
  apply(color, "saved");
}

/** Back to "random each visit": forget the saved choice and roll a different theme now. */
export function randomizeThemeColor(random = Math.random()) {
  const current = readColor();
  const others = THEME_COLORS.filter((c) => c !== current);
  const next = others[Math.min(others.length - 1, Math.floor(random * others.length))];
  safe(() => localStorage.removeItem(THEME_STORAGE_KEY));
  safe(() => sessionStorage.setItem(THEME_SESSION_KEY, next));
  apply(next, "random");
  return next;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Current colour theme (null during SSR/hydration — render theme-specific UI after mount). */
export function useThemeColor(): ThemeColor | null {
  return useSyncExternalStore(subscribe, readColor, () => null);
}

/** How the current theme was chosen ("saved" manual choice vs this visit's random pick). */
export function useThemeSource(): ThemeSource | null {
  return useSyncExternalStore(subscribe, readSource, () => null);
}
