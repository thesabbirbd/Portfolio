import { MarriageBiodataStudio } from "@/components/tools/MarriageBiodataStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bangla & Islamic Marriage Biodata Studio — THE SABBiR OS",
  description:
    "Design elegant, respectful Islamic and modern matrimonial biodatas with religious details, education, family background, and printable card export.",
  path: "/tools/marriage-biodata-maker",
  keywords: [
    "marriage biodata bangla",
    "islamic biodata maker",
    "patro patri biodata",
    "matrimonial biodata format",
    "the sabbir os",
  ],
});

export default function MarriageBiodataPage() {
  return <MarriageBiodataStudio />;
}
