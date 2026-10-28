"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { JOURNEY_STEPS } from "@/data/journey";
import { cn } from "@/lib/utils";

/**
 * Career & Growth — the signature scroll-told timeline (/about#timeline).
 *
 * One server-rendered layout for every viewport (CSS decides what shows), so there is no
 * hydration swap and deep links (#journey-<id>) land exactly.
 *  - Desktop: sticky context panel (current phase, context, progress rail of jump links) beside
 *    the phase cards.
 *  - Phones: a sticky horizontal phase selector with its own progress bar above the cards.
 * Scroll → state flows one way: an IntersectionObserver picks the active phase; jump links are
 * plain anchors (keyboard/no-JS friendly). Nothing programmatically scrolls the page, so the
 * scrubber and the user's scroll never fight. Progress lines are MotionValues on transform.
 */
export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(JOURNEY_STEPS[0].id);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 60%", "end 60%"] });

  useEffect(() => {
    // A deep link (#journey-<id>) selects its phase immediately.
    const fromHash = window.location.hash.replace("#journey-", "");
    if (JOURNEY_STEPS.some((st) => st.id === fromHash)) setActive(fromHash);

    const items = JOURNEY_STEPS.map((st) => document.getElementById(`journey-${st.id}`)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive((hit.target as HTMLElement).dataset.step!);
      },
      // Detection band at 25–30% of the viewport — where anchor jumps land (scroll-mt) and where
      // the eye reads — so the highlighted phase always matches the card being read.
      { rootMargin: "-25% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const announcedRef = useRef(false);
  // Keep the active chip visible inside its own horizontal scroller (never scrolls the page).
  useEffect(() => {
    const scroller = chipsRef.current;
    const chip = scroller?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (scroller && chip) scroller.scrollTo({ left: chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
    // Announce phase changes (optional sound cue); the initial phase on mount is not a change.
    if (announcedRef.current) window.dispatchEvent(new CustomEvent("sabbir:milestone", { detail: active }));
    announcedRef.current = true;
  }, [active]);

  const activeIndex = JOURNEY_STEPS.findIndex((s) => s.id === active);
  const current = JOURNEY_STEPS[activeIndex];

  return (
    <div id="timeline" ref={containerRef} className="relative w-full max-w-6xl mx-auto py-8 sm:py-16 scroll-mt-20">
      <div className="reveal text-center mb-6 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-ink mb-2 sm:mb-4">
          THE ENGINEERING <span className="text-display-gradient">EVOLUTION</span>
        </h2>
        <p className="text-sm sm:text-base text-ink-2 max-w-xl mx-auto px-4">A continuous journey from business strategy to systems architecture.</p>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-10">
        {/* Desktop: sticky context panel + progress rail */}
        <aside className="hidden md:block md:col-span-4" aria-label="Timeline navigation">
          <div className="sticky top-28">
            <p className="font-mono text-eyebrow uppercase text-ink-3">Phase</p>
            <p className="mt-1 font-black tracking-tighter text-ink leading-none">
              <span className="text-6xl text-display-gradient">0{activeIndex + 1}</span>
              <span className="text-2xl text-ink-3">/0{JOURNEY_STEPS.length}</span>
            </p>
            <p className="mt-3 text-lg font-black tracking-tight text-ink">{current.title}</p>
            <p className="text-sm text-ink-2">{current.context}</p>

            <nav className="relative mt-8 pl-5" aria-label="Jump to phase">
              <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-0.5 rounded-full bg-line-strong" />
              <motion.span
                aria-hidden="true"
                className="absolute left-[5px] top-2 bottom-2 w-0.5 rounded-full origin-top bg-gradient-to-b from-brand via-brand-2 to-signal"
                style={{ scaleY: scrollYProgress }}
              />
              <ol className="space-y-2.5">
                {JOURNEY_STEPS.map((step, i) => {
                  const isActive = step.id === active;
                  return (
                    <li key={step.id} className="relative">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-[transform,background-color,border-color] duration-300",
                          isActive ? "scale-125 bg-primary border-primary" : i < activeIndex ? "bg-brand-2 border-brand-2" : "bg-paper border-line-strong"
                        )}
                      />
                      <a
                        href={`#journey-${step.id}`}
                        aria-current={isActive ? "step" : undefined}
                        className={cn(
                          "flex items-baseline gap-2 rounded px-1 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          isActive ? "text-ink font-bold" : "text-ink-3 hover:text-ink"
                        )}
                      >
                        <span>0{i + 1}</span>
                        <span className="tracking-wide">{step.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </aside>

        <div className="md:col-span-8">
          {/* Phones: sticky phase selector (opaque surface — no backdrop blur over moving content) */}
          <div className="md:hidden sticky top-0 z-20 -mx-4 px-4 pt-2 pb-2.5 bg-paper border-b border-line">
            <div ref={chipsRef} className="flex gap-1.5 overflow-x-auto hide-scrollbar" aria-label="Jump to phase">
              {JOURNEY_STEPS.map((step, i) => {
                const isActive = step.id === active;
                return (
                  <a
                    key={step.id}
                    data-chip={step.id}
                    href={`#journey-${step.id}`}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] whitespace-nowrap transition-colors",
                      isActive ? "border-primary/50 bg-primary/10 text-ink font-bold" : "border-line text-ink-3"
                    )}
                  >
                    0{i + 1} {step.title}
                  </a>
                );
              })}
            </div>
            <motion.div aria-hidden="true" className="mt-2 h-0.5 rounded-full origin-left bg-gradient-to-r from-brand via-brand-2 to-signal" style={{ scaleX: scrollYProgress }} />
          </div>

          <ol className="space-y-3 md:space-y-6 pt-3 md:pt-0">
            {JOURNEY_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.id === active;
              return (
                <li key={step.id} id={`journey-${step.id}`} data-step={step.id} className="scroll-mt-24 md:scroll-mt-32">
                  <article
                    className={cn(
                      "reveal relative rounded-card surface-card p-4 sm:p-6 transition-[border-color,box-shadow,opacity] duration-300",
                      isActive ? "border-primary/40 shadow-e2" : "md:opacity-75"
                    )}
                  >
                    <span aria-hidden="true" className={cn("absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-colors duration-300", isActive ? "bg-primary" : "bg-transparent")} />
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex shrink-0 items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl border", isActive ? "bg-primary/10 border-primary/30 text-primary" : "bg-ink/[0.03] border-line text-ink-2")}>
                        <Icon aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-3">
                          <span>PHASE 0{i + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span>{step.stage}</span>
                          {step.status === "current" && <span className="ml-1 px-1.5 py-0.5 rounded bg-ok/10 text-ok font-semibold">NOW</span>}
                        </div>
                        <h3 className="text-base sm:text-xl font-black tracking-tight text-ink">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-2 font-mono text-xs text-ink-3">{step.context}</p>
                    <p className="mt-2 text-sm sm:text-base text-ink-2 leading-relaxed">{step.desc}</p>
                    {step.evidence.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Evidence">
                        {step.evidence.map((ev) => (
                          <li key={ev.href}>
                            <Link
                              href={ev.href}
                              className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                            >
                              {ev.label}
                              <ArrowUpRight aria-hidden="true" className="w-3 h-3" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
