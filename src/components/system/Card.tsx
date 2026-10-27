import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card surfaces mapped to the elevation system in globals.css.
 *  - paper:    level-1 in-flow content (no backdrop-filter)
 *  - elevated: level-1 with stronger surface + shadow (featured content)
 *  - glass:    level-2 backdrop glass — only for floating/fixed UI
 *  - signal:   level-1 with a signal-cyan top hairline (Lab / technical content)
 * `deco` adds Art-Deco corner marks; `interactive` adds paint-only hover states.
 */
type Variant = "paper" | "elevated" | "glass" | "signal";

const VARIANT_CLASS: Record<Variant, string> = {
  paper: "surface-card",
  elevated: "surface-elevated",
  glass: "surface-glass",
  signal: "surface-card signal-edge",
};

type CardProps = {
  as?: "div" | "article" | "li" | "section";
  /** Join the CSS scroll grammar (rise + fade on entry). Default true. */
  reveal?: boolean;
  variant?: Variant;
  deco?: boolean;
  interactive?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export function Card({
  as: Tag = "div",
  variant = "paper",
  deco = false,
  interactive = false,
  reveal = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-card",
        reveal && "reveal",
        VARIANT_CLASS[variant],
        interactive && "surface-interactive",
        deco && "deco-corners",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Small icon tile whose colour encodes a semantic role, not decoration. */
export function RoleIcon({
  role,
  children,
  className,
}: {
  role: "brand" | "accent" | "signal" | "ok";
  children: React.ReactNode;
  className?: string;
}) {
  const tone = {
    brand: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    signal: "bg-signal/10 text-signal",
    ok: "bg-ok/10 text-ok",
  }[role];
  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center rounded-lg", tone, className)}>
      {children}
    </span>
  );
}
