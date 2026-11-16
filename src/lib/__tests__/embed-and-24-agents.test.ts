import { describe, it, expect } from "vitest";
import { EMBED_WIDGETS, generateIframeSnippet } from "@/lib/embed/widget-registry";
import { AUTONOMOUS_AGENTS } from "@/lib/agents/agent-types";
import { SWARM_PIPELINES } from "@/lib/agents/swarm-orchestrator";
import { getOSBrainTelemetry } from "@/lib/autonomous/os-autonomous-engine";

describe("Stage 080: Embeddable Micro-SaaS Widget Registry Tests", () => {
  it("registers exactly 9 micro-widgets with required metadata", () => {
    const keys = Object.keys(EMBED_WIDGETS);
    expect(keys.length).toBe(9);

    const expectedSlugs = [
      "bijoy-converter",
      "land-gold-converter",
      "zakat-calculator",
      "cgpa-calculator",
      "remittance-calculator",
      "electricity-bill",
      "age-calculator",
      "sanchaypatra-emi",
      "id-card-stitcher",
    ];

    expectedSlugs.forEach((slug) => {
      expect(EMBED_WIDGETS[slug]).toBeDefined();
      expect(EMBED_WIDGETS[slug].defaultHeight).toBeGreaterThan(300);
      expect(EMBED_WIDGETS[slug].studioHref.startsWith("/tools/")).toBe(true);
    });
  });

  it("generates valid, secure responsive iframe snippets with backlink", () => {
    const snippet = generateIframeSnippet({
      slug: "bijoy-converter",
      theme: "dark",
      lang: "bn",
    });

    expect(snippet).toContain("<iframe");
    expect(snippet).toContain("https://sabbir.nav.bd/embed/bijoy-converter?theme=dark&lang=bn");
    expect(snippet).toContain("⚡ Powered by THE SABBiR OS");
    expect(snippet).toContain("https://sabbir.nav.bd/tools/bangla-converter");
  });
});

describe("Stage 080: 24 Autonomous Domain Agents Registry Tests", () => {
  it("contains exactly 24 unique domain agents", () => {
    expect(AUTONOMOUS_AGENTS.length).toBe(24);
    const ids = new Set(AUTONOMOUS_AGENTS.map((a) => a.id));
    expect(ids.size).toBe(24);
  });

  it("verifies the 4 new specialist agents exist with valid schemas", () => {
    const newAgentIds = ["health-routine", "academic-coach", "family-cfo", "autonomous-curator"];

    newAgentIds.forEach((id) => {
      const agent = AUTONOMOUS_AGENTS.find((a) => a.id === id);
      expect(agent).toBeDefined();
      expect(agent?.skills.length).toBeGreaterThanOrEqual(3);
      expect(agent?.systemRules.length).toBeGreaterThanOrEqual(2);
      expect(agent?.presets.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe("Stage 080: Multi-Agent Swarms Orchestrator Tests", () => {
  it("contains 10 multi-agent swarms with 3+ stages each", () => {
    expect(SWARM_PIPELINES.length).toBe(10);
    const swarmIds = new Set(SWARM_PIPELINES.map((s) => s.id));
    expect(swarmIds.size).toBe(10);

    SWARM_PIPELINES.forEach((pipeline) => {
      expect(pipeline.stages.length).toBeGreaterThanOrEqual(3);
      expect(pipeline.estimatedSec).toBeGreaterThan(0);
    });
  });

  it("includes Swarm 07 (family-wealth-audit) and Swarm 08 (autonomous-seo-viral)", () => {
    const swarm7 = SWARM_PIPELINES.find((s) => s.id === "family-wealth-audit");
    expect(swarm7).toBeDefined();
    expect(swarm7?.stages.map((st) => st.agentId)).toEqual(["family-cfo", "cheque-guard", "privacyshield"]);

    const swarm8 = SWARM_PIPELINES.find((s) => s.id === "autonomous-seo-viral");
    expect(swarm8).toBeDefined();
    expect(swarm8?.stages.map((st) => st.agentId)).toEqual(["autonomous-curator", "viraldirector", "catalog-ranker"]);
  });
});

describe("Stage 080: OS Brain Telemetry Consistency", () => {
  it("reports accurate platform asset counts", () => {
    const telemetry = getOSBrainTelemetry();
    expect(telemetry.toolsCount).toBe(56);
    expect(telemetry.agentsCount).toBe(24);
    expect(telemetry.swarmsCount).toBe(8);
    expect(telemetry.hacksCount).toBe(40);
  });
});
