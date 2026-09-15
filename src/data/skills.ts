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
    id: "backend",
    title: "Backend & APIs",
    icon: "Server",
    tagline: "High-throughput APIs & relational data architecture",
    color: "blue",
    skills: [
      { name: "Python", context: "Primary language for APIs, automation, and data scripting", level: "Active Focus" },
      { name: "FastAPI", context: "Asynchronous RESTful APIs with Pydantic validation", level: "Active Focus" },
      { name: "REST APIs", context: "Stateless microservice design, routing, and JSON schemas", level: "Active Focus" },
      { name: "PostgreSQL", context: "Relational data modeling, connection pooling, and indexing", level: "Active Focus" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Systems",
    icon: "Container",
    tagline: "Containerization, reproducibility & Linux environments",
    color: "cyan",
    skills: [
      { name: "Docker", context: "Containerizing services, multi-stage builds, and Compose", level: "Active Focus" },
      { name: "Linux", context: "System administration, POSIX environments, and CLI workflows", level: "Hands-on" },
      { name: "Ubuntu", context: "Daily driver, server configuration, and environment tuning", level: "Hands-on" },
      { name: "GNU Bash", context: "Automating repetitive tasks, backups, and pipeline hooks", level: "Hands-on" },
      { name: "CI/CD Foundations", context: "Automated test integration and deployment workflows", level: "Foundational" },
    ],
  },
  {
    id: "networking",
    title: "Networking & NOC",
    icon: "Network",
    tagline: "High availability, packet flow & infrastructure reliability",
    color: "emerald",
    skills: [
      { name: "TCP/IP & DNS", context: "Core packet flow understanding, subnetting, and name resolution", level: "Hands-on" },
      { name: "NOC Surveillance", context: "Real-time network health checks and incident mitigation", level: "Hands-on" },
      { name: "MikroTik Routing", context: "RouterOS configuration, bandwidth queues, and MTCNA concepts", level: "Hands-on" },
      { name: "Traffic Analysis", context: "Diagnosing bottlenecks, latency, and packet drops", level: "Hands-on" },
    ],
  },
  {
    id: "ai-data",
    title: "AI, Data & Local Systems",
    icon: "Brain",
    tagline: "Local inference, mathematical exploration & data insights",
    color: "purple",
    skills: [
      { name: "Ollama", context: "Deploying and managing offline LLM inference locally", level: "Active Focus" },
      { name: "Local AI & Quantization", context: "Running lightweight GGUF models on dedicated GPUs", level: "Active Focus" },
      { name: "Python Data Science", context: "Data manipulation and cleaning via Pandas and NumPy", level: "Hands-on" },
      { name: "Data Visualization", context: "Actionable charting and trends with Matplotlib and Seaborn", level: "Hands-on" },
      { name: "AI/ML/XR Exposure", context: "Ongoing research into spatial and multimodal technologies", level: "Foundational" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    icon: "Cloud",
    tagline: "Scalable hosting, VPS administration & cloud fundamentals",
    color: "blue",
    skills: [
      { name: "Cloud Engineering V1", context: "Muktopaath Certified foundational cloud architecture", level: "Hands-on" },
      { name: "AWS Exploration", context: "EC2 instances, S3 storage, and foundational cloud security", level: "Foundational" },
      { name: "VPS Orchestration", context: "Provisioning remote Linux nodes, SSH keys, and reverse proxies", level: "Hands-on" },
    ],
  },
  {
    id: "creative",
    title: "Creative Technology",
    icon: "Video",
    tagline: "Multi-camera broadcasting, visual storytelling & post-production",
    color: "purple",
    skills: [
      { name: "OBS Studio", context: "Multi-camera live streaming and virtual signal routing", level: "Hands-on" },
      { name: "Adobe Premiere Pro", context: "Cinematic pacing, color grading, and video editing", level: "Hands-on" },
      { name: "360° Photography", context: "Spherical captures for Google Street View and virtual tours", level: "Hands-on" },
      { name: "Cinematography", context: "Framing, lighting, and cinematic visual composition", level: "Hands-on" },
    ],
  },
  {
    id: "hardware",
    title: "Hardware & Electronics",
    icon: "Cpu",
    tagline: "Custom power units, audio circuits & hardware tuning",
    color: "emerald",
    skills: [
      { name: "GPU VRAM Tuning", context: "Optimizing dedicated GPU resources for offline model loading", level: "Hands-on" },
      { name: "DIY UPS Systems", context: "Custom backup power packs for uninterrupted workstation power", level: "Hands-on" },
      { name: "Solar Setups", context: "Off-grid DC charging and solar storage systems", level: "Hands-on" },
      { name: "Transistor Amplifiers", context: "Assembling discrete multi-transistor audio amplifier circuits", level: "Hands-on" },
    ],
  },
];
