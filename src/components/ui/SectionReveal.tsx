import React from "react";

/**
 * Section wrapper kept for API compatibility. It used to fade whole sections in with Framer
 * `whileInView`, which shipped them at opacity 0 in the server HTML (invisible until hydration
 * and scroll). Reveals now come from the CSS scroll grammar (`.reveal` on headers, cards and
 * links — see globals.css), which needs no JavaScript and never hides content when JS fails.
 */
export function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
}
