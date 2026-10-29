import { Briefcase, Monitor, Network, Terminal, Code, Cpu, Server, Workflow } from "lucide-react";

// Canonical "Engineering Evolution" dataset — the only timeline data in the site. Used by the
// full timeline (/about#timeline) and the Home journey preview, so both tell the same story.
//
// Integrity rules (THE_SABBiR_PROJECT_CONTEXT.md §9):
// - No years are given because the source content has none; phases are ordered, not dated.
// - `context` comes from the owner's CV (public/cv/) and existing portfolio content.
// - `evidence` links only to pages that exist in this repository.
// - Learning-stage steps are labelled as such; no scale, uptime or production claims.

export type JourneyStatus = "done" | "current" | "next";

export interface JourneyEvidence {
  label: string;
  href: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  icon: typeof Briefcase;
  stage: string;
  status: JourneyStatus;
  context: string;
  /** Only dates documented in the CV (public/cv/) — omitted where no date exists. */
  period?: string;
  desc: string;
  evidence: JourneyEvidence[];
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "management",
    period: "2021 – exp. 2026",
    title: "MANAGEMENT",
    icon: Briefcase,
    stage: "Foundation",
    status: "done",
    context: "Department of Management, Rajshahi College",
    desc: "BBA (Honours) in Management at Rajshahi College — the business lens: operations, resource allocation and how decisions get made.",
    evidence: [{ label: "Identity & education", href: "/about" }],
  },
  {
    id: "support",
    period: "2021 – 2022",
    title: "IT SUPPORT",
    icon: Monitor,
    stage: "Hands-on",
    status: "done",
    context: "MR Computer · technical support (2021–22) · SSC trade in electronics",
    desc: "Troubleshooting PCs, hardware and everyday user issues — learning to diagnose problems methodically instead of guessing.",
    evidence: [{ label: "Custom UPS build", href: "/projects/custom-ups" }],
  },
  {
    id: "networking",
    period: "2025",
    title: "NETWORKING",
    icon: Network,
    stage: "Hands-on",
    status: "done",
    context: "Shunno IT · IT support alongside the NOC team (2025)",
    desc: "MikroTik routing, DNS/DHCP fundamentals and network troubleshooting — from helping NOC staff at an ISP and home-lab practice.",
    evidence: [
      { label: "MikroTik NOC lab", href: "/projects/noc-router" },
      { label: "OpenWrt NAS note", href: "/notes/openwrt-nas" },
    ],
  },
  {
    id: "linux",
    title: "LINUX",
    icon: Terminal,
    stage: "Daily driver",
    status: "done",
    context: "Ubuntu as the everyday workstation",
    desc: "Ubuntu as the everyday machine: the shell, Bash scripting, package management and basic server hardening.",
    evidence: [
      { label: "Ubuntu dev environment", href: "/journal/ubuntu-dev-environment" },
      { label: "Virtual display lab", href: "/projects/virtual-display" },
    ],
  },
  {
    id: "python",
    period: "2023 – 2024",
    title: "PYTHON",
    icon: Code,
    stage: "Hands-on",
    status: "done",
    context: "Bangladesh Hi-Tech Park Authority · Python trainee (2023–24)",
    desc: "Python training, then small automation scripts and tools that remove repetitive manual work.",
    evidence: [{ label: "StudyOS prototype", href: "/projects/studyos" }],
  },
  {
    id: "ai",
    title: "LOCAL AI",
    icon: Cpu,
    stage: "Experimenting",
    status: "done",
    context: "Ollama on personal GPU hardware",
    desc: "Running local LLMs with Ollama on personal hardware and documenting honestly what works — and what doesn't.",
    evidence: [
      { label: "LLM inference benchmarks", href: "/projects/ollama-bench" },
      { label: "Qwen automation limits", href: "/engineering-lab/qwen-automation-limitations" },
      { label: "Changing my AI strategy", href: "/journal/changing-local-ai-strategy" },
    ],
  },
  {
    id: "backend",
    period: "2026 – now",
    title: "BACKEND",
    icon: Server,
    stage: "Active focus",
    status: "current",
    context: "FastAPI · PostgreSQL · Omnidesk BD",
    desc: "Building APIs with FastAPI and PostgreSQL; learning data modelling, validation and clean service boundaries.",
    evidence: [{ label: "Omnidesk BD case study", href: "/projects/omnidesk" }],
  },
  {
    id: "devops",
    title: "DEVOPS",
    icon: Workflow,
    stage: "Active sprint",
    status: "current",
    context: "100-Day Backend & DevOps sprint",
    desc: "Docker containers, CI/CD and repeatable deployments — practised on personal projects on the way to production work.",
    evidence: [{ label: "Active mission", href: "/experience#mission" }],
  },
];
