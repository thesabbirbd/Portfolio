import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent, SectionHeader } from "@/components/system/SectionHeader";
import { Card } from "@/components/system/Card";
import { LinkedinIcon } from "@/components/ui/BrandIcons";
import { AIYAAR, AIYAAR_FEATURES, AIYAAR_BUSINESS_TYPES, AIYAAR_KEYWORDS } from "@/data/aiyaar";
import { LINKEDIN_URL } from "@/data/experience";
import { pageMetadata } from "@/lib/seo";
import { AiyaarName, withAiyaarLinks } from "@/components/system/AiyaarName";

const TITLE = "Aiyaar — POS, Online Store, Inventory & Digital Khata SaaS | THE SABBiR";
const SOCIAL_TITLE = `Aiyaar — ${AIYAAR.roleTitle} | THE SABBiR`;
const DESCRIPTION =
  `Md Sabbirul Islam Khan, known as THE SABBiR, is ${AIYAAR.role} at Aiyaar. Aiyaar is an all-in-one business SaaS for Bangladesh: POS, online store, inventory with batches and expiry, digital khata, baki, invoices, reports, Facebook & Instagram AI replies, delivery and staff roles for 22 kinds of business.`;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  socialTitle: SOCIAL_TITLE,
  description: DESCRIPTION,
  keywords: AIYAAR_KEYWORDS,
  path: "/aiyaar",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: AIYAAR.name,
      url: AIYAAR.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android",
      description: AIYAAR.summary,
      publisher: { "@type": "Organization", name: AIYAAR.name, url: AIYAAR.url },
      featureList: AIYAAR_FEATURES.map((f) => f.title),
    },
    {
      "@type": "Person",
      "@id": "https://sabbir.nav.bd/#person",
      name: "Md Sabbirul Islam Khan",
      jobTitle: AIYAAR.roleTitle,
      worksFor: { "@type": "Organization", name: AIYAAR.name, url: AIYAAR.url },
      sameAs: [LINKEDIN_URL],
    },
  ],
};

export default function AiyaarPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`)}
      </script>

      <PageHeader
        crumbs={[{ label: "Aiyaar" }]}
        eyebrow={`Current role · ${AIYAAR.role}`}
        title={<><AiyaarName className="no-underline text-[inherit]">Aiyaar</AiyaarName> — run the whole shop from <Accent>one app</Accent></>}
        lede={withAiyaarLinks(AIYAAR.summary)}
      >
        <div className="reveal mt-6 flex flex-wrap gap-2 sm:gap-3">
          <a href={AIYAAR.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors">
            Visit aiyaar.ltd <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
          </a>
          <a href={AIYAAR.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full surface-card surface-interactive font-semibold text-ink">
            User guide <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full surface-card surface-interactive font-semibold text-ink">
            <LinkedinIcon className="w-4 h-4" /> My LinkedIn
          </a>
        </div>
      </PageHeader>

      <section aria-label="Aiyaar at a glance" className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-10 md:mb-14">
        <dl className="reveal grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {AIYAAR.highlights.map((h) => (
            <div key={h.label} className="rounded-xl surface-card p-4">
              <dt className="text-xs text-ink-3">{h.label}</dt>
              <dd className="text-2xl font-extrabold text-ink">{h.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-ink-2">{withAiyaarLinks(AIYAAR.platforms)} Every plan includes every feature; plans differ only in shops, staff and products.</p>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <SectionHeader
          eyebrow="Features"
          title={<>Everything <AiyaarName className="no-underline text-[inherit]">Aiyaar</AiyaarName> <Accent>does</Accent></>}
          lede="A sale at the counter lowers stock, lands in the khata and shows in today's report at once — every part below is connected."
          className="mb-6 sm:mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {AIYAAR_FEATURES.map((f) => (
            <Card key={f.id} as="article" className="p-4 sm:p-5 scroll-mt-28">
              <h3 id={f.id} className="text-base sm:text-lg font-bold text-ink scroll-mt-28">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-2">{withAiyaarLinks(f.desc)}</p>
              <ul className="mt-3 space-y-1.5">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ink-2">
                    <Check aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-ok" /> <span>{withAiyaarLinks(p)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <SectionHeader
          eyebrow="Made for your kind of business"
          title={<>22 business <Accent>types</Accent></>}
          lede={withAiyaarLinks("At sign-up you pick your kind of business; Aiyaar switches on the right product fields, units, starter categories and tools — for example generic names, strength and Rx for pharmacies, or sell-by-weight for grocery.")}
          className="mb-5"
        />
        <ul className="reveal flex flex-wrap gap-2" aria-label="Business types">
          {AIYAAR_BUSINESS_TYPES.map((t) => (
            <li key={t} className="px-3 py-1.5 rounded-full surface-card text-sm text-ink-2">{t}</li>
          ))}
          <li className="px-3 py-1.5 rounded-full border border-dashed border-line-strong text-sm text-ink-3">…and more</li>
        </ul>
      </section>

      <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-16">
        <Card variant="elevated" className="p-5 sm:p-8">
          <h2 className="text-h3 font-extrabold text-ink">My role</h2>
          <p className="mt-3 text-ink-2 leading-relaxed">
            I am <AiyaarName />&apos;s <strong className="text-ink">{AIYAAR.role}</strong>. <AiyaarName /> is one of my projects alongside
            my studies, IT support background and backend learning. The features above describe the product itself, as
            published in <AiyaarName />&apos;s own feature guide (October 2026) — see{" "}
            <a href={AIYAAR.docsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline underline-offset-4">aiyaar.ltd/docs</a>.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/experience#work-history" className="inline-flex min-h-10 items-center px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">Work history</Link>
            <Link href="/resume" className="inline-flex min-h-10 items-center px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">Resume</Link>
            <Link href="/contact" className="inline-flex min-h-10 items-center px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">Contact</Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
