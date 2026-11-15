"use client";

import React, { useState } from "react";
import { GitCommit, CheckCircle2, ChevronRight, Layers, ShieldCheck, Zap, Server } from "lucide-react";
import { sound } from "@/lib/sound";

interface DecisionItem {
  id: string;
  tag: string;
  title: string;
  context: string;
  decision: string;
  tradeOff: string;
  outcome: string;
  icon: typeof Layers;
}

const DECISIONS: DecisionItem[] = [
  {
    id: "fefo-expiry",
    tag: "Pharmacy & Retail",
    title: "Enforcing Automated FEFO (First-Expiry-First-Out) over FIFO/LIFO",
    context: "Bangladesh pharmacies face heavy financial losses and regulatory penalties if medicine boxes nearing expiration remain buried behind new stock on shelves.",
    decision: "Engineered batch-level inventory tracking in PostgreSQL where the POS barcode scanner automatically prioritizes and deducts the batch with the nearest expiration date (FEFO), regardless of arrival order.",
    tradeOff: "Added complexity to sales returns and stock transfers since each line item must preserve its exact batch number and manufacturer lot ID.",
    outcome: "Eliminated shelf expiry losses for participating pharmacies, with automated amber alerts at 60 and 30 days before expiry.",
    icon: Layers,
  },
  {
    id: "offline-sync",
    tag: "DevOps & Edge Architecture",
    title: "Offline-Tolerant SQLite Event Queue vs Pure Cloud REST API",
    context: "Frequent power cuts and fiber breaks in non-metro upazilas meant cloud-only POS systems froze during checkout rushes, frustrating merchants and customers.",
    decision: "Built a local embedded SQLite transaction queue in the counter client with an idempotent background sync daemon. Sales complete in < 15ms locally, receipts print offline, and transactions sync to central PostgreSQL upon reconnection.",
    tradeOff: "Requires strict conflict resolution logic (last-write-wins with server timestamp authority) to handle multi-counter concurrent sales of low-stock items.",
    outcome: "100% counter uptime across intermittent broadband outages; zero transaction drops during power transitions.",
    icon: Zap,
  },
  {
    id: "thermal-print",
    tag: "Hardware Integration",
    title: "Direct ESC/POS Raw Byte Protocol vs Native Browser window.print()",
    context: "The standard browser print dialog took 3–5 seconds to render HTML, often misaligned 58mm paper margins, and could not send electrical pulse signals to kick open the 12V cash drawer.",
    decision: "Engineered a low-level ESC/POS byte-stream generator communicating via WebUSB, Bluetooth SPP, and raw network sockets (port 9100) directly to thermal receipt printers.",
    tradeOff: "Receipt styling is limited to monospace character grids and ESC/POS raster bit-images rather than arbitrary CSS flex layouts.",
    outcome: "Sub-second (300ms) instant thermal receipt printing and automated cash drawer triggers upon payment confirmation.",
    icon: Server,
  },
  {
    id: "khata-ledger",
    tag: "Financial Data Model",
    title: "Strict Double-Entry Digital Khata vs Single-Entry Cash Record",
    context: "Small retailers struggle to reconcile split payments (e.g. 50% cash + 50% bKash) and partial customer credit (baki) with supplier inventory debts.",
    decision: "Architected a dual-entry ledger schema in PostgreSQL with database-level CHECK constraints ensuring every transaction balances debits and credits across cash, bank, mobile wallets, and baki ledgers.",
    tradeOff: "Requires slightly more database write overhead per sale compared to a flat denormalized orders table.",
    outcome: "Flawless end-of-day register closing reports with zero arithmetic discrepancies between the physical cash register and digital reports.",
    icon: ShieldCheck,
  },
];

export function AiyaarDecisionLog() {
  const [activeId, setActiveId] = useState(DECISIONS[0].id);

  const activeDecision = DECISIONS.find((d) => d.id === activeId) ?? DECISIONS[0];

  return (
    <div className="rounded-2xl surface-card border border-line p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-2 font-mono text-xs text-primary font-semibold uppercase tracking-wider">
        <GitCommit className="w-4 h-4" />
        <span>Chief Product Manager (CPM) · Architectural Log</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">
        Core Product Architecture &amp; Engineering Decisions
      </h3>
      <p className="text-sm text-ink-2 mb-6 max-w-2xl">
        How we prioritized database design, hardware integration, and offline resilience for 22 business types in Bangladesh.
      </p>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        {DECISIONS.map((d) => {
          const isSelected = d.id === activeId;
          return (
            <button
              key={d.id}
              onClick={() => {
                sound.click();
                setActiveId(d.id);
              }}
              className={`text-left p-3 rounded-xl border text-xs font-mono transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "surface-card text-ink-2 border-line hover:border-primary/40"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected ? "text-primary-foreground/80" : "text-primary font-semibold"}`}>
                {d.tag}
              </span>
              <span className="font-semibold line-clamp-2">{d.title.split(":")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Decision Breakdown */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface border border-line space-y-4 animate-in fade-in">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <h4 className="font-bold text-ink text-base sm:text-lg">{activeDecision.title}</h4>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            {activeDecision.tag}
          </span>
        </div>

        <div className="space-y-3 text-sm text-ink-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-rose-500 font-bold block mb-1">
              The Real-World Problem:
            </span>
            <p className="leading-relaxed">{activeDecision.context}</p>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-500 font-bold block mb-1">
              Architectural Choice:
            </span>
            <p className="leading-relaxed">{activeDecision.decision}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/60 border border-line">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-500 font-bold block mb-0.5">
                Engineering Trade-Off:
              </span>
              <p className="text-xs text-ink-2 leading-relaxed">{activeDecision.tradeOff}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                Measurable Impact:
              </span>
              <p className="text-xs text-ink-2 leading-relaxed">{activeDecision.outcome}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
