"use client";

import { useSyncExternalStore } from "react";

/**
 * useNavVisibility - single shared source of truth for "is the main nav hidden?".
 *
 * MorphingNav, IdentityDock, SettingsPanel and TerminalModal all choreograph around this
 * value. Previously each kept its own scroll listener with no hysteresis, so they could
 * disagree for a frame and flip on every 1px of scroll jitter. This store:
 *  - hides only after a sustained downward travel (HIDE_DELTA) past HIDE_AFTER_Y
 *  - shows again after a small upward travel (SHOW_DELTA), near the top, or once scrolling settles
 *  - notifies subscribers only when the boolean actually changes
 */

const HIDE_AFTER_Y = 160;
const HIDE_DELTA = 28;
const SHOW_DELTA = 14;
const SETTLE_MS = 900;

let hidden = false;
let lastY = 0;
let travel = 0; // signed distance accumulated in the current direction
let settleTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function setHidden(next: boolean) {
  if (next === hidden) return;
  hidden = next;
  listeners.forEach((l) => l());
}

function onScroll() {
  const y = window.scrollY;
  const delta = y - lastY;
  lastY = y;
  if (delta === 0) return;

  // Reset the accumulator when direction flips.
  travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;

  if (y < HIDE_AFTER_Y) {
    setHidden(false);
  } else if (travel > HIDE_DELTA) {
    setHidden(true);
  } else if (travel < -SHOW_DELTA) {
    setHidden(false);
  }

  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    travel = 0;
    setHidden(false);
  }, SETTLE_MS);
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    // Fresh start whenever the first control mounts: nav visible, no accumulated travel.
    hidden = false;
    travel = 0;
    lastY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (settleTimer) clearTimeout(settleTimer);
    }
  };
}

export function useNavVisibility() {
  const isNavHidden = useSyncExternalStore(
    subscribe,
    () => hidden,
    () => false
  );
  return { isNavHidden };
}
