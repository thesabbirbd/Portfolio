import { SkillsBento } from "@/components/skills/SkillsBento";
import { MissionSection } from "@/components/mission/MissionSection";
import Link from "next/link";

export const metadata = {
  title: "Experience & Skills | THE SABBiR",
  description: "Review the professional skills, IT operations, NOC, and technical engineering experience of Md Sabbirul Islam Khan (THE SABBiR) in Bangladesh.",
  alternates: {
    canonical: "https://sabbir.nav.bd/experience",
  }
};

export default function ExperiencePage() {
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
                <span className="text-foreground">Experience</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Professional Experience & Skills</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          My technical journey encompasses hands-on IT operations, systems administration, and software engineering.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          I have cultivated a diverse skill ecosystem ranging from foundational hardware troubleshooting and NOC (Network Operations Center) support to modern Backend development and Cloud deployment. This unique blend of on-ground IT support and high-level software architecture allows me to approach problems with a holistic view of the entire technology stack.
        </p>
      </div>
      <MissionSection />
      <div className="mt-20">
        <SkillsBento />
      </div>
    </div>
  );
}
