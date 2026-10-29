import { getContentBySlug, getSlugs } from '@/lib/content';
import { LabLayout } from '@/components/content/LabLayout';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { isValidContentDate, lastModified } from '@/lib/content-date';

export async function generateStaticParams() {
  const slugs = getSlugs('lab');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('lab', params.slug);
  if (!item) return {};
  
  return pageMetadata({
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    path: `/engineering-lab/${item.meta.slug}`,
    type: 'article',
    publishedTime: isValidContentDate(item.meta.date) ? item.meta.date : undefined,
    modifiedTime: lastModified(item.meta),
  });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('lab', params.slug);
  
  if (!item || (process.env.NODE_ENV !== 'development' && item.meta.status === 'draft')) {
    notFound();
  }

  return <LabLayout item={item} />;
}
