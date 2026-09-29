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
  brand?: string;
  relatedProjects?: string[];
  relatedNotes?: string[];
  relatedLab?: string[];
  relatedJournal?: string[];
  
  // Project specific fields
  technologies?: string[];
  githubUrl?: string;
  demoUrl?: string;
  projectRole?: string;
  projectStatus?: 'idea' | 'prototype' | 'active' | 'experimental' | 'paused' | 'archived' | 'completed';
  dateStarted?: string;
  changelog?: { date: string; title: string; summary: string }[];
  architecture?: { nodes: string[]; edges: string[] };
  screenshots?: { url: string; alt: string; caption?: string }[];
  
  // Lab specific fields
  experimentResult?: 'success' | 'partial' | 'failed' | 'inconclusive';
  hardware?: string[];
  software?: string[];
  dateCompleted?: string;
  measurements?: { label: string; value: string; notes?: string }[];
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
        brand: data.brand || 'THE SABBiR',
        relatedProjects: data.relatedProjects || [],
        relatedNotes: data.relatedNotes || [],
        relatedLab: data.relatedLab || [],
        relatedJournal: data.relatedJournal || [],
        technologies: data.technologies || [],
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        projectRole: data.projectRole,
        projectStatus: data.projectStatus,
        dateStarted: data.dateStarted,
        changelog: data.changelog || [],
        architecture: data.architecture,
        screenshots: data.screenshots || [],
        experimentResult: data.experimentResult,
        hardware: data.hardware || [],
        software: data.software || [],
        dateCompleted: data.dateCompleted,
        measurements: data.measurements || [],
      },
      content
    };
  } catch (error) {
    console.error(`Error reading ${type}/${slug}`, error);
    return null;
  }
}

export function getAllContent(type: ContentType): ContentItem[] {
  const isDev = process.env.NODE_ENV === 'development';
  const slugs = getSlugs(type);
  const items = slugs
    .map(slug => getContentBySlug(type, slug))
    .filter((item): item is ContentItem => {
      if (item === null) return false;
      if (!isDev && item.meta.status === 'draft') return false;
      return true;
    });

  // Sort by date descending
  return items.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getLatestContent(count: number = 3): ContentItem[] {
  const notes = getAllContent('notes');
  const journal = getAllContent('journal');
  const lab = getAllContent('lab');
  
  const all = [...notes, ...journal, ...lab].sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  return all.slice(0, count);
}
