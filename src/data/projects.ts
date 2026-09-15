export interface ProjectItem {
  id: string;
  title: string;
  category: "Systems" | "AI" | "Creative" | "Community";
  description: string;
  technologies: string[];
  status: string;
  year: string;
  githubUrl?: string;
  liveUrl?: string;
  gradient: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "virtual-display",
    title: "Linux Virtual Display Driver Lab",
    category: "Systems",
    description: "Configuring headless GPU rendering pipelines, custom resolutions, and low-latency virtual display buffers on Linux environments.",
    technologies: ["Linux", "X11 / Wayland", "Bash", "Kernel Drivers"],
    status: "Active R&D",
    year: "2025",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-blue-600/20 via-cyan-500/20 to-transparent",
  },
  {
    id: "web-to-app",
    title: "Web-to-App Hybrid Native Bridge",
    category: "Systems",
    description: "Architecting a multi-platform bridge embedding high-throughput web dashboards into native Android runtimes with offline caching.",
    technologies: ["Flutter", "Android", "TypeScript", "REST"],
    status: "Completed",
    year: "2025",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-cyan-500/20 via-blue-500/20 to-transparent",
  },
  {
    id: "ollama-bench",
    title: "Local LLM Inference Optimization",
    category: "AI",
    description: "Benchmarking prompt evaluation times, token generation speeds, and VRAM quantization for Llama and Mistral local models on Ollama.",
    technologies: ["Ollama", "Python", "CUDA", "FastAPI"],
    status: "Benchmark Active",
    year: "2026",
    githubUrl: "https://github.com/thesabbirbd",
    gradient: "from-purple-600/20 via-pink-500/20 to-transparent",
  },
  {
    id: "noc-router",
    title: "Mikrotik NOC Routing & Packet Lab",
    category: "Systems",
    description: "High-availability router configuration, firewall filtering rules, VLAN segmenting, and 24/7 uptime surveillance benches.",
    technologies: ["RouterOS", "Mikrotik", "TCP/IP", "Wireshark"],
    status: "Production Bench",
    year: "2025",
    gradient: "from-blue-600/20 via-indigo-500/20 to-transparent",
  },
  {
    id: "google-maps-360",
    title: "Google Street View 360° Geospatial Mapping",
    category: "Community",
    description: "Capturing and publishing high-resolution spherical geospatial imagery across Rajshahi and Bangladesh, earning direct Google HQ recognition.",
    technologies: ["Google Maps API", "360° Imaging", "Geospatial", "HDR"],
    status: "Continuous Milestone",
    year: "2024 - 2026",
    liveUrl: "https://www.google.com/maps/contrib/115922089427483699024",
    gradient: "from-emerald-500/20 via-teal-500/20 to-transparent",
  },
  {
    id: "custom-ups",
    title: "Off-Grid Solar & Custom UPS Hardware",
    category: "Creative",
    description: "Engineering custom battery management systems (BMS), multi-transistor audio amplifiers, and resilient DC solar power setups.",
    technologies: ["Power Electronics", "BMS", "Solar Inverters", "Soldering"],
    status: "Field Operational",
    year: "2024",
    gradient: "from-amber-500/20 via-orange-500/20 to-transparent",
  },
];
