"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { sound } from "@/lib/sound";

interface NewsShareButtonProps {
  title: string;
  takeaway: string;
  url: string;
  hashtags: string[];
}

export function NewsShareButton({ title, takeaway, url, hashtags }: NewsShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    sound.copy();
    const text = `${title}\n\n💡 Engineering Takeaway: ${takeaway}\n\nRead more on THE SABBiR OS: ${url}\n\n${hashtags.join(" ")}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-sm"
      title="Copy news breakdown and hashtags"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "Copied to Clipboard!" : "Share Story Snippet"}</span>
    </button>
  );
}
