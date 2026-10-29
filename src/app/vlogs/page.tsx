import { Clapperboard, Play } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { DemoBadge } from "@/components/discover/DemoBadge";
import { VLOGS } from "@/data/discover";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vlogs — Lab Sessions on Video | THE SABBiR",
  description: "Screen-recorded engineering lab sessions by Md Sabbirul Islam Khan, known as THE SABBiR: Ubuntu setups, local LLMs, MikroTik and FastAPI.",
  path: "/vlogs",
  noindex: true, // demo episodes only until real videos are published
});

export default function VlogsPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Vlogs" }]}
        eyebrow="Vlogs"
        title={<>Lab sessions, <Accent>on camera</Accent></>}
        lede="Setups, failures and fixes, recorded as they happen. These first episodes are in production — no video is published yet."
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {VLOGS.map((v, i) => (
            <li key={v.id} className="reveal rounded-card surface-card overflow-hidden lux-card">
              {/* Poster: a generated frame, not a video thumbnail (nothing is published yet). */}
              <div aria-hidden="true" className="relative aspect-video vlog-poster flex items-center justify-center">
                <span className="absolute top-3 left-3 font-mono text-[11px] uppercase tracking-wider text-white/80">EP {String(i + 1).padStart(2, "0")}</span>
                <span className="grid place-items-center w-14 h-14 rounded-full bg-white/15 border border-white/30 text-white">
                  <Play className="w-6 h-6 translate-x-0.5" />
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[11px] text-white">
                  <Clapperboard className="w-3.5 h-3.5" /> In production
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2"><DemoBadge /></div>
                <h2 className="text-base sm:text-lg font-bold text-ink">{v.title}</h2>
                <p className="mt-1 text-sm text-ink-2 leading-relaxed">{v.summary}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics">
                  {v.topics.map((t) => <li key={t} className="text-[11px] font-mono text-ink-3 bg-muted px-2 py-0.5 rounded">{t}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
