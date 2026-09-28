import { MapsExplorerSection } from "@/components/maps/MapsExplorerSection";

export const metadata = {
  title: "THE SABBiR | Google Maps, 360° Photography & Exploration",
  description: "Explore geospatial projects, 360° photography, and Google Maps Local Guide contributions by Md Sabbirul Islam Khan across Bangladesh.",
  alternates: {
    canonical: "https://sabbir.nav.bd/exploration",
  }
};

export default function ExplorationPage() {
  return (
    <div className="flex flex-col w-full pt-12">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Geospatial Exploration</h1>
        <p className="text-xl text-muted-foreground">Google Maps Local Guide, 360° Street View Photography, and immersive mapping in Bangladesh.</p>
      </div>
      <MapsExplorerSection />
    </div>
  );
}
