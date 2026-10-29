import { Gamepad2, Hourglass } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { GAMES } from "@/data/discover";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Browser Games — Coming Soon | THE SABBiR",
  description: "Small engineering browser games by THE SABBiR: Terminal CTF, Subnet Sprint, Packet Runner and a Linux command quiz. Coming soon.",
  path: "/games",
  noindex: true, // nothing playable yet
});

export default function GamesPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Games" }]}
        eyebrow="Browser games"
        title={<>Coming soon — <Accent>stay tuned</Accent></>}
        lede="Small games that teach real engineering skills. They are being designed now; none is playable yet."
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {GAMES.map((g) => (
            <li key={g.id} className="reveal relative rounded-card surface-card p-5 sm:p-6 overflow-hidden lux-card">
              <div aria-hidden="true" className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-primary/10" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary"><Gamepad2 className="w-5 h-5" aria-hidden="true" /></span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-gold">
                  <Hourglass aria-hidden="true" className="w-3.5 h-3.5" /> Coming soon
                </span>
              </div>
              <h2 className="relative mt-4 text-lg sm:text-xl font-bold text-ink">{g.title}</h2>
              <p className="relative mt-1 text-sm sm:text-base text-ink-2 leading-relaxed">{g.pitch}</p>
              <ul className="relative mt-3 flex flex-wrap gap-1.5" aria-label="Skills practised">
                {g.skills.map((s) => <li key={s} className="text-[11px] font-mono text-ink-3 bg-muted px-2 py-0.5 rounded">{s}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-ink-3">Stay tuned — new games will appear here first.</p>
      </div>
    </div>
  );
}
