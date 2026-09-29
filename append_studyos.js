const fs = require('fs');

const studyOSData = `
  {
    id: "studyos",
    title: "StudyOS",
    category: "Featured",
    featured: true,
    shortDescription: "A Local-First Universal Learning Engine & AI-Powered Multi-Domain Study Workspace.",
    longDescription: "StudyOS is my flagship master engineering project — a sophisticated ecosystem designed to ingest, process, and track technical learning materials completely offline. Built to eliminate cognitive fragmentation by pairing offline AI assistance (via Ollama) with high-speed local data persistence (PostgreSQL + FastAPI) wrapped in a modern, distraction-free spatial interface.",
    technologies: ["FastAPI", "PostgreSQL", "Docker", "Ollama", "Python", "Next.js"],
    architecture: "Local-First Core / Asynchronous REST Tier / Local Vector & Relational Storage",
    highlights: [
      "100% Offline Capability: Operates with zero external internet dependencies for air-gapped study sessions",
      "Local LLM Orchestration: Integrates lightweight quantized models directly through Ollama API hooks",
      "Asynchronous Backend: FastAPI engine with async connection pooling and PostgreSQL relational schemas",
      "Containerized Dev Stack: Multi-container Docker environment for repeatable local deployments"
    ],
    status: "Active Engineering",
    year: "2025 - 2026",
    githubUrl: "https://github.com/thesabbirbd/StudyOS",
    gradient: "from-blue-600/25 via-cyan-500/20 to-purple-600/20",
    stats: [
      { label: "Execution Mode", value: "Local-First" },
      { label: "AI Engine", value: "Offline Ollama" },
      { label: "Backend", value: "FastAPI + asyncpg" },
      { label: "Data Store", value: "PostgreSQL" }
    ]
  },
`;

let file = fs.readFileSync('src/data/projects.ts', 'utf8');
// Insert before the last bracket
file = file.replace(/];$/, studyOSData + '];');
fs.writeFileSync('src/data/projects.ts', file);
