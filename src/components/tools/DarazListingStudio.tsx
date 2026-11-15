"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  Download,
  Tag,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

export function DarazListingStudio() {
  const [productName, setProductName] = useState("Pro Bluetooth Smartwatch with Bangla Display");
  const [category, setCategory] = useState("Smartwatches & Wearable Tech");
  const [brand, setBrand] = useState("THE SABBiR Gear");
  const [regularPrice, setRegularPrice] = useState<number>(3450);
  const [salePrice, setSalePrice] = useState<number>(2290);
  const [features, setFeatures] = useState(
    "Bangla font support, IP68 Waterproof, 7-day battery backup, Heart rate & SpO2 monitor, Bluetooth call receiving"
  );
  const [warranty, setWarranty] = useState("6 Months Official Replacement Warranty");
  const [boxContent, setBoxContent] = useState("1x Smartwatch, 1x Magnetic Charging Cable, 1x User Manual, 1x Warranty Card");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Daraz SEO Title & Bullets Engine
  const darazTitle = `${brand} ${productName} - ${features.split(",")[0].trim()} | ${features.split(",")[1]?.trim() || "High Performance"} [${warranty}]`;

  const featureBullets = features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean)
    .map((f) => `• ${f}`);

  const discountPct = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  const perceivedSavings = regularPrice - salePrice;

  // 3 High-Impact FB / Social Ad Copies
  const adCopyDirect = `🔥 ধামাকা অফার! ${brand} এর প্রিমিয়াম ${productName} এখন পাচ্ছেন বিশেষ ছাড়ে!

✅ বিশেষ ফিচারসমূহ:
${featureBullets.join("\n")}

💰 রেগুলার প্রাইস: ৳${regularPrice.toLocaleString()}
⚡ অফার প্রাইস: মাত্র ৳${salePrice.toLocaleString()} (${discountPct}% ছাড় - সঞ্চয় ৳${perceivedSavings})
🛡️ ওয়ারেন্টি: ${warranty}

🚚 ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে। এখনই অর্ডার করতে সেন্ড মেসেজ দিন বা ভিজিট করুন!`;

  const adCopyProblem = `ঘড়ি কিনছেন কিন্তু বাংলায় মেসেজ দেখতে পারছেন না? 

নকল আর কমদামী গ্যাজেটের ভিড়ে বেছে নিন আসল ${brand} ${productName}! 
${features.split(",")[0]} সহ পাচ্ছেন ${warranty}। 

আজই সংগ্রহ করুন মাত্র ৳${salePrice} মূল্যে (সীমিত সময়ের ডিসকাউন্ট!)।`;

  const adCopyFomo = `⏳ স্টক সীমিত! ${discountPct}% বিশেষ ছাড় আজ রাত ১২টা পর্যন্ত!

অরিজিনাল ${productName} (Official Warranty সহ) পাচ্ছেন মাত্র ৳${salePrice}-এ।
বক্সে থাকছে: ${boxContent}।

অর্ডার কনফার্ম করতে 'Shop Now' ক্লিক করুন।`;

  const copyToClipboard = async (text: string, type: string) => {
    sound.copy();
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    osStore.addXp(15, "Copied E-Commerce Copy");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadSheet = () => {
    sound.shutter();
    osStore.addXp(30, "Exported Daraz Listing Sheet");
    osStore.incrementToolRun();

    const md = `# E-Commerce Product Listing: ${productName}
**Brand:** ${brand} | **Category:** ${category}
**Regular Price:** ৳${regularPrice} | **Sale Price:** ৳${salePrice} (${discountPct}% Off)

---
## 1. Daraz & Marketplace SEO Title
\`\`\`
${darazTitle}
\`\`\`

## 2. Key Highlights (Bullet Specifications)
${featureBullets.join("\n")}

## 3. Package & Warranty
- **Warranty:** ${warranty}
- **What's in the Box:** ${boxContent}

---
## 4. Facebook / F-Commerce Ad Copywriting
### Variant A: Direct Offer
${adCopyDirect}

### Variant B: Pain Point Solution
${adCopyProblem}

### Variant C: FOMO & Urgency
${adCopyFomo}
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daraz-listing-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Daraz &amp; F-Commerce Catalog SEO &amp; Ad Copy Optimizer
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Daraz Ranked Keywords • 5-Point Spec Engine • Pricing Psychology • 3 Facebook Ad Copies
          </p>
        </div>

        <button
          onClick={handleDownloadSheet}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Listing Pack</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Pane */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
          <span className="font-bold text-ink uppercase tracking-wider block">Product Specs &amp; Pricing</span>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Product Name</span>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Brand Name</span>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Regular MRP (BDT)</span>
              <input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink line-through opacity-70"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Offer Price (BDT)</span>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold text-rose-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Key Features (comma-separated)</span>
            <textarea
              rows={3}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-line text-ink leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Warranty Details</span>
            <input
              type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">What is in the Box?</span>
            <input
              type="text"
              value={boxContent}
              onChange={(e) => setBoxContent(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
            />
          </div>

          {/* Pricing Psychology Card */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High-Conversion Pricing Psychology
            </span>
            <p className="text-[11px] leading-relaxed">
              Customer sees <strong>{discountPct}% OFF</strong> with an instant perceived savings of{" "}
              <strong>৳{perceivedSavings.toLocaleString()}</strong>.
            </p>
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="lg:col-span-7 space-y-4 text-xs font-mono">
          {/* Daraz Title Card */}
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="font-bold text-ink uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Daraz High-Rank SEO Title
              </span>
              <button
                onClick={() => copyToClipboard(darazTitle, "title")}
                className="text-primary hover:underline flex items-center gap-1"
              >
                {copiedType === "title" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "title" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-bold text-ink leading-relaxed p-2.5 rounded-xl bg-muted/20 border border-line">
              {darazTitle}
            </p>
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-ink-3 uppercase block font-bold">5-Point Bullet Specs:</span>
              <div className="space-y-0.5 text-ink-2">
                {featureBullets.map((b, i) => (
                  <div key={i} className="leading-snug">{b}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Facebook Ad Copywriting Variants */}
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
            <span className="font-bold text-ink uppercase tracking-wider block">
              Facebook / Instagram Sales Ad Copies
            </span>

            {/* Direct Offer */}
            <div className="p-3 rounded-xl bg-muted/15 border border-line space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink text-[11px]">Variant 1: Direct Value Offer</span>
                <button
                  onClick={() => copyToClipboard(adCopyDirect, "ad1")}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {copiedType === "ad1" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === "ad1" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-2 whitespace-pre-wrap leading-relaxed">{adCopyDirect}</p>
            </div>

            {/* Problem First */}
            <div className="p-3 rounded-xl bg-muted/15 border border-line space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink text-[11px]">Variant 2: Misconception / Problem-First</span>
                <button
                  onClick={() => copyToClipboard(adCopyProblem, "ad2")}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {copiedType === "ad2" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === "ad2" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-2 whitespace-pre-wrap leading-relaxed">{adCopyProblem}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
