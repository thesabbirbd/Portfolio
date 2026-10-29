import { getContentBySlug, getSlugs } from '@/lib/content';
import { ContentLayout } from '@/components/content/ContentLayout';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { isValidContentDate, lastModified } from '@/lib/content-date';

export async function generateStaticParams() {
  const slugs = getSlugs('journal');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('journal', params.slug);
  if (!item) return {};
  
  return pageMetadata({
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    path: `/journal/${item.meta.slug}`,
    type: 'article',
    publishedTime: isValidContentDate(item.meta.date) ? item.meta.date : undefined,
    modifiedTime: lastModified(item.meta),
  });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('journal', params.slug);
  
  if (!item) {
    notFound();
  }

  return <ContentLayout item={item} baseUrl="/journal" breadcrumbLabel="Journal" />;
}
