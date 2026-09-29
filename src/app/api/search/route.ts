import { getAllContent } from '@/lib/content';

export async function GET() {
  const allContent = [
    ...getAllContent('notes'),
    ...getAllContent('journal'),
    ...getAllContent('projects'),
    ...getAllContent('lab'),
  ];

  const searchIndex = allContent.map(item => ({
    title: item.meta.title,
    description: item.meta.description,
    slug: item.meta.slug,
    type: item.meta.type,
    category: item.meta.category,
    tags: item.meta.tags || [],
    date: item.meta.date,
    url: `/${item.meta.type === 'lab' ? 'engineering-lab' : item.meta.type}/${item.meta.slug}`
  }));

  return Response.json(searchIndex, {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    }
  });
}
