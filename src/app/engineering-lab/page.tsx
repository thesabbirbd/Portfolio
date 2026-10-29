import { getAllContent } from "@/lib/content";
import { ContentCard } from "@/components/content/ContentCard";
import { EngineeringLabSection } from "@/components/lab/EngineeringLabSection";
import { Accent } from "@/components/system/SectionHeader";
import { PageHeader } from "@/components/system/PageHeader";
import { AsciiRule } from "@/components/system/Signal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Lab & Experiments | THE SABBiR",
  description: "A documented engineering lab for local AI, infrastructure, automation, and backend experiments by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/engineering-lab",
});

export default function EngineeringLabPage() {
  const experiments = getAllContent('lab');

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Engineering Lab" }]}
        expression="signal"
        eyebrow="R&D · Prototyping space"
        title={<>Engineering <Accent tone="signal">Lab</Accent></>}
        lede="Hypotheses tested, boundaries pushed, and architectures broken. This is where I document raw technical experiments before they become projects — things tested, measured, compared, broken and investigated across local AI, Linux, networking and backend systems."
        className="mb-0 md:mb-0"
      />

      {/* Bench log: interactive terminal + every experiment (moved here from the Home page) */}
      <EngineeringLabSection
        variant="full"
        eyebrow="Bench log"
        title={<>Experiments &amp; <Accent tone="signal">prototypes</Accent></>}
        lede="Ongoing bench tests across infrastructure, local AI, Linux systems, hardware and creative tech — filter by discipline or try the terminal."
      />

      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <AsciiRule label="write-ups" className="mb-8" />
        <h2 className="text-h2 font-extrabold text-ink mb-2">Documented write-ups</h2>
        <p className="text-lede text-ink-2 mb-8 max-w-3xl">Long-form lab notes with method, measurements and conclusions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map(exp => (
            <ContentCard key={exp.meta.slug} item={exp} baseUrl="/engineering-lab" />
          ))}
        </div>
      </div>
    </div>
  );
}
