import { describe, it, expect } from "vitest";
import { AUTONOMOUS_AGENTS } from "./agent-types";
import { executeAgentTask } from "./agent-runtime";

describe("Autonomous AI Micro-Agents Engine", () => {
  it("contains 24 specialized micro-agents (20 base + 4 v5.2.13 domain agents)", () => {
    expect(AUTONOMOUS_AGENTS.length).toBe(24);
  });

  it("ensures every agent has unique id, system rules, and presets", () => {
    const ids = new Set<string>();
    for (const agent of AUTONOMOUS_AGENTS) {
      expect(ids.has(agent.id)).toBe(false);
      ids.add(agent.id);
      expect(agent.name).toBeDefined();
      expect(agent.systemRules.length).toBeGreaterThan(0);
      expect(agent.skills.length).toBeGreaterThanOrEqual(3);
      expect(agent.presets.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("runs agent simulation producing step-by-step reasoning trace and artifact", async () => {
    const agent = AUTONOMOUS_AGENTS[0]; // PixelForge
    const steps: string[] = [];

    const execution = await executeAgentTask(
      agent.id,
      "Remove background from product photo",
      (step) => steps.push(step.message)
    );

    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(execution.trace.length).toBeGreaterThanOrEqual(4);
    expect(execution.artifact).toBeDefined();
    expect(execution.artifact?.title).toBeDefined();
  });
});
