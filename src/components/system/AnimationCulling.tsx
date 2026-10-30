"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Pauses looping CSS animations that are off screen.
 *
 * Every running CSS animation costs a style update on the main thread each frame, even when the
 * compositor moves it — including the ones scrolled out of view (the backdrop's drift layer is
 * nearly three screens tall; the hero rings keep spinning after you leave the hero). One
 * IntersectionObserver watches `[data-cull]` elements and the children of `[data-cull-children]`
 * and sets `data-paused` while they are out of view; CSS (globals.css) pauses their animations.
 * Nothing is read on scroll; the observer only fires when something enters or leaves.
 */
export function AnimationCulling() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-paused", !e.isIntersecting);
      },
      { rootMargin: "15% 0px" }
    );
    const targets = document.querySelectorAll("[data-cull], [data-cull-children] > *");
    targets.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      targets.forEach((el) => el.removeAttribute("data-paused"));
    };
  }, [pathname]); // re-collect this route's targets

  return null;
}
