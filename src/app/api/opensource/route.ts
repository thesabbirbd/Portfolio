import { NextResponse } from "next/server";
import { OPENSOURCE_TOOLS } from "@/data/opensource-tools";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier");
  const category = searchParams.get("category");

  let tools = [...OPENSOURCE_TOOLS];

  if (tier && (tier === "built-by-sabbir" || tier === "curated-stack")) {
    tools = tools.filter((t) => t.tier === tier);
  }

  if (category && category !== "All") {
    tools = tools.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    total: tools.length,
    tools,
  });
}
