"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sound } from "@/lib/sound";

/**
 * Site-wide sound layer (v4.0.1):
 *  1. Unlock: browsers only allow audio after a user gesture, so the first tap / click / key
 *     press anywhere starts the AudioContext (sound is on by default; Settings can mute it).
 *  2. Scroll ticks: a soft ratchet every ~160 px of scroll travel.
 *  3. Timeline clock: inside a `[data-sound-zone="timeline"]` element the ticks get denser
 *     (~48 px) and rise in pitch and length with progress — "tik… tikk… tiiik".
 *  4. Chapter cuts: a short sweep when a new top-level section enters the viewport.
 *  5. Click layer: any click on something clickable gets the theme's tap (unless the component
 *     already played its own cue for that click); a click on nothing clickable gets a soft "miss".
 * All cues are throttled in the sound module and stay silent until audio is unlocked.
 */
export function SoundScape() {
  const pathname = usePathname();

  // 1. Unlock on gestures until the context is running.
  useEffect(() => {
    const events = ["pointerdown", "pointerup", "touchend", "keydown", "click"] as const;
    const onGesture = () => {
      sound.unlock();
      if (sound.isUnlocked()) events.forEach((e) => window.removeEventListener(e, onGesture, true));
    };
    events.forEach((e) => window.addEventListener(e, onGesture, { capture: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onGesture, true));
  }, []);

  // 5. Global click layer (bubble phase on window: component handlers have already run).
  useEffect(() => {
    const CLICKABLE = 'a[href],button,[role="button"],[role="radio"],[role="switch"],[role="tab"],[role="menuitem"],[role="option"],[role="checkbox"],input,select,textarea,label,summary,[tabindex]:not([tabindex="-1"])';
    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted || !sound.isEnabled()) return;
      if (sound.playedWithin(80)) return; // the component voiced this click itself
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      if (target.closest(CLICKABLE)) {
        if (!target.closest("input,textarea,select")) sound.click();
        return;
      }
      if (String(window.getSelection?.() ?? "").length > 0) return; // selecting text, not a tap
      sound.miss();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // 2 + 3. Scroll ticks and bottom-boundary detection (one rAF-batched listener).
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let travel = 0;
    let frame = 0;
    let wasAtBottom = false;

    const step = () => {
      frame = 0;
      const y = window.scrollY;
      const t = performance.now();
      const dy = Math.abs(y - lastY);
      const speed = dy / Math.max(1, t - lastT);
      lastY = y;
      lastT = t;

      if (!sound.isEnabled()) return;

      const vh = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Reaching bottom boundary cue
      const atBottom = y + vh >= docHeight - 40;
      if (atBottom && !wasAtBottom && y > 300) {
        sound.bottom();
        wasAtBottom = true;
      } else if (!atBottom && wasAtBottom && y + vh < docHeight - 120) {
        wasAtBottom = false;
      }

      if (!dy) return;
      travel += dy;

      let zone: { progress: number } | null = null;
      for (const el of document.querySelectorAll<HTMLElement>('[data-sound-zone="timeline"]')) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.65 && r.bottom > vh * 0.35) {
          zone = { progress: Math.min(1, Math.max(0, (vh * 0.5 - r.top) / Math.max(1, r.height))) };
          break;
        }
      }
      const every = zone ? 48 : 128;
      if (travel >= every) {
        travel %= every;
        if (zone) sound.timelineTick(zone.progress, speed);
        else sound.scrollTick(speed);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // 4. Chapter cuts for this route's top-level sections (skips those visible on load).
  useEffect(() => {
    const seen = new WeakSet<Element>();
    let ready = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || seen.has(e.target)) continue;
          seen.add(e.target);
          if (ready) sound.sectionEnter();
        }
      },
      { threshold: 0.25 },
    );
    const sections = document.querySelectorAll("main section[id], main > div > section[id]");
    sections.forEach((s) => io.observe(s));
    const t = setTimeout(() => (ready = true), 800);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
