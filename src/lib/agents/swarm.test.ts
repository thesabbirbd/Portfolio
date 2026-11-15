import { describe, it, expect } from "vitest";
import { SWARM_PIPELINES, executeSwarmPipeline } from "./swarm-orchestrator";

describe("Multi-Agent Autonomous Swarm Engine", () => {
  it("contains exactly 8 curated multi-agent swarms", () => {
    expect(SWARM_PIPELINES.length).toBe(8);
  });

  it("ensures every swarm has 3 sequential stages and valid agent bindings", () => {
    for (const swarm of SWARM_PIPELINES) {
      expect(swarm.id).toBeDefined();
      expect(swarm.title).toBeDefined();
      expect(swarm.stages.length).toBe(3);
      for (const stage of swarm.stages) {
        expect(stage.agentId).toBeDefined();
        expect(stage.stageName).toBeDefined();
        expect(typeof stage.inputTransform).toBe("function");
      }
    }
  });

  it("executes E-Commerce Product Launch Swarm end-to-end", async () => {
    const res = await executeSwarmPipeline(
      "ecommerce-launch",
      "Pro Bluetooth Smartwatch with Bangla Display"
    );

    expect(res.swarmId).toBe("ecommerce-launch");
    expect(res.artifacts.length).toBe(3);
    expect(res.stageTraces.length).toBe(3);
    expect(res.combinedBundleMarkdown).toContain("PixelForge");
    expect(res.combinedBundleMarkdown).toContain("CatalogRanker");
    expect(res.combinedBundleMarkdown).toContain("BizDesk BD");
    expect(res.durationMs).toBeGreaterThan(0);
  });

  it("executes Daily Shop Closing Swarm end-to-end", async () => {
    const res = await executeSwarmPipeline(
      "daily-closing",
      "চাল ৫ কেজি ৩৫০ টাকা (PAID), তেল ২ লিটার ৩৭৫ টাকা (BAKI)"
    );

    expect(res.swarmId).toBe("daily-closing");
    expect(res.artifacts.length).toBe(3);
    expect(res.combinedBundleMarkdown).toContain("KhataVision");
    expect(res.combinedBundleMarkdown).toContain("ChequeGuard");
  });

  it("executes Full Brand & Media Launch Swarm end-to-end", async () => {
    const res = await executeSwarmPipeline(
      "brand-launch",
      "THE SABBiR OS SaaS Workplace Launch"
    );

    expect(res.swarmId).toBe("brand-launch");
    expect(res.artifacts.length).toBe(3);
    expect(res.combinedBundleMarkdown).toContain("StoryCraft");
    expect(res.combinedBundleMarkdown).toContain("AudioMaster");
    expect(res.combinedBundleMarkdown).toContain("WafSentinel");
  });

  it("executes Freelancer & Global Remote Career Swarm end-to-end", async () => {
    const res = await executeSwarmPipeline(
      "freelancer-career",
      "Senior Full-Stack Engineer applying to US remote startup with $1,500 milestone"
    );

    expect(res.swarmId).toBe("freelancer-career");
    expect(res.artifacts.length).toBe(3);
    expect(res.combinedBundleMarkdown).toContain("CareerShield");
    expect(res.combinedBundleMarkdown).toContain("RemitAdvisor");
    expect(res.combinedBundleMarkdown).toContain("GovDoc");
  });
});
