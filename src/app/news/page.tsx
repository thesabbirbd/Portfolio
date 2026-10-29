import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { DemoBadge } from "@/components/discover/DemoBadge";
import { NEWS } from "@/data/discover";
import { formatContentDate, contentDateTime } from "@/lib/content-date";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News Commentary — Sourced Takes on Releases | THE SABBiR",
  description: "Short, sourced commentary on Python, PostgreSQL, Docker, Ubuntu and Kubernetes releases by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/news",
  noindex: true, // demo commentary only for now
});

const items = [...NEWS].sort((a, b) => contentDateTime(b.sourceDate) - contentDateTime(a.sourceDate));

export default function NewsPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "News" }]}
        eyebrow="Sourced news commentary"
        title={<>Releases, <Accent>read closely</Accent></>}
        lede="Every take links to the primary source and shows the source's own date. The commentary is my opinion; these first entries are demo samples."
      />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-16">
        <ol className="space-y-3 sm:space-y-4">
          {items.map((n) => (
            <li key={n.id} className="reveal">
              <article className="rounded-card surface-card p-4 sm:p-6 lux-card">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] sm:text-xs text-ink-3">
                  <DemoBadge />
                  <time dateTime={n.sourceDate}>{formatContentDate(n.sourceDate)}</time>
                  <span aria-hidden="true">·</span>
                  {n.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-signal/10 text-signal">{t}</span>)}
                </div>
                <h2 className="mt-2 text-base sm:text-xl font-bold text-ink">{n.headline}</h2>
                <p className="mt-2 text-sm sm:text-base text-ink-2 leading-relaxed">{n.commentary}</p>
                <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-8 items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
                  Source: {n.source} <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </a>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
