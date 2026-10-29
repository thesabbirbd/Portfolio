import React from "react";
import { AIYAAR } from "@/data/aiyaar";
import { cn } from "@/lib/utils";

/**
 * Every visible "Aiyaar" name is a link to the official site (owner request, v4.0.1).
 * Internal pages (/aiyaar) are reached through explicit CTAs such as "Explore Aiyaar features".
 * Never place this inside another link.
 */
export function AiyaarName({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <a
      href={AIYAAR.url}
      target="_blank"
      rel="noopener noreferrer"
      title="Visit aiyaar.ltd (opens in a new tab)"
      className={cn(
        "aiyaar-name font-semibold text-primary underline decoration-primary/30 decoration-1 underline-offset-4 hover:decoration-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm",
        className,
      )}
    >
      {children ?? AIYAAR.name}
    </a>
  );
}

/** Renders a plain string with each standalone "Aiyaar" turned into an <AiyaarName />. */
export function withAiyaarLinks(text: string, className?: string): React.ReactNode {
  const parts = text.split(/\b(Aiyaar)\b/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (p === "Aiyaar" ? <AiyaarName key={i} className={className} /> : <React.Fragment key={i}>{p}</React.Fragment>));
}
