import { EmbedWidgetStudio } from "@/components/tools/EmbedWidgetStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Embeddable Micro-SaaS Widget Studio | THE SABBiR",
  description:
    "Embed 8 popular Bangladesh utility and finance micro-tools directly into your blog, portfolio, or client website with zero server setup.",
  path: "/tools/embed-widget-studio",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Embeddable Micro-SaaS Widget Studio",
      "operatingSystem": "All",
      "applicationCategory": "DeveloperApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Micro-SaaS embed generator for Bijoy converter, CGPA, Electricity, Zakat, Land units, and Remittance calculators.",
    },
  ],
};

export default function EmbedWidgetStudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <EmbedWidgetStudio />
      </div>
    </>
  );
}
