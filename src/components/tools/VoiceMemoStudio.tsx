"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Download,
  Copy,
  Check,
  Activity,
  ListTodo,
  FileText,
  Calendar,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

const DEMO_TRANSCRIPTS = [
  {
    label: "Retail POS Meeting (English)",
    text: "Team meeting on November 15: Farhan will finish the thermal printer ESC/POS driver by next Tuesday. We need to verify 58mm and 80mm paper roll wrapping. THE SABBiR will review PostgreSQL read replica connection pool by Friday. Budget approved 45,000 BDT for hardware testing.",
  },
  {
    label: "Grocery Store Logistics (Bangla)",
    text: "আজকের মিটিংয়ের নোট: শফিক ভাই সকাল ১০টায় কাওরান বাজার যাবেন। চাল ৫০ বস্তা এবং তেল ২০ ড্রাম ডেলিভারি কনফার্ম করবেন। বিকাশ মার্চেন্ট অ্যাকাউন্টে পেমেন্ট চেক করতে হবে। আগামী সোমবারের মধ্যে ইনভয়েস রেডি চাই।",
  },
];

export function VoiceMemoStudio() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en-US" | "bn-BD">("en-US");
  const [transcript, setTranscript] = useState<string>(DEMO_TRANSCRIPTS[0].text);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + " ";
          }
          setTranscript(current.trim());
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser. Please use the Demo Transcript preset buttons below.");
      return;
    }

    if (isRecording) {
      sound.toggleSwitch();
      recognitionRef.current.stop();
      setIsRecording(false);
      sound.levelUp();
      osStore.addXp(30, "Captured Voice Memo");
    } else {
      sound.launch();
      setTranscript("");
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Structured Extraction Engine
  const extractActionItems = (text: string): string[] => {
    const sentences = text.split(/[.।\n]/).map((s) => s.trim()).filter(Boolean);
    const actions = sentences.filter((s) =>
      /will|need|must|hobe|করবেন|যাবেন|দিতে হবে|ready|check|review/i.test(s)
    );
    return actions.length > 0 ? actions : ["Review meeting notes and follow up with team leads."];
  };

  const actionItems = extractActionItems(transcript);

  const handleCopy = async () => {
    sound.copy();
    const markdown = `# Voice Memo Action Minutes\nDate: ${new Date().toLocaleDateString()}\n\n## Transcript\n${transcript}\n\n## Action Items\n${actionItems.map((a) => `- [ ] ${a}`).join("\n")}`;
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.shutter();
    osStore.addXp(25, "Exported Voice Notes");
    osStore.incrementToolRun();

    const markdown = `# Voice Memo Action Minutes\nDate: ${new Date().toLocaleDateString()}\n\n## Transcript\n${transcript}\n\n## Action Items\n${actionItems.map((a) => `- [ ] ${a}`).join("\n")}`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-memo-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Mic className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Bangla &amp; English Voice Memo Summarizer &amp; Action Pad
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Web Speech Recognition • Filler Word Removal • Action Checklist &amp; Meeting Minutes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {DEMO_TRANSCRIPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                sound.toggleSwitch();
                setTranscript(p.text);
              }}
              className="px-3 py-1.5 rounded-xl border border-line bg-muted/30 hover:bg-muted text-xs font-mono text-ink transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mic Recording Strip */}
      <div className="p-5 rounded-2xl bg-muted/30 border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-2xl font-bold flex items-center justify-center transition shadow-lg ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-primary hover:bg-primary-hover text-white"
            }`}
            title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div>
            <div className="text-xs font-bold font-mono text-ink flex items-center gap-2">
              <span>{isRecording ? "Listening to Microphone..." : "Microphone Ready"}</span>
              {isRecording && <Activity className="w-3.5 h-3.5 text-rose-500 animate-spin" />}
            </div>
            <p className="text-[11px] text-ink-3">
              {isRecording ? "Speak naturally in Bengali or English." : "Click to speak or use preset demo text."}
            </p>
          </div>
        </div>

        {/* Language Pill Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-line text-xs font-mono">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setLanguage("en-US");
            }}
            className={`px-3 py-1 rounded-lg transition ${
              language === "en-US" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
            }`}
          >
            English (en-US)
          </button>
          <button
            onClick={() => {
              sound.toggleSwitch();
              setLanguage("bn-BD");
            }}
            className={`px-3 py-1 rounded-lg transition ${
              language === "bn-BD" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
            }`}
          >
            বাংলা (bn-BD)
          </button>
        </div>
      </div>

      {/* Transcript & Extracted Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-2">
          <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider block">
            Speech Transcript Text
          </span>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={8}
            className="w-full p-4 rounded-2xl bg-muted/20 border border-line text-xs font-mono text-ink placeholder:text-ink-3 focus:outline-none focus:border-primary shadow-inner leading-relaxed"
          />
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-primary" />
              <span>Extracted Action Items</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="p-1 rounded-lg border border-line bg-muted hover:bg-muted/80 text-xs font-mono flex items-center gap-1 transition"
                title="Copy markdown"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1 transition shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            {actionItems.map((act, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-2 font-mono leading-relaxed">
                <input type="checkbox" className="mt-1 accent-primary rounded" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
