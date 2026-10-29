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
import { BookOpenText, Clapperboard, Newspaper, Wrench, FlaskRound, Gamepad2 } from "lucide-react";

export type DiscoverSection = {
  id: "articles" | "vlogs" | "news" | "tools" | "playground" | "games";
  href: string;
  title: string;
  label: string;
  blurb: string;
  Icon: LucideIcon;
  role: "brand" | "accent" | "signal" | "ok";
};

export const DISCOVER_SECTIONS: DiscoverSection[] = [
  { id: "articles", href: "/articles", title: "Technical articles", label: "Read", blurb: "Long-form write-ups on Linux, containers, networking and local AI.", Icon: BookOpenText, role: "brand" },
  { id: "vlogs", href: "/vlogs", title: "Vlogs", label: "Watch", blurb: "Screen-recorded lab sessions: setups, failures and fixes.", Icon: Clapperboard, role: "accent" },
  { id: "news", href: "/news", title: "News commentary", label: "Sourced", blurb: "Short takes on platform releases — always linked to the primary source.", Icon: Newspaper, role: "signal" },
  { id: "tools", href: "/tools", title: "Interactive tools", label: "Use", blurb: "Subnet, chmod, Base64, JSON and timestamp tools that run in your browser.", Icon: Wrench, role: "ok" },
  { id: "playground", href: "/playground", title: "Engineering playground", label: "Play", blurb: "Live simulations of rate limiting, load balancing and caching.", Icon: FlaskRound, role: "signal" },
  { id: "games", href: "/games", title: "Browser games", label: "Soon", blurb: "Small engineering games — coming soon, stay tuned.", Icon: Gamepad2, role: "brand" },
];

export type Vlog = { id: string; title: string; summary: string; topics: string[]; demo: true };

export const VLOGS: Vlog[] = [
  { id: "ubuntu-from-zero", title: "Ubuntu dev box from zero", summary: "Fresh install to a repeatable backend workstation: users, SSH keys, firewall, Docker and a bootstrap script.", topics: ["Ubuntu", "SSH", "Docker"], demo: true },
  { id: "ollama-vram", title: "Running local LLMs on limited VRAM", summary: "Quantisation levels, context length and what actually fits on a consumer GPU with Ollama.", topics: ["Ollama", "GPU", "Local AI"], demo: true },
  { id: "mikrotik-lab", title: "A home NOC lab with MikroTik", summary: "VLANs, firewall rules and basic monitoring on a small routing bench.", topics: ["MikroTik", "VLAN", "Monitoring"], demo: true },
  { id: "fastapi-postgres", title: "FastAPI + PostgreSQL, step by step", summary: "Models, migrations and connection pooling for a small API — the Omnidesk BD way.", topics: ["FastAPI", "PostgreSQL", "Backend"], demo: true },
];

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
  { id: "terminal-ctf", title: "Terminal CTF", pitch: "Fix a broken server from a fake shell: find the failing service, read the logs, restart it.", skills: ["Linux", "systemd", "logs"] },
  { id: "subnet-sprint", title: "Subnet Sprint", pitch: "Race the clock: split networks, find broadcast addresses, size the subnet.", skills: ["CIDR", "Networking"] },
  { id: "packet-runner", title: "Packet Runner", pitch: "Guide a packet through routers and firewalls without getting dropped.", skills: ["Routing", "Firewalls"] },
  { id: "command-quiz", title: "Linux Command Quiz", pitch: "Which command does what? Quick rounds from beginner to sysadmin.", skills: ["Shell", "CLI"] },
];

/** Ideas the Explore hub lists as planned (no page yet). */
export const PLANNED_FEATURES = [
  { title: "/now page", desc: "What I'm learning and building this month, dated." },
  { title: "Uses & setup", desc: "Hardware, OS, editor and homelab — the real list." },
  { title: "Newsletter", desc: "A monthly email of new articles and lab notes." },
];
