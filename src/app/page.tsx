import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { OmnideskSection } from "@/components/omnidesk/OmnideskSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { MissionSection } from "@/components/mission/MissionSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <OmnideskSection />
      <SkillsSection />
      <ProjectsSection />
      <MissionSection />
    </div>
  );
}
