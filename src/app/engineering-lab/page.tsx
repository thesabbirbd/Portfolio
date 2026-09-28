import { EngineeringLabSection } from "@/components/lab/EngineeringLabSection";

export const metadata = {
  title: "THE SABBiR Engineering Lab | Linux, AI, Networking & Systems",
  description: "Dive into the Engineering Lab of Md Sabbirul Islam Khan. Exploring Local LLMs, Backend Architecture, DevOps, Linux, and IT Systems.",
  alternates: {
    canonical: "https://sabbir.nav.bd/engineering-lab",
  }
};

export default function EngineeringLabPage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Engineering Lab</h1>
        <p className="text-xl text-muted-foreground">Experiments in Backend, DevOps, Local AI, Linux, and Advanced Networking.</p>
      </div>
      <EngineeringLabSection />
    </div>
  );
}
