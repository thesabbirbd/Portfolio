"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Sliders,
  Sparkles,
  Download,
  Filter,
  Layers,
  PhoneCall,
  Search,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  QUICK_REPLY_MACROS,
  QuickReplyMacro,
  MacroVariables,
  DEFAULT_MACRO_VARIABLES,
  interpolateMacro,
} from "@/lib/crm/quick-reply-engine";

export function QuickReplyHubStudio() {
  const [vars, setVars] = useState<MacroVariables>(DEFAULT_MACRO_VARIABLES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "quick-reply-hub",
    toolName: "WhatsApp Quick Reply Hub",
  });

  const filteredMacros = useMemo(() => {
    return QUICK_REPLY_MACROS.filter((m) => {
      const matchCat = selectedCategory === "all" || m.category === selectedCategory;
      const matchLang = selectedLanguage === "all" || m.language === selectedLanguage;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.template.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchLang && matchSearch;
    });
  }, [selectedCategory, selectedLanguage, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sound.confirm();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (text: string) => {
    sound.click();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleExportJson = () => {
    triggerGatedExport(() => {
      const exportData = {
        exportedAt: new Date().toISOString(),
        variables: vars,
        macros: QUICK_REPLY_MACROS.map((m) => ({
          ...m,
          interpolated: interpolateMacro(m.template, vars),
        })),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quick-reply-macros-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="quick-reply-hub"
        toolName="WhatsApp & F-Commerce Quick Reply Hub"
        category="Business & POS"
        onExportClick={handleExportJson}
      />

      {/* Top Variables Bar (Fill once, auto-populates all 36 macros) */}
      <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Dynamic Customer &amp; Order Variables
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.confirm();
                setVars({
                  customer_name: "Tanvir Ahmed",
                  product: "Ultra-Light Mechanical Keyboard (Red Switch)",
                  price: "৩,৪৫০",
                  delivery_fee: "৬০",
                  bkash_no: "01812345678",
                  invoice_id: "INV-AYR-902",
                  tracking_code: "STEADFAST-99120",
                  company_name: "THE SABBiR Tech Lab",
                });
              }}
              className="text-[11px] text-amber-400 font-mono hover:underline flex items-center gap-1"
            >
              <span>⚡ Load Sample / Demo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setVars(DEFAULT_MACRO_VARIABLES);
              }}
              className="text-[11px] text-neutral-400 font-mono hover:text-neutral-200"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
              {`{customer_name}`}
            </label>
            <input
              type="text"
              value={vars.customer_name}
              onChange={(e) => setVars({ ...vars, customer_name: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">{`{product}`}</label>
            <input
              type="text"
              value={vars.product}
              onChange={(e) => setVars({ ...vars, product: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">{`{price}`}</label>
            <input
              type="text"
              value={vars.price}
              onChange={(e) => setVars({ ...vars, price: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
              {`{delivery_fee}`}
            </label>
            <input
              type="text"
              value={vars.delivery_fee}
              onChange={(e) => setVars({ ...vars, delivery_fee: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">{`{bkash_no}`}</label>
            <input
              type="text"
              value={vars.bkash_no}
              onChange={(e) => setVars({ ...vars, bkash_no: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
              {`{tracking_code}`}
            </label>
            <input
              type="text"
              value={vars.tracking_code}
              onChange={(e) => setVars({ ...vars, tracking_code: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-amber-400 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", name: "All Categories" },
            { id: "order", name: "Orders & Stock" },
            { id: "delivery", name: "Shipping & Tracking" },
            { id: "payment", name: "bKash & COD" },
            { id: "support", name: "Returns & Warranty" },
            { id: "freelance", name: "Freelance" },
            { id: "it_noc", name: "IT / NOC" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sound.click();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-sm"
                  : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-1 shrink-0 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          {["all", "বাংলা", "English", "Banglish"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                sound.click();
                setSelectedLanguage(lang);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedLanguage === lang
                  ? "bg-neutral-800 text-amber-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {lang === "all" ? "All Langs" : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMacros.map((macro) => {
          const processedText = interpolateMacro(macro.template, vars);
          const isCopied = copiedId === macro.id;

          return (
            <div
              key={macro.id}
              className="p-5 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    {macro.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 shrink-0">
                    {macro.language}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/70 p-3 rounded-2xl border border-neutral-800/80 mb-4 whitespace-pre-wrap">
                  {processedText}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/60">
                <button
                  type="button"
                  onClick={() => handleCopy(macro.id, processedText)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isCopied
                      ? "bg-emerald-500 text-neutral-950 font-bold"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(processedText)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Send via WhatsApp Web"
                >
                  <Send className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
