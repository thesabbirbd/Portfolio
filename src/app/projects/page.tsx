import { getAllContent } from "@/lib/content";
import { ProjectBrowser } from "@/components/content/ProjectBrowser";
import Link from "next/link";

export const metadata = {
  title: "Projects | THE SABBiR",
  description: "Explore the technical builds, engineering projects, and case studies by Md Sabbirul Islam Khan (THE SABBiR).",
  alternates: {
    canonical: "https://sabbir.nav.bd/projects",
  }
};

export default function ProjectsPage() {
  const projects = getAllContent('projects');

  return (
    <div className="flex flex-col w-full pt-20">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <nav className="flex text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-foreground">Projects</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineering Projects</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          Case studies documenting problem-solving, architectural evolution, and real-world implementation.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-16">
          These case studies represent practical applications of Backend Engineering, DevOps, and Full-Stack development. They are structured as engineering evidence—documenting not just the features, but the decisions, trade-offs, and iterations behind them.
        </p>

        <ProjectBrowser projects={projects} />
      </div>
    </div>
  );
}
