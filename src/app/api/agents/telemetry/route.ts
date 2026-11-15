import { NextResponse } from "next/server";
import { AUTONOMOUS_AGENTS } from "@/lib/agents/agent-types";

export const revalidate = 60;

export async function GET() {
  const agentsSummary = AUTONOMOUS_AGENTS.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    skillsCount: a.skills.length,
    viralityPoints: a.viralityPoints,
    popularRank: a.popularRank,
  }));

  const totalRuns = AUTONOMOUS_AGENTS.reduce((acc, a) => acc + a.viralityPoints, 0);

  return NextResponse.json({
    totalAgents: AUTONOMOUS_AGENTS.length,
    totalTaskRuns: totalRuns,
    updatedAt: new Date().toISOString(),
    agents: agentsSummary,
  });
}
