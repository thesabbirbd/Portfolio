import React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-ink-3 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full surface-card px-4 py-2.5 text-base sm:text-sm rounded-xl outline-none text-ink placeholder:text-ink-3",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-[border-color,box-shadow]",
                        icon && "pl-10",
            className
          )}
          {...props}
        />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.1)] rounded-xl pointer-events-none" />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
