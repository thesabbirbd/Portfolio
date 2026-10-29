import { SkillsBento } from "@/components/skills/SkillsBento";
import { MissionSection } from "@/components/mission/MissionSection";
import { WorkHistory } from "@/components/experience/WorkHistory";
import { CommunitySection } from "@/components/community/CommunitySection";
import Link from "next/link";
import { PageHeader } from "@/components/system/PageHeader";
import { AIYAAR } from "@/data/aiyaar";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { AiyaarName } from "@/components/system/AiyaarName";

export const metadata = pageMetadata({
  title: "Experience & Skills | THE SABBiR",
  description: "Review the professional skills, IT operations, NOC, and technical engineering experience of Md Sabbirul Islam Khan, known as THE SABBiR in Bangladesh.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Experience" }]}
        eyebrow="Experience · Skills · Community"
        title={<>Experience &amp; <Accent>skills</Accent></>}
        lede={<>{AIYAAR.role} at <AiyaarName />, with a background in IT support, NOC-side troubleshooting and Python training — plus the current backend sprint, skills with an honest level for each, and community work.</>}
        className="mb-2 md:mb-4"
      />
      <WorkHistory />
      <MissionSection />
      <SkillsBento />
      {/* Community, leadership & volunteering (moved here from the Home page) */}
      <CommunitySection />
    </div>
  );
}
