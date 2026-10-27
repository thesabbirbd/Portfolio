import { AboutSection } from "@/components/about/AboutSection";
import Link from "next/link";

export const metadata = {
  title: "About Md Sabbirul Islam Khan | THE SABBiR",
  description: "Learn more about Md Sabbirul Islam Khan, known as THE SABBiR, a Management student from Rajshahi, Bangladesh focusing on Backend Engineering, DevOps, AI, and Systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/about",
  }
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-6 text-sm text-ink-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center gap-2">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">About</li>
        </ol>
      </nav>
      {/* The intro, identity module, bio, matrix, timeline and evidence links all live in AboutSection */}
      <AboutSection />
    </div>
  );
}
