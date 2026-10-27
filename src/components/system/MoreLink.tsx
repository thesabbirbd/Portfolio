import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The single "continue to the full story" link used at the end of every Home chapter.
 * Home is an overview; each chapter hands off to the route that holds the complete content.
 */
export function MoreLink({
  href,
  children,
  tone = "brand",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "brand" | "signal";
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold surface-card transition-colors duration-200 hover:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    tone === "signal" ? "text-signal" : "text-primary",
    className
  );
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );
  // Files (e.g. the CV PDF) are plain downloads, not client-side routes.
  if (/\.[a-z0-9]+$/i.test(href)) return <a href={href} download className={classes}>{content}</a>;
  return <Link href={href} className={classes}>{content}</Link>;
}

/** Row wrapper that aligns one or more MoreLinks under a chapter. */
export function MoreLinks({ children, align = "left", className }: { children: React.ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("reveal mt-6 sm:mt-10 flex flex-wrap gap-2.5", align === "center" ? "justify-center" : "justify-start", className)}>
      {children}
    </div>
  );
}
