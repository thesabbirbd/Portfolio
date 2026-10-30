/**
 * The app's one reader of `window.scrollY`.
 *
 * In Chromium, reading scrollY flushes pending style. While scroll-driven and looping CSS
 * animations run, style is dirty on every frame, so each reader inside a `scroll` event paid a
 * full style recalc of its own. This module listens passively, then reads the position once per
 * frame inside requestAnimationFrame (after animations have ticked, so that recalc is the one the
 * frame needs anyway) and hands the value to every subscriber. Subscribers must not read layout.
 */
type Listener = (y: number) => void;

const listeners = new Set<Listener>();
let frame = 0;

function read() {
  frame = 0;
  const y = window.scrollY;
  listeners.forEach((l) => l(y));
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(read);
}

export function subscribeScrollFrame(listener: Listener) {
  if (listeners.size === 0) window.addEventListener("scroll", onScroll, { passive: true });
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
