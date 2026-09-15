export interface ProjectItem {
  id: string;
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
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "omnidesk-bd",
    title: "Omnidesk BD",
    category: "Featured",
    featured: true,
    shortDescription: "A Local-First Universal Learning Engine & AI-Powered Multi-Domain Study Workspace.",
    longDescription:
      "Omnidesk BD is my flagship master engineering project — a sophisticated ecosystem designed to ingest, process, and track technical learning materials completely offline. Built to eliminate cognitive fragmentation by pairing offline AI assistance (via Ollama) with high-speed local data persistence (PostgreSQL + FastAPI) wrapped in a modern, distraction-free spatial interface.",
    technologies: ["FastAPI", "PostgreSQL", "Docker", "Ollama", "Python", "PWA"],
    architecture: "Local-First Core / Asynchronous REST Tier / Local Vector & Relational Storage",
    highlights: [
      "100% Offline Capability: Operates with zero external internet dependencies for air-gapped study sessions",
      "Local LLM Orchestration: Integrates lightweight quantized models directly through Ollama API hooks",
      "Asynchronous Backend: FastAPI engine with async connection pooling and PostgreSQL relational schemas",
      "Containerized Dev Stack: Multi-container Docker environment for repeatable local deployments",
    ],
    status: "Active Engineering",
    year: "2025 - 2026",
    githubUrl: "https://github.com/thesabbirbd/Omnidesk-BD",
    gradient: "from-blue-600/25 via-cyan-500/20 to-purple-600/20",
    stats: [
      { label: "Execution Mode", value: "Local-First" },
      { label: "AI Engine", value: "Offline Ollama" },
      { label: "Backend", value: "FastAPI + asyncpg" },
      { label: "Data Store", value: "PostgreSQL" },
    ],
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
    status: "Active R&D",
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
    status: "Benchmark Active",
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
      "Built during hands-on NOC support and MTCNA training. Designed multi-subnet routing tables, bandwidth queues (simple and tree), failover gateway scripts, and firewall connection-tracking filters.",
    technologies: ["RouterOS", "MikroTik", "TCP/IP", "Wireshark", "VLANs"],
    architecture: "Layer 3 Routing / Firewall Rules / Quality of Service (QoS)",
    highlights: [
      "Constructed failover scripts that automatically switch active WAN gateways upon ping timeout",
      "Filtered unwanted ICMP and broadcast storms to preserve internal network bandwidth",
    ],
    status: "Production Bench",
    year: "2025",
    gradient: "from-blue-600/20 via-emerald-500/20 to-transparent",
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
    status: "Field Operational",
    year: "2024 - 2025",
    gradient: "from-amber-500/20 via-emerald-500/20 to-transparent",
  },
];
