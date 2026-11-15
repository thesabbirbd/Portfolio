"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

export interface PersonaGoal {
  id: string;
  roleTitleBn: string;
  roleTitleEn: string;
  icon: string;
  taglineBn: string;
  taglineEn: string;
  colorBorder: string;
  recommendedTools: {
    titleBn: string;
    titleEn: string;
    slug: string;
    badge: string;
    descBn: string;
  }[];
}

export const PERSONA_GOALS: PersonaGoal[] = [
  {
    id: "everyday",
    roleTitleBn: "গৃহস্থালি ও পরিবার",
    roleTitleEn: "Family & Home",
    icon: "👨‍👩‍👧",
    taglineBn: "বিদ্যুৎ বিল, ওষুধের নিয়ম ও বাড়ি ভাড়ার হিসাব",
    taglineEn: "Bills, Prescriptions & Rent Receipts",
    colorBorder: "border-amber-500/40 hover:border-amber-400",
    recommendedTools: [
      {
        titleBn: "বিদ্যুৎ বিল ও আইপিএস/সোলার সাইজার",
        titleEn: "Electricity Bill & IPS Sizer",
        slug: "/tools/electricity-solar-calculator",
        badge: "জনপ্রিয়",
        descBn: "BERC স্ল্যাব অনুযায়ী বিল হিসাব ও সঠিক আইপিএস/ব্যাটারি নির্ধারণ",
      },
      {
        titleBn: "ওষুধের রুটিন ও রিফিল চার্ট",
        titleEn: "Prescription Medicine Scheduler",
        slug: "/tools/medicine-scheduler",
        badge: "স্বাস্থ্য",
        descBn: "১+০+১ সকাল-দুপুর-রাত চার্ট প্রিন্ট ও ফোনের অ্যালার্ম ক্যালেন্ডার",
      },
      {
        titleBn: "বাড়ি ভাড়ার রশিদ ও টু-লেট পোস্টার",
        titleEn: "House Rent Receipt & To-Let",
        slug: "/tools/house-rent-studio",
        badge: "প্রপার্টি",
        descBn: "বাড়িওয়ালা-ভাড়াটিয়া ডাবল রশিদ ও কিউআর কোডসহ বাসা ভাড়ার পোস্টার",
      },
    ],
  },
  {
    id: "student",
    roleTitleBn: "শিক্ষার্থী ও চাকরিপ্রার্থী",
    roleTitleEn: "Students & Job Seekers",
    icon: "🎓",
    taglineBn: "সিজিপিএ হিসাব, বিসিএস ছবি ও চাকরির বয়স",
    taglineEn: "CGPA, 300x300 Photos & Age Eligibility",
    colorBorder: "border-blue-500/40 hover:border-blue-400",
    recommendedTools: [
      {
        titleBn: "বিসিএস ও সরকারি চাকরির ছবি সাইজার",
        titleEn: "BCS & Gov Photo Sizer",
        slug: "/tools/gov-photo-sizer",
        badge: "জরুরি",
        descBn: "টেলিটক ৩০০×৩০০ ছবি (<১০০KB) ও ৩০০×৮০ স্বাক্ষর (<৬০KB) প্রস্তুতকরণ",
      },
      {
        titleBn: "এসএসসি/এইচএসসি ও ভার্সিটি সিজিপিএ",
        titleEn: "SSC/HSC & University CGPA",
        slug: "/tools/cgpa-calculator",
        badge: "শিক্ষা",
        descBn: "৪র্থ বিষয়ের বোনাস পয়েন্ট হিসাব ও টার্গেট সিজিপিএ প্রেডিকশন",
      },
      {
        titleBn: "সরকারি চাকরির সঠিক বয়স ও বিএমআই",
        titleEn: "Job Age & Emergency Medical Card",
        slug: "/tools/age-health-card",
        badge: "ক্যালেন্ডার",
        descBn: "সার্কুলারের নির্দিষ্ট তারিখে দিন-মাস-বছর হিসাব ও ৩২ বছরের যোগ্যতা",
      },
    ],
  },
  {
    id: "business",
    roleTitleBn: "দোকান ও ব্যবসা",
    roleTitleEn: "Shop & Business",
    icon: "🛍️",
    taglineBn: "দ্রুত কাস্টমার চ্যাট, ভ্যাট/ট্যাক্স ও স্বর্ণের ভরি",
    taglineEn: "WhatsApp Macros, Gold & Invoices",
    colorBorder: "border-emerald-500/40 hover:border-emerald-400",
    recommendedTools: [
      {
        titleBn: "হোয়াটসঅ্যাপ ও মেসেঞ্জার কুইক রিপ্লাই",
        titleEn: "WhatsApp & F-Commerce Quick Reply Hub",
        slug: "/tools/quick-reply-hub",
        badge: "চ্যাট",
        descBn: "অর্ডার কনফার্ম, কুরিয়ার ট্র্যাকিং ও বিকাশ পেমেন্টের রেডি মেসেজ",
      },
      {
        titleBn: "জমি ও বাজুস স্বর্ণের ভরি কনভার্টার",
        titleEn: "BD Land & BAJUS Gold Converter",
        slug: "/tools/unit-land-converter",
        badge: "পরিমাপ",
        descBn: "শতক/কাঠা রূপান্তর ও ২২K/২১K/১৮K স্বর্ণের ভরি ও মজুরিসহ দাম",
      },
      {
        titleBn: "প্রফেশনাল ইনভয়েস ও মেমো মেকার",
        titleEn: "Invoice & Dokan Khata Studio",
        slug: "/tools/invoice-maker",
        badge: "পিডিএফ",
        descBn: "স্বয়ংক্রিয় মোট টাকা ও বাংলা কথায় টাকাসহ কাস্টমার ক্যাশ মেমো",
      },
    ],
  },
  {
    id: "freelance",
    roleTitleBn: "ফ্রিল্যান্সার ও অফিস",
    roleTitleEn: "Freelance & Office",
    icon: "💼",
    taglineBn: "রেমিট্যান্স ইনসেন্টিভ, বিজয় কনভার্টার ও সিগনেচার",
    taglineEn: "2.5% Incentive, Bijoy & Email Signatures",
    colorBorder: "border-purple-500/40 hover:border-purple-400",
    recommendedTools: [
      {
        titleBn: "ফ্রিল্যান্সার রেমিট্যান্স ও ২.৫% ইনসেন্টিভ",
        titleEn: "Freelancer Remittance & 2.5% Incentive",
        slug: "/tools/remittance-calculator",
        badge: "ইনসেন্টিভ",
        descBn: "Upwork/Payoneer/Wise থেকে ব্যাংকের ২.৫% নগদ সহায়তার সঠিক হিসাব",
      },
      {
        titleBn: "বিজয় ↔ ইউনিকোড ও অফিশিয়াল দরখাস্ত",
        titleEn: "Bijoy <-> Unicode & Application Studio",
        slug: "/tools/bangla-converter",
        badge: "টাইপিং",
        descBn: "SutonnyMJ ফন্ট রূপান্তর ও ১২টি প্রস্তুত সরকারি/ব্যাংক দরখাস্ত",
      },
      {
        titleBn: "ডাইনামিক এইচটিএমএল ইমেইল সিগনেচার",
        titleEn: "HTML Email Signature Studio",
        slug: "/tools/email-signature",
        badge: "ব্র্যান্ডিং",
        descBn: "Gmail/Outlook-এ সরাসরি পেস্ট উপযোগী রেসপনসিভ বিজনেস সিগনেচার",
      },
    ],
  },
  {
    id: "developer",
    roleTitleBn: "ডেভেলপার ও আইটি",
    roleTitleEn: "Developer & DevOps",
    icon: "💻",
    taglineBn: "ব্রাউজারে এসকিউএল, ডকার ও ক্রন এক্সপ্লেইনার",
    taglineEn: "In-Browser SQL, Docker & Cron Explainer",
    colorBorder: "border-amber-400/40 hover:border-amber-300",
    recommendedTools: [
      {
        titleBn: "ব্রাউজার এসকিউএল স্যান্ডবক্স",
        titleEn: "In-Browser SQL Sandbox",
        slug: "/tools/sql-sandbox",
        badge: "ডাটাবেস",
        descBn: "সার্ভার ছাড়া ব্রাউজারে SQLite কুয়েরি চালানো ও টেবিল বিশ্লেষণ",
      },
      {
        titleBn: "ডকার কম্পোজ সিকিউরিটি হার্ডেনার",
        titleEn: "Docker Security Hardener",
        slug: "/tools/docker-hardener",
        badge: "ডেভঅপস",
        descBn: "রুটহীন কন্টেইনার, হেলথচেক ও সিআইএস বেঞ্চমার্ক কনফিগ জেনারেটর",
      },
      {
        titleBn: "প্লেইন ইংলিশ ক্রন এক্সপ্লেইনার",
        titleEn: "Plain English Cron Explainer",
        slug: "/tools/cron-english",
        badge: "টাইমার",
        descBn: "জটিল ক্রন শিডিউলকে সহজ ভাষায় ব্যাখ্যা ও সিস্টেমডি টাইমার রূপান্তর",
      },
    ],
  },
];

