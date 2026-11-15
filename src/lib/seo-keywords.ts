export const CORE_BRAND_KEYWORDS = [
  "THE SABBiR",
  "Md Sabbirul Islam Khan",
  "THE SABBiR OS",
  "SABBiR Developer OS",
  "sabbir.nav.bd",
  "Chief Product Manager CPM",
  "Bangladeshi Systems Engineer",
  "Rajshahi Software Architect",
] as const;

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  arcade: [
    "devops games",
    "sql detective",
    "kernel breach ctf",
    "packet defender ddos",
    "container grid docker",
    "subnet blitz",
    "uptime chaos simulator",
    "interactive terminal game",
  ],
  linux: [
    "linux terminal basics",
    "systemctl troubleshooting",
    "systemd active states",
    "bash command line",
    "linux server administration",
  ],
  database: [
    "sql indexing explained simply",
    "postgresql b tree index",
    "postgresql 17 incremental backup",
    "database explain analyze",
    "drizzle orm neon serverless",
  ],
  ai: [
    "run local ai ollama",
    "ollama vram math",
    "offline ai models",
    "llama 3 local setup",
    "khata2sheet ai bangla ocr",
  ],
  networking: [
    "cidr without calculator",
    "ipv4 subnet mask calculation",
    "mikrotik routeros watchdog",
    "wireguard kernel vpn",
    "bdix peering network",
  ],
  devops: [
    "docker volumes vs bind mounts",
    "docker compose watch",
    "uptime kuma self-hosted",
    "coolify open source paas",
    "playwright browser automation",
  ],
};

export const ALL_KEYWORDS = [
  ...CORE_BRAND_KEYWORDS,
  ...Object.values(CATEGORY_KEYWORDS).flat(),
];

export function generatePageKeywords(category?: string, customTags: string[] = []): string[] {
  const base: string[] = [...CORE_BRAND_KEYWORDS];
  if (category && CATEGORY_KEYWORDS[category.toLowerCase()]) {
    base.push(...CATEGORY_KEYWORDS[category.toLowerCase()]);
  }
  return Array.from(new Set([...base, ...customTags]));
}

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://sabbir.nav.bd${cleanPath}`;
}
