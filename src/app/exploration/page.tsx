import { MapsExplorerSection } from "@/components/maps/MapsExplorerSection";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";

export const metadata = {
  title: "Google Maps & 360° Exploration | THE SABBiR",
  description: "Explore geospatial projects, 360° photography, and Google Maps Local Guide contributions by Md Sabbirul Islam Khan across Bangladesh.",
  alternates: {
    canonical: "https://sabbir.nav.bd/exploration",
  }
};

export default function ExplorationPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Exploration" }]}
        eyebrow="Maps · 360° photography"
        title={<>Geospatial &amp; 360° <Accent>exploration</Accent></>}
        lede="As a Google Maps Local Guide in Rajshahi, I map local businesses, landmarks and public spaces, and publish 360° spherical photography to Google Street View."
        className="mb-2 md:mb-4"
      />
      <MapsExplorerSection />
    </div>
  );
}
