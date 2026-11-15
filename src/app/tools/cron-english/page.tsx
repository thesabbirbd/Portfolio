import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { PlainEnglishCronStudio } from "@/components/tools/PlainEnglishCronStudio";

export const metadata = pageMetadata({
  title: "Plain-English to Cron & systemd.timer Generator | THE SABBiR",
  description: "Convert natural language phrases into standard 5-part cron syntax, view projected run timestamps, and generate complete systemd.timer unit files.",
  path: "/tools/cron-english",
});

export default function CronEnglishPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Cron & Timer" }]}
        eyebrow="Linux & Automation"
        title={<>Plain-English to <Accent>Cron & systemd</Accent></>}
        lede="Translate plain English or Banglish into precise cron schedules, projected execution calendars, and drop-in systemd.timer service definitions."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <PlainEnglishCronStudio />
      </div>
    </div>
  );
}
