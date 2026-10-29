import type { MetadataRoute } from 'next';
import { getAllContent, type ContentType } from '@/lib/content';
import { contentDateTime, lastModified } from '@/lib/content-date';
import { absoluteUrl } from '@/lib/seo';

// Only canonical, indexable routes. /search is a utility page (noindex) and is left out.
// lastmod is real or absent: content entries use their frontmatter `updated`/`date`, collection
// pages use their newest entry, and pages without a recorded edit date carry no lastmod at all
// (a made-up or build-time date would tell crawlers something changed when it didn't).

const SECTION: Record<ContentType, string> = { notes: '/notes', journal: '/journal', projects: '/projects', lab: '/engineering-lab', articles: '/articles' };

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  // Demo entries are labelled placeholders (noindex): never listed for crawlers.
  const collections = (Object.keys(SECTION) as ContentType[]).map((type) => ({ type, items: getAllContent(type).filter((i) => !i.meta.demo) }));

  const newest = (dates: (string | undefined)[]) =>
    dates.filter((d): d is string => !!d).sort((a, b) => contentDateTime(b) - contentDateTime(a))[0];
  const entry = (path: string, priority: number, changeFrequency: Entry['changeFrequency'], lastmod?: string): Entry => ({
    url: absoluteUrl(path),
    ...(lastmod ? { lastModified: lastmod } : {}),
    changeFrequency,
    priority,
  });

  const collectionLastmod = (type: ContentType) =>
    newest(collections.find((c) => c.type === type)!.items.map((i) => lastModified(i.meta)));

  return [
    entry('/', 1.0, 'weekly'),
    entry('/aiyaar', 0.9, 'monthly'),
    entry('/about', 0.8, 'monthly'),
    entry('/projects', 0.8, 'monthly', collectionLastmod('projects')),
    entry('/engineering-lab', 0.8, 'monthly', collectionLastmod('lab')),
    entry('/experience', 0.7, 'monthly'),
    entry('/resume', 0.7, 'monthly'),
    entry('/exploration', 0.6, 'monthly'),
    entry('/notes', 0.6, 'weekly', collectionLastmod('notes')),
    entry('/journal', 0.6, 'weekly', collectionLastmod('journal')),
    entry('/contact', 0.6, 'yearly'),
    entry('/explore', 0.6, 'monthly'),
    entry('/tools', 0.7, 'monthly'),
    entry('/playground', 0.6, 'monthly'),
    // /articles, /vlogs, /news and /games hold only demo entries for now (noindex): added when real content lands.
    ...collections.flatMap(({ type, items }) =>
      items.map((item) => entry(`${SECTION[type]}/${item.meta.slug}`, 0.5, 'monthly', lastModified(item.meta))),
    ),
  ];
}
