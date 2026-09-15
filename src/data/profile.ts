export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: string;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  skills: string[];
  color: "blue" | "cyan" | "purple" | "emerald";
}

export interface JourneyMilestone {
  period: string;
  stage: string;
  title: string;
  description: string;
  tags: string[];
}

export const PROFILE_DATA = {
  fullName: "Md Sabbirul Islam Khan",
  shortName: "SABBiR",
  badgeStatus: "OPEN TO BUILD • LEARN • COLLABORATE",
  rotatingRoles: [
    "Backend Engineering",
    "DevOps Architecture",
    "AI & Local Systems",
    "Linux & Infrastructure",
    "Networking & NOC Operations",
    "Creative Multimedia Tech",
  ],
  heroStatement: "Bridging Business Management with Hardcore Systems, DevOps, AI & Infrastructure.",
  bioNarrative:
    "Operating at the strategic intersection of business economics and production-grade software engineering. Currently pursuing a BBA in Management at Rajshahi College, my engineering mindset is grounded in ROI, resilience, high availability, and terminal-level technical execution.",
  
  academic: {
    degree: "BBA in Management",
    institution: "Rajshahi College (National University)",
    location: "Rajshahi, Bangladesh",
    foundation: "Hat Gangopara BM Technical College (Technical Fundamentals)",
    origin: "Bagmara, Rājshāhi, Bangladesh",
  },

  mission: {
    title: "100-Day Backend & DevOps Engineering Sprint",
    status: "SYSTEM ACTIVE",
    currentFocus: "Microservice Containerization, High-Throughput APIs & Cloud Automation",
    pillars: [
      {
        title: "High-Performance APIs",
        desc: "Asynchronous RESTful backends in FastAPI with connection pooling and relational schema integrity in PostgreSQL.",
      },
      {
        title: "Containerization & Workflows",
        desc: "Isolated microservices with Docker, multi-container orchestration, and automated test benches.",
      },
      {
        title: "Infrastructure Automation",
        desc: "Modular GNU Bash scripting, Linux kernel optimization, and reproducible environment bootstrapping.",
      },
      {
        title: "Cloud & Network Resilience",
        desc: "NOC-level monitoring, Mikrotik routing, DNS management, and Muktopaath V1 cloud engineering standards.",
      },
      {
        title: "Local AI Acceleration",
        desc: "Serving offline LLMs locally via Ollama with dedicated GPU memory tuning and low-latency inference.",
      },
    ],
  },

  flagshipProject: {
    id: "omnidesk-bd",
    name: "Omnidesk BD",
    subtitle: "Universal Engineering Study Operating System",
    description:
      "A local-first learning engine and multi-domain engineering workspace designed to ingest, process, and track technical knowledge completely offline using local AI models (Ollama), PostgreSQL, and FastAPI in a distraction-free spatial interface.",
    status: "Active Engineering",
    architecture: "Local-First / Multi-Tier",
    tags: ["FastAPI", "PostgreSQL", "Docker", "Ollama", "Tauri", "Nginx"],
    githubUrl: "https://github.com/thesabbirbd/Omnidesk-BD",
    images: {
      dashboard: "/assets/omnidesk-glass-dashboard.png",
      mindmap: "/assets/omnidesk-dag-mindmap.png",
      materials: "/assets/omnidesk-materials-engine.png",
      focusTimer: "/assets/omnidesk-focus-timer-presence.png",
      logo: "/assets/omnidesk-logo.png",
    },
  },

  capabilities: [
    {
      id: "backend",
      title: "Backend Architecture",
      tagline: "High-throughput APIs & Data Layers",
      icon: "Server",
      skills: ["Python", "FastAPI", "RESTful APIs", "PostgreSQL", "SQLAlchemy", "Auth & JWT"],
      color: "blue",
    },
    {
      id: "devops",
      title: "DevOps & Systems",
      tagline: "Containers & Automated Tooling",
      icon: "Container",
      skills: ["Docker", "Linux / Ubuntu", "GNU Bash", "CI/CD Pipelines", "System Hardening"],
      color: "cyan",
    },
    {
      id: "networking",
      title: "Networking & NOC",
      tagline: "High Availability & Traffic Flow",
      icon: "Network",
      skills: ["NOC Operations", "Mikrotik RouterOS", "TCP/IP & Subnetting", "DNS Routing", "Uptime Governance"],
      color: "blue",
    },
    {
      id: "ai",
      title: "AI & Local Intelligence",
      tagline: "Offline Inference & Data Engineering",
      icon: "Brain",
      skills: ["Ollama LLMs", "NVIDIA CUDA / VRAM Tuning", "Python Pandas & NumPy", "Data Visualization"],
      color: "purple",
    },
    {
      id: "hardware",
      title: "Hardware Engineering",
      tagline: "Power Systems & Physical Labs",
      icon: "Cpu",
      skills: ["Custom Uninterruptible Power (UPS)", "Solar Architectures", "Multi-Transistor Amplifiers", "PC Optimization"],
      color: "cyan",
    },
    {
      id: "multimedia",
      title: "Creative Technology",
      tagline: "Broadcast & Spatial Media",
      icon: "Camera",
      skills: ["OBS Multi-Cam Routing", "Video Post-Production", "360° Street View Tours", "Cinematography"],
      color: "purple",
    },
  ] as CapabilityGroup[],

  journey: [
    {
      period: "FOUNDATION",
      stage: "Business & Strategy",
      title: "BBA in Management — Rajshahi College",
      description: "Developing strategic vision, organizational management, financial modeling, and ROI-driven technological prioritization.",
      tags: ["Management", "Economics", "Operations"],
    },
    {
      period: "SYSTEMS",
      stage: "Hardware & Telemetry",
      title: "Hardware Hacking, UPS Prototyping & NOC Support",
      description: "Hands-on MTCNA & NOC network surveillance at Shunno IT; fabricating custom UPS power units and solar systems.",
      tags: ["NOC", "Mikrotik", "Power Electronics"],
    },
    {
      period: "COMPUTING",
      stage: "Linux & Terminal",
      title: "Linux Kernel Power User & Python Trainee",
      description: "Automating workflows with Bash scripts, fine-tuning Ubuntu environments, and completing Python specialization at Bangladesh Hi-Tech Park Authority.",
      tags: ["Ubuntu", "Bash", "Python (BHTPA)"],
    },
    {
      period: "AI & ML",
      stage: "Local Intelligence",
      title: "Offline LLM Inference & Data Pipelines",
      description: "Local model serving with Ollama, CUDA acceleration, and data analysis using Pandas, NumPy and Matplotlib.",
      tags: ["Ollama", "CUDA", "Pandas"],
    },
    {
      period: "BACKEND",
      stage: "Production APIs",
      title: "FastAPI, PostgreSQL & Core Omnidesk Architecture",
      description: "Architecting asynchronous REST APIs with connection pooling, database schemas, and building Omnidesk BD.",
      tags: ["FastAPI", "PostgreSQL", "Omnidesk BD"],
    },
    {
      period: "DEVOPS & FUTURE",
      stage: "Infrastructure & Scale",
      title: "Containerization, Cloud Engineering & Production Scale",
      description: "Packaging microservices with Docker, Muktopaath Cloud Engineering V1 certified, pushing toward distributed high-availability systems.",
      tags: ["Docker", "Cloud V1", "Continuous Delivery"],
    },
  ] as JourneyMilestone[],

  verifiedActivities: [
    {
      org: "Shunno IT (শূন্য আইটি)",
      role: "NOC Support & MTCNA Intern",
      desc: "Live network telemetry, Mikrotik routing, uptime surveillance, and packet diagnosis.",
    },
    {
      org: "Bangladesh Hi-Tech Park Authority (BHTPA)",
      role: "Python Specialized Trainee",
      desc: "Comprehensive programmatic fundamentals, data structures, and script automation.",
    },
    {
      org: "Google Maps Community Global",
      role: "Google Local Guide & 360° Street View Photographer",
      desc: "Top contributor mapping Bangladesh with high-resolution geospatial imagery; received direct recognition & gifts from Google Headquarters.",
    },
    {
      org: "Aditi (অদিতি)",
      role: "Media Production Specialist",
      desc: "Director of photography, video post-production, and multi-channel livestream management.",
    },
    {
      org: "Rajshahi College Presentation Club (RCPC)",
      role: "IT Executive",
      desc: "Governing campus IT, audio-visual presentation tech, and digital workflow execution.",
    },
  ],

  socials: [
    {
      name: "GitHub",
      url: "https://github.com/thesabbirbd",
      handle: "thesabbirbd",
      icon: "Github",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/thesabbirbd",
      handle: "thesabbirbd",
      icon: "Linkedin",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/iamthesabbir",
      handle: "iamthesabbir",
      icon: "Facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/iam_thesabbir",
      handle: "iam_thesabbir",
      icon: "Instagram",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/thesabbirbd",
      handle: "thesabbirbd",
      icon: "Twitter",
    },
    {
      name: "Email",
      url: "mailto:iamthesabbir@gmail.com",
      handle: "iamthesabbir@gmail.com",
      icon: "Mail",
    },
    {
      name: "Google Local Guide",
      url: "https://www.google.com/maps/contrib/115922089427483699024?utm_source=mstt_0",
      handle: "360° Contributor",
      icon: "MapPin",
    },
  ] as SocialLink[],
};
