import React from "react";
import { cn } from "@/lib/utils";

/**
 * The one section-heading pattern for the site (eyebrow → title → lede).
 * `expression` picks the visual family without changing structure:
 *  - editorial: orange eyebrow with a short Bauhaus bar (Hero/identity/journey sections)
 *  - glass:     quiet eyebrow chip on a glass surface (projects, contact)
 *  - signal:    mono bracketed eyebrow in signal cyan (Lab, terminals, AI)
 */
export type Expression = "editorial" | "glass" | "signal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  index?: string;
  expression?: Expression;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  index,
  expression = "editorial",
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <header className={cn("reveal flex flex-col gap-3 sm:gap-4", centered ? "items-center text-center" : "items-start text-left", className)}>
      <Eyebrow index={index} expression={expression}>{eyebrow}</Eyebrow>
      <Heading id={id} className="text-h2 font-extrabold text-ink text-balance">
        {title}
      </Heading>
      {lede && <p className={cn("text-lede text-ink-2 max-w-2xl text-pretty", centered && "mx-auto")}>{lede}</p>}
    </header>
  );
}

export function Eyebrow({
  children,
  index,
  expression = "editorial",
  className,
}: {
  children: React.ReactNode;
  index?: string;
  expression?: Expression;
  className?: string;
}) {
  if (expression === "signal") {
    return (
      <span className={cn("inline-flex items-center gap-2 font-mono text-eyebrow uppercase text-signal", className)}>
        <span aria-hidden="true">[</span>
        {index && <span className="eyebrow-index">{index}</span>}
        <span>{children}</span>
        <span aria-hidden="true">]</span>
      </span>
    );
  }
  if (expression === "glass") {
    return (
      <span className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full surface-card font-mono text-eyebrow uppercase text-ink-2", className)}>
        {index && <span className="eyebrow-index">{index}</span>}
        <span>{children}</span>
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-mono text-eyebrow uppercase text-primary", className)}>
      <span aria-hidden="true" className="eyebrow-bar reveal-bar h-0.5 w-6 rounded-full bg-brand" />
      {index && <span className="eyebrow-index">{index} /</span>}
      <span>{children}</span>
    </span>
  );
}

/** Emphasis inside a heading: brand display gradient (editorial/glass) or signal colour (Lab). */
export function Accent({ children, tone = "brand" }: { children: React.ReactNode; tone?: "brand" | "signal" }) {
  return <span className={tone === "signal" ? "text-signal" : "text-display-gradient"}>{children}</span>;
}
