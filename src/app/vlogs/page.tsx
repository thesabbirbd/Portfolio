import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { VlogsList } from "@/components/discover/VlogsList";
import { VLOG_EPISODES } from "@/data/vlogs";
import { pageMetadata } from "@/lib/seo";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

export const metadata = pageMetadata({
  title: "Vlogs & Video Lab — Systems, AI & DevOps on Camera | THE SABBiR",
  description: "Screen-recorded backend, DevOps, local AI and product architecture video sessions by THE SABBiR. 4:5 60fps lab reels with copy-ready companion prompts.",
  path: "/vlogs",
});

export default function VlogsPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Vlogs" }]}
        eyebrow="Video Lab"
        title={<>Lab sessions, <Accent>on camera</Accent></>}
        lede="Engineering setups, failure postmortems, and practical AI systems recorded at 4:5 (60 fps). Every episode includes a copy-ready companion prompt or script."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-6 flex justify-end">
        <BanglaGuideModal topic="vlogs" />
      </div>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <VlogsList episodes={VLOG_EPISODES} />
      </div>
    </div>
  );
}
