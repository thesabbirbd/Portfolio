import { getContentBySlug, getSlugs } from '@/lib/content';
import { LabLayout } from '@/components/content/LabLayout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getSlugs('lab');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('lab', params.slug);
  if (!item) return {};
  
  return {
    title: `${item.meta.title} | THE SABBiR`,
    description: item.meta.description,
    alternates: {
      canonical: `https://sabbir.nav.bd/engineering-lab/${item.meta.slug}`,
    }
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = getContentBySlug('lab', params.slug);
  
  if (!item || (process.env.NODE_ENV !== 'development' && item.meta.status === 'draft')) {
    notFound();
  }

  return <LabLayout item={item} />;
}
