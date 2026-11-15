"use client";

import React, { forwardRef } from "react";
import { AlertCircle, HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";

export interface ProInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  unitSuffix?: string;
  containerClassName?: string;
}

export const ProInput = forwardRef<HTMLInputElement, ProInputProps>(
  ({ label, helperText, error, unitSuffix, containerClassName = "", className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="pro-label flex items-center justify-between">
            <span>{label}</span>
            {props.required && <span className="text-amber-500 font-bold ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            className={`pro-input w-full ${unitSuffix ? "pr-14" : ""} ${
              error ? "border-rose-500/80 focus:border-rose-500" : ""
            } ${className}`}
            {...props}
          />
          {unitSuffix && (
            <span className="absolute right-3 text-xs font-mono font-bold text-ink-3 pointer-events-none select-none">
              {unitSuffix}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-3 leading-relaxed mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
ProInput.displayName = "ProInput";

export interface ProSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string | number; label: string; subtext?: string }[];
  containerClassName?: string;
}

export const ProSelect = forwardRef<HTMLSelectElement, ProSelectProps>(
  ({ label, helperText, error, options, containerClassName = "", className = "", id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="pro-label flex items-center justify-between">
            <span>{label}</span>
            {props.required && <span className="text-amber-500 font-bold ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`pro-select w-full appearance-none pr-10 cursor-pointer ${
              error ? "border-rose-500/80 focus:border-rose-500" : ""
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} {opt.subtext ? `(${opt.subtext})` : ""}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-ink-3 pointer-events-none select-none" />
        </div>
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-3 leading-relaxed mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
ProSelect.displayName = "ProSelect";

export interface ProTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const ProTextarea = forwardRef<HTMLTextAreaElement, ProTextareaProps>(
  ({ label, helperText, error, containerClassName = "", className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={textareaId} className="pro-label flex items-center justify-between">
            <span>{label}</span>
            {props.required && <span className="text-amber-500 font-bold ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`pro-textarea w-full leading-relaxed ${
            error ? "border-rose-500/80 focus:border-rose-500" : ""
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-3 leading-relaxed mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
ProTextarea.displayName = "ProTextarea";

export interface ProNumberStepperProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unitSuffix?: string;
  helperText?: string;
}

export function ProNumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unitSuffix,
  helperText,
}: ProNumberStepperProps) {
  const handleDecrement = () => {
    if (value - step >= min) onChange(Number((value - step).toFixed(2)));
  };

  const handleIncrement = () => {
    if (value + step <= max) onChange(Number((value + step).toFixed(2)));
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="pro-label">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          aria-label="Decrease"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 relative flex items-center">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className={`pro-input w-full text-center font-mono font-bold text-sm ${unitSuffix ? "pr-12" : ""}`}
          />
          {unitSuffix && (
            <span className="absolute right-3 text-xs font-mono font-semibold text-ink-3 pointer-events-none select-none">
              {unitSuffix}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          aria-label="Increase"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {helperText && <p className="text-xs text-ink-3 leading-relaxed mt-1">{helperText}</p>}
    </div>
  );
}

export interface ProStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  trend?: "up" | "down" | "neutral";
  accent?: "brand" | "ok" | "signal" | "warn";
  className?: string;
}

export function ProStatCard({
  label,
  value,
  subtext,
  badge,
  trend,
  accent = "brand",
  className = "",
}: ProStatCardProps) {
  const accentClasses = {
    brand: "text-primary",
    ok: "text-emerald-500",
    signal: "text-cyan-500",
    warn: "text-amber-500",
  };

  return (
    <div className={`p-4 rounded-2xl border border-line bg-surface shadow-xs space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-ink-3 font-medium">
        <span>{label}</span>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {badge}
          </span>
        )}
      </div>
      <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${accentClasses[accent]}`}>
        {value}
      </div>
      {subtext && <div className="text-xs text-ink-3 font-normal">{subtext}</div>}
    </div>
  );
}

export interface ProEmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function ProEmptyState({ title, description, actionText, onAction, icon }: ProEmptyStateProps) {
  return (
    <div className="p-8 text-center rounded-3xl border border-dashed border-line bg-surface/50 space-y-3">
      {icon && <div className="mx-auto w-10 h-10 flex items-center justify-center text-ink-3">{icon}</div>}
      <h4 className="text-sm font-bold text-ink">{title}</h4>
      <p className="text-xs text-ink-3 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
