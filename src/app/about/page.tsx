import { AboutSection } from "@/components/about/AboutSection";

export const metadata = {
  title: "About Md Sabbirul Islam Khan — THE SABBiR",
  description: "Learn more about Md Sabbirul Islam Khan (THE SABBiR), a Management student from Rajshahi, Bangladesh focusing on Backend Engineering, DevOps, AI, and Systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/about",
  }
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Md Sabbirul Islam Khan</h1>
        <p className="text-xl text-muted-foreground">THE SABBiR | Rajshahi, Bangladesh | BBA Management & Systems Engineering</p>
      </div>
      <AboutSection />
    </div>
  );
}
