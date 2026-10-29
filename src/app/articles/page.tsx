import { getAllContent } from "@/lib/content";
import { ContentCard } from "@/components/content/ContentCard";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

const articles = getAllContent("articles");

export const metadata = pageMetadata({
  title: "Technical Articles | THE SABBiR",
  description: "Long-form technical articles on Linux, Docker, networking and local AI by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/articles",
  // Indexed once at least one real (non-demo) article exists.
  noindex: articles.every((a) => a.meta.demo),
});

export default function ArticlesPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Articles" }]}
        eyebrow="Technical articles"
        title={<>Long-form <Accent>write-ups</Accent></>}
        lede="Linux, containers, networking and local AI — explained step by step. Entries marked Demo are samples while the section fills up."
      />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-16">
        <h2 className="sr-only">Latest articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {articles.map((item) => (
            <ContentCard key={item.meta.slug} item={item} baseUrl="/articles" />
          ))}
        </div>
      </div>
    </div>
  );
}
