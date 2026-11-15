import { getAllContent } from "@/lib/content";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { CategorizedArticlesHub } from "@/components/content/CategorizedArticlesHub";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

export const dynamic = "force-static";

const articles = getAllContent("articles");

export const metadata = pageMetadata({
  title: "Categorized Technical Articles & Open-Source Hub | THE SABBiR",
  description: "Field-tested technical guides on Linux sysadmin, PostgreSQL indexing, CIDR subnetting, local LLMs, and curated open-source tools by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/articles",
  noindex: articles.length === 0,
});

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "THE SABBiR Technical Guides & Open-Source Arsenal",
    itemListElement: articles.map((art, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "TechArticle",
        headline: art.meta.title,
        description: art.meta.description,
        url: `https://sabbir.nav.bd/articles/${art.meta.slug}`,
        datePublished: art.meta.date,
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
    })),
  };

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Articles" }]}
        eyebrow="Knowledge Base"
        title={<>Technical guides &amp; <Accent>open-source hub</Accent></>}
        lede="Practical, field-tested guides spanning beginner Linux navigation to production PostgreSQL indexing, local Ollama LLMs, and open-source infrastructure."
      />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-6 flex justify-end">
        <BanglaGuideModal topic="articles" />
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-16">
        <h2 className="sr-only">Categorized Technical Articles</h2>
        <CategorizedArticlesHub initialArticles={articles} />
      </div>
    </div>
  );
}
