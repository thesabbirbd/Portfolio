"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "aiyaar", n: "★", label: "Aiyaar" },
  { id: "about", n: "01", label: "Identity" },
  { id: "projects", n: "02", label: "Work" },
  { id: "journey", n: "03", label: "Journey" },
  { id: "lab", n: "04", label: "Lab" },
  { id: "writing", n: "05", label: "Writing" },
  { id: "discover", n: "06", label: "Discover" },
  { id: "beyond", n: "07", label: "Beyond" },
  { id: "contact", n: "08", label: "Contact" },
];

/**
 * Home's chapter marker — the "motion reel" timeline of the page, without scroll-jacking.
 * Desktop (xl+): a fixed rail of real anchor links with the current chapter highlighted.
 * Smaller screens: a 2px reading-progress bar along the top edge.
 * Progress is a MotionValue bound to transform (no React render per scroll frame); the active
 * chapter comes from one IntersectionObserver and only re-renders when the chapter changes.
 */
export function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    // Back above the first chapter (hero): hide the rail.
    const onScroll = () => {
      const first = els[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.6) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="xl:hidden fixed top-0 inset-x-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand via-brand-2 to-signal print:hidden"
        style={{ scaleX: scrollYProgress }}
      />
      <nav
        aria-label="Page chapters"
        className={cn(
          "hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 print:hidden transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative flex flex-col gap-0.5 pl-4">
          <span aria-hidden="true" className="absolute left-0 top-1 bottom-1 w-px bg-line-strong" />
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-1 bottom-1 w-px origin-top bg-gradient-to-b from-brand to-brand-2"
            style={{ scaleY: scrollYProgress }}
          />
          {CHAPTERS.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-label={`${c.n} ${c.label}`}
                aria-current={isActive ? "location" : undefined}
                className="group flex items-center gap-2 min-h-6 font-mono text-[11px] leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              >
                <span className={cn("transition-colors", isActive ? "text-primary font-bold" : "text-ink-3 group-hover:text-ink")}>{c.n}</span>
                <span
                  className={cn(
                    "uppercase tracking-[0.14em] transition-[opacity,transform,color] duration-300",
                    // Labels on hover/focus; the active label stays visible only where the margin allows (2xl).
                    isActive ? "opacity-0 2xl:opacity-100 2xl:translate-x-0 text-ink group-hover:opacity-100 group-focus-visible:opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 text-ink-3",
                    "rounded bg-paper/90 px-1 py-0.5"
                  )}
                >
                  {c.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
