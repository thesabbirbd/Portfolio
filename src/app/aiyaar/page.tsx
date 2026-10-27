import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent, SectionHeader } from "@/components/system/SectionHeader";
import { Card } from "@/components/system/Card";
import { LinkedinIcon } from "@/components/ui/BrandIcons";
import { AIYAAR, AIYAAR_FEATURES, AIYAAR_BUSINESS_TYPES, AIYAAR_KEYWORDS } from "@/data/aiyaar";
import { LINKEDIN_URL } from "@/data/experience";

const TITLE = "Aiyaar Ltd — POS, Online Store, Inventory & Digital Khata SaaS | THE SABBiR";
const DESCRIPTION =
  "Md Sabbirul Islam Khan (THE SABBiR) is Chief Project Manager at Aiyaar Ltd. Aiyaar is an all-in-one business SaaS for Bangladesh: POS, online store, inventory with batches and expiry, digital khata, baki, invoices, reports, Facebook & Instagram AI replies, delivery and staff roles for 22 kinds of business.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: AIYAAR_KEYWORDS,
  alternates: { canonical: "https://sabbir.nav.bd/aiyaar" },
  openGraph: {
    title: "Aiyaar Ltd — Chief Project Manager | THE SABBiR",
    description: DESCRIPTION,
    url: "https://sabbir.nav.bd/aiyaar",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Aiyaar Ltd — Chief Project Manager | THE SABBiR", description: DESCRIPTION },
};

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
      offers: { "@type": "Offer", description: "Free trial, no card needed" },
      publisher: { "@type": "Organization", name: AIYAAR.company, url: AIYAAR.url },
      featureList: AIYAAR_FEATURES.map((f) => f.title),
    },
    {
      "@type": "Person",
      "@id": "https://sabbir.nav.bd/#person",
      name: "Md Sabbirul Islam Khan",
      jobTitle: "Chief Project Manager",
      worksFor: { "@type": "Organization", name: AIYAAR.company, url: AIYAAR.url },
      sameAs: [LINKEDIN_URL],
    },
  ],
};

export default function AiyaarPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }} />

      <PageHeader
        crumbs={[{ label: "Aiyaar Ltd" }]}
        eyebrow="Current role · Chief Project Manager (CPM)"
        title={<>Aiyaar — run the whole shop from <Accent>one app</Accent></>}
        lede={AIYAAR.summary}
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
        <p className="mt-4 text-sm text-ink-2">{AIYAAR.platforms} Every plan includes every feature; plans differ only in shops, staff and products.</p>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <SectionHeader
          eyebrow="Features"
          title={<>Everything Aiyaar <Accent>does</Accent></>}
          lede="A sale at the counter lowers stock, lands in the khata and shows in today's report at once — every part below is connected."
          className="mb-6 sm:mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {AIYAAR_FEATURES.map((f) => (
            <Card key={f.id} as="article" className="p-4 sm:p-5 scroll-mt-28">
              <h3 id={f.id} className="text-base sm:text-lg font-bold text-ink scroll-mt-28">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-2">{f.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ink-2">
                    <Check aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-ok" /> {p}
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
          lede="At sign-up you pick your kind of business; Aiyaar switches on the right product fields, units, starter categories and tools — for example generic names, strength and Rx for pharmacies, or sell-by-weight for grocery."
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
            I am Aiyaar Ltd&apos;s <strong className="text-ink">Chief Project Manager (CPM)</strong>, working on project planning,
            coordination and delivery. My background in IT support, networking and backend learning helps me speak both the
            business and the technical language of the product.
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
