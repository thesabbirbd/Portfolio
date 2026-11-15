"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign,
  Calculator,
  Wrench,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

export interface IndustryProfile {
  id: string;
  name: string;
  banglaName: string;
  icon: string;
  primaryChallenge: string;
  aiyaarFeature: string;
  sampleWorkflow: {
    title: string;
    description: string;
    liveAlert: string;
    sampleMetric: string;
  };
  leakagePct: number; // Avg industry margin leakage without POS (2-8%)
  hoursSavedWeekly: number;
}

export const INDUSTRIES_22: IndustryProfile[] = [
  {
    id: "pharmacy",
    name: "Pharmacy & Healthcare",
    banglaName: "ফার্মেসি ও ড্রাগ স্টোর",
    icon: "Pill",
    primaryChallenge: "Expired medicine losses & banned generic batch dispensing.",
    aiyaarFeature: "Automated FEFO (First-Expiry-First-Out) batch rotation & generic alternative chip.",
    sampleWorkflow: {
      title: "Batch FEFO Expiry Lock",
      description: "Batch #N-9912 expires in 18 days. System automatically prioritizes sale of this batch before newly stocked batches.",
      liveAlert: "FEFO PRIORITY: Batch #N-9912 (18 Days Left) Dispensed First",
      sampleMetric: "Zero Expired Drug Write-offs",
    },
    leakagePct: 6.5,
    hoursSavedWeekly: 14,
  },
  {
    id: "supershop",
    name: "Supermarket & Grocery",
    banglaName: "সুপারশপ ও গ্রোসারি",
    icon: "ShoppingBag",
    primaryChallenge: "Long checkout queues, scale tare errors & baki dispute.",
    aiyaarFeature: "Barcode scanner buffer, weight scale bridge & instant SMS baki memo.",
    sampleWorkflow: {
      title: "Rapid 3-Second Scanning Checkout",
      description: "Barcode laser scan immediately syncs with weighing scale tare weight and logs cash or baki balance.",
      liveAlert: "POS READY: 28 items processed in 18 seconds via Code-128",
      sampleMetric: "4x Faster Checkout Speed",
    },
    leakagePct: 5.2,
    hoursSavedWeekly: 18,
  },
  {
    id: "restaurant",
    name: "Restaurant & Cloud Kitchen",
    banglaName: "রেস্তোরাঁ ও কিচেন",
    icon: "Utensils",
    primaryChallenge: "KOT ticket mixups, raw meat spoilage & waiter cash theft.",
    aiyaarFeature: "Real-time kitchen display token (KDT), recipe ingredient depletion & split table billing.",
    sampleWorkflow: {
      title: "KOT Ticket Dispatch to Kitchen Display",
      description: "Table 4 order dispatched to Chef Display. Raw beef stock automatically deducted by 350g.",
      liveAlert: "KOT #104: 1x Kacchi Biryani -> Kitchen Display Active",
      sampleMetric: "30% Lower Food Wastage",
    },
    leakagePct: 7.0,
    hoursSavedWeekly: 16,
  },
  {
    id: "fashion",
    name: "Fashion & Boutique",
    banglaName: "ফ্যাশন ও বুটিক হাউজ",
    icon: "Shirt",
    primaryChallenge: "Size/color SKU mismatches, stolen garments & unmanaged festive rush.",
    aiyaarFeature: "Color-Size Matrix SKU tags, barcode sticker printing & VIP festive loyalty points.",
    sampleWorkflow: {
      title: "Matrix SKU Size/Color Grid",
      description: "Panjabi Navy Blue (Sizes 40, 42, 44) tracked individually with unique thermal tag barcodes.",
      liveAlert: "INVENTORY ALERT: Size 42 (Navy Blue) Low Stock (2 Left)",
      sampleMetric: "100% Size Availability Accuracy",
    },
    leakagePct: 4.8,
    hoursSavedWeekly: 12,
  },
  {
    id: "electronics",
    name: "Electronics & Mobile Shop",
    banglaName: "ইলেকট্রনিক্স ও গ্যাজেট শপ",
    icon: "Smartphone",
    primaryChallenge: "IMEI/Serial counterfeit disputes & warranty claim confusion.",
    aiyaarFeature: "IMEI barcode auto-scan on invoice, warranty serial lookup & EMI ledger.",
    sampleWorkflow: {
      title: "IMEI Serial Tracking on Cash Memo",
      description: "Smartphone serial IMEI-869214059218201 bound to 1-year official warranty card.",
      liveAlert: "WARRANTY VERIFIED: IMEI Valid until Nov 2027",
      sampleMetric: "Zero Warranty Fraud Discrepancy",
    },
    leakagePct: 5.8,
    hoursSavedWeekly: 11,
  },
  {
    id: "wholesale",
    name: "Wholesale & Agro Trading",
    banglaName: "পাইকারি ও আড়ত ব্যবসা",
    icon: "Truck",
    primaryChallenge: "Massive customer baki defaults & truck weight shrinkage.",
    aiyaarFeature: "Customer credit limit lock, truck gross/tare calculator & automated SMS recovery.",
    sampleWorkflow: {
      title: "Baki Credit Limit Lock",
      description: "Customer Rahim Trading reached credit ceiling (৳2,00,000). System blocks dispatch until partial payment.",
      liveAlert: "CREDIT LIMIT TRIGGERED: Dispatch paused for approval",
      sampleMetric: "94% Baki Recovery Rate",
    },
    leakagePct: 8.5,
    hoursSavedWeekly: 22,
  },
  {
    id: "hardware",
    name: "Hardware & Sanitary",
    banglaName: "হার্ডওয়্যার ও স্যানিটারি",
    icon: "Wrench",
    primaryChallenge: "Thousands of small nuts/pipes without barcodes & credit defaults.",
    aiyaarFeature: "Visual photo catalog, unit conversion (feet to meter) & contractor credit lock.",
    sampleWorkflow: {
      title: "Pipe & Fittings Dimensional Billing",
      description: "PVC 1-inch pipe 120 feet auto-calculated with unit rate.",
      liveAlert: "UNIT CONVERTED: 120 Feet = 36.57 Meters billed correctly",
      sampleMetric: "Zero Dimension Calculation Error",
    },
    leakagePct: 6.2,
    hoursSavedWeekly: 14,
  },
  {
    id: "cosmetics",
    name: "Cosmetics & Beauty Care",
    banglaName: "কসমেটিকস ও রূপচর্চা",
    icon: "Sparkles",
    primaryChallenge: "Shade number confusion & fake imported brands.",
    aiyaarFeature: "Shade/Tone cataloging, original brand batch checker & gift combo packs.",
    sampleWorkflow: {
      title: "Cosmetic Shade Matrix",
      description: "Foundation Shade #03 Fair Porcelain tracked separately from Shade #04.",
      liveAlert: "SHADE MATCHED: Tone #03 in stock (8 pcs)",
      sampleMetric: "Zero Shade Dispatch Errors",
    },
    leakagePct: 5.5,
    hoursSavedWeekly: 10,
  },
  {
    id: "sweetshop",
    name: "Sweet Shop & Confectionery",
    banglaName: "মিষ্টির দোকান ও মিষ্টান্ন",
    icon: "Utensils",
    primaryChallenge: "Daily milk shelf life & perishable sweet stock loss.",
    aiyaarFeature: "Daily batch expiry alert, box tare deduction & festival advance booking.",
    sampleWorkflow: {
      title: "Daily Perishable Batch Rotation",
      description: "Rasgulla morning batch marked for clearance before afternoon batch.",
      liveAlert: "FRESHNESS TIMER: Morning batch ready for discount clearance",
      sampleMetric: "35% Lower Spoilage Loss",
    },
    leakagePct: 7.2,
    hoursSavedWeekly: 15,
  },
  {
    id: "footwear",
    name: "Footwear & Leather Store",
    banglaName: "জুতা ও চামড়াজাত পণ্য",
    icon: "ShoppingBag",
    primaryChallenge: "Odd-pair sizes left unsold & season end dead stock.",
    aiyaarFeature: "Size-pair pairing barcode, seasonal discount engine & warranty tracking.",
    sampleWorkflow: {
      title: "Shoe Size Pair Reconciliation",
      description: "Size 42 pair left and right barcodes matched before billing.",
      liveAlert: "PAIR MATCH VERIFIED: Size 42 L+R Matched",
      sampleMetric: "Zero Mismatched Shoe Boxes",
    },
    leakagePct: 4.9,
    hoursSavedWeekly: 11,
  },
  {
    id: "optical",
    name: "Optics & Eye Care",
    banglaName: "চশমা ও অপটিক্যাল শপ",
    icon: "Eye",
    primaryChallenge: "Lens power prescriptions & custom frame order delays.",
    aiyaarFeature: "Prescription power ledger (Sph, Cyl, Axis) & lab job-sheet tracking.",
    sampleWorkflow: {
      title: "Power Lens Prescription Card",
      description: "Prescription (-2.50 Sph, -0.75 Cyl) linked directly to customer mobile.",
      liveAlert: "LAB JOBSHEET: Dispatched to Edging Lab with Power -2.50",
      sampleMetric: "Zero Power Prescription Mixups",
    },
    leakagePct: 4.5,
    hoursSavedWeekly: 13,
  },
  {
    id: "jewelry",
    name: "Gold & Jewelry Store",
    banglaName: "স্বর্ণালঙ্কার ও জুয়েলারি",
    icon: "Sparkles",
    primaryChallenge: "Daily fluctuating gold rates, making charges & karat purity.",
    aiyaarFeature: "Live daily gold rate sync, stone deduction tare & bullion hallmarking.",
    sampleWorkflow: {
      title: "Karat Purity Weight Billing",
      description: "22K Gold 11.66g (1 Vori) calculated against today's Bajus gold price.",
      liveAlert: "BAJUS RATE SYNCED: 22K Gold Rate ৳1,38,000/Vori Active",
      sampleMetric: "100% Metal Weight Audit Accuracy",
    },
    leakagePct: 3.2,
    hoursSavedWeekly: 16,
  },
  {
    id: "bakery",
    name: "Bakery & Pastry Kitchen",
    banglaName: "বেকারি ও পেস্ট্রি শপ",
    icon: "Utensils",
    primaryChallenge: "Custom birthday cake delivery times & cream spoilage.",
    aiyaarFeature: "Cake delivery scheduler, advance payment token & ingredient deduction.",
    sampleWorkflow: {
      title: "Custom Birthday Cake Scheduler",
      description: "2-Pound Chocolate Fondant cake scheduled for 6:00 PM pickup with advance receipt.",
      liveAlert: "DELIVERY REMINDER: Cake #304 due for piping at 4:30 PM",
      sampleMetric: "Zero Late Birthday Deliveries",
    },
    leakagePct: 6.8,
    hoursSavedWeekly: 14,
  },
  {
    id: "bookshop",
    name: "Bookshop & Stationery",
    banglaName: "বইয়ের দোকান ও স্টেশনারি",
    icon: "BookOpen",
    primaryChallenge: "Tracking thousands of ISBN titles & academic textbook returns.",
    aiyaarFeature: "ISBN barcode scanner, publisher return tracking & student discount codes.",
    sampleWorkflow: {
      title: "ISBN Book Inventory Lookup",
      description: "Scanned ISBN 978-984-901 auto-retrieves author, publisher, and commission rate.",
      liveAlert: "ISBN RESOLVED: Higher Math Class XI in stock (14 copies)",
      sampleMetric: "5x Faster Textbook Lookups",
    },
    leakagePct: 4.2,
    hoursSavedWeekly: 12,
  },
  {
    id: "tiles",
    name: "Tiles & Ceramic Sanitary",
    banglaName: "টাইলস ও স্যানিটারি শো-রুম",
    icon: "Layers",
    primaryChallenge: "Square feet to box conversions & batch color tone variation.",
    aiyaarFeature: "Sqft to Box conversion calculator, shade tone lock & delivery truck staging.",
    sampleWorkflow: {
      title: "Tile Sqft to Box Dimension Calculation",
      description: "Room 450 sqft auto-converted to 28 full boxes + 2 reserve boxes.",
      liveAlert: "CALCULATED: 450 Sqft = 28.1 Boxes (Shade Tone #G-4)",
      sampleMetric: "Zero Tile Shade Mismatch Complaints",
    },
    leakagePct: 5.4,
    hoursSavedWeekly: 15,
  },
  {
    id: "autoparts",
    name: "Automobile & Bike Parts",
    banglaName: "অটোমোবাইল ও মোটর পার্টস",
    icon: "Wrench",
    primaryChallenge: "Engine model compatibility & duplicate counterfeit spares.",
    aiyaarFeature: "Vehicle model cross-reference, chassis lookup & mechanic commission tracker.",
    sampleWorkflow: {
      title: "Vehicle Model Part Cross-Reference",
      description: "Brake pad fits Honda CB Hornet 160R and Yamaha FZ-S Version 2.",
      liveAlert: "COMPATIBILITY VERIFIED: Fits 4 chassis models",
      sampleMetric: "Zero Wrong Spare Returns",
    },
    leakagePct: 5.9,
    hoursSavedWeekly: 13,
  },
  {
    id: "giftshop",
    name: "Gift Shop & Toys",
    banglaName: "গিফট শপ ও খেলনার দোকান",
    icon: "Sparkles",
    primaryChallenge: "Barcode-less imported trinkets & gift wrap pricing.",
    aiyaarFeature: "Instant sticky thermal label generator, gift wrap bundle & seasonal discount.",
    sampleWorkflow: {
      title: "Imported Toys Labeling",
      description: "Imported diecast car assigned SKU #GFT-809 with sticker barcode.",
      liveAlert: "LABEL PRINTED: Code-128 sticker ready for display",
      sampleMetric: "100% Item Price Transparency",
    },
    leakagePct: 5.1,
    hoursSavedWeekly: 10,
  },
  {
    id: "departmental",
    name: "Departmental Store",
    banglaName: "ডিপার্টমেন্টাল স্টোর",
    icon: "ShoppingBag",
    primaryChallenge: "Multi-floor inventory reconciliation & cash drawer discrepancies.",
    aiyaarFeature: "Multi-counter POS synchronization, shift closing reconciliation & CCTV log sync.",
    sampleWorkflow: {
      title: "Shift Counter Closing Reconciliation",
      description: "Cashier Shift 1 closed. Physical cash counted against system total.",
      liveAlert: "SHIFT RECONCILED: Variance ৳0.00 across 182 orders",
      sampleMetric: "Zero Cash Drawer Leakage",
    },
    leakagePct: 4.7,
    hoursSavedWeekly: 17,
  },
  {
    id: "sports",
    name: "Sports & Fitness Gear",
    banglaName: "স্পোর্টস ও ফিটনেস গিয়ার",
    icon: "ShoppingBag",
    primaryChallenge: "Jersey size customization & seasonal tournament bulk orders.",
    aiyaarFeature: "Team jersey name/number order ledger & tournament bulk quotation.",
    sampleWorkflow: {
      title: "Customized Team Jersey Ledger",
      description: "Cricket jersey batch of 15 pcs customized with player name and number.",
      liveAlert: "CUSTOMIZATION BATCH: 15/15 names verified and staged",
      sampleMetric: "Zero Spelling Errors on Jerseys",
    },
    leakagePct: 4.6,
    hoursSavedWeekly: 11,
  },
  {
    id: "paint",
    name: "Paint & Hardware Depot",
    banglaName: "রং ও পেইন্ট ডিলারশিপ",
    icon: "Wrench",
    primaryChallenge: "Custom computerized tinting machine formula records & painter commissions.",
    aiyaarFeature: "Color shade tinting formulation record & painter/contractor loyalty wallet.",
    sampleWorkflow: {
      title: "Tinting Formula Color Code Lock",
      description: "Dulux Shade #72BG auto-logs tint base and toner quantities.",
      liveAlert: "FORMULA LOGGED: Base White 3.8L + 12ml Yellow + 4ml Blue",
      sampleMetric: "100% Exact Repeat Shade Matches",
    },
    leakagePct: 5.7,
    hoursSavedWeekly: 14,
  },
  {
    id: "agroseeds",
    name: "Agro Seeds & Fertilizer",
    banglaName: "বীজ, সার ও বালাইনাশক",
    icon: "Truck",
    primaryChallenge: "Seasonal sowing expiry dates & government regulated subsidy quotas.",
    aiyaarFeature: "Farmer farmer ID quota verification, seasonal seed germination expiry & bag weights.",
    sampleWorkflow: {
      title: "Seed Germination Season Lock",
      description: "Aman Paddy Seeds Batch #AM-26 verified for current planting window.",
      liveAlert: "SEED TESTED: Germination rate 92% certified",
      sampleMetric: "Zero Expired Seed Sales",
    },
    leakagePct: 6.1,
    hoursSavedWeekly: 16,
  },
  {
    id: "furniture",
    name: "Furniture & Interior Wood",
    banglaName: "ফার্নিচার ও কাঠ ব্যবসা",
    icon: "Layers",
    primaryChallenge: "Long production lead times, staged milestone payments & delivery logistics.",
    aiyaarFeature: "Production stage tracker (Wood cut -> Polishing -> Delivery), advance token & milestone bill.",
    sampleWorkflow: {
      title: "Custom Sofa 3-Stage Milestone Billing",
      description: "Customer paid 40% advance; 30% due on frame inspection, 30% on home delivery.",
      liveAlert: "MILESTONE ALERT: Wood frame complete, customer notified for inspection",
      sampleMetric: "Zero Unpaid Delivery Discrepancies",
    },
    leakagePct: 5.3,
    hoursSavedWeekly: 18,
  },
];

