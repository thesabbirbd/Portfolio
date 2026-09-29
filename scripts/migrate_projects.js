const fs = require('fs');
const path = require('path');

const PROJECTS = [
  {
    id: "virtual-display",
    title: "Linux Virtual Display Driver Lab",
    category: "Systems",
    shortDescription: "Configuring headless GPU rendering pipelines, custom resolutions, and low-latency virtual display buffers on Linux.",
    longDescription: "A systems project focused on headless Linux rendering pipelines. Configured virtual framebuffers, EDID overrides, and dummy displays to enable hardware-accelerated remote desktops and headless OBS video generation pipelines.",
    technologies: ["Linux", "X11 / Wayland", "GNU Bash", "Kernel Modules", "GPU Buffers"],
    architecture: "Kernel Level Display Emulation / Framebuffer Capture",
    status: "Active R&D",
    year: "2025"
  },
  {
    id: "web-to-app",
    title: "Web-to-App Hybrid Native Bridge",
    category: "Systems",
    shortDescription: "Architecting a multi-platform bridge embedding high-throughput web dashboards into native Android runtimes with offline caching.",
    longDescription: "Explored hybrid mobile application architecture by embedding responsive web dashboard engines inside native Android WebView containers with localized service-worker caching and biometric auth integration.",
    technologies: ["Flutter / Android", "TypeScript", "REST APIs", "Service Workers"],
    architecture: "Native WebView Wrapper with Local Caching Layer",
    status: "Completed",
    year: "2025"
  },
  {
    id: "ollama-bench",
    title: "Local LLM Inference Optimization",
    category: "AI",
    shortDescription: "Benchmarking prompt evaluation times, token generation speeds, and VRAM quantization for local models on Ollama.",
    longDescription: "A systematic benchmarking suite measuring tokens-per-second, memory fragmentation, and GPU offloading across quantized 4-bit and 8-bit GGUF models running locally on dedicated GPU hardware.",
    technologies: ["Ollama", "Python", "CUDA", "FastAPI", "GGUF Quantization"],
    architecture: "Benchmarking Pipeline with Automated Latency Metrics",
    status: "Benchmark Active",
    year: "2026"
  },
  {
    id: "noc-router",
    title: "MikroTik NOC Routing & Packet Lab",
    category: "Systems",
    shortDescription: "High-availability router configuration, firewall filtering rules, VLAN segmenting, and 24/7 uptime surveillance benches.",
    longDescription: "Built during hands-on NOC support and MTCNA training. Designed multi-subnet routing tables, bandwidth queues (simple and tree), failover gateway scripts, and firewall connection-tracking filters.",
    technologies: ["RouterOS", "MikroTik", "TCP/IP", "Wireshark", "VLANs"],
    architecture: "Layer 3 Routing / Firewall Rules / Quality of Service (QoS)",
    status: "Production Bench",
    year: "2025"
  },
  {
    id: "custom-ups",
    title: "Off-Grid Solar & Custom UPS Hardware",
    category: "Hardware",
    shortDescription: "Engineering custom battery management systems (BMS), multi-transistor audio amplifiers, and resilient DC solar power setups.",
    longDescription: "Hands-on electronics engineering project building uninterruptible power units with instant relay switching, solar charge regulation, and analog audio circuits built with discrete power transistors.",
    technologies: ["Power Electronics", "BMS", "Solar DC Inverter", "Analog Circuits"],
    architecture: "Hardware Power Management & DC Power Supply Architecture",
    status: "Field Operational",
    year: "2024 - 2025"
  }
];

PROJECTS.forEach(proj => {
  const content = `---
title: "${proj.title}"
slug: "${proj.id}"
description: "${proj.shortDescription}"
date: "${proj.year}-01-01"
type: "projects"
category: "${proj.category}"
tags: ${JSON.stringify(proj.technologies)}
status: "published"
featured: false
author: "Md Sabbirul Islam Khan"
brand: "THE SABBiR"
projectStatus: "${proj.status}"
technologies: ${JSON.stringify(proj.technologies)}
---

${proj.longDescription}

## Architecture
${proj.architecture}
`;
  const p = path.join(__dirname, '..', 'content', 'projects', `${proj.id}.mdx`);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, content, 'utf8');
  }
});
