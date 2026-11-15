/**
 * Real production lab video episodes for sabbir.nav.bd/vlogs.
 * Produced in THE SABBiR studio at 4:5 (1080x1350) @ 60 fps.
 * Each episode comes with an actionable "Steal the Prompt / Companion Action Box".
 */

export interface VlogEpisode {
  id: string;
  episodeNo: number;
  title: string;
  subtitle: string;
  summary: string;
  duration: string;
  fps: number;
  aspectRatio: "4:5" | "16:9";
  topics: string[];
  date: string;
  youtubeId?: string; // YouTube Shorts/Video ID when published
  platforms: {
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  companionPrompt: {
    label: string;
    prompt: string;
    explanation: string;
    companionToolHref?: string;
    companionToolLabel?: string;
  };
}

export const VLOG_EPISODES: VlogEpisode[] = [
  {
    id: "pdf-action-plan",
    episodeNo: 1,
    title: "20-Page PDF to Action Plan in 10s",
    subtitle: "Stop reading 20-page documents linearly — turn AI into a structured workflow engine.",
    summary:
      "A 3-step practical AI workflow using Google NotebookLM and Claude Artifacts. Upload raw sources, run 1 precision command, and get a visual map, summary, and action plan 20× faster.",
    duration: "60s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["NotebookLM", "Claude Artifacts", "Local AI", "Productivity"],
    date: "2026-11-11",
    youtubeId: "dQw4w9WgXcQ", // Click-to-load video ID placeholder
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy the 3-Step Extraction Prompt",
      prompt: `[ROLE] Senior Executive Analyst.
[CONTEXT] Analyzing the attached 20-page document.
[CONSTRAINTS] Extract only verified facts, no generic fluff.
[OUTPUT]
1. Executive Summary in 3 concise bullet points.
2. Interactive Mermaid flowchart of the core system.
3. Prioritized 3-Step Action Plan with owners and realistic deadlines.
4. Flag any missing dependencies or unstated assumptions in [brackets].`,
      explanation: "Prevents conversational hallucinations by forcing structured Markdown with visual mapping.",
      companionToolHref: "/tools#rco-prompt",
      companionToolLabel: "Open R-C-O Prompt Architect ↗",
    },
  },
  {
    id: "vision-ai-receipt",
    episodeNo: 2,
    title: "Vision AI Receipt & Business Expense Scanner",
    summary:
      "How to scan 20 crumpled paper receipts into Google Sheets with zero human calculation errors using Multimodal Vision AI and a 3-task error-shielding prompt.",
    subtitle: "Never lose money on miscalculated paper memos and retail receipts again.",
    duration: "54s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["Vision AI", "Google Sheets", "Retail Tech", "Aiyaar"],
    date: "2026-11-12",
    youtubeId: "dQw4w9WgXcQ",
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy the Vision OCR Shield Prompt",
      prompt: `Analyze this image containing retail memos/receipts.
1. Extract line items into a CSV table: [Date, Invoice_No, Item, Qty, Unit_Price_BDT, Line_Total_BDT, Category].
2. If any handwritten digit is blurred or crossed out, do NOT guess — mark as [?] and compute a conservative minimum.
3. Provide a verification checksum: SUM(Line_Total_BDT) vs Printed Grand Total.`,
      explanation: "Forces the LLM to admit uncertainty with '[?]' rather than hallucinating wrong money numbers.",
      companionToolHref: "/tools#ecommerce-calc",
      companionToolLabel: "Open BD Margin & COD Calculator ↗",
    },
  },
  {
    id: "rco-prompt-architecture",
    episodeNo: 3,
    title: "R-C-O Prompt Architecture for Production Systems",
    summary:
      "Moving beyond chat prompts. How Senior Engineers use Role, Context, Constraints, and Output (R-C-O) to reliably generate production SQL, Docker, and systemd units.",
    subtitle: "The engineering blueprint that makes AI output 100% deterministic code.",
    duration: "60s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["Prompt Engineering", "DevOps", "PostgreSQL", "Systems"],
    date: "2026-11-12",
    youtubeId: "dQw4w9WgXcQ",
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy R-C-O Master System Prompt",
      prompt: `[ROLE] Senior Database & Reliability Engineer.
[CONTEXT] Designing high-concurrency PostgreSQL 17 schema for 5,000 retail pharmacies in Bangladesh.
[CONSTRAINTS]
- Zero table lock during migrations
- Compound B-Tree indexes on (store_id, expiry_date)
- Explain query plan with EXPLAIN (ANALYZE, BUFFERS)
[OUTPUT] Production DDL + Rollback Migration Script + Benchmark command.`,
      explanation: "Guarantees zero fluff and forces production-grade SQL with rollback safeguards.",
      companionToolHref: "/tools#sql-sandbox",
      companionToolLabel: "Test in SQL Sandbox ↗",
    },
  },
  {
    id: "3-layer-ai-stack",
    episodeNo: 4,
    title: "3-Layer AI Architecture: Cloud vs Local vs Offline",
    summary:
      "Inside the Omnidesk AI cascade. How to route tasks intelligently: Cloud APIs (Gemini/OpenAI) for reasoning → Local Ollama (qwen2.5) on GPU → Rule-based offline heuristics when disconnected.",
    subtitle: "Zero downtime and zero reliance on paid API tokens.",
    duration: "60s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["Ollama", "FastAPI", "Hybrid AI", "Omnidesk"],
    date: "2026-11-11",
    youtubeId: "dQw4w9WgXcQ",
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy Local Ollama API Curl Command",
      prompt: `curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:0.5b",
  "prompt": "Explain PostgreSQL index scan vs bitmap heap scan in 3 bullet points.",
  "stream": false,
  "options": {
    "num_predict": 128,
    "temperature": 0.2
  }
}'`,
      explanation: "Direct local REST call with deterministic temperature for offline microservices.",
      companionToolHref: "/tools#docker-nginx",
      companionToolLabel: "Open Docker & Nginx Generator ↗",
    },
  },
  {
    id: "ubuntu-dev-box",
    episodeNo: 5,
    title: "Ubuntu Dev Box from Zero to Repeatable Station",
    summary:
      "A complete walkthrough from fresh Ubuntu install to a hardened backend workstation: user permissions, SSH keys, UFW firewall, Docker daemon, and NVIDIA PRIME GPU offload.",
    subtitle: "A repeatable Linux environment setup in under 15 minutes.",
    duration: "60s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["Ubuntu", "Linux", "SSH", "Docker", "NVIDIA"],
    date: "2026-11-13",
    youtubeId: "dQw4w9WgXcQ",
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy Linux Hardening One-Liner",
      prompt: `sudo ufw default deny incoming && \\
sudo ufw default allow outgoing && \\
sudo ufw allow 22/tcp && \\
sudo ufw allow 80/tcp && \\
sudo ufw allow 443/tcp && \\
sudo ufw enable && sudo ufw status verbose`,
      explanation: "Applies immediate baseline firewall defense on any new Ubuntu cloud instance or dev box.",
      companionToolHref: "/tools#cron-timer",
      companionToolLabel: "Open Cron & systemd Generator ↗",
    },
  },
  {
    id: "mikrotik-noc-lab",
    episodeNo: 6,
    title: "Home NOC Lab with MikroTik: WireGuard & VLAN Bench",
    summary:
      "Setting up a residential Network Operations Center (NOC) bench using MikroTik RouterOS 7: isolated guest/IoT VLANs, WireGuard mesh VPN, and automated latency monitoring.",
    subtitle: "Real routing hardware, sub-millisecond pings, and rock-solid uptime.",
    duration: "60s",
    fps: 60,
    aspectRatio: "4:5",
    topics: ["MikroTik", "WireGuard", "VLAN", "NOC", "Networking"],
    date: "2026-11-13",
    youtubeId: "dQw4w9WgXcQ",
    platforms: {
      youtube: "https://www.youtube.com/@thesabbirbd",
      linkedin: "https://www.linkedin.com/in/thesabbirbd/",
      facebook: "https://facebook.com/iamthesabbir",
      instagram: "https://www.instagram.com/iam_thesabbir",
    },
    companionPrompt: {
      label: "Copy MikroTik WireGuard Configuration",
      prompt: `/interface wireguard add listen-port=13231 mtu=1420 name=wg-noc
/interface wireguard peers add allowed-address=10.200.0.2/32 interface=wg-noc public-key="REPLACE_WITH_CLIENT_PUBKEY"
/ip address add address=10.200.0.1/24 interface=wg-noc network=10.200.0.0`,
      explanation: "Instant peer-to-peer WireGuard VPN tunnel configuration for RouterOS v7.",
      companionToolHref: "/tools#subnet",
      companionToolLabel: "Open Subnet / CIDR Calculator ↗",
    },
  },
];
