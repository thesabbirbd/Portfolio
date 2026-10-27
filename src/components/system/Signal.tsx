import React from "react";
import { cn } from "@/lib/utils";

/**
 * Cyber AI expression primitives — used only on technical surfaces (Lab, terminals, case-study
 * architecture). Dark "terminal" panels in both themes, signal-cyan accents, mono labels.
 */

/** Quiet mono divider: `── // label ──────`. Decorative; the label is real text. */
export function AsciiRule({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3", className)}>
      <span aria-hidden="true" className="text-signal">──</span>
      <span><span aria-hidden="true" className="text-signal">{"// "}</span>{label}</span>
      <span aria-hidden="true" className="flex-1 border-t border-dashed border-signal/30" />
    </div>
  );
}

/**
 * Architecture as a readable figure: numbered component nodes and source → target flows.
 * Lightweight CSS (no graph library); always a dark panel so it reads as an engineering artefact.
 */
export function SignalDiagram({ title = "System Architecture", nodes, edges }: { title?: string; nodes: string[]; edges: string[] }) {
  const index = new Map(nodes.map((n, i) => [n, i + 1]));
  return (
    <figure className="reveal relative my-10 overflow-hidden rounded-card border border-white/10 bg-[#0b0d12] text-slate-200 shadow-e2 signal-edge">
      <div aria-hidden="true" className="absolute inset-0 signal-grid opacity-60 pointer-events-none" />
      <div className="relative p-5 sm:p-6">
        <figcaption className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(34_211_238)]">
          <span aria-hidden="true">[</span>{title}<span aria-hidden="true">]</span>
        </figcaption>

        <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" aria-label="Components">
          {nodes.map((node, i) => (
            <li key={node} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[rgb(34_211_238)]/40 text-[11px] text-[rgb(34_211_238)]">{i + 1}</span>
              <span className="truncate">{node}</span>
            </li>
          ))}
        </ol>

        {edges.length > 0 && (
          <ul className="mt-5 space-y-1.5 border-t border-white/10 pt-4 font-mono text-xs sm:text-sm" aria-label="Data flow">
            {edges.map((edge) => {
              const [source, target] = edge.split("->").map((s) => s.trim());
              return (
                <li key={edge} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-300">
                  <span className="text-slate-500">{index.get(source) ?? "·"}</span>
                  <span>{source}</span>
                  <span aria-label="sends to" className="text-[rgb(34_211_238)]">──▶</span>
                  <span className="text-slate-500">{index.get(target) ?? "·"}</span>
                  <span>{target}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </figure>
  );
}
