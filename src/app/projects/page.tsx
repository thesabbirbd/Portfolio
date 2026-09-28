import { ProjectsSection } from "@/components/projects/ProjectsSection";

export const metadata = {
  title: "Projects by THE SABBiR | Backend, AI, Systems & Creative Technology",
  description: "Explore the technical builds and engineering projects by Md Sabbirul Islam Khan (THE SABBiR), including Omnidesk BD and local AI systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/projects",
  }
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Selected Builds & Projects</h1>
        <p className="text-xl text-muted-foreground">Engineering Architecture, Web Platforms, and Systems Integration by THE SABBiR</p>
      </div>
      <ProjectsSection />
    </div>
  );
}
