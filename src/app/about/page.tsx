import { AboutSection } from "@/components/about/AboutSection";
import Link from "next/link";

export const metadata = {
  title: "About Md Sabbirul Islam Khan | THE SABBiR",
  description: "Learn more about Md Sabbirul Islam Khan (THE SABBiR), a Management student from Rajshahi, Bangladesh focusing on Backend Engineering, DevOps, AI, and Systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/about",
  }
};

export default function AboutPage() {
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
                <span className="text-foreground">About</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">About Md Sabbirul Islam Khan</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          I am a Management student at Rajshahi College with a deep passion for technology and engineering. Known online as <strong>THE SABBiR</strong>, my journey bridges the gap between business management and technical problem-solving.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
          Based in Rajshahi, Bangladesh, I explore Backend Engineering, DevOps, Local AI (such as Ollama), Linux, and IT Systems. I believe in learning by doing, which has led me to build projects like Omnidesk BD and contribute actively as a Google Maps Local Guide. You can find my open-source work on <a href="https://github.com/thesabbirbd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a> or connect with me professionally on <a href="https://bd.linkedin.com/in/thesabbirbd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>.
        </p>

        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 max-w-3xl mb-12">
          <h2 className="text-2xl font-bold mb-4">Evidence & Exploration</h2>
          <p className="text-muted-foreground mb-6">
            My work is documented through real-world implementation, experimental research, and open process logs. Explore my personal knowledge base below.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/projects" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              Explore Projects
            </Link>
            <Link href="/engineering-lab" className="px-5 py-2.5 bg-muted text-foreground border border-border/50 rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">
              Engineering Lab
            </Link>
            <Link href="/notes" className="px-5 py-2.5 bg-muted text-foreground border border-border/50 rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">
              Read Notes
            </Link>
            <Link href="/journal" className="px-5 py-2.5 bg-muted text-foreground border border-border/50 rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">
              Process Logs
            </Link>
          </div>
        </div>
      </div>
      <AboutSection />
    </div>
  );
}
