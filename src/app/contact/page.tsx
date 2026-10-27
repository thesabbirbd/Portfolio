import { ContactSection } from "@/components/contact/ContactSection";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";

export const metadata = {
  title: "Contact Md Sabbirul Islam Khan | THE SABBiR",
  description: "Get in touch with Md Sabbirul Islam Khan, known as THE SABBiR for Backend Engineering, DevOps, IT Support, or creative collaborations.",
  alternates: {
    canonical: "https://sabbir.nav.bd/contact",
  }
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact"
        title={<>Get in <Accent>touch</Accent></>}
        lede="Career opportunities, project collaboration, community work or just a hello. Pick a reason below and the form prepares an email draft for you. Based in Rajshahi, Bangladesh; open to remote opportunities."
        className="mb-4 md:mb-6"
      />
      <ContactSection />
    </div>
  );
}
