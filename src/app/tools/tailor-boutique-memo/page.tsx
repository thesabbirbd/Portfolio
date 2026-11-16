import { TailorBoutiqueMemoStudio } from "@/components/tools/TailorBoutiqueMemoStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tailor Measurement Book & Dual-Copy Order Token — THE SABBiR OS",
  description:
    "Tailor measurement book for Panjabi, Shirt, Pant, Salwar Kameez with inch measurements and dual-copy printable customer order tokens.",
  path: "/tools/tailor-boutique-memo",
  keywords: [
    "tailor measurement book",
    "tailor order token",
    "panjabi cutting inch bd",
    "boutique order slip",
    "the sabbir os",
  ],
});

export default function TailorBoutiqueMemoPage() {
  return <TailorBoutiqueMemoStudio />;
}
