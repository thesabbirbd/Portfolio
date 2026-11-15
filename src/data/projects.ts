export interface ProjectItem {
  id: string;
  /** MDX case-study slug under content/projects when it differs from `id`. */
  slug?: string;
  title: string;
  category: "Featured" | "Backend" | "Systems" | "AI" | "Hardware" | "Community";
  shortDescription: string;
  longDescription: string;
  technologies: string[];
  status: string;
  year: string;
  featured?: boolean;
  architecture?: string;
  highlights?: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  gradient: string;
  stats?: { label: string; value: string }[];
  heroImage?: string;
  gallery?: string[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "omnidesk-bd",
    slug: "omnidesk",
    title: "Omnidesk BD",
    category: "Featured",
    featured: true,
    shortDescription: "A local-first learning and engineering workspace that turns study material into a visual DAG roadmap, gates progress on real competency, and keeps working offline.",
    longDescription:
      "Omnidesk BD ingests PDFs, Markdown, text and YouTube transcripts, turns them into a source-linked topic graph, and only marks a topic done once it has been explained, implemented and debugged. A FastAPI + PostgreSQL backend sits behind a React client, with an AI cascade (Gemini free tier → local Ollama → offline heuristic) so the workspace never depends on a paid key or a connection.",
    technologies: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Redis", "Ollama", "React", "Tauri", "Docker"],
    architecture: "React Client / FastAPI Gateway / Ingestion + AI Cascade + Scheduler / PostgreSQL + Redis",
    highlights: [
      "Multi-format ingestion (PDF, Markdown, text, YouTube transcripts) with SHA-256 source provenance",
      "Analyze → Preview → Approve flow: AI-generated roadmaps are never saved without review",
      "Visual DAG roadmap (React Flow) backed by a PostgreSQL topic graph",
      "Three-tier AI cascade with an offline fallback; packaged for desktop with Tauri",
    ],
    status: "Active Development",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd/Omnidesk-BD",
    gradient: "from-blue-600/25 via-cyan-500/20 to-purple-600/20",
    stats: [
      { label: "Execution Mode", value: "Local-First" },
      { label: "AI Engine", value: "Gemini → Ollama → Offline" },
      { label: "Backend", value: "FastAPI + SQLAlchemy" },
      { label: "Data Store", value: "PostgreSQL" },
    ],
  },
  {
    id: "khata2sheet-ai",
    title: "Khata2Sheet AI",
    category: "AI",
    featured: true,
    shortDescription: "A local-first document processing pipeline that extracts handwritten and printed Bengali khata ledger entries into structured spreadsheets without cloud API costs.",
    longDescription:
      "Khata2Sheet AI takes photos or scans of traditional retail shop credit ledgers (baki khata), performs perspective rectification with OpenCV, clusters text tokens into accounting columns, and exports validated Bengali currency figures directly into Google Sheets and Excel.",
    technologies: ["Python", "OpenCV", "Tesseract", "FastAPI", "Pandas"],
    architecture: "Document Skew Correction / Bengali Binarization / Column Clustering / XLSX Exporter",
    highlights: [
      "OpenCV contour boundary detection and 300 DPI perspective rectification",
      "Bengali numeral recognition and mathematical balance integrity validation",
      "100% offline edge execution ensuring zero financial data leakage",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd/khata2sheet-ai",
    gradient: "from-emerald-600/25 via-teal-500/20 to-cyan-600/20",
    stats: [
      { label: "Pipeline", value: "Computer Vision + OCR" },
      { label: "Language", value: "Bengali + English" },
      { label: "Privacy", value: "Zero Cloud API Leaks" },
      { label: "Export", value: "Excel / Google Sheets" },
    ],
  },
  {
    id: "sara-control-plane",
    title: "S.A.R.A. Task Control Plane",
    category: "Systems",
    featured: true,
    shortDescription: "A resilient background orchestration plane managing asynchronous local tasks, system health checks, cron triggers, and bidirectional Telegram alerts.",
    longDescription:
      "S.A.R.A. (System Automation & Remote Agent) turns an authenticated private Telegram chat into a secure remote command center for developer workstations and homelab servers without opening dangerous WAN ports.",
    technologies: ["Python", "FastAPI", "SQLite", "Telegram Bot API", "systemd", "Linux"],
    architecture: "Telegram Webhook Listener / SQLite Priority Queue / Subprocess Worker Pool",
    highlights: [
      "Secure authenticated remote operations via hashed user token gating",
      "Durable SQLite task queue with atomic state persistence across reboots",
      "Proactive alerts for hardware thresholds (CPU, RAM, disk, and UPS power loss)",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd/sara-control-plane",
    gradient: "from-purple-600/25 via-indigo-500/20 to-blue-600/20",
    stats: [
      { label: "Interface", value: "Telegram Bot API" },
      { label: "Queue", value: "SQLite WAL" },
      { label: "Daemon", value: "Linux systemd" },
      { label: "Security", value: "Zero WAN Ports" },
    ],
  },
  {
    id: "wa-reminder-companion",
    title: "WA Reminder Companion",
    category: "Backend",
    featured: false,
    shortDescription: "A lightweight, headless automation daemon that sends scheduled due payment reminders and invoice receipts to retail pharmacy clients with zero paid API overhead.",
    longDescription:
      "WA Reminder Companion bridges POS database records with headless browser dispatchers to send polite, formatted invoice reminders to pharmacy credit customers with rate-limiting and humanized jitter.",
    technologies: ["Python", "Playwright", "FastAPI", "SQLite", "systemd"],
    architecture: "POS Webhook Receiver / SQLite Event Queue / Headless Dispatcher",
    highlights: [
      "Idempotent task hash preventing duplicate reminder dispatching",
      "Configurable random human jitter delays between consecutive messages",
      "Real-time delivery confirmation and audit logging via Telegram channel",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd/wa-reminder-companion",
    gradient: "from-teal-600/20 via-emerald-500/20 to-transparent",
  },
  {
    id: "studyos",
    title: "StudyOS (Local AI Prototype)",
    category: "AI",
    featured: false,
    shortDescription: "An experimental, fully local AI orchestration layer designed to manage personal tasks, learning workflows, and system automation without cloud dependencies.",
    longDescription:
      "StudyOS began as a research experiment into data sovereignty. Built with Python and FastAPI, it intercepts commands, queries local quantized models via Ollama (Qwen 0.5B / Llama 3), and coordinates task execution without leaking tokens or private data to third-party clouds.",
    technologies: ["Ollama", "Python", "FastAPI", "Bash", "Local Vector DB"],
    architecture: "CLI Interface / Python Orchestrator / Ollama Daemon / System Shell",
    highlights: [
      "Zero-cloud offline task orchestration with local LLM function calling",
      "Benchmarked structured JSON output stability on quantized small-parameter models",
      "Gated shell execution sandbox with defensive error recovery",
    ],
    status: "Experimental",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-blue-600/20 via-indigo-500/20 to-transparent",
  },
  {
    id: "virtual-display",
    title: "Linux Virtual Display Driver Lab",
    category: "Systems",
    featured: false,
    shortDescription: "Configuring headless GPU rendering pipelines, custom resolutions, and low-latency virtual display buffers on Linux.",
    longDescription:
      "A systems project focused on headless Linux rendering pipelines. Configured virtual framebuffers, EDID overrides, and dummy displays to enable hardware-accelerated remote desktops and headless OBS video generation pipelines.",
    technologies: ["Linux", "X11 / Wayland", "GNU Bash", "Kernel Modules", "GPU Buffers"],
    architecture: "Kernel Level Display Emulation / Framebuffer Capture",
    highlights: [
      "Configured dummy EDID configurations for true 1080p60 headless video rendering",
      "Automated virtual display activation using modular systemd service hooks",
    ],
    status: "Experimental",
    year: "2025",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-cyan-500/20 via-blue-500/20 to-transparent",
  },
  {
    id: "web-to-app",
    title: "Web-to-App Hybrid Native Bridge",
    category: "Systems",
    featured: false,
    shortDescription: "Architecting a multi-platform bridge embedding high-throughput web dashboards into native Android runtimes with offline caching.",
    longDescription:
      "Explored hybrid mobile application architecture by embedding responsive web dashboard engines inside native Android WebView containers with localized service-worker caching and biometric auth integration.",
    technologies: ["Flutter / Android", "TypeScript", "REST APIs", "Service Workers"],
    architecture: "Native WebView Wrapper with Local Caching Layer",
    highlights: [
      "Reduced cold start latency via aggressive local asset caching",
      "Integrated bi-directional JavaScript bridge for native device event hooks",
    ],
    status: "Completed",
    year: "2025",
    githubUrl: "https://github.com/thesabbirbd/web-to-app",
    gradient: "from-blue-600/20 via-indigo-500/20 to-transparent",
  },
  {
    id: "ollama-bench",
    title: "Local LLM Inference Optimization",
    category: "AI",
    featured: false,
    shortDescription: "Benchmarking prompt evaluation times, token generation speeds, and VRAM quantization for local models on Ollama.",
    longDescription:
      "A systematic benchmarking suite measuring tokens-per-second, memory fragmentation, and GPU offloading across quantized 4-bit and 8-bit GGUF models running locally on dedicated GPU hardware.",
    technologies: ["Ollama", "Python", "CUDA", "FastAPI", "GGUF Quantization"],
    architecture: "Benchmarking Pipeline with Automated Latency Metrics",
    highlights: [
      "Compared 8-bit vs 4-bit quantization impacts on token evaluation speeds",
      "Documented GPU memory bandwidth bottlenecks during extended context window evaluations",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-purple-600/20 via-pink-500/20 to-transparent",
  },
  {
    id: "noc-router",
    title: "MikroTik NOC Routing & Packet Lab",
    category: "Systems",
    featured: false,
    shortDescription: "High-availability router configuration, firewall filtering rules, VLAN segmenting, and 24/7 uptime surveillance benches.",
    longDescription:
      "A home lab for practising MikroTik and NOC concepts. Designed multi-subnet routing tables, bandwidth queues (simple and tree), failover gateway scripts, and firewall connection-tracking filters.",
    technologies: ["RouterOS", "MikroTik", "TCP/IP", "Wireshark", "VLANs"],
    architecture: "Layer 3 Routing / Firewall Rules / Quality of Service (QoS)",
    highlights: [
      "Constructed failover scripts that automatically switch active WAN gateways upon ping timeout",
      "Filtered unwanted ICMP and broadcast storms to preserve internal network bandwidth",
    ],
    status: "Active lab",
    year: "2025",
    gradient: "from-blue-600/20 via-emerald-500/20 to-transparent",
  },
  {
    id: "netpulse-tg",
    title: "NetPulse TG — ISP Watchdog",
    category: "Systems",
    featured: true,
    shortDescription: "MikroTik RouterOS & ISP Uptime Watchdog with Sub-Second Jitter Detection and Telegram Outage Alerts.",
    longDescription:
      "NetPulse TG monitors upstream ISP gateway latency and packet jitter in real time. Whenever packet loss exceeds defined thresholds or routes drop, it instantly dispatches rich Markdown notifications to your operations Telegram channel.",
    technologies: ["Python", "FastAPI", "Docker", "Telegram Bot API", "MikroTik RouterOS", "Prometheus"],
    architecture: "Gateway ICMP & TCP Probe / Jitter Evaluator / Incident State Machine / Telegram Alert Dispatcher",
    highlights: [
      "Sub-second ICMP prober measuring jitter against reference DNS and BDIX peers",
      "Suppresses false alarms via moving average window and soft-degradation alerting",
      "Automates gateway failover via direct MikroTik RouterOS API integration",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbir/netpulse-tg",
    gradient: "from-cyan-600/25 via-blue-500/20 to-emerald-600/20",
    stats: [
      { label: "Target", value: "MikroTik & ISP Watch" },
      { label: "Alerting", value: "Telegram Markdown" },
      { label: "Runtime", value: "Docker / Linux Edge" },
      { label: "Failover", value: "Sub-Second" },
    ],
  },
  {
    id: "bd-biz-normalizer",
    title: "BD Biz Normalizer",
    category: "Backend",
    featured: true,
    shortDescription: "Fast Bangladeshi Phone Number, Geo District, and SME Customer Normalizer with E.164 standardization.",
    longDescription:
      "Deterministic data normalization library for Bangladeshi phone numbers, administrative regions, and Bengali numerals with zero cloud API overhead and 50k records/sec throughput.",
    technologies: ["Python", "FastAPI", "Regex", "E.164", "Pydantic", "TypeScript"],
    architecture: "Ingestion / Bengali Numeral Normalizer / E.164 Operator Classifier / District Resolver",
    highlights: [
      "Strict E.164 telco operator detection for GP, Banglalink, Robi, Airtel, and Teletalk",
      "Bidirectional transliteration between Bengali (০-৯) and standard ASCII numerals",
      "Fuzzy administrative district and upazila resolver for 64 districts",
    ],
    status: "Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbir/bd-biz-normalizer",
    gradient: "from-emerald-600/25 via-teal-500/20 to-blue-600/20",
    stats: [
      { label: "Throughput", value: "50,000 rec/sec" },
      { label: "Standard", value: "ITU-T E.164 BD" },
      { label: "Coverage", value: "64 Districts / 495 Thanas" },
      { label: "Zero-Cloud", value: "100% Offline" },
    ],
  },
  {
    id: "custom-ups",
    title: "Off-Grid Solar & Custom UPS Hardware",
    category: "Hardware",
    featured: false,
    shortDescription: "Engineering custom battery management systems (BMS), multi-transistor audio amplifiers, and resilient DC solar power setups.",
    longDescription:
      "Hands-on electronics engineering project building uninterruptible power units with instant relay switching, solar charge regulation, and analog audio circuits built with discrete power transistors.",
    technologies: ["Power Electronics", "BMS", "Solar DC Inverter", "Analog Circuits"],
    architecture: "Hardware Power Management & DC Power Supply Architecture",
    highlights: [
      "Zero-downtime cutover circuit preventing desktop restarts during grid outages",
      "Off-grid DC solar charging loop with overcharge and deep-discharge protection",
    ],
    status: "Completed",
    year: "2024 - 2025",
    gradient: "from-amber-500/20 via-emerald-500/20 to-transparent",
  },
];

/** Route of the full case-study page for a project. */
export function projectHref(project: Pick<ProjectItem, "id" | "slug">) {
  return `/projects/${project.slug ?? project.id}`;
}
