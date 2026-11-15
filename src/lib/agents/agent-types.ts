export type AgentCategory =
  | "All"
  | "Media & Vision"
  | "Business & Accounting"
  | "Privacy & Documents"
  | "Voice & Notes"
  | "Creator & Social"
  | "DevOps & Linux"
  | "Database & SQL"
  | "Everyday & Family"
  | "Education & Career";

export interface AgentPreset {
  label: string;
  description: string;
  input: string;
}

export interface AgentArtifact {
  title: string;
  filename: string;
  filetype: "text" | "json" | "csv" | "svg" | "markdown";
  content: string;
  summary: string;
}

export interface AgentTraceStep {
  step: number;
  totalSteps: number;
  message: string;
  timestamp: string;
  status: "pending" | "running" | "completed";
}

export interface DomainAgent {
  id: string;
  name: string;
  tagline: string;
  category: AgentCategory;
  domain: string;
  description: string;
  skills: string[];
  systemRules: string[];
  popularRank: number;
  viralityPoints: number;
  presets: AgentPreset[];
  icon: string;
  color: string;
}

export const AUTONOMOUS_AGENTS: DomainAgent[] = [
  {
    id: "pixelforge",
    name: "PixelForge Agent",
    tagline: "Media, E-Commerce Product Studio & WebP Engine",
    category: "Media & Vision",
    domain: "Computer Vision & Image Optimization",
    description: "Specialized in client-side background removal, 1:1 Daraz/FB Marketplace product framing, 3D drop-shadows, and batch WebP compression.",
    skills: ["edgeThresholdMatting", "autoWhiteStudioBg", "shadowSynthesizer", "batchWebpEncoder", "zipPackager"],
    systemRules: [
      "Process 100% in-browser using HTML5 Canvas & Web Workers.",
      "Preserve source alpha channel and sharpen product silhouettes.",
      "Output lightweight WebP/PNG assets under 35KB.",
    ],
    popularRank: 99,
    viralityPoints: 1420,
    icon: "Image",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    presets: [
      {
        label: "Product White Studio",
        description: "Isolate product photo and place onto a crisp white background with soft drop shadow.",
        input: "Isolate product silhouette from smartphone photo, apply 1:1 square canvas, add 15% bottom contact shadow, and export 800x800 WebP.",
      },
      {
        label: "Marketplace 20% OFF Badge",
        description: "Format 4:5 social commerce photo with promotional badge.",
        input: "Format product image for Facebook Shop feed (1080x1350), add top-right '20% OFF' ribbon badge and clean watermark.",
      },
      {
        label: "Batch WebP Compression",
        description: "Compress 50 images to ultra-fast WebP under 25KB each.",
        input: "Scan image queue, downsample max dimension to 1200px, compress using quality factor 0.82, and prepare downloadable ZIP archive.",
      },
    ],
  },
  {
    id: "khatavision",
    name: "KhataVision Agent",
    tagline: "Bangla/English Receipt, Cash Memo & Khata OCR-to-Excel",
    category: "Business & Accounting",
    domain: "Document Digitization & Structured Table Parsing",
    description: "Transforms handwritten and printed Bengali bookkeeping khatas, grocery lists, and pharmacy vouchers into normalized Excel and CSV tables.",
    skills: ["imagePreprocessContrast", "banglaDigitMapper", "lineItemTokenizer", "bakiTotalAuditor", "csvExcelExporter"],
    systemRules: [
      "Map Bengali digits (০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯) accurately to standard numerals.",
      "Detect product name, quantity, unit price, and line total.",
      "Calculate mathematical sum and highlight discrepancy in Baki records.",
    ],
    popularRank: 98,
    viralityPoints: 1890,
    icon: "FileSpreadsheet",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    presets: [
      {
        label: "Baki Khata Ledger Line",
        description: "Parse traditional shop credit book entry with customer names.",
        input: "রহিম ভাই - চাল ৫ কেজি ২৫০ টাকা, তেল ২ লিটার ৩৮০ টাকা, ডাল ১ কেজি ১৪০ টাকা। জমা ৫০০ টাকা, বাকি ২৭০ টাকা।",
      },
      {
        label: "Grocery Market Fard",
        description: "Convert weekly bazar list into structured budget spreadsheet.",
        input: "আলু ১০ কেজি ৩০০ টাকা, পেঁয়াজ ৫ কেজি ৪৫০ টাকা, মুরগি ২ কেজি ৫৬০ টাকা, রসুন ১ কেজি ১২০ টাকা।",
      },
      {
        label: "Pharmacy Cash Memo",
        description: "Extract medicine names, strip quantities, and prescription totals.",
        input: "Napa Extra 500mg 2 strips 50 tk, Seclo 20mg 3 strips 210 tk, Monas 10mg 1 strip 160 tk. Total: 420 tk.",
      },
    ],
  },
  {
    id: "privacyshield",
    name: "PrivacyShield Agent",
    tagline: "NID, Phone, Email & Financial Document Redaction",
    category: "Privacy & Documents",
    domain: "Data Anonymization & Confidential Document Security",
    description: "Detects Bangladeshi phone numbers, 10/13/17-digit National ID (NID) cards, bank account IBANs, and applies irreversible blackout redaction.",
    skills: ["nidPhoneRegexScanner", "emailBankDetector", "canvasBlackoutMasker", "watermarkStamper", "safePdfExporter"],
    systemRules: [
      "Zero server transmission: strictly client-side regex and pixel masking.",
      "Support both text redaction (█████) and canvas blackout bars.",
      "Stamp 'CONFIDENTIAL — FOR VERIFICATION ONLY' security watermark.",
    ],
    popularRank: 95,
    viralityPoints: 1240,
    icon: "ShieldAlert",
    color: "from-rose-500/20 to-red-500/20 text-rose-500",
    presets: [
      {
        label: "NID & Phone Redactor",
        description: "Anonymize employee biodata and NID card records.",
        input: "Candidate: Md Tanvir Hasan, Mobile: +8801711234567, NID: 19942691523456789, Address: Rajshahi 6205, Bank Account: 2050123456789.",
      },
      {
        label: "Medical Prescription Anonymizer",
        description: "Mask patient phone number and doctor registration before publishing.",
        input: "Patient: Mrs. Salma Begum (Age: 48), Contact: 01819876543, Clinic Card #88219. Prescribed: Metformin 500mg.",
      },
      {
        label: "Legal Contract Watermarker",
        description: "Flatten document and stamp single-use identification watermark.",
        input: "Redact financial figures: 'Advance payment of BDT 450,000 paid to Account #11029384812' and stamp 'FOR REVIEW ONLY'.",
      },
    ],
  },
  {
    id: "voicescribe",
    name: "VoiceScribe Agent",
    tagline: "Bangla/English Voice Memo Transcriber & Action Pad",
    category: "Voice & Notes",
    domain: "Speech-to-Text & Executive Minutes Extraction",
    description: "Captures voice memos in Bengali or English, scrubs filler words, summarizes key takeaways, and compiles actionable checklist to-do items.",
    skills: ["webSpeechTranscriber", "audioWaveformAnalyzer", "fillerWordCleaner", "actionItemExtractor", "meetingMinutesFormatter"],
    systemRules: [
      "Clean repeated words and pause artifacts ('um', 'মানে', 'আরকি').",
      "Categorize output into: Executive Summary, Decision Log, Action Items.",
      "Extract mentioned dates, currencies, and assignees.",
    ],
    popularRank: 94,
    viralityPoints: 1110,
    icon: "Mic",
    color: "from-sky-500/20 to-blue-500/20 text-sky-500",
    presets: [
      {
        label: "Client Meeting Summary",
        description: "Extract deliverables and delivery deadlines from meeting audio.",
        input: "Meeting with Aiyaar retail team: Tanvir needs to finalize the thermal 58mm printer SDK by next Tuesday. THE SABBiR will review PostgreSQL replica queries on Friday. Delivery milestone locked for end of month.",
      },
      {
        label: "Homelab Idea Voice Note",
        description: "Structure quick technical brain-dump into action checklist.",
        input: "Idea for homelab router: configure WireGuard peer with custom MTU 1420 to fix packet fragmentation on BDIX ISP. Add netpulse cron check every 5 minutes to ping gateway 103.205.180.1.",
      },
      {
        label: "Bangla Store Delivery Note",
        description: "Convert casual Bangla dispatch instructions into shipping memo.",
        input: "আজকে ধানমন্ডি ৩ নম্বর রোডে ২টা পার্সেল ডেলিভারি দিতে হবে। কাস্টমার বিকাশ করবে ক্যাশ অন ডেলিভারি ১২০০ টাকা। ডেলিভারিম্যান শফিককে সকাল ১১টায় বের হতে বলো।",
      },
    ],
  },
  {
    id: "bizdesk-bd",
    name: "BizDesk BD Agent",
    tagline: "BD SME Invoice, bKash/Nagad QR & POS Engine",
    category: "Business & Accounting",
    domain: "E-Commerce Finance & Retail Billing Automation",
    description: "Builds professional corporate invoices, cash memos, and 58mm/80mm thermal receipts with bKash/Nagad payment QR and courier charge calculations.",
    skills: ["gstVatDiscountCalc", "codCourierFeeOptimizer", "thermal58mm80mmRenderer", "bkashQrGenerator", "invoicePdfBuilder"],
    systemRules: [
      "Format standard Bangladeshi currency (BDT / ৳) and division shipping tiers.",
      "Generate instant merchant/personal bKash & Nagad scan-to-pay QR codes.",
      "Render pixel-accurate 58mm and 80mm ESC/POS thermal printer previews.",
    ],
    popularRank: 97,
    viralityPoints: 1680,
    icon: "Receipt",
    color: "from-violet-500/20 to-purple-500/20 text-violet-500",
    presets: [
      {
        label: "E-Commerce Cash Memo (COD)",
        description: "Generate invoice with Steadfast/Pathao courier delivery fees.",
        input: "Customer: Farhana Yeasmin, Dhaka Uttara. Items: 2x Premium Cotton Panjabi @ 1850 BDT, 1x Leather Wallet @ 650 BDT. Inside Dhaka Delivery: 70 BDT. Advance Paid: 500 BDT. COD Due: 3870 BDT.",
      },
      {
        label: "58mm Thermal Food Bill",
        description: "Format restaurant POS ticket for portable thermal printers.",
        input: "Table 4. Items: 1x Rajshahi Mango Lassi @ 120, 2x Chicken Biryani @ 280, 1x Borhani @ 60. VAT 5%: 37 BDT. Total: 777 BDT. Thank you, visit again!",
      },
      {
        label: "Freelancer Quotation",
        description: "Generate professional consulting quote with milestone breakdown.",
        input: "Client: TechVentures Ltd. Service: Next.js SaaS Architecture & Docker deployment. 3 Milestones @ 45,000 BDT each. Total: 135,000 BDT. Payment Terms: Net 15.",
      },
    ],
  },
  {
    id: "viraldirector",
    name: "ViralDirector Agent",
    tagline: "60s Reel, Hook & Social SEO Architecture",
    category: "Creator & Social",
    domain: "Short-Form Video Retention & OpenGraph Optimization",
    description: "Architects 60-second viral TikTok/Reels scripts using the 3-second hook law, creates 3-column production sheets (Voice | Visual | SFX), and exports .srt captions.",
    skills: ["hookRetentionScorer", "threeColumnScriptBuilder", "srtTimecodeGenerator", "ogCardPreviewer", "hashtagClusterEngine"],
    systemRules: [
      "Calibrate pace for 135–145 words per minute (60 seconds = ~140 words).",
      "Mandate a high-contrast visual shock in the first 2 seconds.",
      "Generate matching timestamped .srt subtitles and social preview tags.",
    ],
    popularRank: 96,
    viralityPoints: 1530,
    icon: "Clapperboard",
    color: "from-pink-500/20 to-rose-500/20 text-pink-500",
    presets: [
      {
        label: "Run AI Locally (Tech Hook)",
        description: "60-second reel showing how to run Llama 3 without paid subscriptions.",
        input: "Topic: Why you should stop paying $20/month for ChatGPT and run Llama 3.2 on your laptop with Ollama in 60 seconds.",
      },
      {
        label: "PostgreSQL Index Mystery",
        description: "Educational explainer on why database queries slow down under traffic.",
        input: "Topic: Why your PostgreSQL database is taking 4 seconds to load user orders, and how 1 B-tree index drops latency to 2 milliseconds.",
      },
      {
        label: "Product Launch Reel",
        description: "High-energy commercial reel for a new Bangladeshi SaaS launch.",
        input: "Topic: Introducing Khata2Sheet AI — turning handwritten shop khatas into automated Excel spreadsheets in 3 seconds.",
      },
    ],
  },
  {
    id: "secops-guardian",
    name: "SecOps Guardian Agent",
    tagline: "Dockerfile Security Hardener, Cron & systemd.timer Agent",
    category: "DevOps & Linux",
    domain: "Container Security, Linux SRE & Daemon Hardening",
    description: "Audits Dockerfiles for root vulnerabilities and bloated layers, converts plain English into cron expressions, and builds systemd.timer units.",
    skills: ["dockerfileAstAuditor", "nonRootPatchGenerator", "nlToCronParser", "systemdTimerBuilder", "nginxSecurityHeaderInjector"],
    systemRules: [
      "Enforce non-root USER directive, minimal alpine/distroless base, and multi-stage builds.",
      "Ensure cron expressions include human-readable next-run schedules.",
      "Emit production-ready systemd .service and .timer unit files.",
    ],
    popularRank: 93,
    viralityPoints: 1190,
    icon: "Terminal",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-500",
    presets: [
      {
        label: "Harden Node.js Dockerfile",
        description: "Fix security vulnerabilities in an unhardened Node container.",
        input: "FROM node:latest\nWORKDIR /app\nCOPY . .\nRUN npm install\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
      },
      {
        label: "Nightly Database Backup Cron",
        description: "Convert natural language into a hardened cron & systemd unit.",
        input: "Run postgres pg_dump of database 'sabbir_pos' every day at 02:45 AM, compress with zstd, and delete dumps older than 14 days.",
      },
      {
        label: "Nginx Hardening Headers",
        description: "Inject modern CSP, HSTS, and XSS security headers into Nginx config.",
        input: "Generate production Nginx SSL server block with HTTP/2, TLS 1.3, Strict-Transport-Security, Content-Security-Policy, and rate-limiting zone.",
      },
    ],
  },
  {
    id: "schemapilot",
    name: "SchemaPilot Agent",
    tagline: "PostgreSQL & SQLite Schema Auditor, Index & Query Optimizer",
    category: "Database & SQL",
    domain: "Relational Database Performance & Architecture",
    description: "Diagnoses slow SQL queries, detects missing composite indices and N+1 table scans, visualizes EXPLAIN plans, and writes Drizzle migrations.",
    skills: ["ddlSchemaValidator", "missingIndexDetector", "nPlusOneQueryFinder", "explainPlanVisualizer", "drizzleMigrationGenerator"],
    systemRules: [
      "Spot sequential table scans (Seq Scan) and suggest minimal B-tree index keys.",
      "Warn on unindexed foreign keys and unbounded SELECT * queries.",
      "Generate clean Drizzle ORM TypeScript schemas and SQL DDL.",
    ],
    popularRank: 92,
    viralityPoints: 1310,
    icon: "Database",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-500",
    presets: [
      {
        label: "Slow Order Query Rescue",
        description: "Optimize an unindexed multi-table JOIN query.",
        input: "SELECT o.id, o.total, c.name, o.created_at FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.status = 'PENDING' AND o.created_at >= '2026-01-01' ORDER BY o.created_at DESC LIMIT 50;",
      },
      {
        label: "E-Commerce Drizzle Schema",
        description: "Generate type-safe PostgreSQL schema with foreign keys and indices.",
        input: "Create schema for Products, Categories, Orders, and OrderItems in PostgreSQL with UUID primary keys and proper inventory decimal columns.",
      },
      {
        label: "JSONB Index Optimization",
        description: "Accelerate deep queries inside PostgreSQL JSONB payload columns.",
        input: "Query: SELECT * FROM audit_logs WHERE metadata->>'tenant_id' = 'acme_corp' AND metadata->>'action' = 'LOGIN_FAILURE';",
      },
    ],
  },
  {
    id: "catalog-ranker",
    name: "CatalogRanker Agent",
    tagline: "Daraz SEO, F-Commerce Copywriting & Pricing Tiers",
    category: "Creator & Social",
    domain: "E-Commerce Growth & Catalog Optimization",
    description: "Generates high-rank Daraz SEO product titles, bullet highlights, pricing psychology brackets, and 3 viral Facebook ad copies.",
    skills: ["darazKeywordScorer", "bulletSpecFormatter", "adCopySynthesizer", "pricingPsychologyEngine"],
    systemRules: [
      "Include brand and primary keywords in first 40 characters of product title.",
      "Calculate perceived savings and percentage discount.",
      "Draft 3 distinct ad variants: Direct Value, Pain-point, and FOMO.",
    ],
    popularRank: 95,
    viralityPoints: 1650,
    icon: "ShoppingBag",
    color: "from-pink-500/20 to-rose-500/20 text-pink-500",
    presets: [
      {
        label: "Smartwatch Launch Copy",
        description: "Create Daraz title and ad copy for waterproof smartwatch.",
        input: "Brand: THE SABBiR Gear, Product: Pro Bluetooth Smartwatch, Features: Bangla display, IP68 Waterproof, 7-day battery, Regular: 3450 BDT, Sale: 2290 BDT, Warranty: 6 Months.",
      },
    ],
  },
  {
    id: "cheque-guard",
    name: "ChequeGuard Agent",
    tagline: "Bangla Taka-in-Words, Cheque Audit & Deposit Reconciliation",
    category: "Business & Accounting",
    domain: "Financial Compliance & Cheque Processing",
    description: "Converts numbers into exact Lakh/Crore words in Bengali and English, verifies cheque date validity, and generates deposit slips.",
    skills: ["takaInWordsBengali", "takaInWordsEnglish", "chequeDateAuditor", "depositSlipGenerator"],
    systemRules: [
      "Apply exact Bangladesh Bank Lakh/Crore format (এক লক্ষ পঁচিশ হাজার টাকা মাত্র).",
      "Flag stale cheques (>180 days) and post-dated clearing conflicts.",
      "Enforce A/C Payee crossing verification on high-value transfers.",
    ],
    popularRank: 94,
    viralityPoints: 1520,
    icon: "Landmark",
    color: "from-amber-500/20 to-emerald-500/20 text-emerald-500",
    presets: [
      {
        label: "Office Rent Cheque Leaf",
        description: "Convert 1,25,450 BDT to Bengali words and audit clearing date.",
        input: "Amount: 125450, Payee: Md Sabbirul Islam Khan, Bank: BRAC Bank Gulshan, Date: Today, A/C: 1501204892182001.",
      },
    ],
  },
  {
    id: "career-shield",
    name: "CareerShield Agent",
    tagline: "ATS Keyword Matcher & Public Resume Privacy Scrubber",
    category: "Privacy & Documents",
    domain: "HR Tech & Privacy Protection",
    description: "Scores resumes against job descriptions, identifies missing technical keywords, and scrubs private PII for safe LinkedIn publishing.",
    skills: ["atsKeywordScorer", "missingSkillFinder", "piiScrubber", "publicCvFormatter"],
    systemRules: [
      "Match candidate skills against job requirements with 0-100% ATS score.",
      "Mask phone numbers, NID, DOB, and exact street address for public sharing.",
      "Preserve technical accomplishments and verified project metrics.",
    ],
    popularRank: 93,
    viralityPoints: 1480,
    icon: "FileText",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-500",
    presets: [
      {
        label: "Full-Stack Engineer Resume Audit",
        description: "Match resume against Senior Full-Stack job and sanitize private info.",
        input: "Target: Senior Full-Stack (Next.js, TypeScript, PostgreSQL, Docker, Redis). Candidate: 4 years Node, React, SQL experience.",
      },
    ],
  },
  {
    id: "network-doctor",
    name: "NetworkDoctor Agent",
    tagline: "MikroTik RouterOS Scripting, Dual-WAN & API Load Benchmarks",
    category: "DevOps & Linux",
    domain: "ISP Networks & System Reliability",
    description: "Generates MikroTik RouterOS firewall and failover scripts, designs Queue Tree bandwidth rules, and crafts k6/Locust benchmark scripts.",
    skills: ["routerOsScriptGen", "dualWanFailoverArchitect", "queueTreeCalculator", "k6ScriptGenerator"],
    systemRules: [
      "Implement recursive routing with Google DNS for reliable MikroTik failover.",
      "Configure fast-track firewall filters for high-throughput traffic.",
      "Calculate p50, p95, p99 latency thresholds for k6 load scenarios.",
    ],
    popularRank: 92,
    viralityPoints: 1390,
    icon: "Activity",
    color: "from-purple-500/20 to-violet-500/20 text-purple-500",
    presets: [
      {
        label: "Dual-WAN Failover Script",
        description: "Generate MikroTik recursive routing script for ISP-1 and ISP-2.",
        input: "ISP1 Gateway: 192.168.1.1 (Distance 1), ISP2 Gateway: 192.168.2.1 (Distance 2, 4G LTE Backup). Check via 8.8.8.8.",
      },
    ],
  },
  {
    id: "image-retouch",
    name: "ImageRetouch Agent",
    tagline: "E-Commerce Photo Lighting, Crop Specs & Color Grading Audit",
    category: "Media & Vision",
    domain: "Computer Vision & Color Grading",
    description: "Automates multi-layer crop ratios (1:1, 4:5, 16:9), computes exposure/contrast histograms, and applies cinematic LUT curves.",
    skills: ["cropRatioOptimizer", "exposureHistogramAuditor", "lutCurveSynthesizer", "batchFilterPreserver"],
    systemRules: [
      "Enforce accurate 4:5 and 1:1 e-commerce dimensions.",
      "Calculate dynamic range and suggest contrast/warmth tweaks.",
      "Generate high-DPI canvas transform directives.",
    ],
    popularRank: 95,
    viralityPoints: 1610,
    icon: "ImagePlus",
    color: "from-amber-500/20 to-yellow-500/20 text-yellow-500",
    presets: [
      {
        label: "Teal & Orange LUT",
        description: "Apply Teal & Orange cinematic curve to product showcase photo.",
        input: "Product image: smartphone on desk. Apply 4:5 portrait crop, Teal & Orange LUT, +15% warmth, and high-pass sharpening.",
      },
      {
        label: "4:5 Portrait Feed Reframe",
        description: "Crop and reframe product shot for Facebook feed with 15% warmth boost.",
        input: "Reframe horizontal landscape photo into 1080x1350 (4:5) portrait format with balanced center composition.",
      },
    ],
  },
  {
    id: "story-craft",
    name: "StoryCraft Agent",
    tagline: "Instagram/LinkedIn Carousel & 9:16 Story Storyboard Generator",
    category: "Creator & Social",
    domain: "Social Media Storyboarding & Visual Typography",
    description: "Designs 5-slide LinkedIn carousels and 9:16 vertical story layouts with dual Bangla/English typography and profile stickers.",
    skills: ["storyboardDecomposer", "gradientMeshGenerator", "dualScriptTypography", "carouselSlideSequencer"],
    systemRules: [
      "Format slide 1 with viral curiosity hook and slide 5 with actionable save/share CTA.",
      "Ensure 1080x1920 (9:16) and 1080x1350 (4:5) viewport safe zones.",
      "Pair Hind Siliguri or Tiro Bangla with bold English headlines.",
    ],
    popularRank: 97,
    viralityPoints: 1740,
    icon: "Sparkles",
    color: "from-pink-500/20 to-rose-500/20 text-pink-500",
    presets: [
      {
        label: "5-Slide Technical Carousel",
        description: "Generate 5-slide breakdown: 'Why Postgres Trumps MongoDB for SaaS'.",
        input: "Topic: Postgres vs MongoDB for SaaS in 2026. Create 5 slides: Hook, Relational Integrity, JSONB Performance, Migration Pitfalls, Verdict.",
      },
      {
        label: "9:16 Product Launch Story",
        description: "Create 9:16 story frame for new feature release with swipe-up pill.",
        input: "Product: THE SABBiR OS v5.2 SaaS Workplace. Hook: 35 browser studios with 24h link sharing. Format: 1080x1920 with gradient mesh.",
      },
    ],
  },
  {
    id: "audio-master",
    name: "AudioMaster Agent",
    tagline: "Voiceover Loudness (-14 LUFS), EQ & Podcast Cleanup Recipe",
    category: "Voice & Notes",
    domain: "WebAudio DSP & Speech Enhancement",
    description: "Analyzes audio waveforms, calculates integrated loudness (-14 LUFS, <= -1 dBTP), targets 3-band vocal EQ, and removes hum.",
    skills: ["lufsLoudnessCalibrator", "threeBandEqDesigner", "humFilterSynthesizer", "podcastMasterRecipe"],
    systemRules: [
      "Target standard -14 LUFS integrated and -1 dB true peak for social feeds.",
      "Apply 80Hz high-pass filter to eliminate microphone plosives and desk rumble.",
      "Boost 2-4kHz band for crisp vocal articulation.",
    ],
    popularRank: 96,
    viralityPoints: 1680,
    icon: "Volume2",
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400",
    presets: [
      {
        label: "Podcast Vocal Polish",
        description: "Generate DSP filter chain for condenser mic with AC room hum.",
        input: "Condenser mic recording with 50Hz AC mains hum. Provide high-pass cutoff, 3-band EQ frequencies, and compressor ratio for radio warmth.",
      },
      {
        label: "Bangla Voiceover Master",
        description: "Normalize vocal track to -14 LUFS with gentle 3-band presence boost.",
        input: "Bangla explainer narration track (60s). Target -14 LUFS, duck background music by -21 dB, and limit true peaks to -1.5 dBTP.",
      },
    ],
  },
  {
    id: "waf-sentinel",
    name: "WafSentinel Agent",
    tagline: "SQL Injection, DDoS Rate-Limit & OWASP Top-10 Security Policy Generator",
    category: "DevOps & Linux",
    domain: "Web Application Firewall & Application Security",
    description: "Audits HTTP request payloads, detects boolean/union SQL injection patterns, designs Token-Bucket rate limits, and crafts WAF rules.",
    skills: ["sqliAstAnalyzer", "tokenBucketTuner", "xssPatternDetector", "wafRuleCompiler"],
    systemRules: [
      "Identify stacked queries, UNION SELECT, and boolean tautology exploits.",
      "Calculate sliding-window rate limit thresholds based on route criticality.",
      "Generate zero-cost Next.js edge middleware security rules.",
    ],
    popularRank: 98,
    viralityPoints: 1950,
    icon: "ShieldAlert",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    presets: [
      {
        label: "Next.js Edge WAF Ruleset",
        description: "Generate token-bucket rate limiter and SQLi filter configuration.",
        input: "Route: /api/workplace/auth and /api/share. Set 15 req/min burst cap, detect SQLi AST patterns, and output TypeScript WAF middleware.",
      },
      {
        label: "OWASP SQLi Audit Matrix",
        description: "Inspect payload patterns and output defense signature checklist.",
        input: "Audit input: 'admin\\' OR 1=1 --'. Provide regex signature, AST breakdown, and sanitized prepared statement equivalent.",
      },
    ],
  },
  {
    id: "gov-doc",
    name: "GovDoc Agent",
    tagline: "BCS, Govt Job & Visa Photo/Document Compliance Checker",
    category: "Privacy & Documents",
    domain: "Government Application Standards & Identity Document Compliance",
    description: "Audits photos and scanned signatures against Bangladesh Teletalk BCS (300x300 <100KB, 300x80 <60KB), E-Passport, US Visa (600x600), and Schengen specs.",
    skills: ["bcsDimensionChecker", "signatureAspectRatioValidator", "fileSizeCompressorRecipe", "visaBackgroundVerifier", "pdfStampPreparer"],
    systemRules: [
      "Enforce strict 300x300px <= 100KB for BCS / Teletalk job application photos.",
      "Enforce 300x80px <= 60KB on clean white background for applicant signature.",
      "Ensure 600x600px 2x2 inch 50-69% head ratio for US Visa applications.",
    ],
    popularRank: 99,
    viralityPoints: 2150,
    icon: "UserCheck",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    presets: [
      {
        label: "BCS Photo & Sign Spec Audit",
        description: "Verify exact 300x300 photo and 300x80 signature constraints.",
        input: "Check applicant portrait: 300x300px JPEG, target size 65KB, white background, signature 300x80px, 32KB on crisp white paper.",
      },
      {
        label: "US / Schengen Visa Photo Checklist",
        description: "Generate 2x2 inch 600x600px visa photo specifications.",
        input: "Audit US Visa application requirements: 600x600px, 2x2 inches, neutral expression, white backdrop, no eyeglasses, eye height 56-69%.",
      },
      {
        label: "4R 8-Photo Printable Sheet Layout",
        description: "Generate print sheet layout coordinates for 4R photo paper.",
        input: "Create 4R photo layout (1200x1800 at 300 DPI) arranging 8 passport-size photos with cutting guides.",
      },
    ],
  },
  {
    id: "remit-advisor",
    name: "RemitAdvisor Agent",
    tagline: "Freelancer Remittance Corridor & 2.5% Cash Incentive Optimizer",
    category: "Business & Accounting",
    domain: "Cross-Border Payout Economics & Bangladesh Bank Incentives",
    description: "Evaluates payout channels (Upwork, Payoneer, Wise, Direct SWIFT) to maximize BDT payout with Bangladesh Bank's 2.5% Govt cash incentive and minimum FX spread.",
    skills: ["remittanceCorridorEvaluator", "bbGovtIncentiveCalculator", "fxSpreadAuditor", "cashoutFeeComparator", "payoutSlipExporter"],
    systemRules: [
      "Apply official 2.5% Bangladesh Bank cash incentive to recognized banking channels.",
      "Calculate hidden exchange rate markups relative to interbank mid-market rate.",
      "Account for bKash/Nagad 1.49% to 1.85% cashout deductions when comparing mobile wallets.",
    ],
    popularRank: 99,
    viralityPoints: 2450,
    icon: "DollarSign",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400",
    presets: [
      {
        label: "$1,000 Upwork to Bank Payout Comparison",
        description: "Compare direct local bank vs Payoneer vs wire transfer for $1,000.",
        input: "Amount: $1,000 USD from Upwork. Compare Direct to Bank (2.5% incentive) vs Payoneer to bKash vs Wire Transfer. Show net BDT in hand.",
      },
      {
        label: "Payoneer vs Wise vs bKash Net BDT",
        description: "Calculate fee differences across top 3 freelance withdrawal channels.",
        input: "Amount: $500 USD from international client. Compare Wise to Bank vs Payoneer to Bank vs bKash Remittance.",
      },
      {
        label: "Annual Remittance Incentive Summary",
        description: "Forecast annual 2.5% cash incentive earnings for $25,000 yearly volume.",
        input: "Annual freelancing income: $25,000 USD. Calculate total Bangladesh Bank 2.5% cash assistance and recommended banking corridor.",
      },
    ],
  },
  {
    id: "support-macro",
    name: "SupportMacro Agent",
    tagline: "F-Commerce WhatsApp & Messenger Playbook Generator",
    category: "Creator & Social",
    domain: "Customer Service Automation & Conversational Commerce",
    description: "Generates high-converting Bangla, Banglish, and English customer support macros for Facebook Page, WhatsApp Business, order confirmations, bKash advances, and polite baki reminders.",
    skills: ["fcommercePlaybookGenerator", "variableInjectionEngine", "politeBakiReminderRecipe", "orderConfirmationMacro", "waDirectLinkComposer"],
    systemRules: [
      "Use courteous, reassuring Bengali business phrasing with clear price & delivery transparency.",
      "Inject dynamic placeholders like {customer_name}, {product_name}, {amount}, {tracking_id}.",
      "Never pressure customer harshly; maintain trust and polite follow-up intervals.",
    ],
    popularRank: 97,
    viralityPoints: 1980,
    icon: "MessageCircle",
    color: "from-pink-500/20 to-rose-500/20 text-pink-400",
    presets: [
      {
        label: "10 Essential F-Commerce Order Macros",
        description: "Generate complete order flow from greeting to delivery confirmation.",
        input: "Create 10 standard F-Commerce macros: Welcome, Stock Check, Size Guide, Delivery Charge (Inside/Outside Dhaka), Advance Payment, Confirmation, Tracking.",
      },
      {
        label: "Gentle Baki / Due Payment Reminder",
        description: "Write polite, professional WhatsApp reminder for outstanding dues.",
        input: "Generate 3-stage polite Baki reminder templates (Day 1 polite reminder, Day 7 statement summary, Day 14 gentle follow-up with bKash QR).",
      },
      {
        label: "Courier Return & Exchange Policy Reply",
        description: "Handle damaged/wrong size parcel complaints gracefully.",
        input: "Customer received wrong shirt size. Craft empathetic response offering free courier pickup and same-day replacement dispatch.",
      },
    ],
  },
  {
    id: "design-token",
    name: "DesignToken Agent",
    tagline: "WCAG 2.1 Accessibility & Tailwind v4 Design Token Synthesizer",
    category: "Media & Vision",
    domain: "Design Systems, Color Science & Perceptual Contrast",
    description: "Synthesizes 50-950 Tailwind CSS v4 color palettes from a single seed hex, audits WCAG 2.1 AA/AAA contrast compliance, and generates CSS Glassmorphism tokens.",
    skills: ["oklchPaletteSynthesizer", "wcagContrastAuditor", "tailwindThemeExporter", "glassmorphismTuner", "darkModeTokenMapper"],
    systemRules: [
      "Calculate exact relative luminance per WCAG 2.1 standard (minimum 4.5:1 for AA normal text, 7:1 for AAA).",
      "Generate 11 shade stops (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) with perceptual smoothness.",
      "Output clean @theme Tailwind v4 and :root CSS custom properties.",
    ],
    popularRank: 98,
    viralityPoints: 2100,
    icon: "Palette",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400",
    presets: [
      {
        label: "Tailwind v4 Brand Palette from Hex",
        description: "Generate 50-950 stops from #0284c7 with WCAG contrast audit.",
        input: "Seed Hex: #0284c7. Generate 11 Tailwind v4 shade stops, compute contrast against #000000 and #ffffff, and export @theme CSS block.",
      },
      {
        label: "WCAG 2.1 Contrast Audit Matrix",
        description: "Evaluate foreground/background combinations for AA and AAA compliance.",
        input: "Audit text color #3b82f6 against #0f172a (dark) and #ffffff (light). Provide contrast ratio, AA/AAA status, and accessible alternative if failing.",
      },
      {
        label: "Frosted Glassmorphism CSS System",
        description: "Generate cross-browser backdrop-filter glass card tokens.",
        input: "Design 3 tiers of glass cards (Subtle, Frosted, High-Contrast) with blur, border alpha, and fallback background for unsupported browsers.",
      },
    ],
  },
  {
    id: "health-routine",
    name: "HealthRoutine Agent",
    tagline: "Prescription Dose Parser, Pill Refill Alerts & BMI Meal Routine Planner",
    category: "Everyday & Family",
    domain: "Personal Health Informatics & Medication Adherence",
    description: "Parses Bangladeshi medical dosage shorthands (1+0+1, 0+0+1), computes pill stock depletion dates, generates RFC 5545 calendar alarms, and calculates Mifflin-St Jeor daily caloric targets.",
    skills: ["doseNotationParser", "pillDepletionForecaster", "calendarAlarmSynthesizer", "tdeeCaloriePlanner", "emergencyMedicalIdEncoder"],
    systemRules: [
      "Interpret standard 1+0+1 medical notation accurately (morning/noon/night).",
      "Calculate exact days until zero stock and recommend 3-day advance pharmacy refill alerts.",
      "Apply Asian-Pacific WHO BMI thresholds (Overweight ≥23, Obese ≥25).",
    ],
    popularRank: 96,
    viralityPoints: 1750,
    icon: "HeartPulse",
    color: "from-rose-500/20 to-red-500/20 text-rose-500",
    presets: [
      {
        label: "Prescription Dose & Calendar Alarm Generator",
        description: "Parse multiple medications and output calendar reminders.",
        input: "Tab Napa Extra (1+0+1 after meal, 10 days), Cap Seclo 20mg (1+0+0 before meal, 14 days). Generate reminder schedule.",
      },
      {
        label: "Pill Depletion & Refill Cost Forecast",
        description: "Calculate exact refill runout date and monthly expense.",
        input: "Stock: 30 tablets. Dosage: 1+0+1 daily. Strip price: ৳35 per 10 tablets. Calculate runout date and monthly cost.",
      },
      {
        label: "Mifflin-St Jeor TDEE & Deficit Plan",
        description: "Calculate daily maintenance calories and safe weight-loss deficit.",
        input: "Male, 28 years old, 78 kg, 175 cm, moderate activity (exercise 3-5 days/week). Recommend target daily calories for 0.5kg/week fat loss.",
      },
    ],
  },
  {
    id: "academic-coach",
    name: "AcademicCoach Agent",
    tagline: "SSC/HSC GPA Predictor, UGC Semester CGPA Target Solver & BCS Roadmap",
    category: "Education & Career",
    domain: "Academic Performance Engineering & Target Solving",
    description: "Calculates Education Board SSC/HSC GPA with 4th-subject bonus points, solves required future semester grades for graduation CGPA honors targets, and audits BCS eligibility.",
    skills: ["fourthSubjectBonusCalculator", "goldenAPlusAuditor", "targetCgpaReverseSolver", "bcsAgeCutoffValidator", "studyMilestonePlanner"],
    systemRules: [
      "Apply Bangladesh Education Board rule: 4th-subject GPA points above 2.00 add up to 3.00 bonus points.",
      "Enforce maximum GPA 5.00 ceiling and detect all-subject 5.00 Golden A+ conditions.",
      "Solve reverse required GPA algebraically across remaining credits.",
    ],
    popularRank: 97,
    viralityPoints: 2150,
    icon: "GraduationCap",
    color: "from-indigo-500/20 to-blue-500/20 text-indigo-400",
    presets: [
      {
        label: "HSC Science GPA with 4th Subject",
        description: "Calculate final GPA considering Biology 4th subject bonus points.",
        input: "Bangla: 5.0, English: 4.0, Physics: 5.0, Chemistry: 5.0, Higher Math: 4.0, Biology (4th): 5.0. Calculate final GPA and Golden A+ status.",
      },
      {
        label: "University Target CGPA Solver",
        description: "Calculate what GPA is required in remaining 3 semesters to graduate with 3.75.",
        input: "Current CGPA: 3.52 after 72 credits. Target: 3.75 after 130 credits. What minimum average GPA is required in remaining 58 credits?",
      },
      {
        label: "BCS Govt Job Eligibility Audit",
        description: "Check exact age and graduation qualification against BPSC 32y cutoff.",
        input: "Date of Birth: 1996-03-22. General candidate. Audit age on current date and verify eligibility for upcoming BCS exam.",
      },
    ],
  },
  {
    id: "family-cfo",
    name: "FamilyCFO Agent",
    tagline: "50/30/20 Family Budget, Sanchaypatra TDS & BAJUS Gold Nisab Zakat Reconciler",
    category: "Business & Accounting",
    domain: "Household Financial Health, Islamic Wealth & Savings",
    description: "Audits monthly household income against 50/30/20 allocation rules, forecasts National Savings Certificate net monthly cash after source tax, and calculates authentic 2.5% Zakat.",
    skills: ["familyBudgetAllocator", "sanchaypatraTierForecaster", "nisabThresholdEvaluator", "loanEmiStressTester", "wealthBalanceAuditor"],
    systemRules: [
      "Distribute income: 50% Needs, 30% Wants, 20% Savings/DPS/Debt.",
      "Evaluate Zakat Nisab against BAJUS 52.5 Vori silver or 7.5 Vori gold.",
      "Apply 5% or 10% TDS deduction for National Sanchaypatra tiers.",
    ],
    popularRank: 99,
    viralityPoints: 2600,
    icon: "Receipt",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    presets: [
      {
        label: "Family 50/30/20 Monthly Budget Plan",
        description: "Allocate ৳85,000 monthly income into rent, groceries, leisure, and emergency fund.",
        input: "Monthly Household Income: ৳85,000. Family of 4 living in Dhaka. Generate optimal 50/30/20 budget with savings targets.",
      },
      {
        label: "Annual Zakat Calculation on Savings & Gold",
        description: "Calculate 2.5% Zakat on cash, DPS, and 6 Vori gold jewellery.",
        input: "Cash in bank: ৳4,50,000, DPS value: ৳1,20,000, Gold: 6 Vori (current BAJUS rate ৳1,20,000/vori), Loan owed: ৳50,000. Calculate net Zakat.",
      },
      {
        label: "৳20 Lakh Sanchaypatra vs Bank FDR Comparison",
        description: "Compare net monthly cash flow between Paribar Sanchaypatra and 10% Bank FDR.",
        input: "Investment: ৳20,00,000. Compare 5-Year Paribar Sanchaypatra (with 10% tax) vs Commercial Bank FDR @ 10.5% (with 10% tax). Show monthly payout.",
      },
    ],
  },
  {
    id: "autonomous-curator",
    name: "AutonomousCurator Agent",
    tagline: "Live Repo, Tech News & Everyday Hack Synthesis Engine Powering OS Brain",
    category: "DevOps & Linux",
    domain: "Autonomous Knowledge Synthesis & Feed Curation",
    description: "Continuously scans GitHub releases, developer hacks, Bangladesh tech spikes, and AI breakthroughs to synthesize verified Bangla summaries and deterministic vector covers for sabbir.nav.bd.",
    skills: ["techPulseSynthesizer", "coverSvgGenerator", "sha256DeterministicHasher", "banglaSummaryComposer", "osBrainTelemetrySync"],
    systemRules: [
      "Filter out clickbait; verify technical novelty and practical developer utility.",
      "Generate 16:9 modern SVG covers using deterministic seed hashing.",
      "Compose concise, human-grade Bengali summaries without robotic filler phrases.",
    ],
    popularRank: 99,
    viralityPoints: 2950,
    icon: "Cpu",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400",
    presets: [
      {
        label: "Curate Open Source GitHub Release",
        description: "Synthesize release notes and generate deterministic cover metadata.",
        input: "Repo: vercel/next.js v15.1. Extract key features (Turbopack stable, React 19), generate Bangla summary, and craft SVG cover seed.",
      },
      {
        label: "Synthesize Everyday Developer Hack",
        description: "Document clean one-liner for Linux or Git workflow.",
        input: "Topic: Git interactive rebase and surgical commit squashing. Craft actionable 30-second hack with code snippet and visual badge.",
      },
      {
        label: "Autonomous OS Brain Telemetry Check",
        description: "Audit current OS Brain catalog, sync count, and health heartbeat.",
        input: "Execute autonomous scan across /news, /open-source, and /hacks. Verify 0 dead links and compute global health score.",
      },
    ],
  },
];
