"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X, CheckCircle2, ArrowRight, Languages, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

interface BanglaGuideContent {
  title: string;
  badge: string;
  subtitle: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  footerTip: string;
}

const GUIDES: Record<string, BanglaGuideContent> = {
  aiyaar: {
    badge: "আইয়ার বিজনেস গাইড",
    title: "আইয়ার (Aiyaar) কী এবং কীভাবে এটি দোকানের জটিলতা দূর করে?",
    subtitle: "বাংলাদেশের রিটেল ফার্মেসি, মুদি এবং মাঝারি ব্যবসার জন্য তৈরি অল-ইন-ওয়ান ক্লাউড ও অফলাইন প্ল্যাটফর্ম।",
    sections: [
      {
        heading: "১. কাউন্টারে দ্রুত বিক্রি ও ক্যাশ মেমো (POS)",
        points: [
          "বারকোড স্ক্যানার বা মোবাইল ক্যামেরা দিয়ে ১ সেকেন্ডে প্রোডাক্ট স্ক্যান।",
          "নগদ, বিকাশ, নগদ বা কার্ডে বিল স্প্লিট করে নেওয়ার সুবিধা।",
          "৫৮ মিমি বা ৮০ মিমি থার্মাল প্রিন্টারে কম্পিউটার ছাড়াই সরাসরি দ্রুত মেমো প্রিন্ট।",
        ],
      },
      {
        heading: "২. ফার্মেসির জন্য ওষুধের মেয়াদ (FEFO) ট্র্যাকিং",
        points: [
          "নতুন ওষুধ আসার পরেও যে ওষুধের মেয়াদ আগে শেষ হবে সেটি আগে বিক্রির স্বয়ংক্রিয় সংকেত (FEFO)।",
          "মেয়াদ শেষ হওয়ার ৬০ ও ৩০ দিন আগে অ্যাম্বার ওয়ার্নিং সংকেত।",
        ],
      },
      {
        heading: "৩. ডিজিটাল বাকি খাতা ও ফ্রি হোয়াটসঅ্যাপ রিমাইন্ডার",
        points: [
          "কাগজের খাতার ঝামেলা শেষ—কাস্টমারের মোবাইল নম্বর দিয়ে বাকি এন্ট্রি।",
          "বাকি আদায়ের জন্য ১ ক্লিকে মেমোসহ ভদ্র হোয়াটসঅ্যাপ মেসেজ সেন্ড।",
        ],
      },
      {
        heading: "৪. ইন্টারনেট বা বিদ্যুৎ চলে গেলেও সম্পূর্ণ অফলাইন মোড",
        points: [
          "লোকাল ক্যাশে মেমোরি থাকায় নেট চলে গেলেও বিল কাটা বন্ধ হয় না।",
          "পরবর্তীতে নেট আসলে স্বয়ংক্রিয়ভাবে ক্লাউড ডাটাবেসের সাথে সিঙ্ক হয়ে যায়।",
        ],
      },
    ],
    footerTip: "বিস্তারিত জানতে অথবা ফ্রি ট্রায়াল শুরু করতে aiyaar.ltd ভিজিট করুন।",
  },
  tools: {
    badge: "৬৪টি সুপার-টুল ও ক্রিয়েটিভ ওয়ার্কপ্লেস স্টুডিও গাইড",
    title: "THE SABBiR ৬৪টি ওয়ার্কপ্লেস ও সুপার-টুল ব্যবহারের সহজ বাংলা নির্দেশিকা",
    subtitle: "মেস বাজার ও মিল রেট, স্কুল মার্কশিট, ডিজিটাল প্রেসক্রিপশন প্যাড, দর্জি মাপ খাতা, বিয়ের বায়োডাটা, ফ্রিল্যান্সার চুক্তি, কুরিয়ার চার্জ ও ফটো কলাজ সহ ৬৪টি প্রফেশনাল স্টুডিও—১০০% ক্লায়েন্ট-সাইড ব্রাউজারে নিরাপদ।",
    sections: [
      {
        heading: "১. নতুন ৮টি প্রাত্যহিক সুপার-স্টুডিও (#48–#55 / Total 64 Tools)",
        points: [
          "🍲 মেস বাজার ও মিল রেট স্প্লিটার (/tools/mess-bazar-splitter): ব্যাচেলর মেস মিল রেট (মোট বাজার ÷ মোট মিল), সদস্যভিত্তিক দেনা-পাওনা ও ভাউচার কার্ড।",
          "🎓 স্কুল রেজাল্ট ও আইডি কার্ড স্টুডিও (/tools/school-result-id-studio): স্বয়ংক্রিয় জিপিএ মার্কশিট, গ্রেড পয়েন্ট এবং প্রিন্টযোগ্য স্টুডেন্ট আইডি কার্ড।",
          "🩺 ডিজিটাল ডাক্তার প্রেসক্রিপশন প্যাড (/tools/prescription-health-pad): রোগীর ভাইটালস, ১+০+১ বাংলা শিডিউল ও প্রিন্টযোগ্য A4 মেডিকেল প্রেসক্রিপশন প্যাড।",
          "✂️ দর্জি মাপ খাতা ও মেমো টোকেন (/tools/tailor-boutique-memo): পাঞ্জাবি, শার্ট ও প্যান্টের বডি কাটিং ইঞ্চি এবং কাস্টমার অর্ডার টোকেন।",
          "💍 বাংলা ও ইসলামিক বিয়ের বায়োডাটা (/tools/marriage-biodata-maker): দ্বীনি ও পারিবারিক তথ্যাবলি সংবলিত মার্জিত বায়োডাটা এবং কার্ড এক্সপোর্ট।",
          "📄 ফ্রিল্যান্সার প্রপোজাল ও সার্ভিস চুক্তি (/tools/freelancer-proposal-contract): আপওয়ার্ক/ফাইভার বিড ও ৫০% অগ্রিম সুরক্ষা ক্লজযুক্ত দ্বিভাষিক চুক্তিপত্র।",
          "🚚 কুরিয়ার চার্জ ও জরুরি হটলাইন হাব (/tools/bd-emergency-courier-tracker): স্টিডফাস্ট, পাঠাও ও রেডএক্স চার্জ তুলনা, ৬৪ জেলার পোস্টকোড ও ৯৯৯ হটলাইন।",
          "🖼️ মাল্টি-ফটো কলাজ ও জাতীয় ফ্রেম স্টুডিও (/tools/photo-collage-frame-studio): ১০৮০x১০৮০ স্কয়ার গ্রিড কলাজ এবং বিজয় দিবস ও বৈশাখী প্রোফাইল ফ্রেম।",
          "🔄 মাল্টি-ফরম্যাট ইমেজ কনভার্টার (/tools/image-format-converter): PNG, JPG, WebP, AVIF, ICO ব্যাচ কনভার্টার ও EXIF GPS স্ট্রিপার।",
        ],
      },
      {
        heading: "১. নতুন ১২টি প্রাত্যহিক সুপার-স্টুডিও (Studios #35–#46)",
        points: [
          "🇧🇩 বিজয় ও ইউনিকোড কনভার্টার (/tools/bangla-converter): সুতন্বীএমজে ও ইউনিকোড উভমুখী নির্ভুল রূপান্তর এবং ব্যাংক, চাকরি ও জিডি ফরমের ১২টি রেডি দরখাস্ত।",
          "💊 প্রেসক্রিপশন ডোজ ও রিফিল চার্ট (/tools/medicine-scheduler): ডাক্তারের 1+0+1 সংকেত থেকে ওয়াল-পোস্টার চার্ট, ওষুধের রিফিল ও খরচের হিসাব এবং মোবাইল ক্যালেন্ডার অ্যালার্ম (.ics)।",
          "🎓 এসএসসি, এইচএসসি ও বিশ্ববিদ্যালয় সিজিপিএ (/tools/cgpa-calculator): শিক্ষাবোর্ডের ৪র্থ বিষয়ের বোনাস পয়েন্ট হিসাব, গোল্ডেন A+ ভেরিফিকেশন, ইউজিসি ৪.০০ স্কেল সিজিপিএ এবং কাঙ্ক্ষিত সিজিপিএ অর্জনের রিভার্স প্রেডিক্টর।",
          "🕌 ফ্যামিলি বাজেট ও ইসলামিক যাকাত (/tools/family-budget-zakat): ৫০/৩০/২০ পারিবারিক বাজেট ট্র্যাকিং, ব্যাংক ডিপিএস/এফডিআর ১০%/১৫% কর কর্তন এবং বাজুস স্বর্ণ (৭.৫ ভরি) ও রূপা (৫২.৫ ভরি) নেসাব অনুযায়ী ২.৫% বিশুদ্ধ যাকাত হিসাব।",
          "⚡ বিদ্যুৎ বিল (LT-A) ও সোলার সাইজার (/tools/electricity-solar-calculator): বিইআরসি আবাসিক স্টেপ-ট্যারিফ বিল ও লোডশেডিংয়ের জন্য আইপিএস ভিএ ও ব্যাটারি Ah সাইজার।",
          "🏠 বাড়ি ভাড়ার রশিদ ও টু-লেট পোস্টার (/tools/house-rent-studio): মালিক ও ভাড়াটিয়ার দ্বৈত কপি রশিদ, কথায় টাকার পরিমাণ ও হোয়াটসঅ্যাপ কিউআর যুক্ত A4 টু-লেট পোস্টার।",
          "❤️ চাকরির বয়স ও জরুরি স্বাস্থ্য আইডি (/tools/age-health-card): সরকারি চাকরির বয়সসীমা (৩২ বছর) কাটঅফ চেক, বিএমআই ডায়েট এবং মানিব্যাগ-সাইজ এমার্জেন্সি হেলথ কার্ড।",
          "🍛 দাওয়াতি ক্যাটারিং ও পিকনিক চাঁদা (/tools/event-dawat-planner): কাচ্চি/পোলাও বিরিয়ানির পার-হেড কেজি/লিটার উপাদান হিসাব এবং বন্ধুদের সমবন্টন চাঁদা স্প্লিট।",
          "📑 বিডি আয়কর ও সঞ্চয়পত্র মুনাফা (/tools/tax-sanchaypatra-emi): ২০২৫-২৬ কর ধাপ অনুযায়ী আয়কর, সঞ্চয়পত্রের নিট মাসিক মুনাফা এবং ব্যাংকের ঋণ কিস্তি (EMI) শিডিউল।",
          "✍️ সোশ্যাল বোল্ড টেক্সট স্টাইলার (/tools/social-text-styler): ফেসবুক ও লিঙ্কডইনে বোল্ড, কার্সিভ ইউনিকোড ফন্ট এবং ২০+ ভাইরাল এনগেজমেন্ট হুক জেনারেটর।",
          "🔐 পাসওয়ার্ড ভল্ট ও হ্যাশ স্টুডিও (/tools/password-vault-hash): জিরো-নলেজ AES-256-GCM নোট এনক্রিপশন, ডাইসওয়্যার পাসফ্রেজ ও SHA-256 চেকসাম।",
          "🧩 এমবেড উইজেট স্টুডিও (/tools/embed-widget-studio): যেকোনো ওয়েবসাইট বা ব্লগে সাব্বির ওএস ক্যালকুলেটর সরাসরি এমবেড করার আইফ্রেম ও কোড বিল্ডার।",
          "🪪 এনআইডি ও স্মার্ট কার্ড ২-পার্শ্ব A4 প্রিন্ট (/tools/id-card-stitcher): জাতীয় পরিচয়পত্র ও ড্রাইভিং লাইসেন্স এক পৃষ্ঠায় সাজিয়ে অপব্যবহার রোধে সুরক্ষা জলছাপ যুক্ত করা।",
        ],
      },
      {
        heading: "২. পূর্ববর্তী ৮টি হাই-ডিমান্ড স্টুডিও (Studios #27–#34)",
        points: [
          "📸 বিসিএস ও সরকারি চাকরি ফটো সাইজার (/tools/gov-photo-sizer): বিসিএস ও টেলিটক ৩০০x৩০০ (<১০০KB) ছবি, ৩০০x৮০ (<৬০KB) স্বাক্ষর, ই-পাসপোর্ট ও ভিসা ফটো ক্রপ ও ৪R ৮-ছবির প্রিন্ট শিট।",
          "💵 রেমিট্যান্স ও ২.৫% প্রণোদনা (/tools/remittance-calculator): পেওনিয়ার, ওয়াইজ, আপওয়ার্ক থেকে বাংলাদেশ ব্যাংক ২.৫% নগদ প্রণোদনা বনাম বিকাশ/নগদ রেট তুলনা ও সামারি শিট।",
          "📐 জমি ও বাজুস সোনা পরিমাপক (/tools/unit-land-converter): শতক/ডেসিমেল, কাঠা, বিঘা, একর জমি হিসাব ও বাজুস স্ট্যান্ডার্ড ভরি, আনা, রতি সোনার দাম ও ৫% ভ্যাট ক্যালকুলেটর।",
          "📄 ডকুমেন্ট স্ক্যানার ও শ্যাডো রিমুভার (/tools/document-scanner): মোবাইলের ক্যামেরায় তোলা দলিলের ছায়া দূরীকরণ (Shadow Removal) ও পার্সপেক্টিভ সোজা করে ফটোকপি পিডিএফ।",
          "⌨️ টাইপিং স্পিড এরিনা (/tools/typing-speed-arena): বাংলা ইউনিকোড, ইংরেজি, কোড ও লিনাক্স সিএলআই টাইপিং টেস্ট, লাইভ WPM চার্ট ও ভেরিফায়েড সার্টিফিকেট পিএনজি।",
          "🎨 কালার ডিজাইন ল্যাব (/tools/color-design-lab): টেইলউইন্ড v4 ৫০-৯৫০ কালার প্যালেট, লাইভ WCAG 2.1 AA/AAA কন্ট্রাস্ট অডিট ও ফ্রস্টেড গ্লাস সিএসএস জেনারেটর।",
          "✉️ এক্সিকিউটিভ ইমেইল সিগনেচার (/tools/email-signature): জিমেইল ও আউটলুকের জন্য রেস্পন্সিভ টেবিল সিগনেচার, সোশ্যাল ব্যাজ ও ১-ক্লিক রিচ-টেক্সট কপি।",
          "💬 এফ-কমার্স কুইক রিপ্লাই হাব (/tools/quick-reply-hub): ৩৬+ টি বাংলা ও ব্যাংলিশ ডেলিভারি, বিকাশ পেমেন্ট ও বাকি রিমাইন্ডার ম্যাক্রো ও wa.me ডিরেক্ট লঞ্চার।",
        ],
      },
      {
        heading: "২. ৮টি ক্রিয়েটিভ ও অফিস স্টুডিও (Studios #19–#26)",
        points: [
          "🎨 ইমেজ এডিটর (/tools/image-editor): ফটোশপ ছাড়াই ব্রাউজারে ক্রপ, রোটেট, ১২টি LUT সিনেমাটিক কালার ফিল্টার, ফ্রিহ্যান্ড ব্রাশ ও টেক্সট লেয়ার।",
          "📱 স্টোরি ও ব্যানার মেকার (/tools/story-maker): ইনস্টাগ্রাম/এফবি স্টোরি (1080x1920) ও লিঙ্কডইন ক্যারোসেল টেমপ্লেট ও ১-ক্লিক এইচডি এক্সপোর্ট।",
          "🎧 অডিও এডিটর DAW (/tools/audio-editor): পডকাস্টের ব্যাকগ্রাউন্ড নয়েজ রিমুভ, 3-Band EQ, ভয়েস বুস্ট ও নিখুঁত WAV ট্রিম।",
          "🎞️ ভিডিও ক্লিপার (/tools/video-clipper): ভিডিও ট্রিম, এইচডি থাম্বনেইল ফ্রেম গ্র্যাব ও ক্যাপশন বার্ন-ইন।",
          "📊 স্প্রেডশিট গ্রিড (/tools/spreadsheet-grid): দোকান ক্যাশ ও বাকি খাতা, বেতন শিট ও ফর্মুলা গ্রিড (=SUM, =AVERAGE) থেকে ইনস্ট্যান্ট বার/পাই চার্ট।",
          "📽️ স্লাইড ডেক প্রেজেন্টার (/tools/slide-deck): নোটস ও প্রম্পট থেকে ১০-স্লাইডের প্রফেশনাল প্রেজেন্টেশন ও ক্যারোসেল স্লাইড তৈরি।",
          "🎥 স্ক্রিন রেকর্ডার স্টুডিও (/tools/screen-recorder): কোনো সফটওয়্যার ছাড়া স্ক্রিন + গোল ওয়েবক্যাম PiP + মাইক অডিও রেকর্ড ও টেলিপ্রম্পটার।",
          "🪪 কিউআর ভিজিটিং কার্ড ও স্ট্যান্ডি (/tools/qr-link-bio): বিকাশ/নগদ পেমেন্ট স্ট্যান্ডি ও ১-ক্লিকে মোবাইলে সেভ করার .vcf ডিজিটাল ভিজিটিং কার্ড।",
        ],
      },
      {
        heading: "৩. এক্সপোর্ট অথ গেট ও ২৪-ঘণ্টার শেয়ার লিংক (Export Gate & 24h Share)",
        points: [
          "⚡ Continue as Guest: নাম লিখে ক্লিক করলেই মুহূর্তের মধ্যে ফাইল ডাউনলোড এবং সাথে সাথে +25 XP লিডারবোর্ডে যুক্ত হবে।",
          "🚀 Sign Up Workspace: ফ্রি সাইন আপে ক্লাউড ব্যাকআপ হিস্ট্রি এবং প্রতিটি এক্সপোর্টে 2x ডাবল XP (+50 XP)।",
          "🔗 ২৪-ঘণ্টার শেয়ার লিংক (/s/[token]): কাজের ফাইল বা স্ন্যাপশট বন্ধুদের সাথে শেয়ার করুন, ২৪ ঘণ্টা পর এটি স্বয়ংক্রিয়ভাবে মুছে যাবে।",
        ],
      },
      {
        heading: "৪. গ্লোবাল লিডারবোর্ড ও মেম্বার পয়েন্ট সিস্টেম (/leaderboard)",
        points: [
          "প্রতিটি টুল এক্সপোর্ট ও গেম জয়ের জন্য লিডারবোর্ডে পয়েন্ট (XP) অর্জিত হয় এবং মেম্বার র‍্যাংকিং বাড়ে।",
          "Novice থেকে শুরু করে Kernel Legend পর্যন্ত ব্যাজ ও বিশেষ প্রিভিলেজ আনলক হয়।",
        ],
      },
      {
        heading: "৫. অরিজিনাল কাটআউট, ডকুমেন্ট ও এপিআই সুপার-টুলস (Tools 01–18)",
        points: [
          "রিমুভ বিজি, বারকোড স্টুডিও, চেক অডিটর, দারাজ এসইও, এসএমএস ক্যাম্পেইন, সিভি প্রাইভেসি শিল্ড, পিডিএফ টুলকিট ও লোড সিমুলেটর।",
        ],
      },
    ],
    footerTip: "কোনো টুল ব্যবহারে ইন্টারনেট খরচ ছাড়া কোনো ক্রেডিট বা এপিআই কি প্রয়োজন নেই।",
  },
  workplace: {
    badge: "SaaS ওয়ার্কপ্লেস ও সিকিউরিটি শিল্ড",
    title: "THE SABBiR OS SaaS ওয়ার্কপ্লেস ও এন্টারপ্রাইজ ফায়ারওয়াল গাইড",
    subtitle: "ডাউনলোড অথ গেট, ২৪-ঘণ্টা শেয়ারিং, গ্লোবাল লিডারবোর্ড এবং WAF DDoS/SQLi প্রতিরক্ষা সিস্টেম।",
    sections: [
      {
        heading: "১. রিয়েল-টাইম ২৪-ঘণ্টার শেয়ারিং আর্কিটেকচার (/s/[token])",
        points: [
          "যেকোনো স্টুডিও থেকে আউটপুট ১-ক্লিকে ২৪ ঘণ্টার জন্য শেয়ার লিংক তৈরি করা যায়।",
          "পাসকোড/পিন লক এবং লাইভ কাউন্টডাউন টাইমার থাকে। ২৪ ঘণ্টা পর স্বয়ংক্রিয়ভাবে পার্জ হয়ে যায়।",
        ],
      },
      {
        heading: "২. WAF & DDoS টোকেন বাকেট রেট লিমিটার",
        points: [
          "প্রতি মিনিটে মাত্রাতিরিক্ত ট্রাফিক বা বট রিকোয়েস্টকে স্বয়ংক্রিয়ভাবে ব্লক করে HTTP 429 থ্রোটল করে।",
          "AST ফায়ারওয়াল ক্ষতিকর SQL Injection এবং XSS স্ক্রিপ্ট শনাক্ত করে ব্যান করে।",
        ],
      },
      {
        heading: "৩. সুপারঅ্যাডমিন কন্ট্রোল সেন্টার (/superadmin)",
        points: [
          "মাস্টার পাসকোড সুরক্ষিত প্যানেলে বসে ৩৫টি টুলের পারমিশন মোড লাইভ পরিবর্তন ও ডাটাবেস ব্যাকআপ নেওয়া যায়।",
        ],
      },
    ],
    footerTip: "সম্পূর্ণ সার্ভারলেস ও জিরো-কস্ট আর্কিটেকচার যা আজীবন ফ্রিতে চলে।",
  },
  agents: {
    badge: "১২টি অটোনোমাস এজেন্ট ও ৪টি মাল্টি-এজেন্ট সোয়ার্ম গাইড",
    title: "THE SABBiR ১২টি অটোনোমাস এজেন্ট ও ৪টি মাল্টি-এজেন্ট সোয়ার্ম কীভাবে কাজ করে?",
    subtitle: "লোকাল-ফার্স্ট এবং ক্লাউড-ইন্ডিপেনডেন্ট আর্কিটেকচার যা কোনো পেইড এপিআই ছাড়াই নিখুঁত কাজ সম্পন্ন করে।",
    sections: [
      {
        heading: "১. ৪টি মাল্টি-এজেন্ট সোয়ার্ম পাইপলাইন (Multi-Agent Swarms)",
        points: [
          "E-Commerce Product Launch: PixelForge -> CatalogRanker -> BizDesk BD (ইমেজ, দারাজ কপি ও বারকোড রেডি)।",
          "Daily Shop Closing: KhataVision -> ChequeGuard -> PrivacyShield (খাতার হিসাব, টাকা কথায় ও অডিট রিপোর্ট)।",
          "Production DevOps Release: SchemaPilot -> SecOps Guardian -> NetworkDoctor (স্কিমা অডিট, ডকার হার্ডেন ও ফায়ারওয়াল)।",
          "Creator Viral Episode: VoiceScribe -> ViralDirector -> CatalogRanker (ভয়েস নোটস থেকে ৬০s স্ক্রিপ্ট ও হ্যাশট্যাগ)।",
        ],
      },
      {
        heading: "২. নতুন ৪টি বিশেষজ্ঞ ডোমেইন এজেন্ট (Agents 09–12)",
        points: [
          "CatalogRanker Agent: দারাজ এসইও ক্যাটালগ ও সোশ্যাল অ্যাড কপি বিশেষজ্ঞ।",
          "ChequeGuard Agent: বাংলাদেশি ব্যাংকিং টাকা-কথায় ও চেক গরমিল নিরসন বিশেষজ্ঞ।",
          "CareerShield Agent: রেজ্যুমে ATS অপ্টিমাইজেশন ও পাবলিক সিভি প্রাইভেসি বিশেষজ্ঞ।",
          "NetworkDoctor Agent: MikroTik ডুয়াল-WAN ফেইলওভার ও ব্যান্ডউইথ কিউ বিশেষজ্ঞ।",
        ],
      },
      {
        heading: "৩. অরিজিনাল ৮টি বিশেষজ্ঞ এজেন্ট (Agents 01–08)",
        points: [
          "PixelForge, KhataVision, PrivacyShield, VoiceScribe, BizDesk BD, ViralDirector, SecOps Guardian, SchemaPilot।",
        ],
      },
    ],
    footerTip: "এজেন্ট পেজে (/agents) গিয়ে সরাসরি যেকোনো এজেন্টের লাইভ টার্মিনাল বা স্বয়ংক্রিয় সোয়ার্ম চালিয়ে দেখতে পারেন।",
  },
  vlogs: {
    badge: "ল্যাব ভিডিও গাইড",
    title: "ভিডিও ল্যাব ও এআই প্রম্পট ব্যবহারের গাইডলাইন",
    subtitle: "স্ক্রিন-রেকর্ডেড রিয়েল ইঞ্জিনিয়ারিং সেশন এবং সাথে ব্যবহৃত প্রোডাকশন প্রম্পট ড্রয়ার।",
    sections: [
      {
        heading: "১. ভিডিও ওয়াচ ও প্ল্যাটফর্ম সুইচার",
        points: [
          "প্রতিটি ভিডিও ৪:৫ (১০৮০x১৩৫০) হাই-রেজোলিউশন ও ৬০ ফ্রেম প্রতি সেকেন্ডে তৈরি।",
          "আপনার পছন্দের প্ল্যাটফর্ম (LinkedIn, Facebook, YouTube Shorts, Instagram)-এ সরাসরি দেখতে পারবেন।",
        ],
      },
      {
        heading: "২. 'Steal the Prompt' ড্রয়ার",
        points: [
          "ভিডিওর নিচে থাকা 'Steal the Prompt' বাটনে ক্লিক করলে আসল প্রম্পট ও শেল কমান্ড পেয়ে যাবেন।",
          "১-ক্লিকে কপি করে আপনার নিজস্ব চ্যাটজিপিটি, ক্লড বা লোকাল ওলামাতে হুবহু ব্যবহার করতে পারবেন।",
        ],
      },
    ],
    footerTip: "নতুন ভিডিও প্রতি সপ্তাহে রিলিজ করা হয়। সাথে থাকুন!",
  },
  games: {
    badge: "আর্কেড গেম নির্দেশিকা",
    title: "THE SABBiR OS আর্কেড গেম ও স্কোরকার্ড ডাউনলোড গাইড",
    subtitle: "ব্রাউজারের ভেতর খেলুন ৫টি আসক্তিকর ইঞ্জিনিয়ারিং গেম এবং গেম শেষে নিজের নামে ডাউনলোড করুন ভাইরাল PNG স্কোরকার্ড!",
    sections: [
      {
        heading: "১. Kernel Breach (টার্মিনাল ও SQL CTF)",
        points: [
          "Linux systemd ফেইলিউর, ভুল CIDR রাউটিং এবং স্লো PostgreSQL কুয়েরি টার্মিনাল কমান্ড লিখে ফিক্স করুন।",
          "পরপর সঠিক কমান্ড দিলে কম্বো মাল্টিপ্লায়ার চালু হবে এবং দ্রুত শেষ করলে বোনাস পয়েন্ট পাবেন।",
        ],
      },
      {
        heading: "২. Packet Defender (NOC DDoS ফায়ারওয়াল)",
        points: [
          "৩টি লেন দিয়ে ধেয়ে আসা বৈধ ট্রাফিক সার্ভারে পাঠান (ALLOW)।",
          "ম্যালিশিয়াস Botnet DDoS ও SQLi প্যাকেটগুলোকে বাটন বা কিবোর্ড (1/2/3) দিয়ে ড্রপ (DROP) করে সার্ভার বাঁচান।",
        ],
      },
      {
        heading: "৩. ১-ক্লিকে PNG স্কোরকার্ড ডাউনলোড ও গ্লোবাল লিডারবোর্ড",
        points: [
          "গেম শেষ হওয়ার সাথে সাথে নিজের হ্যান্ডেল বা নাম লিখে 'Download PNG' বাটনে ক্লিক করলেই হাই-রেজোলিউশন ইমেজ সেভ হয়ে যাবে।",
          "'Save to Global Leaderboard' দিয়ে নিজের স্কোর গ্লোবাল র‍্যাংকিংয়ে সংরক্ষণ করুন।",
        ],
      },
    ],
    footerTip: "পয়েন্ট অর্জন করে Novice Scout থেকে S-Tier Kernel Master র‍্যাংকে উন্নীত হন!",
  },
  articles: {
    badge: "নলেজ বেস ও ওপেন-সোর্স গাইড",
    title: "ক্যাটাগরিভিত্তিক টেকনিক্যাল গাইড ও ওপেন-সোর্স আর্সেনাল",
    subtitle: "সহজ ভাষায় বেসিক গাইড থেকে শুরু করে প্রোডাকশন ব্যাকএন্ড, ডকার ও লোকাল এআই টিউটোরিয়াল।",
    sections: [
      {
        heading: "১. বেসিক থেকে অ্যাডভান্সড ক্যাটাগরি ফিল্টার",
        points: [
          "নতুনদের জন্য রয়েছে '🟢 Basic & Beginner Guides'—যেখানে টার্মিনাল নেভিগেশন, SQL ইনডেক্সিং এবং ওলামা সহজ ভাষায় বোঝানো হয়েছে।",
          "ক্যাটাগরি ট্যাব দিয়ে DevOps, Backend, Local AI ও NOC নেটওয়ার্কিং আলাদাভাবে ব্রাউজ করুন।",
        ],
      },
      {
        heading: "২. ওপেন-সোর্স টুলস ডিরেক্টরি (১-ক্লিক ইনস্টল)",
        points: [
          "THE SABBiR-এর নিজস্ব ওপেন-সোর্স প্রজেক্ট এবং সেরা কিউরেটেড স্ট্যাকগুলোর বিস্তারিত তালিকা।",
          "প্রতিটি টুলের নিচে থাকা 'Copy Command' দিয়ে সরাসরি টার্মিনালে রান করার মতো কমান্ড কপি করুন।",
        ],
      },
    ],
    footerTip: "সবগুলো আর্টিকেল কোনো সাবস্ক্রিপশন বা পে-ওয়াল ছাড়া ১০০% ফ্রি ওপেন-সোর্স নলেজ।",
  },
};