export function IndustryInteractiveSimulator() {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(INDUSTRIES_22[0].id);
  const [monthlySalesBdt, setMonthlySalesBdt] = useState<number>(850000);
  const [staffCount, setStaffCount] = useState<number>(4);

  const currentProfile = INDUSTRIES_22.find((i) => i.id === selectedIndustryId) || INDUSTRIES_22[0];

  // ROI Calculator
  const roiCalculations = useMemo(() => {
    // Prevented leakage
    const monthlyLeakagePrevented = Math.round((monthlySalesBdt * (currentProfile.leakagePct / 100)));
    // Staff hours saved per month
    const monthlyHoursSaved = currentProfile.hoursSavedWeekly * 4 * staffCount;
    // Labor value (assuming 150 BDT / hour)
    const laborValueSaved = monthlyHoursSaved * 150;
    const totalMonthlyValue = monthlyLeakagePrevented + laborValueSaved;

    return {
      monthlyLeakagePrevented,
      monthlyHoursSaved,
      laborValueSaved,
      totalMonthlyValue,
      annualValue: totalMonthlyValue * 12,
    };
  }, [monthlySalesBdt, staffCount, currentProfile]);

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Aiyaar 22-Industry Business Simulator &amp; ROI Engine
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Experience tailored POS, FEFO, and KOT workflows across Bangladesh&apos;s primary retail &amp; wholesale verticals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>CPM Verified Architecture</span>
          </span>
        </div>
      </div>

      {/* Industry Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
        {INDUSTRIES_22.map((ind) => (
          <button
            key={ind.id}
            onClick={() => {
              sound.toggleSwitch();
              setSelectedIndustryId(ind.id);
            }}
            className={`p-3 rounded-2xl border text-center transition space-y-1 ${
              selectedIndustryId === ind.id
                ? "bg-primary text-white border-primary shadow font-bold"
                : "bg-surface border-line text-ink-2 hover:border-ink-4"
            }`}
          >
            <span className="block text-sm">{ind.banglaName}</span>
            <span className="text-[10px] opacity-80 block truncate">{ind.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
        {/* Left Live Workflow Simulation Card */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-bold text-ink uppercase flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Live Industry Workflow Simulation
            </span>
            <span className="text-[10px] text-ink-3">Interactive Demo State</span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-ink">{currentProfile.sampleWorkflow.title}</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {currentProfile.sampleWorkflow.description}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-[10px] shrink-0">
                {currentProfile.sampleWorkflow.sampleMetric}
              </span>
            </div>

            {/* Live Visual Telemetry Alert Box */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{currentProfile.sampleWorkflow.liveAlert}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-[11px]">
              <div>
                <span className="text-[10px] text-ink-3 block">Primary Sector Challenge:</span>
                <span className="text-rose-500 font-medium">{currentProfile.primaryChallenge}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-3 block">Aiyaar Architectural Fix:</span>
                <span className="text-emerald-600 font-medium">{currentProfile.aiyaarFeature}</span>
              </div>
            </div>

            {/* Stage 064: Direct Related Free Tool Bridge */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Wrench className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-ink-2 truncate">
                  Try Companion Free Tool: <strong className="text-ink">
                    {currentProfile.id === "pharmacy"
                      ? "Barcode & QR Studio"
                      : currentProfile.id === "supershop" || currentProfile.id === "restaurant"
                      ? "BD SME Invoice & Thermal Receipt"
                      : currentProfile.id === "fashion"
                      ? "Daraz & FB Product Photo Studio"
                      : currentProfile.id === "electronics"
                      ? "Smart Khata Spreadsheet Grid"
                      : "Khata & Cash Memo to Excel Scanner"}
                  </strong>
                </span>
              </div>
              <Link
                href={
                  currentProfile.id === "pharmacy"
                    ? "/tools/barcode-studio"
                    : currentProfile.id === "supershop" || currentProfile.id === "restaurant"
                    ? "/tools/invoice-maker"
                    : currentProfile.id === "fashion"
                    ? "/tools/product-studio"
                    : currentProfile.id === "electronics"
                    ? "/tools/spreadsheet-grid"
                    : "/tools/khata-scanner"
                }
                onClick={() => sound.navigate()}
                className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline shrink-0 text-[11px]"
              >
                <span>Open Tool</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right ROI Calculator Card */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-bold text-ink uppercase flex items-center gap-1.5 text-[11px]">
              <Calculator className="w-3.5 h-3.5 text-primary" /> Monthly ROI &amp; Savings Calculator
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">~{currentProfile.leakagePct}% Leakage Saved</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-ink-2">
                <span>Monthly Shop Turnover:</span>
                <span className="font-bold text-ink">৳ {monthlySalesBdt.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={monthlySalesBdt}
                onChange={(e) => setMonthlySalesBdt(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-ink-2">
                <span>Staff &amp; Cashiers:</span>
                <span className="font-bold text-ink">{staffCount} Members</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={staffCount}
                onChange={(e) => setStaffCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Savings Breakdown */}
            <div className="p-3.5 rounded-xl bg-muted/20 border border-line space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-ink-3">Prevented Inventory Leakage:</span>
                <span className="font-bold text-emerald-600">+ ৳{roiCalculations.monthlyLeakagePrevented.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-ink-3">Staff Labor Hours Saved:</span>
                <span className="font-bold text-ink">{roiCalculations.monthlyHoursSaved} hrs / mo</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-ink pt-2 border-t border-line">
                <span>Total Monthly Value Added:</span>
                <span className="text-primary">৳ {roiCalculations.totalMonthlyValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center p-2 rounded-xl bg-primary/10 text-primary font-bold text-xs">
              Annual Projected Business Gain: ৳ {roiCalculations.annualValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
