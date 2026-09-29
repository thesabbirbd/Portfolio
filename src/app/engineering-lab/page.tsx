import { getAllContent } from "@/lib/content";
import { ContentCard } from "@/components/content/ContentCard";
import Link from "next/link";
import { FlaskConical } from "lucide-react";

export const metadata = {
  title: "Engineering Lab & Experiments | THE SABBiR",
  description: "A documented engineering lab for local AI, infrastructure, automation, and backend experiments by Md Sabbirul Islam Khan (THE SABBiR).",
  alternates: {
    canonical: "https://sabbir.nav.bd/engineering-lab",
  }
};

export default function EngineeringLabPage() {
  const experiments = getAllContent('lab');

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
                <span className="text-foreground">Engineering Lab</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <FlaskConical className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Engineering Lab</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          Hypotheses tested, boundaries pushed, and architectures broken.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-16">
          This is where I document raw technical experiments before they become production projects. It tracks things tested, measured, compared, broken, and investigated across Local AI, Linux, Networking, and Backend systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map(exp => (
            <ContentCard key={exp.meta.slug} item={exp} baseUrl="/engineering-lab" />
          ))}
        </div>
      </div>
    </div>
  );
}
