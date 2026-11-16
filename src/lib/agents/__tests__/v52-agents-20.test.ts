import { describe, it, expect } from "vitest";
import { AUTONOMOUS_AGENTS } from "../agent-types";
import { SWARM_PIPELINES } from "../swarm-orchestrator";
import { SUPER_TOOLS_CATALOG } from "@/components/discover/Tools";

describe("THE SABBiR OS v5.2.13 Scale Verification (Stage 095)", () => {
  it("verifies exactly 24 registered Autonomous Domain Agents", () => {
    expect(AUTONOMOUS_AGENTS.length).toBe(24);

    const ids = AUTONOMOUS_AGENTS.map((a) => a.id);
    expect(ids).toContain("gov-doc");
    expect(ids).toContain("remit-advisor");
    expect(ids).toContain("support-macro");
    expect(ids).toContain("design-token");
    expect(ids).toContain("health-routine");
    expect(ids).toContain("academic-coach");
    expect(ids).toContain("family-cfo");
    expect(ids).toContain("autonomous-curator");
  });

  it("verifies 10 Multi-Agent Swarm Pipelines", () => {
    expect(SWARM_PIPELINES.length).toBe(10);

    const swarmIds = SWARM_PIPELINES.map((s) => s.id);
    expect(swarmIds).toContain("freelancer-career");
    expect(swarmIds).toContain("brand-launch");
    expect(swarmIds).toContain("ecommerce-launch");
    expect(swarmIds).toContain("daily-closing");
    expect(swarmIds).toContain("devops-release");
    expect(swarmIds).toContain("viral-creator");
    expect(swarmIds).toContain("family-wealth-audit");
    expect(swarmIds).toContain("autonomous-seo-viral");
    expect(swarmIds).toContain("student-mess-life");
    expect(swarmIds).toContain("govt-job-application");
  });

  it("verifies 56 dedicated studios + 8 dev sandboxes = 64 total tools", () => {
    expect(SUPER_TOOLS_CATALOG.length).toBe(56);

    const studioSlugs = SUPER_TOOLS_CATALOG.map((t) => t.slug);
    expect(studioSlugs).toContain("gov-photo-sizer");
    expect(studioSlugs).toContain("remittance-calculator");
    expect(studioSlugs).toContain("bangla-converter");
    expect(studioSlugs).toContain("medicine-scheduler");
    expect(studioSlugs).toContain("cgpa-calculator");
    expect(studioSlugs).toContain("family-budget-zakat");
    expect(studioSlugs).toContain("electricity-solar-calculator");
    expect(studioSlugs).toContain("house-rent-studio");
    expect(studioSlugs).toContain("age-health-card");
    expect(studioSlugs).toContain("event-dawat-planner");
    expect(studioSlugs).toContain("tax-sanchaypatra-emi");
    expect(studioSlugs).toContain("social-text-styler");
    expect(studioSlugs).toContain("password-vault-hash");
    expect(studioSlugs).toContain("embed-widget-studio");
    expect(studioSlugs).toContain("id-card-stitcher");
  });
});
