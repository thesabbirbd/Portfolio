import { ContactSection } from "@/components/contact/ContactSection";

export const metadata = {
  title: "Contact THE SABBiR | Md Sabbirul Islam Khan",
  description: "Get in touch with Md Sabbirul Islam Khan (THE SABBiR) for Backend Engineering, DevOps, IT Support, or creative collaborations.",
  alternates: {
    canonical: "https://sabbir.nav.bd/contact",
  }
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contact Transmission</h1>
        <p className="text-xl text-muted-foreground">Connect with Md Sabbirul Islam Khan — THE SABBiR for professional inquiries and engineering collaboration.</p>
      </div>
      <ContactSection />
    </div>
  );
}
