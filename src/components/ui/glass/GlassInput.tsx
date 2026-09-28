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
          <div className="absolute left-3 text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full spatial-glass px-4 py-2.5 text-sm rounded-xl outline-none placeholder:text-slate-700 dark:text-slate-300 dark:placeholder:text-slate-700 dark:text-slate-300",
            "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all",
            "text-gray-900 dark:text-gray-100",
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
