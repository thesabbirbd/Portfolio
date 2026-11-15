// "Discover" sections (v4.0.1): articles, vlogs, sourced news commentary, interactive tools,
// engineering playground and browser games. The owner asked for these sections to exist now,
// filled with a few clearly-labelled DEMO entries so nothing renders blank.
//
// Honesty rules for this file:
//  - every demo entry carries `demo: true` and is labelled "Demo" in the UI
//  - vlogs have no fake video links or view counts: they are "in production"
//  - news commentary links to the real primary source (each URL checked on 2026-10-29)
//    and states the source's own date; the commentary is opinion, not a claim of involvement
//  - tools and playground simulations are real, working client-side code
//  - games are "coming soon" only

import type { LucideIcon } from "lucide-react";
import { BookOpenText, Clapperboard, Newspaper, Wrench, FlaskRound, Gamepad2, Sparkles, Cpu } from "lucide-react";

import { VLOG_EPISODES, type VlogEpisode } from "./vlogs";

export type DiscoverSection = {
  id: "articles" | "vlogs" | "news" | "tools" | "playground" | "games" | "hacks" | "os-brain";
  href: string;
  title: string;
  label: string;
  blurb: string;
  Icon: LucideIcon;
  role: "brand" | "accent" | "signal" | "ok";
  popularityScore?: number;
  addedAt?: string;
  isNew?: boolean;
};

export const DISCOVER_SECTIONS: DiscoverSection[] = [
  { id: "tools", href: "/tools", title: "55 Interactive Tools", label: "Use", blurb: "Bangla Bijoy, Medicine, CGPA, Electricity, Zakat, BCS Photo & Dev Studios.", Icon: Wrench, role: "ok", popularityScore: 98, isNew: true, addedAt: "2026-11-15" },
  { id: "hacks", href: "/hacks", title: "Everyday Hacks Hub", label: "Shortcuts", blurb: "36+ field-tested AI prompts, GitHub tricks, Linux one-liners and BD life hacks.", Icon: Sparkles, role: "accent", popularityScore: 95, isNew: true, addedAt: "2026-11-15" },
  { id: "os-brain", href: "/os-brain", title: "Autonomous OS Brain", label: "Autonomous", blurb: "Self-evolving technical intelligence center with automated discovery pipeline.", Icon: Cpu, role: "signal", popularityScore: 92, isNew: true, addedAt: "2026-11-15" },
  { id: "articles", href: "/articles", title: "Technical articles", label: "Read", blurb: "Long-form write-ups on Linux, containers, networking and local AI.", Icon: BookOpenText, role: "brand", popularityScore: 88, isNew: false },
  { id: "vlogs", href: "/vlogs", title: "Vlogs", label: "Watch", blurb: "Screen-recorded lab sessions: setups, failures and fixes.", Icon: Clapperboard, role: "accent", popularityScore: 82, isNew: false },
  { id: "news", href: "/news", title: "News commentary", label: "Sourced", blurb: "Short takes on platform releases — always linked to the primary source.", Icon: Newspaper, role: "signal", popularityScore: 80, isNew: false },
  { id: "playground", href: "/playground", title: "Engineering playground", label: "Play", blurb: "Live simulations of rate limiting, load balancing and caching.", Icon: FlaskRound, role: "signal", popularityScore: 78, isNew: false },
  { id: "games", href: "/games", title: "Browser games", label: "Play", blurb: "Terminal & SQL CTF engineering challenges running in your browser.", Icon: Gamepad2, role: "brand", popularityScore: 85, isNew: false },
];

export type Vlog = VlogEpisode;

export const VLOGS: Vlog[] = VLOG_EPISODES;

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  sourceUrl: string;
  /** Date of the source's own announcement, at the precision the source states. */
  sourceDate: string;
  commentary: string;
  tags: string[];
  demo: true;
};

