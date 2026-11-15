"use client";

import React, { useState } from "react";
import {
  Video,
  Sparkles,
  Copy,
  Check,
  Download,
  Flame,
  FileText,
  Clock,
  Layers,
  Wand2,
  Bot,
  Play,
  Pause,
  Eye,
  X,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface ScriptScene {
  timestamp: string;
  secondsRange: string;
  voiceover: string;
  visual: string;
  sfx: string;
}

export function ReelScriptStudio() {
  const [topic, setTopic] = useState("AI দিয়ে কীভাবে প্রতিদিন ৩ ঘণ্টা সময় বাঁচাবেন (How to save 3 hours daily with AI)");
  const [hookStyle, setHookStyle] = useState<"contrarian" | "curiosity" | "pain" | "story">("contrarian");
  const [duration, setDuration] = useState<30 | 45 | 60>(60);
  const [language, setLanguage] = useState<"bangla" | "english" | "banglish">("bangla");
  const [copied, setCopied] = useState(false);
  const [srtCopied, setSrtCopied] = useState(false);
  const [hookScore, setHookScore] = useState(94);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [isPrompterScrolling, setIsPrompterScrolling] = useState(false);
  const [prompterSpeed, setPrompterSpeed] = useState(1);
  const [prompterFontSize, setPrompterFontSize] = useState(32);
  const prompterRef = React.useRef<HTMLDivElement | null>(null);

  // Teleprompter Auto-Scroll Effect
  React.useEffect(() => {
    let animId: number;
    if (showTeleprompter && isPrompterScrolling) {
      const step = () => {
        if (prompterRef.current) {
          prompterRef.current.scrollTop += prompterSpeed * 0.8;
        }
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [showTeleprompter, isPrompterScrolling, prompterSpeed]);

  const [scenes, setScenes] = useState<ScriptScene[]>([
    {
      timestamp: "00:00 - 00:03",
      secondsRange: "0s - 3s",
      voiceover: "ChatGPT দিয়ে আপনার কোনো লাভ হচ্ছে না—যদি এই ৩টি ভুল আপনি এখনো করেন!",
      visual: "Fast zoom into a frustrated face looking at laptop, screen red glitch flash",
      sfx: "Record scratch + digital glitch woosh",
    },
    {
      timestamp: "00:03 - 00:08",
      secondsRange: "3s - 8s",
      voiceover: "প্রথম ভুল: আপনি জেনেরিক প্রম্পট দেন। যেমন 'Write a cold email'। এআই আপনাকে দিবে ১০ বছর আগের বোরিং টেমপ্লেট।",
      visual: "Side-by-side bad output marked with red cross, kinetic text pop-in 'GENERIC PROMPT'",
      sfx: "Negative buzzer + fast typewriter clack",
    },
    {
      timestamp: "00:08 - 00:18",
      secondsRange: "8s - 18s",
      voiceover: "সমাধান হলো 'Role + Objective + Constraint' ফ্রেমওয়ার্ক। এআই-কে আগে ক্লিয়ার কনটেক্সট দিন।",
      visual: "Crisp blue UI glass card reveals 3 bullet points with checkmarks floating in 3D",
      sfx: "Smooth bubble pop + UI chime",
    },
    {
      timestamp: "00:18 - 00:32",
      secondsRange: "18s - 32s",
      voiceover: "দ্বিতীয় ভুল: আপনি ফ্রি মডেল দিয়ে কমপ্লেক্স ডেটা অ্যানালিসিস করান। লোকাল মডেল যেমন Qwen 2.5 দিয়ে নিজেই প্রাইভেট পাইপলাইন বানান।",
      visual: "Split screen: Free bot spinning vs Fast terminal bash pipeline churning data in green",
      sfx: "Sub-bass riser + rapid terminal key clicks",
    },
    {
      timestamp: "00:32 - 00:48",
      secondsRange: "32s - 48s",
      voiceover: "এবং তৃতীয় ভুল: ডেইলি রুটিন অটোমেট না করা। sabbir.nav.bd-এর ফ্রি খাতা স্ক্যানার আর রিডাক্টর দিয়ে ম্যানুয়াল এন্ট্রি এক সেকেন্ডে শেষ করুন।",
      visual: "Screen recording of sabbir.nav.bd tool scanning receipt and dropping neat Excel rows",
      sfx: "Crisp cash register ding + modern whoosh",
    },
    {
      timestamp: "00:48 - 00:60",
      secondsRange: "48s - 60s",
      voiceover: "ফুল প্রম্পট শিট এবং সোর্স কোড কমেন্টে পিন করা আছে। সেভ করে রাখুন আর ফলো দিয়ে কানেক্টেড থাকুন!",
      visual: "Founder point-down gesture to caption area, clean follow banner animation with bell icon",
      sfx: "Double click chime + subtle deep hit",
    },
  ]);

  const presets = [
    {
      label: "Tech / AI Explainer",
      topic: "AI দিয়ে কীভাবে প্রতিদিন ৩ ঘণ্টা সময় বাঁচাবেন (How to save 3 hours daily with AI)",
      style: "contrarian" as const,
      score: 94,
    },
    {
      label: "E-Commerce Product Launch",
      topic: "দারাজ বা ফেসবুক শপে কাপড় বিক্রির সময় যে ৩টি ভুলের কারণে কাস্টমার ড্রপ করে",
      style: "pain" as const,
      score: 91,
    },
    {
      label: "Freelance & Career Advice",
      topic: "২০২৬ সালে আপওয়ার্কে প্রথম কাজ পাওয়ার গোপন সিক্রেট যা কেউ বলে না",
      style: "curiosity" as const,
      score: 96,
    },
    {
      label: "Local Business / Khata",
      topic: "দোকানের বাকি খাতা হিসাব করতে প্রতিদিন ২ ঘণ্টা নষ্ট করছেন? ১ ক্লিকে এক্সেল বানান",
      style: "pain" as const,
      score: 93,
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    sound.toggleSwitch();
    setTopic(p.topic);
    setHookStyle(p.style);
    setHookScore(p.score);
  };

  const generateSrt = (): string => {
    return scenes
      .map((scene, idx) => {
        const parts = scene.timestamp.split(" - ");
        const start = `00:${parts[0].trim()},000`;
        const end = `00:${parts[1].trim()},000`;
        return `${idx + 1}\n${start} --> ${end}\n${scene.voiceover}\n`;
      })
      .join("\n");
  };

  const generateMarkdown = (): string => {
    let md = `# 60s Viral Reel Script: ${topic}\n`;
    md += `**Retention Hook Score:** ${hookScore}/100 | **Style:** ${hookStyle.toUpperCase()} | **Duration:** ${duration}s\n\n`;
    md += `| Time | Voiceover (Narrative) | Visual & Camera Direction | Real SFX |\n`;
    md += `| :--- | :-------------------- | :------------------------ | :------- |\n`;
    scenes.forEach((s) => {
      md += `| ${s.timestamp} | ${s.voiceover} | ${s.visual} | ${s.sfx} |\n`;
    });
    return md;
  };

  const handleCopyMarkdown = () => {
    sound.click();
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    osStore.addXp(20, "Generated 60s Reel Script");
    osStore.incrementToolRun();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSrt = () => {
    sound.confirm();
    const srt = generateSrt();
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reel_script_${Date.now()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
    setSrtCopied(true);
    osStore.addXp(25, "Exported Reel SRT Subtitles");
    setTimeout(() => setSrtCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                1-Click 60s Viral Reel & .SRT Generator
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                  ViralDirector Powered
                </span>
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                ভিডিওর ৩-সেকেন্ড স্ক্রোল-স্টপার হুক, ৩-কলাম স্ক্রিপ্ট (Voice | Visual | SFX) ও রেডিমেড .srt সাবটাইটেল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              Hook Score: {hookScore}/100
            </div>
            <a
              href="/agents?agent=viral-director"
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              Open Agent
            </a>
          </div>
        </div>

        {/* Preset Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-neutral-400 font-medium">Topic or Value Proposition</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-rose-500"
            placeholder="e.g. 3 secrets of productive remote devs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-400 font-medium">Hook Angle</label>
          <select
            value={hookStyle}
            onChange={(e) => setHookStyle(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-rose-500"
          >
            <option value="contrarian">Contrarian / Misconception</option>
            <option value="curiosity">Curiosity Gap</option>
            <option value="pain">Pain Point Agitation</option>
            <option value="story">Story / Case Study</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-400 font-medium">Target Duration</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[30, 45, 60].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  sound.click();
                  setDuration(dur as any);
                }}
                className={`py-2 rounded-lg font-mono font-medium border text-center transition-all ${
                  duration === dur
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:bg-neutral-800"
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Timed Script Table */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            3-Column Master Beat Sheet ({scenes.length} Acts, {duration}s Total)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.launch();
                setShowTeleprompter(true);
                setIsPrompterScrolling(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Teleprompter</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied MD" : "Copy Table"}
            </button>
            <button
              onClick={handleDownloadSrt}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download .SRT
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-mono bg-neutral-950/40">
                <th className="py-2.5 px-3 w-28">Timestamp</th>
                <th className="py-2.5 px-3">Voiceover (Narrative & Speech)</th>
                <th className="py-2.5 px-3">Visual & Camera Direction</th>
                <th className="py-2.5 px-3 w-48">Real Sound FX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {scenes.map((scene, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono text-rose-400 whitespace-nowrap align-top">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      {scene.timestamp}
                    </span>
                  </td>
                  <td className="py-3 px-3 align-top font-medium leading-relaxed text-neutral-200">
                    {scene.voiceover}
                  </td>
                  <td className="py-3 px-3 align-top text-neutral-400 leading-relaxed">
                    {scene.visual}
                  </td>
                  <td className="py-3 px-3 align-top font-mono text-amber-300/80">
                    {scene.sfx}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live SRT Preview Box */}
      <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 font-mono text-xs">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span>.SRT Subtitle Stream (60fps compliant)</span>
          <span>{scenes.length} cues</span>
        </div>
        <pre className="p-3 rounded-lg bg-neutral-900 text-neutral-300 max-h-36 overflow-y-auto leading-relaxed select-all">
          {generateSrt()}
        </pre>
      </div>
      {/* Live Teleprompter Modal */}
      {showTeleprompter && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-6 sm:p-12 text-white">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase">
                Studio Teleprompter
              </span>
              <span className="text-sm font-bold text-neutral-300 truncate max-w-md">{topic}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPrompterScrolling(!isPrompterScrolling)}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {isPrompterScrolling ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPrompterScrolling ? "Pause" : "Scroll"}</span>
              </button>

              <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs font-mono">
                {[1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompterSpeed(s)}
                    className={`px-2 py-0.5 rounded-lg ${prompterSpeed === s ? "bg-neutral-800 text-white font-bold" : "text-neutral-400"}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowTeleprompter(false);
                  setIsPrompterScrolling(false);
                }}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={prompterRef}
            className="flex-1 overflow-y-auto px-4 sm:px-16 py-8 space-y-16 max-w-4xl mx-auto w-full font-sans text-center scroll-smooth select-none"
            style={{ fontSize: `${prompterFontSize}px`, lineHeight: 1.6 }}
          >
            {scenes.map((s, idx) => (
              <div key={idx} className="space-y-2 py-6 border-b border-neutral-900">
                <span className="text-xs font-mono font-bold text-rose-500 block tracking-widest">
                  {s.timestamp}
                </span>
                <p className="font-bold text-neutral-100">{s.voiceover}</p>
                <span className="text-sm text-neutral-500 font-mono block italic">
                  [Camera: {s.visual}]
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
