"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  Search,
  Grid,
  Sparkles,
  Flame,
  Users,
  Briefcase,
  GraduationCap,
  Palette,
  Terminal,
  Bot,
  ExternalLink,
  ChevronRight,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { sound } from "@/lib/sound";

export interface DrawerAppItem {
  name: string;
  banglaName: string;
  href: string;
  category: string;
  icon: string;
  isNew?: boolean;
  isPopular?: boolean;
  description: string;
}

export const OS_DRAWER_CATEGORIES = [
  { id: "popular", label: "🔥 Most Popular", bangla: "জনপ্রিয় স্টুডিও" },
  { id: "new", label: "✨ New Releases", bangla: "নতুন যুক্ত স্টুডিও" },
  { id: "everyday", label: "👨‍👩‍👧 Everyday & Family", bangla: "পারিবারিক ও প্রাত্যহিক" },
  { id: "business", label: "🛍️ Business & POS", bangla: "ব্যবসা ও ক্যাশ মেমো" },
  { id: "education", label: "🎓 Student & BCS", bangla: "শিক্ষা ও চাকরি" },
  { id: "media", label: "🎨 Media & Creator", bangla: "ডিজাইন ও কনটেন্ট" },
  { id: "devops", label: "💻 DevOps & AI", bangla: "ডেভেলপার ও লিনাক্স" },
  { id: "autonomous", label: "🤖 Brain & Games", bangla: "অটোনোমাস ও গেমস" },
];

