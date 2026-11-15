import type { MetadataRoute } from 'next';
import { getAllContent, type ContentType } from '@/lib/content';
import { contentDateTime, lastModified } from '@/lib/content-date';
import { absoluteUrl } from '@/lib/seo';
import { getAllNewsStories } from '@/lib/news-portal';

// Only canonical, indexable routes. /search is a utility page (noindex) and is left out.
// lastmod is real or absent: content entries use their frontmatter `updated`/`date`, collection
// pages use their newest entry, and pages without a recorded edit date carry no lastmod at all
// (a made-up or build-time date would tell crawlers something changed when it didn't).

const SECTION: Record<ContentType, string> = {
  notes: '/notes',
  journal: '/journal',
  projects: '/projects',
  lab: '/engineering-lab',
  articles: '/articles',
};

const SUPER_TOOLS = [
  'bg-remover',
  'product-studio',
  'image-compressor',
  'khata-scanner',
  'pdf-redactor',
  'voice-notes',
  'invoice-maker',
  'barcode-studio',
  'reel-script',
  'social-preview',
  'cron-english',
  'docker-hardener',
  'daraz-listing-ai',
  'cheque-audit',
  'sms-campaign-studio',
  'cv-privacy-shield',
  'pdf-toolkit',
  'api-load-simulator',
  'image-editor',
  'story-maker',
  'audio-editor',
  'video-clipper',
  'spreadsheet-grid',
  'slide-deck',
  'screen-recorder',
  'qr-link-bio',
  'gov-photo-sizer',
  'remittance-calculator',
  'email-signature',
  'quick-reply-hub',
  'unit-land-converter',
  'document-scanner',
  'typing-speed-arena',
  'color-design-lab',
  'bangla-converter',
  'medicine-scheduler',
  'cgpa-calculator',
  'family-budget-zakat',
  'electricity-solar-calculator',
  'house-rent-studio',
  'age-health-card',
  'event-dawat-planner',
  'tax-sanchaypatra-emi',
  'social-text-styler',
  'password-vault-hash',
  'embed-widget-studio',
  'id-card-stitcher',
];

const EMBED_SLUGS = [
  'bijoy-converter',
  'land-gold-converter',
  'zakat-calculator',
  'cgpa-calculator',
  'remittance-calculator',
  'electricity-bill',
  'age-calculator',
  'sanchaypatra-emi',
  'id-card-stitcher',
];

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  // Demo entries are labelled placeholders (noindex): never listed for crawlers.
  const collections = (Object.keys(SECTION) as ContentType[]).map((type) => ({
    type,
    items: getAllContent(type).filter((i) => !i.meta.demo),
  }));
  const newsStories = getAllNewsStories();

  const newest = (dates: (string | undefined)[]) =>
    dates.filter((d): d is string => !!d).sort((a, b) => contentDateTime(b) - contentDateTime(a))[0];
  const entry = (
    path: string,
    priority: number,
    changeFrequency: Entry['changeFrequency'],
    lastmod?: string,
  ): Entry => ({
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
    entry('/now', 0.7, 'monthly'),
    entry('/uses', 0.7, 'monthly'),
    entry('/tools', 0.9, 'weekly'),
    entry('/agents', 0.9, 'weekly'),
    entry('/hacks', 0.85, 'weekly'),
    entry('/os-brain', 0.85, 'daily'),
    entry('/open-source', 0.85, 'weekly'),
    entry('/vlogs', 0.8, 'weekly'),
    entry('/articles', 0.8, 'monthly', collectionLastmod('articles')),
    entry('/playground', 0.6, 'monthly'),
    entry('/games', 0.8, 'monthly'),
    entry('/architecture', 0.8, 'monthly'),
    entry('/news', 0.8, 'daily'),
    entry('/leaderboard', 0.85, 'daily'),
    // 46 Dedicated Studios
    ...SUPER_TOOLS.map((slug) => entry(`/tools/${slug}`, 0.85, 'monthly')),
    // 8 Embeddable Micro-SaaS Widgets
    ...EMBED_SLUGS.map((slug) => entry(`/embed/${slug}`, 0.75, 'monthly')),
    // Dynamic collections
    ...collections.flatMap(({ type, items }) =>
      items.map((item) =>
        entry(`${SECTION[type]}/${item.meta.slug}`, 0.5, 'monthly', lastModified(item.meta)),
      ),
    ),
    ...newsStories.map((story) =>
      entry(`/news/${story.slug}`, 0.7, 'weekly'),
    ),
  ];
}
