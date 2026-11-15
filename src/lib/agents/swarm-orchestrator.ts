/**
 * Multi-Agent Swarm Orchestrator (Client-Side Autonomous Pipelines)
 * Coordinates 3+ domain agents executing in a sequential DAG (Directed Acyclic Graph),
 * passing intermediate artifacts, telemetry traces, and generating a combined release bundle.
 */

import { executeAgentTask } from "./agent-runtime";
import { type AgentArtifact, type AgentTraceStep } from "./agent-types";

export interface SwarmStage {
  agentId: string;
  stageName: string;
  roleDescription: string;
  inputTransform: (prevArtifacts: AgentArtifact[], initialInput: string) => string;
}

export interface SwarmPipeline {
  id: string;
  title: string;
  banglaTitle: string;
  tagline: string;
  description: string;
  stages: SwarmStage[];
  category: "E-Commerce" | "Retail Accounting" | "DevOps" | "Creator Media" | "Brand & Security" | "Career & Global" | "Family & Finance" | "Autonomous Intelligence";
  icon: string;
  estimatedSec: number;
}

export interface SwarmExecutionResult {
  swarmId: string;
  title: string;
  artifacts: AgentArtifact[];
  stageTraces: { stageName: string; agentId: string; traces: AgentTraceStep[] }[];
  combinedBundleMarkdown: string;
  durationMs: number;
}

