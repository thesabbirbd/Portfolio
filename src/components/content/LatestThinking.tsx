import { getLatestContent } from '@/lib/content';
import { ContentCard } from './ContentCard';
import { SectionHeader, Accent } from '@/components/system/SectionHeader';
import { MoreLink, MoreLinks } from '@/components/system/MoreLink';

export function LatestThinking() {
  const latest = getLatestContent(3);

  if (latest.length === 0) return null;

  return (
    <section id="writing" className="py-12 sm:py-16 md:py-24 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        index="05"
        eyebrow="Writing"
        title={<>Latest <Accent>thinking</Accent></>}
        lede="Recent notes, engineering journals, and experiments from the lab."
        className="mb-8 sm:mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
        {latest.map(item => {
          const type = item.meta.type || 'notes';
          const baseUrl = type === 'lab' ? '/engineering-lab' : `/${type}`;
          return <ContentCard key={item.meta.slug} item={item} baseUrl={baseUrl} />;
        })}
      </div>
      <MoreLinks>
        <MoreLink href="/notes">All notes</MoreLink>
        <MoreLink href="/journal">Engineering journal</MoreLink>
      </MoreLinks>
    </section>
  );
}
