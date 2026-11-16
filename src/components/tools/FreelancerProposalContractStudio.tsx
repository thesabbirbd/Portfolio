"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  FileText,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Download,
  Copy,
  Check,
  DollarSign,
  User,
} from "lucide-react";
import { sound } from "@/lib/sound";

export function FreelancerProposalContractStudio() {
  const [docType, setDocType] = useState<"proposal" | "contract">("contract");
  const [freelancerName, setFreelancerName] = useState("Md Sabbirul Islam Khan");
  const [clientName, setClientName] = useState("Amanullah Enterprise");
  const [projectTitle, setProjectTitle] = useState("Next.js 16 Web Application & Admin Dashboard");
  const [totalFee, setTotalFee] = useState("৳ 45,000 / $400");
  const [advancePercent, setAdvancePercent] = useState("50%");
  const [timelineDays, setTimelineDays] = useState("14 Business Days");
  const [revisionCount, setRevisionCount] = useState("2 Rounds of Revisions");
  const [deliverables, setDeliverables] = useState(
    "1. Responsive Frontend UI with Tailwind CSS\n2. Secure Auth & PostgreSQL Integration\n3. REST API Routes & Deployment on Vercel"
  );
  const [copied, setCopied] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.copy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    sound.click();
    setFreelancerName("Md Sabbirul Islam Khan");
    setClientName("Apex Digital Agency");
    setProjectTitle("Full-Stack E-Commerce Platform with bKash Gateway");
    setTotalFee("৳ 60,000");
    setAdvancePercent("50%");
    setTimelineDays("21 Days");
    setRevisionCount("3 Rounds");
    setDeliverables(
      "1. Product Catalog & Cart Checkout\n2. bKash / Nagad Payment Gateway Integration\n3. Admin Order Management Panel & SMS Notification"
    );
  };

  const exportPayload = {
    docType,
    freelancerName,
    clientName,
    projectTitle,
    totalFee,
    advancePercent,
    timelineDays,
    revisionCount,
    deliverables,
    generatedAt: new Date().toISOString(),
  };

  return (
    <StudioWorkspaceShell
      toolSlug="freelancer-proposal-contract"
      toolTitle="Freelancer Proposal & Bilingual Service Contract"
      category="Career & Gov"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Document", value: docType.toUpperCase() },
        { label: "Client", value: clientName.slice(0, 18) },
        { label: "Fee", value: totalFee },
        { label: "Advance", value: `${advancePercent} Protected` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setDocType("contract")}
              className={`py-2 text-xs font-semibold rounded-lg ${
                docType === "contract" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              দ্বিভাষিক সার্ভিস চুক্তি (Contract)
            </button>
            <button
              onClick={() => setDocType("proposal")}
              className={`py-2 text-xs font-semibold rounded-lg ${
                docType === "proposal" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              Upwork/Fiverr বিড প্রপোজাল
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">ফ্রিল্যান্সার / এজেন্সির নাম</label>
              <input
                type="text"
                value={freelancerName}
                onChange={(e) => setFreelancerName(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">ক্লায়েন্ট / কোম্পানির নাম</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">প্রজেক্টের নাম ও টাইটেল</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">মোট ফি / বাজেট</label>
              <input
                type="text"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-400 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">অগ্রিম জমা</label>
              <input
                type="text"
                value={advancePercent}
                onChange={(e) => setAdvancePercent(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-emerald-400 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">সময়সীমা</label>
              <input
                type="text"
                value={timelineDays}
                onChange={(e) => setTimelineDays(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">মূল ডেলিভারেবলস (Scope of Work)</label>
            <textarea
              rows={3}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          <div className="rounded-3xl border-2 border-neutral-700 bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                  {docType === "contract" ? "LEGAL SERVICE AGREEMENT // সেবামূলক চুক্তিপত্র" : "HIGH-CONVERTING CLIENT PROPOSAL"}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{projectTitle}</h3>
                <p className="text-xs text-neutral-400">
                  পক্ষসমূহ: <strong className="text-white">{freelancerName}</strong> ও <strong className="text-white">{clientName}</strong>
                </p>
              </div>
              <button
                onClick={() => handleCopyText(`${projectTitle}\nFee: ${totalFee}\nScope:\n${deliverables}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "কপি হয়েছে!" : "কপি টেক্সট"}</span>
              </button>
            </div>

            {/* Clauses */}
            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-400 font-mono text-[11px]">১. কাজের পরিধি (Scope of Work):</span>
                <pre className="font-mono text-[11px] text-neutral-300 whitespace-pre-wrap mt-1">{deliverables}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <span className="font-bold text-emerald-400 font-mono text-[11px]">২. পারিশ্রমিক ও পেমেন্ট শর্ত (Payment Terms):</span>
                <p>
                  মোট নির্ধারিত পারিশ্রমিক <strong>{totalFee}</strong>। কাজ শুরুর পূর্বে <strong>{advancePercent}</strong> অগ্রিম পরিশোধ করতে হবে এবং অবশিষ্ট ৫০% কাজ সম্পন্ন হওয়ার পর কোড/অ্যাসেট হ্যান্ডওভারের সময় পরিশোধযোগ্য।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <span className="font-bold text-sky-400 font-mono text-[11px]">৩. সংশোধন ও রিভিশন সীমাবদ্ধতা (Revision Limit):</span>
                <p>
                  প্রজেক্টে সর্বোচ্চ <strong>{revisionCount}</strong> রিভিশন অন্তর্ভুক্ত থাকবে। অতিরিক্ত পরিমার্জন বা নতুন ফিচার যোগ করার ক্ষেত্রে ঘণ্টাভিত্তিক বা নতুন বাজেটে কাজ সম্পাদিত হবে।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <span className="font-bold text-purple-400 font-mono text-[11px]">৪. মেধাস্বত্ব হস্তান্তর (Intellectual Property):</span>
                <p>
                  সম্পূর্ণ ফি পরিশোধের পর ক্লায়েন্ট তৈরিকৃত সফটওয়্যার/ডিজাইন কোডের ১০০% কপিরাইট ও মালিকানা লাভ করবেন।
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 gap-8 text-xs font-mono text-neutral-400">
              <div className="text-center space-y-2">
                <div className="border-b border-neutral-700 w-36 mx-auto pt-8" />
                <span>ফ্রিল্যান্সার / ডেভেলপার স্বাক্ষর</span>
              </div>
              <div className="text-center space-y-2">
                <div className="border-b border-neutral-700 w-36 mx-auto pt-8" />
                <span>ক্লায়েন্ট / নিয়োগকর্তার স্বাক্ষর</span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
