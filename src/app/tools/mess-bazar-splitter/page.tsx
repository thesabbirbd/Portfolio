import { MessBazarSplitterStudio } from "@/components/tools/MessBazarSplitterStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Student Mess Meal Rate & Bazar Splitter — THE SABBiR OS",
  description:
    "Free client-side bachelor mess meal rate calculator, member-wise bazar balance reconciliation, and instant settlement report card.",
  path: "/tools/mess-bazar-splitter",
  keywords: [
    "mess meal rate calculator",
    "bachelor mess hisab",
    "mess bazar hisab bangladesh",
    "meal rate bd",
    "the sabbir os",
  ],
});

export default function MessBazarSplitterPage() {
  return <MessBazarSplitterStudio />;
}
