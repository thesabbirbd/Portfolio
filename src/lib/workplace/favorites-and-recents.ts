/**
 * THE SABBiR OS — Favorites & Recents Engine
 * Manages pinned tools (⭐) and LRU visited tools (🕒) in localStorage.
 */

const PINNED_STORAGE_KEY = "the_sabbir_os_pinned_tools";
const RECENTS_STORAGE_KEY = "the_sabbir_os_recent_tools";
const MAX_RECENTS = 8;

const DEFAULT_PINNED = ["bg-remover", "invoice-maker", "gov-photo-sizer", "remittance-calculator"];

export function getPinnedTools(): string[] {
  if (typeof window === "undefined") return DEFAULT_PINNED;
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return DEFAULT_PINNED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PINNED;
  } catch {
    return DEFAULT_PINNED;
  }
}

export function isToolPinned(slug: string): boolean {
  return getPinnedTools().includes(slug);
}

export function toggleToolPin(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getPinnedTools();
    const exists = current.includes(slug);
    const updated = exists ? current.filter((s) => s !== slug) : [slug, ...current];
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("sabbir_os_favorites_changed", { detail: { pinned: updated } }));
    return !exists;
  } catch {
    return false;
  }
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordToolVisit(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  try {
    const current = getRecentTools().filter((s) => s !== slug);
    const updated = [slug, ...current].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("sabbir_os_recents_changed", { detail: { recents: updated } }));
  } catch {
    // ignore
  }
}

import { useState, useEffect } from "react";

export function clearRecentTools(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENTS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("sabbir_os_recents_changed", { detail: { recents: [] } }));
  } catch {
    // ignore
  }
}

export function usePinnedAndRecents() {
  const [pinned, setPinned] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    setPinned(getPinnedTools());
    setRecents(getRecentTools());

    const onFavChange = () => setPinned(getPinnedTools());
    const onRecentChange = () => setRecents(getRecentTools());

    window.addEventListener("sabbir_os_favorites_changed", onFavChange);
    window.addEventListener("sabbir_os_recents_changed", onRecentChange);

    return () => {
      window.removeEventListener("sabbir_os_favorites_changed", onFavChange);
      window.removeEventListener("sabbir_os_recents_changed", onRecentChange);
    };
  }, []);

  return {
    pinned,
    recents,
    isPinned: (slug: string) => pinned.includes(slug),
    togglePin: (slug: string) => toggleToolPin(slug),
    clearRecents: () => clearRecentTools(),
  };
}
