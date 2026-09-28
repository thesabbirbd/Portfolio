import { getContentBySlug, getSlugs } from '@/lib/content';
import { ContentLayout } from '@/components/content/ContentLayout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getSlugs('notes');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('notes', params.slug);
  if (!item) return {};
  
  return {
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    alternates: {
      canonical: `https://sabbir.nav.bd/notes/${item.meta.slug}`,
    }
  };
}

export default async function NotePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('notes', params.slug);
  
  if (!item) {
    notFound();
  }

  return <ContentLayout item={item} baseUrl="/notes" breadcrumbLabel="Notes" />;
}
