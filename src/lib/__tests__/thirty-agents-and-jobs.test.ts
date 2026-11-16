import { describe, it, expect } from "vitest";
import {
  ALL_30_AGENTS,
  FLEET_A_INPUT_TO_ACTION_AGENTS,
  FLEET_B_SCHEDULED_BOTS,
  getAgentById,
  getAgentsByFleet,
} from "@/lib/agents/agent-fleet-registry";
import { SWARM_PIPELINES } from "@/lib/agents/swarm-orchestrator";
import {
  createJobTicket,
  getJobTicket,
  executeLocalWorkerJob,
  listUserJobs,
} from "@/lib/agents/input-to-action-dispatcher";
import liveBdRates from "@/data/live-bd-rates.json";

describe("30 Real-World Agentic Systems & Job Engine (Block 4 - Stages 031-045)", () => {
  it("catalogs exactly 30 agents split into 15 Worker Agents and 15 Scheduled Bots", () => {
    expect(ALL_30_AGENTS.length).toBe(30);
    expect(FLEET_A_INPUT_TO_ACTION_AGENTS.length).toBe(15);
    expect(FLEET_B_SCHEDULED_BOTS.length).toBe(15);

    const workerAgents = getAgentsByFleet("input-to-action");
    expect(workerAgents.length).toBe(15);

    const scheduledBots = getAgentsByFleet("scheduled-bot");
    expect(scheduledBots.length).toBe(15);
  });

  it("finds Agent #01 OmniFormat Image Converter with all metadata", () => {
    const agent = getAgentById("image-converter-agent");
    expect(agent).toBeDefined();
    expect(agent?.number).toBe(1);
    expect(agent?.name).toContain("OmniFormat");
    expect(agent?.outputArtifactType).toBe("zip");
    expect(agent?.skills.length).toBeGreaterThan(2);
  });

  it("catalogs 10 Autonomous Multi-Agent Swarms", () => {
    expect(SWARM_PIPELINES.length).toBe(10);
    expect(SWARM_PIPELINES.some((s) => s.id === "student-mess-life")).toBe(true);
    expect(SWARM_PIPELINES.some((s) => s.id === "govt-job-application")).toBe(true);
    expect(SWARM_PIPELINES.some((s) => s.id === "ecommerce-launch")).toBe(true);
  });

  it("creates, retrieves, and executes a local worker job ticket cleanly", async () => {
    const ticket = createJobTicket({
      agentId: "image-converter-agent",
      userId: "test-user-101",
      username: "Rafiq Chowdhury",
      inputPayload: "Convert 5 product shots to WebP 85%",
      mode: "instant_local",
      inputParams: { targetFormat: "webp", fileCount: 5 },
    });

    expect(ticket.id.startsWith("JOB-")).toBe(true);
    expect(ticket.status).toBe("queued");

    const fetched = getJobTicket(ticket.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(ticket.id);

    const completed = await executeLocalWorkerJob(ticket.id);
    expect(completed.status).toBe("completed");
    expect(completed.progressPercent).toBe(100);
    expect(completed.artifact).toBeDefined();
    expect(completed.artifact?.filename).toContain("omniformat");

    const userJobs = listUserJobs("test-user-101");
    expect(userJobs.length).toBeGreaterThanOrEqual(1);
    expect(userJobs[0].id).toBe(ticket.id);
  });

  it("validates live-bd-rates.json schema and currency/gold benchmarks", () => {
    expect(liveBdRates).toBeDefined();
    expect(liveBdRates.currency.usdRemittance).toBeGreaterThanOrEqual(120);
    expect(liveBdRates.goldBajusPerBhori["22k"]).toBeGreaterThan(100000);
    expect(liveBdRates.silverBajusPerBhori["22k"]).toBeGreaterThan(1500);
    expect(liveBdRates.zakatNisab.silverTakaThreshold).toBeGreaterThan(50000);
  });
});
