import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sabbir.nav.bd';
  // Use a fixed date for the current iteration rather than dynamic Date() which causes unnecessary re-crawls
  const lastModified = '2026-09-28T00:00:00.000Z';

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/engineering-lab`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exploration`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...['notes', 'journal', 'projects', 'lab'].flatMap(type => {
      try {
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(process.cwd(), 'content', type);
        if (!fs.existsSync(dir)) return [];
        
        return fs.readdirSync(dir)
          .filter((f: string) => f.endsWith('.md') || f.endsWith('.mdx'))
          .map((file: string) => {
            const slug = file.replace(/\.mdx?$/, '');
            const urlType = type === 'lab' ? 'engineering-lab' : type;
            return {
              url: `${baseUrl}/${urlType}/${slug}`,
              lastModified,
              changeFrequency: 'monthly',
              priority: 0.5,
            };
          });
      } catch (e) {
        return [];
      }
    }) as MetadataRoute.Sitemap
  ];
}