export const SWARM_PIPELINES: SwarmPipeline[] = [
  {
    id: "ecommerce-launch",
    title: "E-Commerce Product Launch Swarm",
    banglaTitle: "ই-কমার্স প্রোডাক্ট লঞ্চ সোয়ার্ম",
    tagline: "PixelForge ➔ CatalogRanker ➔ BizDesk BD",
    description: "Transforms a single product idea into studio photo specs, Daraz & Facebook ad copies, and scannable inventory barcode labels.",
    category: "E-Commerce",
    icon: "ShoppingBag",
    estimatedSec: 3,
    stages: [
      {
        agentId: "pixelforge",
        stageName: "1. Media & Backdrop Framing",
        roleDescription: "Isolates product silhouette, applies 1:1 square canvas, and crafts studio contact shadow.",
        inputTransform: (_, input) => `Create 1080p e-commerce studio showcase for: ${input}`,
      },
      {
        agentId: "catalog-ranker",
        stageName: "2. Daraz SEO & Ad Copywriting",
        roleDescription: "Drafts ranked title, 5-point specs, and 3 Facebook ad copy variants with pricing psychology.",
        inputTransform: (prev, input) => `Synthesize Daraz listing & FB ad copies for: ${input}. Backdrop: Clean Studio.`,
      },
      {
        agentId: "bizdesk-bd",
        stageName: "3. Inventory Barcode & COD Shipping",
        roleDescription: "Generates scannable GS1 Code-128 SKU sticker, bKash QR code, and Steadfast courier fee calculation.",
        inputTransform: (prev, input) => `Generate retail SKU barcode and delivery cash memo for: ${input}`,
      },
    ],
  },
  {
    id: "daily-closing",
    title: "Daily Shop Closing & Audit Swarm",
    banglaTitle: "দোকানের দিনশেষে বাকি ও ক্যাশ অডিট সোয়ার্ম",
    tagline: "KhataVision ➔ ChequeGuard ➔ PrivacyShield",
    description: "Parses Bengali khata notes, calculates cash vs baki, reconciles bank cheque deposit slips in words, and scrubs customer PII.",
    category: "Retail Accounting",
    icon: "Receipt",
    estimatedSec: 3,
    stages: [
      {
        agentId: "khatavision",
        stageName: "1. Khata Digit & Subtotal Extraction",
        roleDescription: "Parses handwritten/typed Bengali khata items, segregates Paid vs Baki, and outputs Excel CSV.",
        inputTransform: (_, input) => `Parse shop closing ledger: ${input}`,
      },
      {
        agentId: "cheque-guard",
        stageName: "2. Cheque Clearing & Words Reconciliation",
        roleDescription: "Converts grand total to Bangladeshi Lakh/Crore banking words and audits clearing dates.",
        inputTransform: (prev) => `Reconcile total closing amount in words and audit deposit slip. Data: ${prev[0]?.summary || "125,450 BDT"}`,
      },
      {
        agentId: "privacy-shield",
        stageName: "3. Customer Privacy Sanitization",
        roleDescription: "Masks customer mobile numbers, NID, and street address for safe cloud accounting archiving.",
        inputTransform: (prev) => `Sanitize customer PII and generate privacy-safe audit record. Content: ${prev[0]?.content || ""}`,
      },
    ],
  },
  {
    id: "devops-release",
    title: "Production DevOps Release Swarm",
    banglaTitle: "প্রোডাকশন ডেভঅপ্স রিলিজ সোয়ার্ম",
    tagline: "SchemaPilot ➔ SecOps Guardian ➔ NetworkDoctor",
    description: "Audits SQL schema for missing indexes, hardens Dockerfile with non-root multi-stage builds, and crafts MikroTik dual-WAN failover.",
    category: "DevOps",
    icon: "Terminal",
    estimatedSec: 3,
    stages: [
      {
        agentId: "schemapilot",
        stageName: "1. SQL Index & EXPLAIN Optimization",
        roleDescription: "Identifies sequential table scans, recommends B-tree composite indices, and generates DDL.",
        inputTransform: (_, input) => `Optimize database schema and queries for release: ${input}`,
      },
      {
        agentId: "secops-guardian",
        stageName: "2. Container & systemd Hardening",
        roleDescription: "Eliminates root user execution, pins minimal Alpine tags, and generates systemd timer units.",
        inputTransform: (prev, input) => `Harden container and scheduled cron units for: ${input}`,
      },
      {
        agentId: "network-doctor",
        stageName: "3. Dual-WAN & API Latency Scenario",
        roleDescription: "Designs MikroTik recursive failover routes and sets up k6 p95/p99 latency benchmark scripts.",
        inputTransform: (prev, input) => `Architect dual-WAN failover routes and k6 latency test for: ${input}`,
      },
    ],
  },
  {
    id: "viral-creator",
    title: "Creator Viral Episode Swarm",
    banglaTitle: "ক্রিয়েটর ভাইরাল ভিডিও এপিসোড সোয়ার্ম",
    tagline: "VoiceScribe ➔ ViralDirector ➔ CatalogRanker",
    description: "Transcribes voice notes into meeting action items, writes a 60s timed 3-column script with .SRT, and formats social SEO cards.",
    category: "Creator Media",
    icon: "Video",
    estimatedSec: 3,
    stages: [
      {
        agentId: "voice-scribe",
        stageName: "1. Speech-to-Text & Action Extraction",
        roleDescription: "Captures spoken ideas, extracts core takeaways, and formats structured action items.",
        inputTransform: (_, input) => `Transcribe and extract key hooks from speech: ${input}`,
      },
      {
        agentId: "viraldirector",
        stageName: "2. 60s Script & Subtitle Timestamps",
        roleDescription: "Engineers 3-second hook, 3-column master sheet (Voice | Visual | SFX), and compliant .srt stream.",
        inputTransform: (prev, input) => `Construct 60s viral video script with .srt subtitles for: ${input}`,
      },
      {
        agentId: "catalog-ranker",
        stageName: "3. Social Headline & Preview Hooks",
        roleDescription: "Generates high-CTR Facebook/YouTube title variants and promotional caption hooks.",
        inputTransform: (prev, input) => `Generate click-worthy title options and social media captions for: ${input}`,
      },
    ],
  },
  {
    id: "brand-launch",
    title: "Full Brand & Media Launch Swarm",
    banglaTitle: "ফুল ব্র্যান্ড ও মিডিয়া লঞ্চ সোয়ার্ম",
    tagline: "StoryCraft ➔ AudioMaster ➔ WafSentinel",
    description: "Generates a 5-slide visual carousel, crafts -14 LUFS vocal DSP profile, and compiles WAF token-bucket security policies for a flawless launch.",
    category: "Brand & Security",
    icon: "ShieldAlert",
    estimatedSec: 4,
    stages: [
      {
        agentId: "story-craft",
        stageName: "1. Visual Story & Carousel Blueprint",
        roleDescription: "Designs 5-slide social carousel with high-CTR curiosity hook and 4:5 / 9:16 safe-zones.",
        inputTransform: (_, input) => `Design 5-slide launch carousel and story storyboard for: ${input}`,
      },
      {
        agentId: "audio-master",
        stageName: "2. Voiceover & BGM DSP Mastering",
        roleDescription: "Calculates -14 LUFS loudness curve, cuts mic rumble, and targets vocal clarity EQ.",
        inputTransform: (prev, input) => `Master voiceover and BGM loudness for brand release: ${input}`,
      },
      {
        agentId: "waf-sentinel",
        stageName: "3. Edge WAF & Traffic Shield Policy",
        roleDescription: "Compiles Token-Bucket DDoS rate limiter and SQLi/XSS AST security rules for the launch.",
        inputTransform: (prev, input) => `Generate WAF security shield and rate-limit policy for high-traffic launch: ${input}`,
      },
    ],
  },
  {
    id: "freelancer-career",
    title: "Freelancer & Global Remote Career Swarm",
    banglaTitle: "ফ্রিল্যান্সার ও গ্লোবাল রিমোট ক্যারিয়ার সোয়ার্ম",
    tagline: "CareerShield ➔ RemitAdvisor ➔ GovDoc",
    description: "Audits ATS CV for international remote roles, optimizes USD-to-BDT banking corridors with 2.5% Bangladesh Bank cash incentive, and generates visa document spec sheets.",
    category: "Career & Global",
    icon: "Globe",
    estimatedSec: 4,
    stages: [
      {
        agentId: "career-shield",
        stageName: "1. ATS CV & Global Profile Scrubber",
        roleDescription: "Audits CV for global tech keywords, computes ATS match score, and sanitizes personal PII for public LinkedIn/Upwork sharing.",
        inputTransform: (_, input) => `Audit CV and scrub PII for global remote role: ${input}`,
      },
      {
        agentId: "remit-advisor",
        stageName: "2. Remittance & 2.5% Incentive Calculator",
        roleDescription: "Compares Upwork vs Payoneer vs Wise to local bank account and maximizes net BDT payout with 2.5% Govt cash incentive.",
        inputTransform: (prev, input) => `Optimize international USD remittance payout and 2.5% incentive for: ${input}`,
      },
      {
        agentId: "gov-doc",
        stageName: "3. Visa & International Document Verification",
        roleDescription: "Verifies passport photo compliance, digital signature sizing, and embassy document requirements.",
        inputTransform: (prev, input) => `Generate visa and identity document spec sheet for global remote worker: ${input}`,
      },
    ],
  },
  {
    id: "family-wealth-audit",
    title: "Family Wealth, Tax & Zakat Audit Swarm",
    banglaTitle: "পারিবারিক সম্পদ, কর ও যাকাত অডিট সোয়ার্ম",
    tagline: "FamilyCFO ➔ ChequeGuard ➔ PrivacyShield",
    description: "Audits household 50/30/20 budget and Sanchaypatra net profit, verifies banking cheque words with crossing lines, and scrubs financial PII before PDF export.",
    category: "Family & Finance",
    icon: "Receipt",
    estimatedSec: 4,
    stages: [
      {
        agentId: "family-cfo",
        stageName: "1. Household Budget & Zakat Allocation",
        roleDescription: "Analyzes monthly income, computes BAJUS Gold/Silver Nisab, and reconciles Sanchaypatra source tax.",
        inputTransform: (_, input) => `Audit family wealth and zakat allocation for: ${input}`,
      },
      {
        agentId: "cheque-guard",
        stageName: "2. Banking Cheque & Words Verification",
        roleDescription: "Validates Taka amounts in Bengali words, applies Account Payee Only crossing lines, and flags fraud risks.",
        inputTransform: (prev, input) => `Generate secure bank cheque words and crossing rules for wealth disbursement: ${input}`,
      },
      {
        agentId: "privacyshield",
        stageName: "3. Financial PII & Document Redaction",
        roleDescription: "Scrubs bank account numbers, NID hashes, and phone numbers before storing or sharing audit statements.",
        inputTransform: (prev, input) => `Redact PII from wealth audit statement: ${input}`,
      },
    ],
  },
  {
    id: "autonomous-seo-viral",
    title: "Autonomous SEO, News & Viral Content Swarm",
    banglaTitle: "অটোনোমাস এসইও, নিউজ ও ভাইরাল কন্টেন্ট সোয়ার্ম",
    tagline: "AutonomousCurator ➔ ViralDirector ➔ CatalogRanker",
    description: "Continuously scans GitHub releases and Bangladesh tech news, designs 60s viral TikTok/Reel storyboard hooks, and synthesizes SEO-ranked tags and metadata.",
    category: "Autonomous Intelligence",
    icon: "Cpu",
    estimatedSec: 4,
    stages: [
      {
        agentId: "autonomous-curator",
        stageName: "1. OS Brain Tech & Hack Synthesis",
        roleDescription: "Scans open source repositories, filters out fluff, generates Bengali summary, and creates deterministic vector cover seed.",
        inputTransform: (_, input) => `Curate tech news and open source releases for: ${input}`,
      },
      {
        agentId: "viraldirector",
        stageName: "2. 60s Viral Storyboard & Hook Design",
        roleDescription: "Crafts high-retention 3-second visual hook, scene-by-scene script, and B-roll guidance for social platforms.",
        inputTransform: (prev, input) => `Design 60-second viral tech video storyboard for: ${input}`,
      },
      {
        agentId: "catalog-ranker",
        stageName: "3. Search Engine Ranking & Tag Optimizer",
        roleDescription: "Synthesizes YouTube tags (≤500 chars), meta descriptions, and OpenGraph social preview tags.",
        inputTransform: (prev, input) => `Optimize search ranking and YouTube tags for: ${input}`,
      },
    ],
  },
];