export function BanglaGuideModal({ topic = "aiyaar" }: { topic?: "aiyaar" | "tools" | "vlogs" | "games" | "articles" | "agents" | "workplace" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const guide = GUIDES[topic] ?? GUIDES.aiyaar;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sound.modalClose();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpen = () => {
    sound.modalOpen();
    setIsOpen(true);
  };

  const handleClose = () => {
    sound.modalClose();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/25 transition-all shadow-sm"
        aria-label="সহজ বাংলায় গাইড দেখুন"
      >
        <Languages className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
        <span>সহজ বাংলায় গাইড দেখুন</span>
      </button>

      {isOpen && mounted && createPortal(
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-[#0a0a0c] border border-neutral-700 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-neutral-100 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bangla-guide-title"
          >
            {/* Header - 100% Solid Opaque */}
            <div className="p-5 sm:p-6 border-b border-neutral-800 bg-[#121217] shrink-0 flex items-start justify-between gap-4">
              <div>
                <span className="inline-block text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/30 shadow-xs mb-1">
                  {guide.badge}
                </span>
                <h2 id="bangla-guide-title" className="text-xl sm:text-2xl font-bold text-white mt-2 drop-shadow-md">
                  {guide.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed font-medium drop-shadow-xs">
                  {guide.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0 shadow-xs"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Sections - 100% Solid Opaque */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 bg-[#0a0a0c] text-neutral-200 text-sm leading-relaxed">
              {guide.sections.map((sec, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-xl bg-[#131318] border border-neutral-800 shadow-lg space-y-3">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2 drop-shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sec.heading}</span>
                  </h3>
                  <div className="space-y-2">
                    {sec.points.map((pt, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-100 bg-[#1a1a22] p-3 rounded-lg border border-neutral-700/70 shadow-sm leading-relaxed"
                      >
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span className="font-medium drop-shadow-xs">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - 100% Solid Opaque */}
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#121217] shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-emerald-400 font-mono text-[11px] sm:text-xs font-semibold drop-shadow-xs">💡 {guide.footerTip}</span>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors ml-auto sm:ml-0 shadow-md"
              >
                বুঝতে পেরেছি
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