export const OS_DRAWER_APPS: DrawerAppItem[] = [
  // 1. New Releases / Everyday
  {
    name: "NID & Dual-Side ID Card Stitcher",
    banglaName: "এনআইডি ও স্মার্ট কার্ড ২-পার্শ্ব A4 প্রিন্ট ও ওয়াটারমার্ক",
    href: "/tools/id-card-stitcher",
    category: "education",
    icon: "🪪",
    isNew: true,
    isPopular: true,
    description: "NID, ড্রাইভিং লাইসেন্স ও স্টুডেন্ট আইডির উভয় পিঠ এক পেজে নির্ভুল সাজিয়ে অ্যান্টি-মিসইউজ জলছাপসহ প্রিন্ট।",
  },
  {
    name: "Bijoy ↔ Unicode Bangla Converter",
    banglaName: "বিজয় ও ইউনিকোড উভমুখী বাংলা কনভার্টার",
    href: "/tools/bangla-converter",
    category: "everyday",
    icon: "🇧🇩",
    isNew: true,
    isPopular: true,
    description: "সুতন্বীএমজে ও ইউনিকোড নির্ভুল রূপান্তর এবং ১২টি রেডিমেড সরকারি ও ব্যাংক দরখাস্ত।",
  },
  {
    name: "Medicine Dose & Refill Scheduler",
    banglaName: "প্রেসক্রিপশন ডোজ ও রিফিল অ্যালার্ম চার্ট",
    href: "/tools/medicine-scheduler",
    category: "everyday",
    icon: "💊",
    isNew: true,
    isPopular: true,
    description: "ডাক্তারের 1+0+1 সংকেত থেকে ওয়াল-পোস্টার চার্ট, খরচ ও ক্যালেন্ডার অ্যালার্ম।",
  },
  {
    name: "4-Year Degree & SSC/HSC CGPA Studio",
    banglaName: "৪ বছরের বিশ্ববিদ্যালয় ডিগ্রি ও বোর্ড জিপিএ স্টুডিও",
    href: "/tools/cgpa-calculator",
    category: "education",
    icon: "🎓",
    isNew: true,
    isPopular: true,
    description: "BA, BBA, BSC, Diploma কারিকুলাম অনুযায়ী বছরভিত্তিক সেমিস্টার গ্রেড ও সার্টিফিকেট ট্রান্সক্রিপ্ট।",
  },
  {
    name: "Family Budget & Islamic Zakat Studio",
    banglaName: "৫০/৩০/২০ ফ্যামিলি বাজেট ও ইসলামিক যাকাত",
    href: "/tools/family-budget-zakat",
    category: "everyday",
    icon: "🕌",
    isNew: true,
    isPopular: true,
    description: "পারিবারিক বাজেট ট্র্যাকিং, ব্যাংক ডিপিএস কর এবং বাজুস স্বর্ণ-রূপা নেসাব যাকাত হিসাব।",
  },
  {
    name: "Electricity Bill (LT-A) & Solar Sizer",
    banglaName: "বিদ্যুৎ বিল (LT-A) ও আইপিএস সোলার সাইজার",
    href: "/tools/electricity-solar-calculator",
    category: "everyday",
    icon: "⚡",
    isNew: true,
    isPopular: true,
    description: "বিইআরসি আবাসিক স্টেপ-ট্যারিফ বিল ও লোডশেডিংয়ের জন্য ইনভার্টার ও ব্যাটারি সাইজার।",
  },
  {
    name: "House Rent Receipt & To-Let Studio",
    banglaName: "বাড়ি ভাড়ার রশিদ ও টু-লেট পোস্টার মেকার",
    href: "/tools/house-rent-studio",
    category: "everyday",
    icon: "🏠",
    isNew: true,
    isPopular: false,
    description: "দ্বৈত কপি ভাড়ার রশিদ এবং হোয়াটসঅ্যাপ কিউআর যুক্ত A4 টু-লেট পোস্টার।",
  },
  {
    name: "Job Age & Emergency Health ID",
    banglaName: "সরকারি চাকরির বয়স ও ইমার্জেন্সি হেলথ কার্ড",
    href: "/tools/age-health-card",
    category: "everyday",
    icon: "❤️",
    isNew: true,
    isPopular: false,
    description: "৩২ বছর বয়স কাটঅফ ভেরিফিকেশন, বিএমআই এবং মানিব্যাগ সাইজ হেলথ আইডি কার্ড।",
  },
  {
    name: "Event Dawat & Catering Planner",
    banglaName: "দাওয়াতি ক্যাটারিং ও পিকনিক চাঁদা স্প্লিট",
    href: "/tools/event-dawat-planner",
    category: "everyday",
    icon: "🍛",
    isNew: true,
    isPopular: false,
    description: "বিরিয়ানি/পোলাও পার-হেড কেজি উপাদান হিসাব এবং বন্ধুদের সমবন্টন চাঁদা স্প্লিট।",
  },
  {
    name: "Tax, Sanchaypatra & Bank EMI",
    banglaName: "আয়কর, সঞ্চয়পত্র মুনাফা ও ব্যাংক ইএমআই",
    href: "/tools/tax-sanchaypatra-emi",
    category: "business",
    icon: "📑",
    isNew: true,
    isPopular: false,
    description: "২০২৫-২৬ কর ধাপ অনুযায়ী নিট মাসিক মুনাফা ও ব্যাংক ঋণের কিস্তি চার্ট।",
  },
  {
    name: "Social Bold Text & Viral Styler",
    banglaName: "সোশ্যাল বোল্ড টেক্সট স্টাইলার ও হুক্স",
    href: "/tools/social-text-styler",
    category: "media",
    icon: "✍️",
    isNew: true,
    isPopular: false,
    description: "ফেসবুক ও লিঙ্কডইনে বোল্ড, কার্সিভ ফন্ট এবং ২০+ ভাইরাল এনগেজমেন্ট হুক।",
  },
  {
    name: "Zero-Knowledge Password Vault & Hash",
    banglaName: "পাসওয়ার্ড ভল্ট ও হ্যাশ জেনারেটর",
    href: "/tools/password-vault-hash",
    category: "devops",
    icon: "🔐",
    isNew: true,
    isPopular: false,
    description: "AES-256-GCM জিরো-নলেজ নোট ভল্ট ও SHA-256 চেকসাম অডিট।",
  },
  {
    name: "Embed Widget Studio & Iframe",
    banglaName: "এমবেড উইজেট ও আইফ্রেম স্টুডিও",
    href: "/tools/embed-widget-studio",
    category: "devops",
    icon: "🧩",
    isNew: true,
    isPopular: false,
    description: "যেকোনো ব্লগ বা ওয়েবসাইটে সাব্বির ওএস টুল এমবেড করার লাইভ কোড জেনারেটর।",
  },

  // 2. High Demand Business & Creative
  {
    name: "BCS & Govt Photo & Signature Sizer",
    banglaName: "বিসিএস ও সরকারি চাকরি ফটো সাইজার",
    href: "/tools/gov-photo-sizer",
    category: "education",
    icon: "📸",
    isNew: false,
    isPopular: true,
    description: "৩০০x৩০০ ছবি ও ৩০০x৮০ স্বাক্ষর নিখুঁত সাইজিং ও ৪R প্রিন্ট শিট।",
  },
  {
    name: "Freelancer Remittance & 2.5% Incentive",
    banglaName: "রেমিট্যান্স ও ২.৫% নগদ প্রণোদনা ক্যালকুলেটর",
    href: "/tools/remittance-calculator",
    category: "business",
    icon: "💵",
    isNew: false,
    isPopular: true,
    description: "পেওনিয়ার, ওয়াইজ ও ব্যাংকের সরকারি ২.৫% প্রণোদনা ও নিট টাকা হিসাব।",
  },
  {
    name: "Unit, Land & Gold Vori Converter",
    banglaName: "জমি ও বাজুস সোনা পরিমাপক",
    href: "/tools/unit-land-converter",
    category: "everyday",
    icon: "📐",
    isNew: false,
    isPopular: true,
    description: "শতক, কাঠা, বিঘা এবং ভরি, আনা, রতি হিসাব ও ৫% ভ্যাট ক্যালকুলেটর।",
  },
  {
    name: "Document Scanner & Shadow Remover",
    banglaName: "ডকুমেন্ট স্ক্যানার ও দলিলের ছায়া দূরীকরণ",
    href: "/tools/document-scanner",
    category: "everyday",
    icon: "📄",
    isNew: false,
    isPopular: true,
    description: "মোবাইলে তোলা দলিলের ছায়া রিমুভ করে ফটোকপি এ৪ পিডিএফ।",
  },
  {
    name: "Typing Speed Arena (Bangla & English)",
    banglaName: "টাইপিং স্পিড এরিনা ও সার্টিফিকেট",
    href: "/tools/typing-speed-arena",
    category: "education",
    icon: "⌨️",
    isNew: false,
    isPopular: true,
    description: "বাংলা ইউনিকোড ও ইংরেজি টাইপিং টেস্ট ও ভেরিফায়েড পিএনজি সার্টিফিকেট।",
  },
  {
    name: "Color Design Lab (WCAG Contrast)",
    banglaName: "কালার ডিজাইন ল্যাব ও কন্ট্রাস্ট অডিটর",
    href: "/tools/color-design-lab",
    category: "media",
    icon: "🎨",
    isNew: false,
    isPopular: false,
    description: "টেইলউইন্ড ৫০-৯৫০ কালার প্যালেট ও WCAG AAA লাইভ কন্ট্রাস্ট অডিট।",
  },
  {
    name: "AI Studio Background Remover",
    banglaName: "এআই ব্যাকগ্রাউন্ড রিমুভার ও ম্যাটিং",
    href: "/tools/bg-remover",
    category: "media",
    icon: "✂️",
    isNew: false,
    isPopular: true,
    description: "প্রোডাক্ট ও পোর্ট্রেটের ব্যাকগ্রাউন্ড নিখুঁতভাবে রিমুভ করে স্টুডিও ব্যাকড্রপ।",
  },
  {
    name: "Shop Khata Scanner & OCR",
    banglaName: "দোকানের বাকি খাতা স্ক্যানার ও এক্সেল",
    href: "/tools/khata-scanner",
    category: "business",
    icon: "📖",
    isNew: false,
    isPopular: true,
    description: "হাতে লেখা বাকি খাতা স্ক্যান করে ১ ক্লিকে এক্সেল ও সিএসভি শিট।",
  },
  {
    name: "Invoice & Cash Memo Maker",
    banglaName: "ইনভয়েস ও থার্মাল ক্যাশ মেমো মেকার",
    href: "/tools/invoice-maker",
    category: "business",
    icon: "🧾",
    isNew: false,
    isPopular: true,
    description: "৫৮ ও ৮০ মিমি থার্মাল প্রিন্ট এবং এ৪ সাইজ প্রফেশনাল ক্যাশ মেমো।",
  },
  {
    name: "Barcode & QR Studio for POS",
    banglaName: "বারকোড ও কিউআর জেনারেটর স্টুডিও",
    href: "/tools/barcode-studio",
    category: "business",
    icon: "🏷️",
    isNew: false,
    isPopular: true,
    description: "EAN-13, Code-128 বারকোড স্টিকার প্রিন্ট শিট ও বিকাশ কিউআর।",
  },
  {
    name: "PDF Toolkit (Merge, Split, Protect)",
    banglaName: "পিডিএফ মার্জ, স্প্লিট ও পাসওয়ার্ড প্রটেক্ট",
    href: "/tools/pdf-toolkit",
    category: "everyday",
    icon: "📑",
    isNew: false,
    isPopular: true,
    description: "একাধিক পিডিএফ ফাইল জোড়া লাগানো, পেজ আলাদা করা ও সাইজ কমানো।",
  },
  {
    name: "F-Commerce Quick Reply Hub",
    banglaName: "এফ-কমার্স কুইক রিপ্লাই ও হোয়াটসঅ্যাপ",
    href: "/tools/quick-reply-hub",
    category: "business",
    icon: "💬",
    isNew: false,
    isPopular: false,
    description: "৩৬+ টি রেডি বাংলা ডেলিভারি ও বাকি রিমাইন্ডার মেসেজ ও ডিরেক্ট wa.me।",
  },
  {
    name: "Spreadsheet Grid & Financial Book",
    banglaName: "স্প্রেডশিট গ্রিড ও হিসাবের খাতা",
    href: "/tools/spreadsheet-grid",
    category: "business",
    icon: "📊",
    isNew: false,
    isPopular: false,
    description: "ব্রাউজারেই এক্সেল ফর্মুলা গ্রিড এবং ইনস্ট্যান্ট বার/পাই চার্ট।",
  },
  {
    name: "Slide Deck Presentation Presenter",
    banglaName: "স্লাইড ডেক প্রেজেন্টেশন মেকার",
    href: "/tools/slide-deck",
    category: "media",
    icon: "📽️",
    isNew: false,
    isPopular: false,
    description: "নোটস ও প্রম্পট থেকে ১০-স্লাইডের প্রফেশনাল প্রেজেন্টেশন তৈরি।",
  },
  {
    name: "Screen Recorder & WebCam PiP",
    banglaName: "স্ক্রিন রেকর্ডার ও টেলিপ্রম্পটার",
    href: "/tools/screen-recorder",
    category: "media",
    icon: "🎥",
    isNew: false,
    isPopular: false,
    description: "স্ক্রিন ও গোল ওয়েবক্যাম PiP রেকর্ড ও অডিও সাউন্ড বুস্ট।",
  },
  {
    name: "Audio Editor & Noise Reducer DAW",
    banglaName: "অডিও এডিটর ও নয়েজ রিমুভার",
    href: "/tools/audio-editor",
    category: "media",
    icon: "🎧",
    isNew: false,
    isPopular: false,
    description: "পডকাস্ট ও ভয়েসের ব্যাকগ্রাউন্ড নয়েজ রিমুভ ও ৩-ব্যান্ড EQ।",
  },
  {
    name: "Video Clipper & Caption Burn-in",
    banglaName: "ভিডিও ক্লিপার ও থাম্বনেইল ফ্রেম গ্র্যাব",
    href: "/tools/video-clipper",
    category: "media",
    icon: "🎞️",
    isNew: false,
    isPopular: false,
    description: "ভিডিও ট্রিম, ফ্রেম গ্র্যাব ও ক্যাপশন বার্ন-ইন।",
  },

  // 3. Autonomous AI, Hacks, Architecture & Games
  {
    name: "SaaS User Workspace & Dashboard",
    banglaName: "ইউজার ড্যাশবোর্ড ও জব ট্র্যাকার",
    href: "/dashboard",
    category: "autonomous",
    icon: "⚡",
    isNew: true,
    description: "১৫টি ইনপুট-টু-অ্যাকশন এজেন্ট জব ট্র্যাকিং, ভিজ্যুয়াল শেয়ার ও ক্যারিয়ার পাসপোর্ট।",
  },
  {
    name: "30 Autonomous AI Agents Hub",
    banglaName: "৩০টি অটোনোমাস এআই এজেন্ট হাব",
    href: "/agents",
    category: "autonomous",
    icon: "🤖",
    isPopular: true,
    description: "১৫টি ওয়ার্কার এজেন্ট ও ১৫টি ক্লাউড ক্রন বট—সম্পূর্ণ ফ্রি।",
  },
  {
    name: "8 Multi-Agent Swarms Studio",
    banglaName: "৮টি মাল্টি-এজেন্ট সোয়ার্ম পাইপলাইন",
    href: "/agents#swarms",
    category: "autonomous",
    icon: "🐝",
    isNew: true,
    description: "একাধিক এআই এজেন্টের সমবেত টিমওয়ার্ক পাইপলাইন।",
  },
  {
    name: "40 Everyday Software & Linux Hacks",
    banglaName: "৪০টি প্রাত্যহিক সফটওয়্যার ও লিনাক্স হ্যাকস",
    href: "/hacks",
    category: "devops",
    icon: "⚡",
    isPopular: true,
    description: "প্রমাণিত ও কপি-পেস্ট রেডি CLI, ডকার, টার্মিনাল ও এসকিউএল হ্যাকস।",
  },
  {
    name: "Autonomous OS Brain & Evolution Center",
    banglaName: "অটোনোমাস ওএস ব্রেন ও সেলফ-আপডেট ড্যাশবোর্ড",
    href: "/os-brain",
    category: "autonomous",
    icon: "🧠",
    isNew: true,
    description: "সিস্টেমের লাইভ হেলথ, মেমোরি, ক্রন শিডিউলার ও এসইও কিওয়ার্ড র‍্যাঙ্কিং।",
  },
  {
    name: "Aiyaar Retail Architecture & Decision Log",
    banglaName: "আইয়ার রিটেল আর্কিটেকচার ও সিফিএম ডিসিশন লগ",
    href: "/aiyaar",
    category: "business",
    icon: "🏢",
    isPopular: true,
    description: "ফার্মেসি FEFO, ক্লাউড পিওএস ও ২২-ইন্ডাস্ট্রি সিমুলেটর।",
  },
  {
    name: "DevOps & SQL Arcade (6 Games)",
    banglaName: "ডেভঅপস ও এসকিউএল আর্কেড গেমস (৬টি)",
    href: "/games",
    category: "autonomous",
    icon: "🎮",
    isPopular: true,
    description: "এসকিউএল ডিটেকটিভ, কার্নেল বিচ, প্যাকেট ডিফেন্ডার ও সাবনেট ব্লিৎজ।",
  },
  {
    name: "Global Leaderboard & XP Points",
    banglaName: "গ্লোবাল লিডারবোর্ড ও মেম্বার পয়েন্ট র‍্যাঙ্কিং",
    href: "/leaderboard",
    category: "autonomous",
    icon: "🏆",
    isPopular: true,
    description: "টুল এক্সপোর্ট ও গেম জয়ের জন্য অর্জিত এক্সপি র‍্যাংক ও ব্যাজ।",
  },
];

