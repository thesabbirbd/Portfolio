import { MapsExplorerSection } from "@/components/maps/MapsExplorerSection";
import Link from "next/link";

export const metadata = {
  title: "Google Maps & 360° Exploration | THE SABBiR",
  description: "Explore geospatial projects, 360° photography, and Google Maps Local Guide contributions by Md Sabbirul Islam Khan across Bangladesh.",
  alternates: {
    canonical: "https://sabbir.nav.bd/exploration",
  }
};

export default function ExplorationPage() {
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
                <span className="text-foreground">Exploration</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Geospatial & 360° Exploration</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          Beyond traditional software engineering, I explore the physical world through geospatial mapping and immersive media.
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          As a Google Maps Local Guide based in Rajshahi, Bangladesh, I have mapped numerous local businesses, historical landmarks, and public spaces. My work heavily involves 360° spherical photography and Google Street View contributions, leveraging creative technology to digitalize real-world environments.
        </p>
      </div>
      <MapsExplorerSection />
    </div>
  );
}
