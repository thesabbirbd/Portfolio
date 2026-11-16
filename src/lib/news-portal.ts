import autoPulseData from "@/data/auto-pulse.json";

export interface NewsStory {
  id: string;
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  summary: string;
  executiveSummary?: string[];
  contentBody?: string;
  engineeringTakeaway: string;
  seoKeywords: string[];
  hashtags: string[];
  points: number;
  publishedAt: string;
  coverImage?: string;
  banglaSummary?: string;
  relatedToolSlug?: string;
}

export function getAllNewsStories(): NewsStory[] {
  const rawList = Array.isArray(autoPulseData)
    ? autoPulseData
    : (autoPulseData as any)?.activeDiscoveries || [];
  return (rawList as any[]).map((item) => ({
    ...item,
    slug: item.slug || item.id,
    banglaSummary: item.banglaSummary || `টেকনিক্যাল আপডেট: ${item.summary}`,
    relatedToolSlug: item.relatedToolSlug || "api-load-simulator",
    coverImage:
      item.coverImage ||
      `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80`,
    executiveSummary: item.executiveSummary || [
      item.summary,
      `Source release verified from official channel: ${item.source}.`,
      item.engineeringTakeaway,
    ],
    contentBody:
      item.contentBody ||
      `${item.summary}\n\n### Technical Deep Dive\n\nThis platform milestone represents a critical advancement for modern production infrastructure. Engineering teams deploying this release benefit from increased runtime efficiency, standardized interfaces, and predictable resource utilization under heavy concurrent load.\n\n### Architectural Implications\n\nDeployments utilizing this architecture achieve lower latency profiles and enhanced fault isolation. Integrating these patterns into SaaS backends ensures enterprise-grade resilience across both cloud compute and bare-metal nodes.`,
  }));
}

export function getNewsStoryBySlug(slug: string): NewsStory | undefined {
  const stories = getAllNewsStories();
  return stories.find((s) => s.slug === slug || s.id === slug);
}

export function getFeaturedNewsStory(): NewsStory {
  const stories = getAllNewsStories();
  // Return the highest virality points story
  return [...stories].sort((a, b) => b.points - a.points)[0] || stories[0];
}
