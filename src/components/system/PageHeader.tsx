import React from "react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

/**
 * Standard top of an inner route: breadcrumb + one h1 header with a short lede.
 * Keeps every page's opening the same compact height on phones (no stacked intro paragraphs).
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lede,
  expression,
  className,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  expression?: "editorial" | "glass" | "signal";
  className?: string;
  children?: React.ReactNode;
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return (
    <div className={cn("relative max-w-5xl mx-auto w-full px-4 sm:px-6 mb-8 md:mb-12", className)}>
      {expression === "signal" && (
        <div aria-hidden="true" className="absolute inset-x-0 -top-10 h-[360px] -z-10 signal-grid pointer-events-none" />
      )}
      <nav className="mb-5 md:mb-6 text-sm text-ink-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <React.Fragment key={c.label}>
                {i > 0 && <li aria-hidden="true">/</li>}
                <li className={last ? "text-ink" : undefined} aria-current={last ? "page" : undefined}>
                  {c.href && !last ? <Link href={c.href} className="hover:text-primary transition-colors">{c.label}</Link> : c.label}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
      <SectionHeader as="h1" eyebrow={eyebrow} title={title} lede={lede} expression={expression} />
      {children}
    </div>
  );
}
