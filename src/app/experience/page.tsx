import { SkillsBento } from "@/components/skills/SkillsBento";
import { MissionSection } from "@/components/mission/MissionSection";

export const metadata = {
  title: "Experience & Skills | Md Sabbirul Islam Khan — THE SABBiR",
  description: "Review the professional skills, IT operations, NOC, and technical engineering experience of Md Sabbirul Islam Khan in Bangladesh.",
  alternates: {
    canonical: "https://sabbir.nav.bd/experience",
  }
};

export default function ExperiencePage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Professional Experience</h1>
        <p className="text-xl text-muted-foreground">Technical Operations, Systems Engineering, and Active Missions.</p>
      </div>
      <MissionSection />
      <div className="mt-20">
        <SkillsBento />
      </div>
    </div>
  );
}
