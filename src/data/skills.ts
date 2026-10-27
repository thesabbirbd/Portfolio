export interface SkillItem {
  name: string;
  context: string;
  level?: "Foundational" | "Hands-on" | "Active Focus";
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  color: "cyan" | "purple" | "emerald" | "blue";
  skills: SkillItem[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "it-support",
    title: "IT Support & Systems",
    icon: "Wrench",
    tagline: "Troubleshooting, diagnostics and day-to-day support",
    color: "emerald",
    skills: [
      { name: "Hardware Troubleshooting", context: "Diagnosing and repairing desktop hardware failures (MR Computer)", level: "Hands-on" },
      { name: "Software Troubleshooting", context: "L1/L2 support for the Netfee ISP billing platform (Shunno IT)", level: "Hands-on" },
      { name: "System Diagnostics", context: "OS errors, driver issues and LAN connectivity problems", level: "Hands-on" },
      { name: "PC Setup & Maintenance", context: "Installing and maintaining operating systems, software and peripherals", level: "Hands-on" },
      { name: "Basic System Administration", context: "Users, packages and services on Linux and Windows machines", level: "Hands-on" },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    icon: "Server",
    tagline: "APIs, validation and relational data modelling",
    color: "blue",
    skills: [
      { name: "Python", context: "Primary language for APIs, automation, and data scripting", level: "Active Focus" },
      { name: "FastAPI", context: "Asynchronous RESTful APIs with Pydantic validation", level: "Active Focus" },
      { name: "REST APIs", context: "Resource design, routing and JSON schemas", level: "Active Focus" },
      { name: "PostgreSQL", context: "Relational data modeling, connection pooling, and indexing", level: "Active Focus" },
      { name: "Redis", context: "Caching layer in FastAPI prototypes", level: "Hands-on" },
      { name: "Node.js", context: "Working knowledge for small scripts and tooling", level: "Foundational" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Systems",
    icon: "Container",
    tagline: "Containers, Linux environments and reproducible setups",
    color: "cyan",
    skills: [
      { name: "Docker", context: "Containerizing services, multi-stage builds, and Compose", level: "Active Focus" },
      { name: "Linux", context: "System administration, POSIX environments, and CLI workflows", level: "Hands-on" },
      { name: "Ubuntu", context: "Daily driver, server configuration, and environment tuning", level: "Hands-on" },
      { name: "GNU Bash", context: "Automating repetitive tasks, backups, and pipeline hooks", level: "Hands-on" },
      { name: "Nginx", context: "Reverse proxy on a local Ubuntu server", level: "Hands-on" },
      { name: "systemd", context: "Running and managing services on Linux", level: "Hands-on" },
      { name: "CI/CD Foundations", context: "Automated test integration and deployment workflows", level: "Foundational" },
    ],
  },
  {
    id: "networking",
    title: "Networking & NOC",
    icon: "Network",
    tagline: "Packet flow, routing and network monitoring",
    color: "emerald",
    skills: [
      { name: "TCP/IP & DNS", context: "Core packet flow understanding, subnetting, and name resolution", level: "Hands-on" },
      { name: "DHCP & Routing", context: "Address assignment and static/dynamic routing basics", level: "Hands-on" },
      { name: "Wireshark", context: "Packet captures alongside ping and traceroute for diagnostics", level: "Hands-on" },
      { name: "NOC Surveillance", context: "Assisting NOC staff with link-failure diagnostics and customer connection issues (Shunno IT)", level: "Hands-on" },
      { name: "MikroTik Routing", context: "RouterOS configuration, bandwidth queues and firewall rules in a home lab", level: "Hands-on" },
      { name: "Cisco Networking", context: "Packet Tracer simulations, VLANs, and routing fundamentals", level: "Foundational" },
      { name: "Traffic Analysis", context: "Diagnosing bottlenecks, latency, and packet drops", level: "Hands-on" },
    ],
  },
  {
    id: "ai-data",
    title: "AI, Data & Local Systems",
    icon: "Brain",
    tagline: "Local inference and practical data analysis",
    color: "purple",
    skills: [
      { name: "Ollama", context: "Deploying and managing offline LLM inference locally", level: "Active Focus" },
      { name: "Local AI & Quantization", context: "Running lightweight GGUF models on dedicated GPUs", level: "Active Focus" },
      { name: "Python Data Science", context: "Data manipulation and cleaning via Pandas and NumPy", level: "Hands-on" },
      { name: "Data Visualization", context: "Actionable charting and trends with Matplotlib and Seaborn", level: "Hands-on" },
      { name: "AI-assisted Development", context: "Using AI tools to prototype, document and automate workflows", level: "Hands-on" },
      { name: "Model Experimentation", context: "Comparing small local models for specific tasks", level: "Hands-on" },
      { name: "RAG Concepts", context: "Retrieval-augmented generation — studied, early experiments", level: "Foundational" },
      { name: "AI in Immersive Technology", context: "NSDA Level-6 training (360 hours, 2026)", level: "Foundational" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    icon: "Cloud",
    tagline: "VPS administration and cloud fundamentals",
    color: "blue",
    skills: [
      { name: "Cloud Engineering V1", context: "Muktopaath Certified foundational cloud architecture", level: "Hands-on" },
      { name: "AWS Exploration", context: "EC2 instances, S3 storage, and foundational cloud security", level: "Foundational" },
      { name: "VPS Administration", context: "Provisioning remote Linux servers, SSH keys and reverse proxies", level: "Hands-on" },
    ],
  },
  {
    id: "creative",
    title: "Creative Technology",
    icon: "Video",
    tagline: "Live production, photography and post-production",
    color: "purple",
    skills: [
      { name: "OBS Studio", context: "Multi-camera live streaming and virtual signal routing", level: "Hands-on" },
      { name: "Adobe Premiere Pro", context: "Editing, pacing and colour correction", level: "Hands-on" },
      { name: "DaVinci Resolve", context: "Color grading, timeline editing and video mastering", level: "Hands-on" },
      { name: "360° Photography", context: "Spherical captures for Google Street View and virtual tours", level: "Hands-on" },
      { name: "Photography & Videography", context: "Event and campaign shoots, framing and lighting", level: "Hands-on" },
      { name: "Social Media Marketing", context: "Content for digital campaigns (Aditi)", level: "Hands-on" },
    ],
  },
  {
    id: "hardware",
    title: "Hardware & Electronics",
    icon: "Cpu",
    tagline: "Power units, audio circuits and GPU tuning",
    color: "emerald",
    skills: [
      { name: "GPU VRAM Tuning", context: "Optimizing dedicated GPU resources for offline model loading", level: "Hands-on" },
      { name: "DIY UPS Systems", context: "Custom backup power packs for uninterrupted workstation power", level: "Hands-on" },
      { name: "Solar Setups", context: "Off-grid DC charging and solar storage systems", level: "Hands-on" },
      { name: "Transistor Amplifiers", context: "Assembling discrete multi-transistor audio amplifier circuits", level: "Hands-on" },
    ],
  },
];
