import { describe, it, expect } from "vitest";
import { AUTONOMOUS_AGENTS } from "../agent-types";
import { executeAgentTask } from "../agent-runtime";
import { SWARM_PIPELINES, executeSwarmPipeline } from "../swarm-orchestrator";

describe("24 Domain Agents & 8 Swarms Integration Test (Stage 095)", () => {
  it("contains exactly 24 registered autonomous domain agents", () => {
    expect(AUTONOMOUS_AGENTS.length).toBe(24);
    const agentIds = AUTONOMOUS_AGENTS.map((a) => a.id);
    expect(agentIds).toContain("pixelforge");
    expect(agentIds).toContain("khatavision");
    expect(agentIds).toContain("catalog-ranker");
    expect(agentIds).toContain("cheque-guard");
    expect(agentIds).toContain("career-shield");
    expect(agentIds).toContain("network-doctor");
    expect(agentIds).toContain("image-retouch");
    expect(agentIds).toContain("story-craft");
    expect(agentIds).toContain("audio-master");
    expect(agentIds).toContain("waf-sentinel");
    expect(agentIds).toContain("gov-doc");
    expect(agentIds).toContain("remit-advisor");
    expect(agentIds).toContain("support-macro");
    expect(agentIds).toContain("design-token");
    expect(agentIds).toContain("health-routine");
    expect(agentIds).toContain("academic-coach");
    expect(agentIds).toContain("family-cfo");
    expect(agentIds).toContain("autonomous-curator");
  });

  it("verifies Agent 13 (ImageRetouch) executes and outputs valid JSON recipe", async () => {
    const res = await executeAgentTask(
      "image-retouch",
      "Product photo on desk. 4:5 crop with Teal-Orange LUT."
    );
    expect(res.agent.id).toBe("image-retouch");
    expect(res.artifact.filename).toBe("image-retouch-recipe.json");
    expect(res.artifact.filetype).toBe("json");
    const json = JSON.parse(res.artifact.content);
    expect(json.cropSpec.targetAspectRatio).toBe("4:5");
    expect(json.adjustments.lutPreset).toBe("Cinematic Teal-Orange");
  });

  it("verifies Agent 14 (StoryCraft) executes and outputs 5-slide markdown storyboard", async () => {
    const res = await executeAgentTask(
      "story-craft",
      "Why Postgres Trumps MongoDB for SaaS"
    );
    expect(res.agent.id).toBe("story-craft");
    expect(res.artifact.filename).toBe("storycraft-carousel.md");
    expect(res.artifact.filetype).toBe("markdown");
    expect(res.artifact.content).toContain("StoryCraft Carousel Storyboard");
    expect(res.artifact.content).toContain("Slide 1");
    expect(res.artifact.content).toContain("Slide 5");
  });

  it("verifies Agent 15 (AudioMaster) executes and outputs -14 LUFS DSP profile", async () => {
    const res = await executeAgentTask(
      "audio-master",
      "Bangla podcast narration track with AC background hum"
    );
    expect(res.agent.id).toBe("audio-master");
    expect(res.artifact.filename).toBe("audiomaster-chain.json");
    expect(res.artifact.filetype).toBe("json");
    const json = JSON.parse(res.artifact.content);
    expect(json.standards.integratedLoudness).toBe("-14.0 LUFS");
    expect(json.standards.bgmDuckRelVoice).toBe("-21.0 dB");
  });

  it("verifies Agent 16 (WafSentinel) executes and outputs TypeScript WAF middleware", async () => {
    const res = await executeAgentTask(
      "waf-sentinel",
      "Next.js Edge route /api/workplace/auth rate limit and SQLi audit"
    );
    expect(res.agent.id).toBe("waf-sentinel");
    expect(res.artifact.filename).toBe("waf-sentinel-rules.ts");
    expect(res.artifact.filetype).toBe("text");
    expect(res.artifact.content).toContain("checkRateLimit");
    expect(res.artifact.content).toContain("inspectPayloadSecurity");
  });

  it("verifies Agent 17 (GovDoc) executes and outputs BCS/Visa compliance spec", async () => {
    const res = await executeAgentTask(
      "gov-doc",
      "BCS 300x300 photo and 300x80 signature verification"
    );
    expect(res.agent.id).toBe("gov-doc");
    expect(res.artifact.filename).toBe("govdoc-compliance-report.json");
    expect(res.artifact.filetype).toBe("json");
    const json = JSON.parse(res.artifact.content);
    expect(json.photoAudit.dimensions).toContain("300x300");
    expect(json.signatureAudit.dimensions).toContain("300x80");
  });

  it("verifies Agent 18 (RemitAdvisor) executes and outputs 2.5% incentive breakdown", async () => {
    const res = await executeAgentTask(
      "remit-advisor",
      "Calculate $1,000 Upwork withdrawal to Bangladeshi bank"
    );
    expect(res.agent.id).toBe("remit-advisor");
    expect(res.artifact.filename).toBe("remittance-payout-analysis.json");
    expect(res.artifact.filetype).toBe("json");
    const json = JSON.parse(res.artifact.content);
    expect(json.govtIncentiveRate).toContain("2.5%");
    expect(json.corridorRankings.length).toBeGreaterThanOrEqual(3);
  });

  it("verifies Agent 19 (SupportMacro) executes and outputs markdown F-Commerce playbook", async () => {
    const res = await executeAgentTask(
      "support-macro",
      "Create order confirmation and polite due payment macros"
    );
    expect(res.agent.id).toBe("support-macro");
    expect(res.artifact.filename).toBe("fcommerce-support-playbook.md");
    expect(res.artifact.filetype).toBe("markdown");
    expect(res.artifact.content).toContain("Order Confirmation Macro");
    expect(res.artifact.content).toContain("{customer_name}");
  });

  it("verifies Agent 20 (DesignToken) executes and outputs Tailwind v4 theme", async () => {
    const res = await executeAgentTask(
      "design-token",
      "Generate Tailwind v4 theme tokens from hex #0284c7"
    );
    expect(res.agent.id).toBe("design-token");
    expect(res.artifact.filename).toBe("tailwind-v4-theme.css");
    expect(res.artifact.filetype).toBe("text");
    expect(res.artifact.content).toContain("@theme");
    expect(res.artifact.content).toContain("--color-brand-600");
  });

  it("contains 10 curated multi-agent swarms with Swarm 06 (freelancer-career)", async () => {
    expect(SWARM_PIPELINES.length).toBe(10);
    const careerSwarm = SWARM_PIPELINES.find((s) => s.id === "freelancer-career");
    expect(careerSwarm).toBeDefined();
    expect(careerSwarm?.stages.length).toBe(3);
    expect(careerSwarm?.stages[0].agentId).toBe("career-shield");
    expect(careerSwarm?.stages[1].agentId).toBe("remit-advisor");
    expect(careerSwarm?.stages[2].agentId).toBe("gov-doc");

    const exec = await executeSwarmPipeline("freelancer-career", "Global Remote Software Engineer");
    expect(exec.swarmId).toBe("freelancer-career");
    expect(exec.artifacts.length).toBe(3);
    expect(exec.combinedBundleMarkdown).toContain("CareerShield");
    expect(exec.combinedBundleMarkdown).toContain("RemitAdvisor");
    expect(exec.combinedBundleMarkdown).toContain("GovDoc");
  });
});
