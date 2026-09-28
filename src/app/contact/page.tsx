import { ContactSection } from "@/components/contact/ContactSection";
import Link from "next/link";

export const metadata = {
  title: "Contact Md Sabbirul Islam Khan | THE SABBiR",
  description: "Get in touch with Md Sabbirul Islam Khan (THE SABBiR) for Backend Engineering, DevOps, IT Support, or creative collaborations.",
  alternates: {
    canonical: "https://sabbir.nav.bd/contact",
  }
};

export default function ContactPage() {
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
                <span className="text-foreground">Contact</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Contact Transmission</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          Open for professional inquiries, technical consulting, and engineering collaborations.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Whether you need assistance with Backend Architecture, DevOps infrastructure, or specialized IT Systems support, feel free to reach out. I am currently based in Rajshahi, Bangladesh, but available for remote opportunities.
        </p>
      </div>
      <ContactSection />
    </div>
  );
}