/**
 * Executes a full 3-stage Multi-Agent Swarm Pipeline.
 */
export async function executeSwarmPipeline(
  swarmId: string,
  initialInput: string,
  onStageStart?: (stageIndex: number, stageName: string) => void
): Promise<SwarmExecutionResult> {
  const pipeline = SWARM_PIPELINES.find((p) => p.id === swarmId);
  if (!pipeline) {
    throw new Error(`Unknown swarm pipeline ID: ${swarmId}`);
  }

  const startTime = performance.now();
  const collectedArtifacts: AgentArtifact[] = [];
  const stageTraces: { stageName: string; agentId: string; traces: AgentTraceStep[] }[] = [];

  for (let i = 0; i < pipeline.stages.length; i++) {
    const stage = pipeline.stages[i];
    if (onStageStart) {
      onStageStart(i, stage.stageName);
    }

    const stageInput = stage.inputTransform(collectedArtifacts, initialInput);
    const result = await executeAgentTask(stage.agentId, stageInput);

    collectedArtifacts.push(result.artifact);
    stageTraces.push({
      stageName: stage.stageName,
      agentId: stage.agentId,
      traces: result.trace,
    });
  }

  const durationMs = Math.round(performance.now() - startTime);

  // Generate combined Markdown bundle
  let combinedMd = `# ${pipeline.title} — Artifact Bundle // THE SABBiR OS\n`;
  combinedMd += `**Pipeline ID:** \`${pipeline.id}\` | **Executed In:** ${durationMs}ms | **Stages:** ${pipeline.stages.length}\n\n`;

  collectedArtifacts.forEach((art, idx) => {
    combinedMd += `## Stage ${idx + 1}: ${pipeline.stages[idx].stageName} — ${art.title} (\`${art.filename}\`)\n`;
    combinedMd += `> ${art.summary}\n\n`;
    combinedMd += `\`\`\`${art.filetype}\n${art.content}\n\`\`\`\n\n`;
  });

  return {
    swarmId,
    title: pipeline.title,
    artifacts: collectedArtifacts,
    stageTraces,
    combinedBundleMarkdown: combinedMd,
    durationMs,
  };
}