export function EverydayPersonaFinder() {
  const [selectedPersona, setSelectedPersona] = useState<string>("everyday");

  const current = PERSONA_GOALS.find((g) => g.id === selectedPersona) || PERSONA_GOALS[0];

  return (
    <div className="w-full p-5 sm:p-7 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সহজ মোড · Everyday Goal Finder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            আজ আপনি কী কাজ করতে চান?
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            আপনার পেশা বা আজকের প্রয়োজনীয়তা বেছে নিন — ৩টি সেরা কার্যকর টুলস সরাসরি পেয়ে যাবেন।
          </p>
        </div>
      </div>

      {/* Persona Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PERSONA_GOALS.map((p) => {
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                sound.click();
                setSelectedPersona(p.id);
              }}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                isSelected
                  ? "bg-neutral-800 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.02]"
                  : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{p.icon}</span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 animate-in zoom-in-50 duration-200" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{p.roleTitleBn}</div>
                <div className="text-[10px] text-neutral-400 font-mono">{p.roleTitleEn}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected 3 Recommended Tools Showcase */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <span>{current.icon}</span>
            <span>{current.roleTitleBn}-এর জন্য ৩টি সেরা সমাধান</span>
          </span>
          <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
            {current.taglineBn}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {current.recommendedTools.map((t) => (
            <Link
              key={t.slug}
              href={t.slug}
              onClick={() => sound.click()}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/90 hover:border-amber-400/60 transition-all duration-200 group flex flex-col justify-between space-y-3 hover:-translate-y-0.5 shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    {t.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.titleBn}
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{t.descBn}</p>
              </div>

              <div className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1 group-hover:underline pt-1">
                <span>টুলটি ব্যবহার করুন</span>
                <span>➔</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
