import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { WORK_EXPERIENCE, CV_PDF, LINKEDIN_URL } from "@/data/experience";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card } from "@/components/system/Card";
import { LinkedinIcon } from "@/components/ui/BrandIcons";

/** /experience — work history from the CV, newest first, with the CV and LinkedIn one tap away. */
export function WorkHistory() {
  return (
    <section id="work-history" className="relative py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-20">
      <SectionHeader
        eyebrow="Work history"
        title={<>Roles &amp; <Accent>experience</Accent></>}
        lede="Current leadership role first, then IT support, field research, training and media work — as listed on my CV."
        className="mb-6 sm:mb-8"
      />
      <ol className="space-y-3 sm:space-y-4">
        {WORK_EXPERIENCE.map((w) => {
          const external = w.url?.startsWith("http");
          return (
            <Card as="li" key={`${w.org}-${w.title}`} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base sm:text-lg font-bold text-ink">{w.title}</h3>
                <span className={`text-xs font-mono ${w.current ? "text-ok" : "text-ink-3"}`}>{w.date}</span>
              </div>
              <div className="mt-0.5 text-sm font-semibold text-primary">
                {w.url ? (
                  external ? (
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-1 hover:underline underline-offset-4">
                      {w.org} <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link href={w.url} className="inline-flex min-h-7 items-center gap-1 hover:underline underline-offset-4">{w.org}</Link>
                  )
                ) : <span className="inline-flex min-h-7 items-center">{w.org}</span>}
              </div>
              <ul className="mt-2 space-y-1 list-disc pl-5 text-sm text-ink-2 leading-relaxed">
                {w.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              {w.detailsHref && (
                <Link href={w.detailsHref} className="mt-2 inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
                  Details: {w.org} <span aria-hidden="true">→</span>
                </Link>
              )}
            </Card>
          );
        })}
      </ol>
      <div className="reveal mt-5 flex flex-wrap gap-2">
        <a href={CV_PDF} download className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors">
          <FileDown aria-hidden="true" className="w-4 h-4" /> Download CV (PDF)
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
          <LinkedinIcon className="w-4 h-4" /> LinkedIn
        </a>
        <Link href="/resume" className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
          Interactive resume
        </Link>
      </div>
    </section>
  );
}
