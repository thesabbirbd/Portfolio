export interface LabExperiment {
  id: string;
  title: string;
  category: "infrastructure" | "ai" | "systems" | "hardware" | "creative";
  categoryLabel: string;
  status: "Active" | "Prototyped" | "Testing" | "Documented";
  description: string;
  technologies: string[];
  notes?: string;
  date: string;
  featured?: boolean;
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "exp-ollama-vram",
    title: "Offline LLM VRAM Offloading Benchmarks",
    category: "ai",
    categoryLabel: "AI Lab",
    status: "Active",
    description: "Measuring token generation speeds and memory fragmentation across quantized 7B/8B GGUF models on dedicated GPU hardware using Ollama.",
    technologies: ["Ollama", "CUDA", "GGUF", "VRAM Optimization"],
    notes: "Achieved ~24 tokens/sec on local workstation with zero remote API latency or telemetry leakage.",
    date: "2026",
    featured: true,
  },
  {
    id: "exp-ups-dc",
    title: "Custom Uninterruptible Power Supply (UPS) Rig",
    category: "hardware",
    categoryLabel: "Hardware Lab",
    status: "Prototyped",
    description: "Engineered a custom high-capacity backup DC supply system with automated relay cutover to keep network nodes and compute rigs online during brownouts.",
    technologies: ["Battery Management", "Relay Switching", "Solar DC Inverter", "Power Electronics"],
    notes: "Provides clean continuous power transition preventing Linux kernel panics and sudden halts.",
    date: "2025 - 2026",
    featured: true,
  },
  {
    id: "exp-bash-bootstrapper",
    title: "Idempotent Ubuntu Workstation Bootstrapper",
    category: "systems",
    categoryLabel: "Systems Lab",
    status: "Active",
    description: "A modular GNU Bash provisioning suite that configures a fresh Ubuntu installation with dotfiles, developer toolchains, Docker, and kernel sysctl parameters in under 4 minutes.",
    technologies: ["GNU Bash", "Ubuntu", "Sysctl", "Dotfiles", "Systemd"],
    notes: "Maintained in private dotfiles repo with self-healing checks.",
    date: "2026",
    featured: true,
  },
  {
    id: "exp-openwrt-nas",
    title: "OpenWrt / Routing & Local Storage Testbed",
    category: "infrastructure",
    categoryLabel: "Infrastructure Lab",
    status: "Testing",
    description: "Configuring custom router firmware with QoS traffic prioritization, DNS-over-HTTPS, and lightweight network-attached storage benchmarks.",
    technologies: ["OpenWrt", "QoS Queues", "DNS-over-HTTPS", "Samba", "Linux Networking"],
    notes: "Testing bufferbloat reduction and low-latency packet scheduling for live broadcasts.",
    date: "2025 - 2026",
    featured: false,
  },
  {
    id: "exp-obs-multicam",
    title: "Multi-Camera Virtual OBS Signal Router",
    category: "creative",
    categoryLabel: "Creative Lab",
    status: "Documented",
    description: "Built a low-latency multi-angle camera switching pipeline using OBS Studio, virtual loopback devices, and hardware capture cards for broadcast production.",
    technologies: ["OBS Studio", "Virtual Cam", "A/V Synchronization", "Hardware Encoding"],
    notes: "Used in live streaming and collegiate presentation broadcasts with zero dropped frames.",
    date: "2025",
    featured: false,
  },
  {
    id: "exp-transistor-amp",
    title: "Discrete Multi-Transistor Audio Amplifier Circuit",
    category: "hardware",
    categoryLabel: "Hardware Lab",
    status: "Documented",
    description: "Designed and soldered a discrete power amplifier using high-current bipolar junction transistors, passive filters, and dual-rail power regulation.",
    technologies: ["BJT Transistors", "Analog Circuit Design", "Soldering", "Heat Dissipation"],
    notes: "Yielded clean acoustic frequency response with low harmonic distortion at standard operating loads.",
    date: "2024 - 2025",
    featured: false,
  },
];
