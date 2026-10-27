import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Store, ShoppingBag, Boxes, BookOpen, HandCoins, Bot, BarChart3, Users } from "lucide-react";
import { AIYAAR, AIYAAR_FEATURES } from "@/data/aiyaar";
import { LINKEDIN_URL } from "@/data/experience";
import { LinkedinIcon } from "@/components/ui/BrandIcons";

const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  pos: Store, store: ShoppingBag, inventory: Boxes, khata: BookOpen, baki: HandCoins, social: Bot, reports: BarChart3, team: Users,
};
const SPOTLIGHT = ["pos", "store", "inventory", "khata", "baki", "social", "reports", "team"];

/**
 * Home — the featured current role, placed right after the hero so it is the first thing
 * visitors meet: Chief Project Manager at Aiyaar Ltd, what the Aiyaar SaaS does, and links to
 * the full /aiyaar page, the product site and LinkedIn.
 */
export function AiyaarFeature() {
  const spotlight = SPOTLIGHT.map((id) => AIYAAR_FEATURES.find((f) => f.id === id)!).filter(Boolean);
  return (
    <section id="aiyaar" aria-labelledby="aiyaar-title" className="relative py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      <div className="reveal relative overflow-hidden rounded-panel border border-primary/25 surface-elevated shadow-e3">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_0%_0%,rgb(var(--brand)/0.16),transparent_55%),radial-gradient(90%_70%_at_100%_100%,rgb(var(--brand-2)/0.12),transparent_60%)]" />
        <div className="relative p-5 sm:p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ok/30 bg-ok/10 text-ok text-[11px] font-mono font-semibold uppercase tracking-wider">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok motion-safe:animate-pulse" /> Current role
            </span>
            <span className="font-mono text-eyebrow uppercase text-ink-3">Featured · SaaS for Bangladeshi businesses</span>
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 id="aiyaar-title" className="text-h2 font-extrabold text-ink text-balance">
                Chief Project Manager at{" "}
                <Link href="/aiyaar" className="text-display-gradient hover:underline decoration-primary/40 underline-offset-8">Aiyaar Ltd</Link>
              </h2>
              <p className="mt-4 text-lede text-ink-2 max-w-2xl text-pretty">{AIYAAR.tagline}</p>
              <p className="mt-3 text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
                POS, online store, inventory, digital khata, baki, invoices, reports, Facebook &amp; Instagram AI replies, delivery and staff roles —
                one connected system built for 22 kinds of business, from pharmacies and grocery shops to restaurants and turfs.
              </p>
            </div>
            <dl className="lg:col-span-5 grid grid-cols-2 gap-2 sm:gap-3">
              {AIYAAR.highlights.map((h) => (
                <div key={h.label} className="rounded-xl surface-card p-3 sm:p-4">
                  <dt className="text-xs text-ink-3">{h.label}</dt>
                  <dd className="text-xl sm:text-2xl font-extrabold text-ink">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3" aria-label="What Aiyaar does">
            {spotlight.map((f) => {
              const Icon = ICON[f.id] ?? Store;
              return (
                <li key={f.id}>
                  <Link
                    href={`/aiyaar#${f.id}`}
                    className="group flex h-full flex-col gap-2 rounded-xl surface-card surface-interactive p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <Icon aria-hidden="true" className="w-5 h-5 text-primary" />
                    <span className="text-sm sm:text-base font-bold text-ink group-hover:text-primary transition-colors">{f.title}</span>
                    <span className="hidden sm:block text-xs text-ink-2 leading-snug">{f.desc}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
            <Link href="/aiyaar" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full bg-primary text-on-primary text-sm sm:text-base font-semibold hover:bg-primary/90 transition-colors">
              Explore Aiyaar features <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <a href={AIYAAR.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full surface-card surface-interactive text-sm sm:text-base font-semibold text-ink">
              Visit aiyaar.ltd <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-5 rounded-full surface-card surface-interactive text-sm sm:text-base font-semibold text-ink">
              <LinkedinIcon className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
