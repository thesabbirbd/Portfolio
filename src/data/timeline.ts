export interface TimelineStep {
  id: string;
  stage: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: "completed" | "current" | "direction";
  color: "blue" | "cyan" | "purple" | "emerald";
}

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "business-foundation",
    stage: "Stage 01",
    period: "Ongoing",
    title: "Business & Management Economics",
    subtitle: "Department of Management, Rajshahi College",
    description:
      "Developing foundational strategic acumen: organizational management, operations planning, cost-benefit analysis, and ROI. This shapes an engineering perspective focused on building systems that solve business challenges.",
    tags: ["Operations", "Strategic Management", "ROI", "Resource Planning"],
    status: "completed",
    color: "blue",
  },
  {
    id: "technical-foundation",
    stage: "Stage 02",
    period: "Foundation",
    title: "Hardware, Systems & Technical Fundamentals",
    subtitle: "BM Technical College & Hands-on Electronics",
    description:
      "Hands-on immersion in computer hardware, DIY electronics (UPS, transistor amplifiers, solar DC charging), OS configurations, and troubleshooting physical workstations.",
    tags: ["Hardware Diagnostics", "Electronics", "OS Architecture", "Power Systems"],
    status: "completed",
    color: "emerald",
  },
  {
    id: "networking-noc",
    stage: "Stage 03",
    period: "Industry Experience",
    title: "Networking, Linux & NOC Operations",
    subtitle: "Shunno IT (শূন্য আইটি) & Network Surveillance",
    description:
      "Hands-on NOC support and MTCNA training. Monitoring ISP/network uptime, packet flows, MikroTik routing tables, and mastering Linux environments under production conditions.",
    tags: ["NOC Surveillance", "MikroTik", "TCP/IP", "Ubuntu Linux", "Uptime SLAs"],
    status: "completed",
    color: "cyan",
  },
  {
    id: "programming-python",
    stage: "Stage 04",
    period: "Technical Training",
    title: "Scripting, Automation & Python Fundamentals",
    subtitle: "Bangladesh Hi-Tech Park Authority (BHTPA)",
    description:
      "Completed formal Introduction to Python course. Built automation scripts, system utilities, and data processing routines to turn manual workflows into reproducible code.",
    tags: ["Python", "Automation", "Scripting", "Algorithm Design"],
    status: "completed",
    color: "purple",
  },
  {
    id: "local-ai",
    stage: "Stage 05",
    period: "Exploration",
    title: "Local-First AI & Compute Engines",
    subtitle: "Ollama, Dedicated GPU Tuning & AI/ML Research",
    description:
      "Exploring offline AI paradigms. Running quantized open-source LLMs locally with Ollama, tuning dedicated GPU VRAM pipelines, and experimenting with multimodal applications without cloud reliance.",
    tags: ["Ollama", "Offline LLMs", "CUDA VRAM", "Local-First AI", "AI-ML-XR"],
    status: "completed",
    color: "purple",
  },
  {
    id: "backend-architecture",
    stage: "Stage 06",
    period: "Active Development",
    title: "Modern Backend Architecture",
    subtitle: "FastAPI, PostgreSQL & Omnidesk BD",
    description:
      "Designing asynchronous RESTful backends, data modeling in PostgreSQL, connection pooling, and building the backend engine for Omnidesk BD.",
    tags: ["FastAPI", "PostgreSQL", "Async Python", "REST APIs"],
    status: "completed",
    color: "blue",
  },
  {
    id: "devops-sprint",
    stage: "Stage 07",
    period: "Active Sprint",
    title: "100-Day Backend & DevOps Engineering Sprint",
    subtitle: "Production Containerization & Pipeline Mastery",
    description:
      "An intensive daily commitment to containerizing microservices with Docker, writing optimized Dockerfiles, automating tasks with modular GNU Bash, and hardening deployments.",
    tags: ["Docker", "GNU Bash", "CI/CD Workflows", "100-Day Sprint"],
    status: "current",
    color: "cyan",
  },
  {
    id: "future-direction",
    stage: "Stage 08",
    period: "Next Horizon",
    title: "Production Cloud Engineering & Scaled Systems",
    subtitle: "Cloud-Native Deployments & Distributed Infrastructure",
    description:
      "Expanding Muktopaath V1 cloud engineering foundations toward production Kubernetes, distributed caching, multi-region observability, and high-resilience architectures.",
    tags: ["Cloud Infrastructure", "Distributed Systems", "Kubernetes", "Observability"],
    status: "direction",
    color: "emerald",
  },
];