export function OSAppLauncherDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setMounted(true);
    const handleOpenDrawer = () => setIsOpen(true);
    window.addEventListener("sabbir_os_open_app_drawer", handleOpenDrawer);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("sabbir_os_open_app_drawer", handleOpenDrawer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    sound.modalOpen();
    setIsOpen(true);
  };

  const handleClose = () => {
    sound.click();
    setIsOpen(false);
  };

  const filteredApps = OS_DRAWER_APPS.filter((app) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.banglaName.includes(searchQuery) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === "all") return true;
    if (activeCategory === "popular") return app.isPopular;
    if (activeCategory === "new") return app.isNew;
    return app.category === activeCategory;
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-surface hover:bg-muted text-ink text-xs font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Open Categorized OS App Drawer (Ctrl/⌘ + M)"
        aria-label="Open All OS Apps Drawer"
      >
        <Grid className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">All Apps</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none">
          56
        </span>
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            onClick={handleClose}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-surface border border-line rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.85)] animate-in zoom-in-95 duration-200 text-ink overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="THE SABBiR OS App Launcher"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-line bg-surface/90 backdrop-blur-md shrink-0 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
                      🧭
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-ink drop-shadow-xs">
                          THE SABBiR OS — অ্যাপ ও স্টুডিও ডিরেক্টরি
                        </h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                          ৫৬টি টুল ও হাব
                        </span>
                      </div>
                      <p className="text-xs text-ink-3 mt-0.5">
                        প্রাত্যহিক পরিবার, ব্যবসা, শিক্ষা, ক্রিয়েটর ও ডেভঅপস স্টুডিওর পূর্ণাঙ্গ ক্যাটালগ
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-xl text-ink-3 hover:text-ink hover:bg-muted transition-colors shadow-xs"
                    aria-label="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar & Category Filter Strip */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-ink-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="টুল বা কাজের নাম খুঁজুন (যেমন: এনআইডি, ফটো সাইজার, ভ্যাট, বয়স, বিদ্যুৎ)..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-surface-well text-sm text-ink focus:border-primary focus:outline-none placeholder:text-ink-3/70"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-xs text-ink-3 hover:text-ink"
                      >
                        মুছুন
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
                    <button
                      onClick={() => {
                        sound.click();
                        setActiveCategory("all");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === "all"
                          ? "bg-primary text-on-primary shadow-xs"
                          : "border border-line bg-surface text-ink-3 hover:text-ink"
                      }`}
                    >
                      সব ({OS_DRAWER_APPS.length})
                    </button>
                    {OS_DRAWER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          sound.click();
                          setActiveCategory(cat.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          activeCategory === cat.id
                            ? "bg-primary text-on-primary shadow-xs"
                            : "border border-line bg-surface text-ink-3 hover:text-ink"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid of Apps */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-line scrollbar-track-surface bg-surface-well/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      onClick={handleClose}
                      className="p-4 rounded-2xl border border-line bg-surface hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl p-2 rounded-xl bg-surface-well border border-line/60 inline-flex items-center justify-center">
                            {app.icon}
                          </span>
                          <div className="flex items-center gap-1">
                            {app.isNew && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/20">
                                NEW
                              </span>
                            )}
                            {app.isPopular && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold border border-amber-500/20">
                                POPULAR
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-ink group-hover:text-primary transition-colors flex items-center justify-between">
                            <span>{app.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                          </h4>
                          <div className="text-xs font-medium text-emerald-500 mt-0.5">
                            {app.banglaName}
                          </div>
                        </div>

                        <p className="text-xs text-ink-3 line-clamp-2 leading-relaxed">
                          {app.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-line/40 flex items-center justify-between text-[11px] font-mono text-ink-3">
                        <span className="text-primary font-semibold">স্টুডিও খুলুন ➔</span>
                        <span>100% Free · Client-Side</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredApps.length === 0 && (
                  <div className="text-center py-12 space-y-2">
                    <p className="text-sm font-semibold text-ink">কোনো টুল খুঁজে পাওয়া যায়নি</p>
                    <p className="text-xs text-ink-3">অন্য কোনো কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-line bg-surface/95 shrink-0 flex items-center justify-between text-xs text-ink-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>সকল টুল ১০০% ক্লায়েন্ট-সাইডে ব্রাউজারে চলে · কোনো ফাইল আপলোড হয় না</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
                  <span>কীবোর্ড শর্টকাট:</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-well font-bold">
                    ⌘ + M
                  </kbd>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
