const fs = require('fs');
let file = fs.readFileSync('src/data/projects.ts', 'utf8');

file = file.replace(
  /"A Local-First Universal Learning Engine & AI-Powered Multi-Domain Study Workspace."/,
  '"A commercial e-commerce platform for custom PC builds and ergonomic furniture, focusing on performance, modularity, and smooth user checkout flows."'
);

file = file.replace(
  /"Omnidesk BD is my flagship master engineering project — a sophisticated ecosystem designed to ingest, process, and track technical learning materials completely offline. Built to eliminate cognitive fragmentation by pairing offline AI assistance \(via Ollama\) with high-speed local data persistence \(PostgreSQL \+ FastAPI\) wrapped in a modern, distraction-free spatial interface."/,
  '"Omnidesk BD is a commercial e-commerce platform designed to handle complex relational data for custom PC builds. It is built to prevent users from placing invalid or physically incompatible orders using a highly responsive interface paired with a strict backend rule engine."'
);

file = file.replace(
  /"FastAPI", "PostgreSQL", "Docker", "Ollama", "Python", "PWA"/,
  '"Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma", "Redis", "Docker"'
);

file = file.replace(
  /"Local-First Core \/ Asynchronous REST Tier \/ Local Vector & Relational Storage"/,
  '"Next.js Frontend \/ Node.js API \/ Redis Cache \/ PostgreSQL DB"'
);

file = file.replace(
  /"100% Offline Capability: Operates with zero external internet dependencies for air-gapped study sessions",\s*"Local LLM Orchestration: Integrates lightweight quantized models directly through Ollama API hooks",\s*"Asynchronous Backend: FastAPI engine with async connection pooling and PostgreSQL relational schemas",\s*"Containerized Dev Stack: Multi-container Docker environment for repeatable local deployments"/,
  '"Complex Component Compatibility Engine for Custom PC Builders",\n      "Redis caching layer dropping standard API catalog query latency by 60%",\n      "Decoupled Architecture with separate isolated Admin Panel from customer storefront",\n      "Containerized deployment strategy using Docker and CI/CD pipelines"'
);

fs.writeFileSync('src/data/projects.ts', file);
