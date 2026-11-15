import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Flame,
  Cpu,
  Calendar,
  Share2,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ExternalLink,
  Presentation,
  Smartphone,
} from "lucide-react";
import { getAllNewsStories, getNewsStoryBySlug } from "@/lib/news-portal";
import { formatContentDate } from "@/lib/content-date";
import { pageMetadata } from "@/lib/seo";
import { NewsShareButton } from "@/components/news/NewsShareButton";
import { BanglaArticleSummary } from "@/components/content/BanglaArticleSummary";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const stories = getAllNewsStories();
  return stories.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getNewsStoryBySlug(slug);

  if (!story) {
    return pageMetadata({
      title: "News Story Not Found | THE SABBiR",
      description: "Requested tech news story was not found.",
      path: `/news/${slug}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${story.title} | THE SABBiR`,
    description: story.summary,
    path: `/news/${story.slug}`,
    type: "article",
    keywords: story.seoKeywords,
    publishedTime: story.publishedAt,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = getNewsStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const allStories = getAllNewsStories();
  const relatedStories = allStories
    .filter((s) => s.slug !== story.slug && s.category === story.category)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: story.summary,
    image: story.coverImage ? [story.coverImage] : undefined,
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    author: {
      "@type": "Person",
      name: "Md Sabbirul Islam Khan",
      alternateName: "THE SABBiR",
      url: "https://sabbir.nav.bd",
    },
    publisher: {
      "@type": "Organization",
      name: "THE SABBiR",
      url: "https://sabbir.nav.bd",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sabbir.nav.bd/news/${story.slug}`,
    },
  };

  return (
    <article className="min-h-screen bg-bg text-ink py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink-3">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 hover:text-primary transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tech Pulse
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase text-[10px]">
              {story.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>{story.points} PTS</span>
            </div>
          </div>
        </div>

        {/* Headline & Meta */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-ink leading-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-3 border-b border-line pb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={story.publishedAt}>{formatContentDate(story.publishedAt)}</time>
            </div>
            <span>•</span>
            <div>
              Source:{" "}
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {story.source} ↗
              </a>
            </div>
            <span>•</span>
            <div>
              Curated by: <span className="text-ink font-bold">THE SABBiR</span>
            </div>
          </div>
        </div>

        {/* 16:9 Hero Cover Image */}
        {story.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-line shadow-md bg-muted/40">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* 3-Bullet Executive Summary */}
        {story.executiveSummary && story.executiveSummary.length > 0 && (
          <div className="p-5 rounded-2xl bg-muted/30 border border-line space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Briefing</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-2">
              {story.executiveSummary.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 1-Click Bangla Summary & Impact */}
        <BanglaArticleSummary
          title={story.title}
          banglaSummary={story.summary}
          bullets={story.executiveSummary}
          relatedToolHref="/tools"
          relatedToolLabel="Explore Tools on THE SABBiR OS ↗"
        />

        {/* THE SABBiR Engineering Takeaway (Callout Box) */}
        <div className="p-5 rounded-2xl bg-primary/10 border-2 border-primary/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>THE SABBiR Engineering Takeaway</span>
          </div>
          <p className="text-xs sm:text-sm text-ink font-sans leading-relaxed">
            {story.engineeringTakeaway}
          </p>
        </div>

        {/* 1-Click Creative Remix Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/20 border border-line">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-3 font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Remix into Workplace Studio:</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/tools/story-maker?headline=${encodeURIComponent(story.title)}&category=${encodeURIComponent(story.category || "News")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 dark:text-pink-400 text-xs font-mono font-medium transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Story Poster (9:16)</span>
            </Link>
            <Link
              href={`/tools/slide-deck?title=${encodeURIComponent(story.title)}&notes=${encodeURIComponent(story.summary || "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-mono font-medium transition"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Deck (16:9)</span>
            </Link>
          </div>
        </div>

        {/* Main Body Breakdown */}
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-ink-2 leading-relaxed space-y-4 pt-2">
          {story.contentBody ? (
            story.contentBody.split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-lg font-bold font-mono text-ink mt-6 mb-2">
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-base font-bold font-mono text-ink mt-4 mb-2">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("> ")) {
                return (
                  <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-ink my-3">
                    {para.replace("> ", "")}
                  </blockquote>
                );
              }
              if (para.startsWith("- ")) {
                const listItems = para.split("\n- ").map((item) => item.replace("- ", ""));
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1">
                    {listItems.map((li, idx) => (
                      <li key={idx}>{li}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{para}</p>;
            })
          ) : (
            <p>{story.summary}</p>
          )}
        </div>

        {/* Interactive Viral Sharing & Primary Source Bridge */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-ink-3 block">Primary Source Verification</span>
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline"
            >
              <span>Read Original Release on {story.source}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <NewsShareButton
            title={story.title}
            takeaway={story.engineeringTakeaway}
            url={`https://sabbir.nav.bd/news/${story.slug}`}
            hashtags={story.hashtags}
          />
        </div>

        {/* SEO Keyword Cloud & Tags */}
        <div className="space-y-2 pt-4 border-t border-line">
          <span className="text-[10px] font-mono uppercase text-ink-3 block">Topic Keywords &amp; Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {story.seoKeywords.map((k) => (
              <span
                key={k}
                className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-mono text-ink-2"
              >
                #{k}
              </span>
            ))}
            {story.hashtags.map((h) => (
              <span
                key={h}
                className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-mono font-semibold"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Related Stories Grid */}
        {relatedStories.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-line">
            <h3 className="text-base font-bold font-mono text-ink">Related {story.category} Drops</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedStories.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/news/${rel.slug}`}
                  className="p-4 rounded-xl border border-line bg-surface hover:border-primary/50 transition flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    {rel.coverImage && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-ink group-hover:text-primary transition line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-primary mt-2 flex items-center gap-1">
                    Read Breakdown →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
