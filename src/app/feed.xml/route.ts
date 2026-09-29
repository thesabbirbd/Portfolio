import { getAllContent } from '@/lib/content';

export async function GET() {
  const allContent = [
    ...getAllContent('notes'),
    ...getAllContent('journal'),
    ...getAllContent('projects'),
    ...getAllContent('lab'),
  ];
  
  // Sort by date descending
  allContent.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  // Only take latest 20 items
  const recentContent = allContent.slice(0, 20);

  const baseUrl = 'https://sabbir.nav.bd';

  const feedItems = recentContent.map(item => {
    let section = item.meta.type;
    if (section === 'lab') section = 'engineering-lab';
    
    return `
      <item>
        <title><![CDATA[${item.meta.title}]]></title>
        <link>${baseUrl}/${section}/${item.meta.slug}</link>
        <guid>${baseUrl}/${section}/${item.meta.slug}</guid>
        <pubDate>${new Date(item.meta.date).toUTCString()}</pubDate>
        <description><![CDATA[${item.meta.description || ''}]]></description>
      </item>
    `;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>THE SABBiR - Engineering Knowledge Base</title>
        <link>${baseUrl}</link>
        <description>Engineering notes, logs, experiments, and projects by Md Sabbirul Islam Khan.</description>
        <language>en-us</language>
        <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>
  `;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
