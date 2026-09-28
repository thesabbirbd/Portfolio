import { getContentBySlug, getSlugs } from '@/lib/content';
import { ContentLayout } from '@/components/content/ContentLayout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getSlugs('journal');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('journal', params.slug);
  if (!item) return {};
  
  return {
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    alternates: {
      canonical: `https://sabbir.nav.bd/journal/${item.meta.slug}`,
    }
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('journal', params.slug);
  
  if (!item) {
    notFound();
  }

  return <ContentLayout item={item} baseUrl="/journal" breadcrumbLabel="Journal" />;
}
