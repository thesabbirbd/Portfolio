import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { EngineeringLabSection } from "@/components/lab/EngineeringLabSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { MapsExplorerSection } from "@/components/maps/MapsExplorerSection";
import { CommunitySection } from "@/components/community/CommunitySection";
import { MissionSection } from "@/components/mission/MissionSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SettingsPanel } from "@/components/ui/SettingsPanel";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 01 // HERO */}
      <HeroSection />

      {/* 02 // ABOUT, IDENTITY & JOURNEY TIMELINE */}
      <AboutSection />

      {/* 03 // SELECTED BUILDS (FEATURING OMNIDESK BD & ARCHITECTURE MODAL) */}
      <ProjectsSection />

      {/* 04 // ENGINEERING LAB (5 DISCIPLINE PROTOTYPES) */}
      <EngineeringLabSection />

      {/* 05 // SKILLS & CAPABILITY ECOSYSTEM */}
      <SkillsSection />

      {/* 06 // MAPS EXPLORER (GOOGLE LOCAL GUIDE & 360° VR) */}
      <MapsExplorerSection />

      {/* 07 // COMMUNITY, LEADERSHIP & VOLUNTEERING */}
      <CommunitySection />

      {/* 08 // ACTIVE MISSION & FIELD OPERATIONS */}
      <MissionSection />

      {/* 09 // CONTACT & TRANSMISSION */}
      <ContactSection />

      {/* FLOATING SYSTEM EXPERIENCE SETTINGS (THEME, SOUND, MOTION, 3D) */}
      <SettingsPanel />
    </div>
  );
}
