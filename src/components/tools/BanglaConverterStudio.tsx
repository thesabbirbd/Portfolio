"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Share2,
  BookOpen,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  convertBijoyToUnicode,
  convertUnicodeToBijoy,
  BANGLA_OFFICIAL_TEMPLATES,
  BanglaTemplate,
} from "@/lib/bangla/bijoy-unicode-engine";
import { sound } from "@/lib/sound";

export function BanglaConverterStudio() {
  const [unicodeText, setUnicodeText] = useState(
    "গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সকল প্রশাসনিক কাজ ও দাপ্তরিক নথিতে ইউনিকোড ও বিজয় কিবোর্ড বহুলভাবে ব্যবহৃত হয়।"
  );
  const [bijoyText, setBijoyText] = useState(() => convertUnicodeToBijoy(
    "গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সকল প্রশাসনিক কাজ ও দাপ্তরিক নথিতে ইউনিকোড ও বিজয় কিবোর্ড বহুলভাবে ব্যবহৃত হয়।"
  ));
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [copiedUnicode, setCopiedUnicode] = useState(false);
  const [copiedBijoy, setCopiedBijoy] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "bangla-converter",
    toolName: "Bijoy ↔ Unicode Bangla Studio",
  });

  const handleUnicodeChange = (val: string) => {
    setUnicodeText(val);
    const converted = convertUnicodeToBijoy(val);
    setBijoyText(converted);
    setActiveStep(2);
  };

  const handleBijoyChange = (val: string) => {
    setBijoyText(val);
    const converted = convertBijoyToUnicode(val);
    setUnicodeText(converted);
    setActiveStep(2);
  };

  const handleSwap = () => {
    sound.toggleSwitch();
    // Swap contents and recalculate
    const oldUni = unicodeText;
    const oldBij = bijoyText;
    setUnicodeText(oldBij);
    setBijoyText(convertUnicodeToBijoy(oldBij));
  };

  const handleClear = () => {
    sound.click();
    setUnicodeText("");
    setBijoyText("");
    setSelectedTemplateId("");
    setActiveStep(1);
  };

  const handleLoadTemplate = (tpl: BanglaTemplate) => {
    sound.click();
    setSelectedTemplateId(tpl.id);
    setUnicodeText(tpl.unicodeContent);
    setBijoyText(convertUnicodeToBijoy(tpl.unicodeContent));
    setActiveStep(2);
  };

  const copyUnicode = async () => {
    sound.copy();
    await navigator.clipboard.writeText(unicodeText);
    setCopiedUnicode(true);
    setTimeout(() => setCopiedUnicode(false), 2000);
  };

  const copyBijoy = async () => {
    sound.copy();
    await navigator.clipboard.writeText(bijoyText);
    setCopiedBijoy(true);
    setTimeout(() => setCopiedBijoy(false), 2000);
  };

  const downloadTextFile = (format: "txt" | "doc") => {
    triggerExport(() => {
      setActiveStep(3);
      const mime = format === "doc" ? "application/msword;charset=utf-8" : "text/plain;charset=utf-8";
      const blob = new Blob([unicodeText], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `the-sabbir-bangla-document.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const stats = useMemo(() => {
    const chars = unicodeText.length;
    const words = unicodeText.trim() ? unicodeText.trim().split(/\s+/).length : 0;
    const lines = unicodeText ? unicodeText.split("\n").length : 0;
    return { chars, words, lines };
  }, [unicodeText]);

  return (
    <StudioWorkspaceShell
      slug="bangla-converter"
      title="Bijoy ↔ Unicode Bangla & Official Application Studio"
      category="Bangla Desktop & Administration"
      popularityScore={98}
      lede="Bijoy SutonnyMJ ও Unicode UTF-8 উভমুখী রূপান্তর, যুক্তবর্ণ ও স্বরচিহ্ন নির্ভুল প্রসেসিং এবং ১২টি রেডিমেড প্রশাসনিক বাংলা দরখাস্ত।"
      activeStep={activeStep}
      getSharePayload={() => ({
        unicodeText,
        bijoyText,
        templateId: selectedTemplateId,
      })}
      sampleLoaderSlot={
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              const tpl = BANGLA_OFFICIAL_TEMPLATES.find((t) => t.id === e.target.value);
              if (tpl) handleLoadTemplate(tpl);
            }}
            className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs text-ink focus:border-amber-500 focus:outline-none"
          >
            <option value="">⚡ রেডি বাংলা দরখাস্ত নির্বাচন করুন (১২টি)</option>
            {BANGLA_OFFICIAL_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.titleBn}
              </option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="rounded-xl border border-line bg-muted/40 px-3 py-1.5 text-xs font-semibold text-ink-3 hover:text-ink hover:bg-muted transition-colors"
          >
            Clear
          </button>
        </div>
      }
      exportSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadTextFile("txt")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>.TXT</span>
          </button>
          <button
            onClick={() => downloadTextFile("doc")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Word .DOC</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Dual Side-by-Side Editors */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Unicode Editor */}
          <div className="flex flex-col rounded-2xl border border-line bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
                <h3 className="text-sm font-bold text-ink drop-shadow-xs">ইউনিকোড টেক্সট (Unicode UTF-8 / অব্র)</h3>
              </div>
              <button
                onClick={copyUnicode}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-muted/40 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-muted transition-colors shadow-xs"
              >
                {copiedUnicode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{copiedUnicode ? "কপি হয়েছে!" : "Copy Unicode"}</span>
              </button>
            </div>

            <textarea
              value={unicodeText}
              onChange={(e) => handleUnicodeChange(e.target.value)}
              placeholder="এখানে ইউনিকোড বা অব্র বাংলা টাইপ অথবা পেস্ট করুন..."
              rows={14}
              className="w-full resize-none rounded-xl border border-line bg-muted/20 p-4 font-sans text-sm text-ink leading-relaxed focus:border-amber-500 focus:outline-none"
            />

            <div className="flex items-center justify-between text-xs text-ink-3 font-mono pt-1">
              <span className="drop-shadow-xs">{stats.words} শব্দ · {stats.chars} বর্ণ · {stats.lines} লাইন</span>
              <span className="text-emerald-500 font-semibold drop-shadow-xs">Web & Mobile Friendly</span>
            </div>
          </div>

          {/* Right: Bijoy SutonnyMJ Editor */}
          <div className="flex flex-col rounded-2xl border border-line bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" />
                <h3 className="text-sm font-bold text-ink drop-shadow-xs">বিজয় ক্লাসিক (Bijoy SutonnyMJ ANSI)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSwap}
                  title="উভয় বক্সের টেক্সট অদল-বদল করুন"
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-muted/40 p-1 text-xs text-ink hover:bg-muted shadow-xs"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-amber-500" />
                </button>
                <button
                  onClick={copyBijoy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-muted/40 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-muted transition-colors shadow-xs"
                >
                  {copiedBijoy ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
                  <span>{copiedBijoy ? "কপি হয়েছে!" : "Copy Bijoy"}</span>
                </button>
              </div>
            </div>

            <textarea
              value={bijoyText}
              onChange={(e) => handleBijoyChange(e.target.value)}
              placeholder="Bijoy SutonnyMJ ANSI text will appear here..."
              rows={14}
              className="w-full resize-none rounded-xl border border-line bg-muted/20 p-4 font-mono text-sm text-ink leading-relaxed focus:border-amber-500 focus:outline-none"
            />

            <div className="flex items-center justify-between text-xs text-ink-3 font-mono pt-1">
              <span className="drop-shadow-xs">SutonnyMJ Font Compatible</span>
              <span className="text-amber-500 font-semibold drop-shadow-xs">MS Word & Govt Press Ready</span>
            </div>
          </div>
        </div>

        {/* 12 Official Templates Quick Chips */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              জনপ্রিয় প্রশাসনিক বাংলা দরখাস্ত ও ফরম (১-ক্লিকে লোড করুন)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {BANGLA_OFFICIAL_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleLoadTemplate(tpl)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedTemplateId === tpl.id
                    ? "border-amber-500 bg-amber-500/10 text-amber-400 font-bold"
                    : "border-line bg-muted/30 text-ink-2 hover:bg-muted hover:text-ink"
                }`}
              >
                {tpl.titleBn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
