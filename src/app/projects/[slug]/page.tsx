import { getContentBySlug, getSlugs } from '@/lib/content';
import { ProjectLayout } from '@/components/content/ProjectLayout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getSlugs('projects');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('projects', params.slug);
  if (!item) return {};
  
  return {
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    alternates: {
      canonical: `https://sabbir.nav.bd/projects/${item.meta.slug}`,
    }
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('projects', params.slug);
  
  if (!item || (process.env.NODE_ENV !== 'development' && item.meta.status === 'draft')) {
    notFound();
  }

  return <ProjectLayout item={item} />;
}
