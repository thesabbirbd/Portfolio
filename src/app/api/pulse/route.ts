import { NextResponse } from "next/server";
import { getAllNewsStories } from "@/lib/news-portal";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");

  let stories = getAllNewsStories();

  if (category && category !== "All") {
    stories = stories.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (limit && !isNaN(Number(limit))) {
    stories = stories.slice(0, Number(limit));
  }

  return NextResponse.json({
    total: stories.length,
    updatedAt: new Date().toISOString(),
    items: stories,
  });
}
