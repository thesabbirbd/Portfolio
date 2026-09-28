import { ProjectsSection } from "@/components/projects/ProjectsSection";
import Link from "next/link";

export const metadata = {
  title: "Projects | THE SABBiR",
  description: "Explore the technical builds and engineering projects by Md Sabbirul Islam Khan (THE SABBiR), including Omnidesk BD and local AI systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/projects",
  }
};

export default function ProjectsPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Technical Projects</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          A showcase of engineering architecture, web platforms, and systems integration built by Md Sabbirul Islam Khan (THE SABBiR).
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          These projects represent practical applications of Backend Engineering, DevOps, and Full-Stack development. From commercial solutions like Omnidesk BD to experimental systems architecture, this portfolio reflects my ongoing exploration of scalable technology. For deeper technical insights, explore the <Link href="/engineering-lab" className="text-primary hover:underline">Engineering Lab</Link>.
        </p>
      </div>
      <ProjectsSection />
    </div>
  );
}
