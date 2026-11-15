import Link from "next/link";
import { Monitor, Cpu, Server, Terminal, Wrench, Shield, Video, HardDrive, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Uses & Setup | THE SABBiR",
  description: "Hardware, homelab, developer tooling, local AI setup, and video production stack used daily by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/uses",
});

interface UseItem {
  name: string;
  detail: string;
  tag?: string;
}

interface UseCategory {
  title: string;
  icon: typeof Monitor;
  color: string;
  items: UseItem[];
}

const CATEGORIES: UseCategory[] = [
  {
    title: "Workstation & Hardware",
    icon: Cpu,
    color: "text-primary bg-primary/10",
    items: [
      { name: "OS", detail: "Ubuntu Linux 24.04 LTS (Noble Numbat) — rock-solid developer workstation environment.", tag: "Daily Driver" },
      { name: "Processor", detail: "Intel Core i7-1065G7 (4 Cores, 8 Threads) with optimized governors.", tag: "CPU" },
      { name: "Graphics", detail: "NVIDIA GeForce MX350 2GB VRAM — tuned with ANGLE and NVIDIA PRIME Offload for 60 fps Remotion video rendering.", tag: "GPU Offload" },
      { name: "Memory & Storage", detail: "16 GB DDR4 Dual-Channel RAM with 512 GB high-speed NVMe SSD.", tag: "Hardware" },
      { name: "Display", detail: "Calibrated IPS external monitor set to accurate sRGB for 4:5 and 9:16 social video grading.", tag: "Display" },
    ],
  },
  {
    title: "Homelab & Network Bench",
    icon: Server,
    color: "text-emerald-500 bg-emerald-500/10",
    items: [
      { name: "Core Router", detail: "MikroTik hEX (RB750Gr3) running RouterOS v7 with Dual-WAN failover, mangle rules, and queue trees.", tag: "MikroTik" },
      { name: "Bench Switch", detail: "Dedicated Gigabit switch bench for testing network topologies and isolated VLAN namespaces.", tag: "NOC Lab" },
      { name: "Power Backup", detail: "Custom-built 12V LiFePO4 DC-UPS delivering zero relay-switch delay for ONU and router during load-shedding.", tag: "Zero-Lag" },
    ],
  },
  {
    title: "Developer Tooling & Terminal",
    icon: Terminal,
    color: "text-accent bg-accent/10",
    items: [
      { name: "Shell & Multiplexer", detail: "Zsh + tmux for persistent session management across local terminal windows.", tag: "CLI" },
      { name: "Editors", detail: "Cursor and VS Code with Vim keybindings; Antigravity Agentic IDE for autonomous coding.", tag: "Editor" },
      { name: "Runtimes", detail: "Node.js 22 LTS (managed via Volta), Python 3.12 (venv), and pure Bash scripts.", tag: "Runtimes" },
      { name: "Containers & Daemons", detail: "Docker Engine, Docker Compose v2, and custom Linux systemd services (thesabbirai.service).", tag: "DevOps" },
      { name: "Databases", detail: "PostgreSQL 17, Neon Serverless Postgres, SQLite/libSQL, and Drizzle ORM.", tag: "Databases" },
    ],
  },
  {
    title: "Local AI & Production Studio",
    icon: Video,
    color: "text-gold bg-gold/10",
    items: [
      { name: "Video Engine", detail: "Remotion 4.x (React 19 + TypeScript) rendering 1080x1350 @ 60 fps with zero visual degradation.", tag: "Remotion" },
      { name: "Local Inference", detail: "Ollama running quantized Qwen2.5 and DeepSeek models locally with zero cloud API token leaks.", tag: "Offline AI" },
      { name: "Speech & Transcripts", detail: "faster-whisper (large-v3-turbo cached) and librosa for precise speech onset and syllable alignment.", tag: "Audio AI" },
      { name: "Sound Engineering", detail: "Web Audio API zero-asset DSP synthesizers (sound.ts) and CC0 tactile sound design.", tag: "Audio" },
    ],
  },
];

export default function UsesPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Uses" }]}
        eyebrow="Uses"
        title={<>Tools, gear &amp; <Accent>setup</Accent></>}
        lede="A living breakdown of the hardware, network testbed, developer tooling, and media production stack that powers my day-to-day engineering."
      />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16 space-y-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.title} className="rounded-card surface-card p-6 sm:p-8 border border-line shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className={`grid place-items-center w-10 h-10 rounded-xl ${cat.color}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-ink">{cat.title}</h2>
              </div>
              <ul className="divide-y divide-line">
                {cat.items.map((item) => (
                  <li key={item.name} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1 sm:max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink text-sm sm:text-base">{item.name}</span>
                        {item.tag && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-ink-3 uppercase tracking-wider">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* Footer nav */}
        <div className="p-6 rounded-card surface-card border border-line flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ink-3">
          <span>Curious about how these tools are used?</span>
          <div className="flex gap-4">
            <Link href="/now" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>View /now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/tools" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>Try Developer Tools</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
