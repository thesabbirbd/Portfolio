import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { OmnideskSection } from "@/components/omnidesk/OmnideskSection";
import { EngineeringLabSection } from "@/components/lab/EngineeringLabSection";
import { LatestThinking } from "@/components/content/LatestThinking";
import { JourneyPreview } from "@/components/home/JourneyPreview";
import { BeyondChapters } from "@/components/home/BeyondChapters";
import { ContactCTA } from "@/components/home/ContactCTA";
import { ChapterRail } from "@/components/home/ChapterRail";
import { AiyaarFeature } from "@/components/home/AiyaarFeature";
import { DiscoverChapter } from "@/components/home/DiscoverChapter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Md Sabbirul Islam Khan — THE SABBiR | Backend, DevOps, AI & Systems",
  description: "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
  path: "/",
  type: "profile",
});

/**
 * Home is the curated overview. Each chapter is short and hands off to the route that holds
 * the full content:
 *   ★  Aiyaar (CPM)    → /aiyaar (featured current role — Chief Product Manager — and the Aiyaar SaaS)
 *   01 Identity        → /about (portrait, "My World", full timeline)
 *   02 Selected Work   → /projects (every case study); Omnidesk flagship spotlight inline
 *   03 Journey         → /about#timeline (each step deep-links to its phase)
 *   04 Lab             → /engineering-lab (terminal, filters, every experiment)
 *   05 Writing         → /notes, /journal
 *   06 Beyond the code → /experience (skills, mission, community), /exploration (maps)
 *   07 Contact         → /contact (full form)
 */
export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <ChapterRail />
      <HeroSection />

      {/* Featured current role, first thing after the hero */}
      <AiyaarFeature />

      <AboutSection variant="overview" />

      <ProjectsSection>
        <OmnideskSection embedded />
      </ProjectsSection>

      <JourneyPreview />

      <EngineeringLabSection variant="teaser" index="04" />

      <LatestThinking />

      <DiscoverChapter />

      <BeyondChapters />

      <ContactCTA />
    </div>
  );
}
