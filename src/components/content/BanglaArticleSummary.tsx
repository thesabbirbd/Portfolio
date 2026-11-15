"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Wrench, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface BanglaArticleSummaryProps {
  title: string;
  banglaSummary?: string;
  bullets?: string[];
  relatedToolHref?: string;
  relatedToolLabel?: string;
}

export function BanglaArticleSummary({
  title,
  banglaSummary,
  bullets = [
    "ক্লায়েন্ট-সাইড WASM ও Canvas ইঞ্জিন ব্যবহারের ফলে সার্ভার বা ক্লাউড API খরচ ছাড়াই ১০০% প্রাইভেসি নিশ্চিত হয়।",
    "অ্যালগরিদমগুলো ব্রাউজারে মিলি-সেকেন্ডের মধ্যে এক্সিকিউট হয়—ফলে কোনো থার্ড-পার্টি ডাটা লিকেজের ঝুঁকি নেই।",
    "বাংলাদেশি প্রেক্ষাপটে (E.164 ফোন, বাংলা ডিজিট, লাখ-কোটি কারেন্সি) নিখুঁত কনভার্সন ও অডিট করা সম্ভব।",
  ],
  relatedToolHref = "/tools",
  relatedToolLabel = "Launch Related Super-Tool on sabbir.nav.bd ↗",
}: BanglaArticleSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    sound.click();
    setIsOpen((prev) => !prev);
  };

  const defaultSummary =
    banglaSummary ||
    `এই গাইডের মূল উদ্দেশ্য হলো বাস্তব সিস্টেম আর্কিটেকচার ও ক্লায়েন্ট-সাইড ইঞ্জিনিয়ারিংয়ের মাধ্যমে সার্ভারলেস ও অফলাইন-ফার্স্ট সমাধান তৈরি করা। "${title}" আর্টিকেলে আলোচিত কৌশলগুলো সরাসরি প্রয়োগ করে সিস্টেম লেটেন্সি কমানো এবং জটিল ডেটা প্রসেসিং ব্রাউজারেই সম্পন্ন করা সম্ভব।`;

  return (
    <div className="w-full my-6 rounded-2xl border border-primary/25 bg-primary/5 overflow-hidden shadow-sm font-sans transition-all">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-primary/10 transition"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-primary text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <span>🇧🇩 বাংলায় সারসংক্ষেপ ও টেকনিক্যাল ইমপ্যাক্ট</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-bold">
                Bangla Summary
              </span>
            </h3>
            <p className="text-xs text-ink-3 mt-0.5">
              ক্লিক করে ১ মিনিটে এই আর্টিকেলের বাংলা সারমর্ম ও মূল টেকনিক্যাল পয়েন্টগুলো পড়ুন
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-ink-3">
          {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-primary/15 bg-surface/50 space-y-4 animate-in fade-in duration-200">
          {/* Main Bangla Paragraph */}
          <div className="text-sm text-ink-2 leading-relaxed bg-surface p-4 rounded-xl border border-line">
            <p>{defaultSummary}</p>
          </div>

          {/* Key Bullet Points */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>মূল টেকনিক্যাল পয়েন্টসমূহ:</span>
            </h4>
            <ul className="space-y-2">
              {bullets.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-ink leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Live Tool Bridge */}
          {relatedToolHref && (
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-ink-3 font-mono">
                ⚡ Try this architecture live on THE SABBiR OS:
              </span>
              <Link
                href={relatedToolHref}
                className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 transition shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{relatedToolLabel}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
