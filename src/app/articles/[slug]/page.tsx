import { getContentBySlug, getSlugs } from '@/lib/content';
import { ContentLayout } from '@/components/content/ContentLayout';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { isValidContentDate, lastModified } from '@/lib/content-date';

export async function generateStaticParams() {
  return getSlugs('articles').map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('articles', params.slug);
  if (!item) return {};

  return pageMetadata({
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    path: `/articles/${item.meta.slug}`,
    type: 'article',
    publishedTime: isValidContentDate(item.meta.date) ? item.meta.date : undefined,
    modifiedTime: lastModified(item.meta),
    noindex: item.meta.demo,
  });
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('articles', params.slug);

  if (!item) {
    notFound();
  }

  return <ContentLayout item={item} baseUrl="/articles" breadcrumbLabel="Articles" />;
}
