"use client";

import { useEffect } from "react";

const GA_ID = "G-47T386XBN6";
const CLARITY_ID = "ypf1mf272k";
/** Wait this long after `load`, then use the next idle period (capped by IDLE_TIMEOUT_MS). */
const AFTER_LOAD_MS = 3500;
const IDLE_TIMEOUT_MS = 2000;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
};

function injectScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function loadAnalytics() {
  const w = window as AnalyticsWindow;

  // Google Analytics 4 (same configuration as the former inline snippet).
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag expects the `arguments` object itself, not an array copy.
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

  // Microsoft Clarity (queue stub, then the tag).
  if (!w.clarity) {
    const clarity = ((...args: unknown[]) => { (clarity.q = clarity.q || []).push(args); }) as NonNullable<AnalyticsWindow["clarity"]>;
    w.clarity = clarity;
  }
  injectScript(`https://www.clarity.ms/tag/${CLARITY_ID}?ref=bwt`);
}

/**
 * Loads Google Analytics and Microsoft Clarity once the page has settled: ~3.5 s after `load`,
 * in the next idle period. Measured on Home (phone profile, 4× CPU): loading them right after
 * `load` (the old `lazyOnload`) roughly doubled main-thread long-task time in the first seconds,
 * while hydration and the first taps were still running. Vercel Analytics (rendered separately)
 * still records every page view immediately. Production builds only, so local development
 * sessions never reach the analytics dashboards.
 */
export function DeferredThirdParty() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    const schedule = () => {
      timer = setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(loadAnalytics, { timeout: IDLE_TIMEOUT_MS });
        else loadAnalytics();
      }, AFTER_LOAD_MS);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (timer) clearTimeout(timer);
      if (idle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    };
  }, []);
  return null;
}
