import { getAllContent } from "@/lib/content";
import { getAllNewsStories } from "@/lib/news-portal";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = SITE_URL || "https://sabbir.nav.bd";

  const allContent = [
    ...getAllContent("notes"),
    ...getAllContent("journal"),
    ...getAllContent("projects"),
    ...getAllContent("lab"),
    ...getAllContent("articles"),
  ].filter((item) => !item.meta.demo);

  const newsStories = getAllNewsStories();

  const articleItems = allContent.map((item) => {
    let section = item.meta.type;
    if (section === "lab") section = "engineering-lab";

    return {
      id: `${baseUrl}/${section}/${item.meta.slug}`,
      url: `${baseUrl}/${section}/${item.meta.slug}`,
      title: item.meta.title,
      summary: item.meta.description || "",
      date_published: item.meta.date ? new Date(item.meta.date).toISOString() : undefined,
      tags: item.meta.tags || [],
      image: item.meta.coverImage,
    };
  });

  const newsItems = newsStories.map((story) => ({
    id: `${baseUrl}/news/${story.slug}`,
    url: `${baseUrl}/news/${story.slug}`,
    title: story.title,
    summary: story.summary,
    date_published: new Date(story.publishedAt).toISOString(),
    tags: story.seoKeywords || [],
    image: story.coverImage,
    content_text: story.engineeringTakeaway,
  }));

  const allFeedItems = [...articleItems, ...newsItems].sort((a, b) => {
    const timeA = a.date_published ? new Date(a.date_published).getTime() : 0;
    const timeB = b.date_published ? new Date(b.date_published).getTime() : 0;
    return timeB - timeA;
  });

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "THE SABBiR OS - Autonomous Tech Media & Engineering Portal",
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    description:
      "Daily autonomous tech news, engineering write-ups, open-source tools, and interactive DevOps challenges by Md Sabbirul Islam Khan, known as THE SABBiR.",
    icon: `${baseUrl}/favicon.ico`,
    favicon: `${baseUrl}/favicon.ico`,
    authors: [
      {
        name: "Md Sabbirul Islam Khan",
        url: baseUrl,
      },
    ],
    items: allFeedItems.slice(0, 30),
  };

  return new Response(JSON.stringify(jsonFeed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
