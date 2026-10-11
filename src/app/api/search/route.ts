import { getAllContent } from '@/lib/content';

type SearchIndexItem = {
  title: string;
  description: string;
  slug: string;
  type: string | undefined;
  category: string | undefined;
  tags: string[];
  date: string;
  url: string;
};

let cachedSearchIndex: SearchIndexItem[] | null = null;

export async function GET() {
  if (!cachedSearchIndex || process.env.NODE_ENV === 'development') {
    const allContent = [
      ...getAllContent('notes'),
      ...getAllContent('journal'),
      ...getAllContent('projects'),
      ...getAllContent('lab'),
    ];

    cachedSearchIndex = allContent.map(item => ({
      title: item.meta.title,
      description: item.meta.description,
      slug: item.meta.slug,
      type: item.meta.type,
      category: item.meta.category,
      tags: item.meta.tags || [],
      date: item.meta.date,
      url: `/${item.meta.type === 'lab' ? 'engineering-lab' : item.meta.type}/${item.meta.slug}`
    }));
  }

  return Response.json(cachedSearchIndex, {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    }
  });
}
