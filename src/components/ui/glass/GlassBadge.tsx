import React from "react";
import { cn } from "@/lib/utils";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent";
}

export function GlassBadge({ children, className, variant = "primary", ...props }: GlassBadgeProps) {
  const variants = {
    primary: "bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400",
    secondary: "bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300",
    accent: "bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide backdrop-blur-md border",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-full pointer-events-none" />
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </div>
  );
}
