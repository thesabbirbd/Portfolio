import { getAllContent } from "@/lib/content";
import { ProjectBrowser } from "@/components/content/ProjectBrowser";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";

export const metadata = {
  title: "Projects | THE SABBiR",
  description: "Explore the technical builds, engineering projects, and case studies by Md Sabbirul Islam Khan, known as THE SABBiR.",
  alternates: {
    canonical: "https://sabbir.nav.bd/projects",
  }
};

export default function ProjectsPage() {
  const projects = getAllContent('projects');

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Projects" }]}
        eyebrow="Selected work · Case studies"
        title={<>Engineering <Accent>projects</Accent></>}
        lede="Case studies that document the problem, the decisions and trade-offs, and what actually got built — across backend, DevOps, hardware and local AI."
      />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-12">
        <h2 className="sr-only">All projects</h2>
        <ProjectBrowser projects={projects} />
      </div>
    </div>
  );
}
