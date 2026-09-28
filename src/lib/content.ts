import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type ContentType = 'notes' | 'journal' | 'projects' | 'lab';

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  author?: string;
  relatedProjects?: string[];
  relatedNotes?: string[];
  relatedLab?: string[];
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

export function getSlugs(type: ContentType): string[] {
  const dirPath = path.join(contentDirectory, type);
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  return files.filter(file => file.endsWith('.mdx') || file.endsWith('.md')).map(file => file.replace(/\.mdx?$/, ''));
}

export function getContentBySlug(type: ContentType, slug: string): ContentItem | null {
  try {
    const dirPath = path.join(contentDirectory, type);
    const mdxPath = path.join(dirPath, `${slug}.mdx`);
    const mdPath = path.join(dirPath, `${slug}.md`);
    
    let filePath = mdxPath;
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(mdPath)) filePath = mdPath;
      else return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      meta: {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        updated: data.updated,
        category: data.category,
        tags: data.tags || [],
        status: data.status || 'published',
        featured: data.featured || false,
        author: data.author || 'Md Sabbirul Islam Khan',
        relatedProjects: data.relatedProjects || [],
        relatedNotes: data.relatedNotes || [],
        relatedLab: data.relatedLab || [],
      },
      content
    };
  } catch (error) {
    console.error(`Error reading ${type}/${slug}`, error);
    return null;
  }
}

export function getAllContent(type: ContentType): ContentItem[] {
  const slugs = getSlugs(type);
  const items = slugs
    .map(slug => getContentBySlug(type, slug))
    .filter((item): item is ContentItem => item !== null && item.meta.status !== 'draft');

  // Sort by date descending
  return items.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}
