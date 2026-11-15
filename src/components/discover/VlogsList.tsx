"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Sparkles, ChevronDown, ChevronUp, Copy, Check, ExternalLink, Video, FileText, Wrench } from "lucide-react";
import { sound } from "@/lib/sound";
import { type VlogEpisode } from "@/data/vlogs";
import { TeleprompterModal } from "@/components/vlogs/TeleprompterModal";
import { PopularNewTabsBar } from "@/components/system/PopularNewTabsBar";
import { ArrowRight, Lightbulb } from "lucide-react";
import {
  YoutubeIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/ui/BrandIcons";

function PromptBox({
  companionPrompt,
}: {
  companionPrompt: VlogEpisode["companionPrompt"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(companionPrompt.prompt);
    setCopied(true);
    sound.confirm();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    sound.click();
  };

  return (
    <div className="mt-4 border border-line rounded-xl overflow-hidden surface-card transition-all">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-ink surface-interactive"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{companionPrompt.label}</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-ink-3" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-3" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 pt-0 border-t border-line/60 bg-muted/40">
          <p className="text-[12px] text-ink-2 mb-2 leading-relaxed">
            {companionPrompt.explanation}
          </p>
          <div className="relative">
            <pre className="p-3 rounded-xl bg-paper border border-line font-mono text-xs text-ink overflow-x-auto whitespace-pre-wrap max-h-48">
              {companionPrompt.prompt}
            </pre>
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-primary text-white hover:opacity-90 transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          {companionPrompt.companionToolHref && (
            <div className="mt-2.5 flex justify-end">
              <Link
                href={companionPrompt.companionToolHref}
                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
              >
                {companionPrompt.companionToolLabel || "Open companion tool ↗"}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VlogCard({ episode }: { episode: VlogEpisode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  const handleStartPlay = () => {
    sound.launch();
    setIsPlaying(true);
  };

  return (
    <li className="reveal rounded-card surface-card overflow-hidden lux-card flex flex-col justify-between">
      <div>
        {/* Click-to-load 4:5 / 16:9 Facade */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden group">
          {isPlaying && episode.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${episode.youtubeId}?autoplay=1&rel=0`}
              title={episode.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              onClick={handleStartPlay}
              className="w-full h-full flex flex-col items-center justify-between p-5 cursor-pointer select-none bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 relative"
            >
              {/* Top metadata strip */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-white/80 z-10">
                <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 uppercase tracking-wider font-semibold">
                  EP {String(episode.episodeNo).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary-2 border border-primary/30">
                  <Video className="w-3 h-3" /> {episode.duration} · {episode.fps} FPS ({episode.aspectRatio})
                </span>
              </div>

              {/* Center Play Button & Title */}
              <div className="flex flex-col items-center text-center px-4 z-10">
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white grid place-items-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-xl mb-3">
                  <Play className="w-7 h-7 translate-x-0.5 fill-current" />
                </div>
                <p className="text-white font-bold text-base sm:text-lg line-clamp-2 leading-snug">
                  {episode.title}
                </p>
                <span className="mt-1 text-xs text-white/60 font-mono">Click to watch session</span>
              </div>

              {/* Bottom tag */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-white/60 z-10">
                <span>{episode.date}</span>
                <span className="text-primary">{episode.topics[0]}</span>
              </div>

              {/* Background Glow Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial-at-c from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-mono text-primary font-semibold">
              Lab Session · Episode {String(episode.episodeNo).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-mono text-ink-3">{episode.date}</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-ink leading-snug">
            {episode.title}
          </h2>
          <p className="mt-1 text-xs text-primary font-medium">{episode.subtitle}</p>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{episode.summary}</p>

          {/* Topic Pills */}
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics">
            {episode.topics.map((t) => (
              <li
                key={t}
                className="text-[11px] font-mono text-ink-3 bg-muted px-2 py-0.5 rounded border border-line/40"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Steal the Prompt Box */}
          <PromptBox companionPrompt={episode.companionPrompt} />

          {/* Teleprompter & Live Tool Bridges */}
          <div className="mt-4 pt-3 border-t border-line/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                setIsTeleprompterOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-surface border border-line hover:border-primary/50 text-ink text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>📜 Teleprompter</span>
            </button>

            <Link
              href={episode.companionPrompt.companionToolHref || "/tools"}
              className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition text-center"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Run Tool ↗</span>
            </Link>
          </div>

          <TeleprompterModal
            isOpen={isTeleprompterOpen}
            onClose={() => setIsTeleprompterOpen(false)}
            title={episode.title}
            script={episode.companionPrompt.prompt}
            duration={episode.duration}
          />
        </div>
      </div>

      {/* Social Watch Footer */}
      <div className="p-4 sm:p-5 pt-0 border-t border-line/40 mt-3 flex items-center justify-between">
        <span className="text-xs text-ink-3 font-mono">Watch across:</span>
        <div className="flex items-center gap-2">
          {episode.platforms.youtube && (
            <a
              href={episode.platforms.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg surface-card surface-interactive text-ink-2 hover:text-red-500 grid place-items-center transition-colors"
              title="Watch on YouTube"
              aria-label="Watch on YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          )}
          {episode.platforms.linkedin && (
            <a
              href={episode.platforms.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg surface-card surface-interactive text-ink-2 hover:text-blue-500 grid place-items-center transition-colors"
              title="Watch on LinkedIn"
              aria-label="Watch on LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {episode.platforms.facebook && (
            <a
              href={episode.platforms.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg surface-card surface-interactive text-ink-2 hover:text-blue-600 grid place-items-center transition-colors"
              title="Watch on Facebook"
              aria-label="Watch on Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          )}
          {episode.platforms.instagram && (
            <a
              href={episode.platforms.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg surface-card surface-interactive text-ink-2 hover:text-pink-500 grid place-items-center transition-colors"
              title="Watch on Instagram"
              aria-label="Watch on Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export function VlogsList({ episodes }: { episodes: VlogEpisode[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popular" | "new">("popular");

  const categories = [
    { key: "all", label: "All Sessions (6)" },
    { key: "ai", label: "Local AI & Systems" },
    { key: "devops", label: "DevOps & Linux" },
    { key: "retail", label: "Retail & Aiyaar" },
  ];

  const filtered = episodes
    .filter((ep) => {
      if (filter === "all") return true;
      if (filter === "ai") return ep.topics.some((t) => ["Local AI", "Claude Artifacts", "NotebookLM", "Prompt Engineering", "Ollama", "Hybrid AI"].includes(t));
      if (filter === "devops") return ep.topics.some((t) => ["Ubuntu", "Linux", "SSH", "Docker", "NVIDIA", "WireGuard", "NOC", "Networking"].includes(t));
      if (filter === "retail") return ep.topics.some((t) => ["Retail Tech", "Aiyaar", "Vision AI", "Google Sheets"].includes(t));
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return (b.episodeNo || 0) - (a.episodeNo || 0);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Popular and New Quick Switcher Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-line/60 pb-4">
        <PopularNewTabsBar
          activeTab={sortBy === "new" ? "new" : "popular"}
          onTabChange={(tab) => setSortBy(tab)}
          showPersonaChips={false}
        />

        <Link
          href="/hacks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Explore 36 Everyday Hacks & Prompts</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-ink-3 uppercase tracking-wider mr-2">Filter Lab:</span>
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              setFilter(c.key);
              sound.click();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border ${
              filter === c.key
                ? "bg-primary text-white border-primary shadow-sm"
                : "surface-card border-line text-ink-2 hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((episode) => (
          <VlogCard key={episode.id} episode={episode} />
        ))}
      </ul>
    </div>
  );
}
