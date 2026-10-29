import { cn } from "@/lib/utils";

/** Marks placeholder entries in the new Discover sections, so demo content is never mistaken for real work. */
export function DemoBadge({ className, label = "Demo" }: { className?: string; label?: string }) {
  return (
    <span
      title="Sample entry — real content coming soon"
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-dashed border-gold/60 text-gold font-mono text-[11px] font-semibold uppercase tracking-wider", className)}
    >
      {label}
    </span>
  );
}
