import { EngineeringLabSection } from "@/components/lab/EngineeringLabSection";
import Link from "next/link";

export const metadata = {
  title: "Engineering Lab | THE SABBiR",
  description: "Dive into the Engineering Lab of Md Sabbirul Islam Khan. Exploring Local LLMs, Backend Architecture, DevOps, Linux, and IT Systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/engineering-lab",
  }
};

export default function EngineeringLabPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineering Lab</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          The experimental testing ground for Md Sabbirul Islam Khan (THE SABBiR). This space documents my hands-on research and prototyping in advanced technical domains.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Here you will find prototypes and experiments covering Backend Systems (FastAPI, Python, PostgreSQL), DevOps practices (Docker, CI/CD pipelines, Linux environments), Local AI inference (Ollama running LLMs on consumer hardware), and Advanced Networking (MikroTik, NOC operations). This laboratory bridges the gap between theoretical knowledge and practical engineering.
        </p>
      </div>
      <EngineeringLabSection />
    </div>
  );
}
