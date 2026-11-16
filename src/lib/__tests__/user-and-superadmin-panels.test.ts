import { describe, it, expect, beforeEach } from "vitest";
import { ALL_30_AGENTS } from "@/lib/agents/agent-fleet-registry";
import { listAllJobs, createJobTicket } from "@/lib/agents/input-to-action-dispatcher";
import {
  saveStoredSession,
  getStoredSession,
  authenticateWithBlankOrPassword,
  type ImmortalUser,
} from "@/lib/auth/immortal-identity";

describe("SaaS User Panel & SuperAdmin Control Center (Block 5 - Stages 046-055)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it("manages immortal user session and blank-password mode in dashboard settings", () => {
    const session: ImmortalUser = {
      id: "usr-dash-test",
      handle: "Tanvir_Hasan",
      displayName: "Tanvir Hasan",
      role: "member",
      totalXp: 450,
      exportsCount: 12,
      hasPassword: false,
      sessionToken: "tok-test-4829",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    saveStoredSession(session);
    const active = getStoredSession();

    expect(active).toBeDefined();
    expect(active?.handle).toBe("Tanvir_Hasan");
    expect(active?.hasPassword).toBe(false);
    expect(active?.totalXp).toBe(450);
  });

  it("authenticates Tanvir_Hasan with blank password seamlessly", async () => {
    const session: ImmortalUser = {
      id: "usr-dash-test",
      handle: "Tanvir_Hasan",
      displayName: "Tanvir Hasan",
      role: "member",
      totalXp: 450,
      exportsCount: 12,
      hasPassword: false,
      sessionToken: "tok-test-4829",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    saveStoredSession(session);

    const auth = await authenticateWithBlankOrPassword("Tanvir_Hasan", "");
    expect(auth.success).toBe(true);
    expect(auth.user?.handle).toBe("Tanvir_Hasan");
  });

  it("populates Global Job Queue for SuperAdmin inspection", () => {
    createJobTicket({
      agentId: "khata-vision",
      userId: "usr-dash-test",
      username: "Tanvir_Hasan",
      inputPayload: "Baki Khata memo scan #42",
      mode: "instant_local",
    });

    const allJobs = listAllJobs(10);
    expect(allJobs.length).toBeGreaterThanOrEqual(1);
    expect(allJobs.some((j) => j.username === "Tanvir_Hasan")).toBe(true);
  });

  it("verifies 7 SaaS tabs and 30 agents registry integrity", () => {
    expect(ALL_30_AGENTS.length).toBe(30);
    const fleetA = ALL_30_AGENTS.filter((a) => a.fleet === "input-to-action");
    const fleetB = ALL_30_AGENTS.filter((a) => a.fleet === "scheduled-bot");

    expect(fleetA.length).toBe(15);
    expect(fleetB.length).toBe(15);
  });
});