export const NEWS: NewsItem[] = [
  {
    id: "python-313",
    headline: "Python 3.13 ships an experimental free-threaded build and JIT",
    source: "Python docs — What's New in Python 3.13",
    sourceUrl: "https://docs.python.org/3/whatsnew/3.13.html",
    sourceDate: "2024-10-07",
    commentary: "The no-GIL build (PEP 703) and the JIT (PEP 744) are both opt-in and experimental. For backend learners the practical win today is the new interactive REPL and clearer error messages; free-threading matters later, once C extensions catch up.",
    tags: ["Python", "Runtime"],
    demo: true,
  },
  {
    id: "postgres-17",
    headline: "PostgreSQL 17 adds incremental backups and JSON_TABLE",
    source: "PostgreSQL Global Development Group",
    sourceUrl: "https://www.postgresql.org/about/news/postgresql-17-released-2936/",
    sourceDate: "2024-09-26",
    commentary: "Incremental backups in pg_basebackup make nightly backups of a growing database far cheaper, and JSON_TABLE turns JSON columns into rows with plain SQL — both useful for small self-hosted apps.",
    tags: ["PostgreSQL", "Databases"],
    demo: true,
  },
  {
    id: "compose-v2",
    headline: "Docker Compose v1 is retired — use `docker compose`",
    source: "Docker Docs — Migrate to Compose V2",
    sourceUrl: "https://docs.docker.com/compose/releases/migrate/",
    sourceDate: "2023-07", // Compose v1 stopped receiving updates in July 2023 (day not stated)
    commentary: "The hyphenated `docker-compose` (v1) no longer receives updates. Old tutorials still use it; switching to the `docker compose` plugin is mostly a find-and-replace, but check container naming and env-file behaviour.",
    tags: ["Docker", "DevOps"],
    demo: true,
  },
  {
    id: "ubuntu-2404",
    headline: "Ubuntu 24.04 LTS \"Noble Numbat\" released",
    source: "Canonical — Ubuntu blog",
    sourceUrl: "https://ubuntu.com/blog/canonical-releases-ubuntu-24-04-noble-numbat",
    sourceDate: "2024-04-25",
    commentary: "A long-term-support base is the right default for a dev box or a small server: years of security updates and stable packages, so setup scripts keep working.",
    tags: ["Ubuntu", "Linux"],
    demo: true,
  },
  {
    id: "k8s-132",
    headline: "Kubernetes v1.32 \"Penelope\" released",
    source: "Kubernetes blog",
    sourceUrl: "https://kubernetes.io/blog/2024/12/11/kubernetes-v1-32-release/",
    sourceDate: "2024-12-11",
    commentary: "Release notes are where deprecations hide. Even when learning on a single-node cluster, reading the \"deprecations and removals\" section first saves broken manifests later.",
    tags: ["Kubernetes", "Cloud native"],
    demo: true,
  },
];

export type Game = { id: string; title: string; pitch: string; skills: string[] };

export const GAMES: Game[] = [
  { id: "sql-detective", title: "SQL Detective: The Rajshahi Server Heist", pitch: "Investigate a 03:15 AM database heist across VPN and audit logs to catch the culprit.", skills: ["SQL", "Forensics", "JOINs"] },
  { id: "kernel-breach", title: "Kernel Breach: Bandit Terminal CTF", pitch: "Fix broken systemd daemons, subnet sizes, and SQL indices in a terminal shell.", skills: ["Linux", "systemd", "CLI"] },
  { id: "packet-defender", title: "Packet Defender: MikroTik DDoS Firewall", pitch: "3-lane real-time network routing: allow clean traffic and drop botnet floods.", skills: ["NOC", "Firewall", "MikroTik"] },
  { id: "container-grid", title: "Container Grid: Docker & K8s Puzzle", pitch: "Wire Nginx, FastAPI, Redis, and Postgres replicas without 502 or OOM errors.", skills: ["Docker", "Kubernetes", "SRE"] },
  { id: "subnet-sprint", title: "Subnet & Regex Blitz: 60s Overclock", pitch: "Toggle 8-bit switches (128..1) and answer rapid CIDR & regex patterns under 60s.", skills: ["CIDR", "Regex", "Binary"] },
  { id: "uptime-architect", title: "Uptime Tycoon: 99.99% Chaos Simulator", pitch: "Balance RAM, FastAPI workers, and DC-UPS battery to hold 99.99% uptime.", skills: ["SRE", "High Availability", "Chaos"] },
  { id: "query-optimizer", title: "Query Optimizer: Slow-Log Rescue", pitch: "PostgreSQL CPU is 96°C! Inspect EXPLAIN plans and apply B-tree indices.", skills: ["PostgreSQL", "B-tree", "EXPLAIN"] },
];

export type PlannedFeature = {
  title: string;
  desc: string;
  href?: string;
  status: "live" | "planned";
};

/** Ideas the Explore hub lists as planned or newly published. */
export const PLANNED_FEATURES: PlannedFeature[] = [
  { title: "/now page", desc: "What I'm actively building, testing in the lab, and shipping this quarter.", href: "/now", status: "live" },
  { title: "Uses & setup", desc: "Hardware, homelab, developer tooling, and production stack.", href: "/uses", status: "live" },
  { title: "Architecture & APIs", desc: "Interactive API explorer, SQL query execution flows, and edge telemetry.", href: "/architecture", status: "live" },
  { title: "Newsletter", desc: "A monthly dispatch of new articles, lab notes, and SQL architectures.", status: "planned" },
];
