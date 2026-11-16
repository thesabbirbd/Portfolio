import { PrescriptionHealthPadStudio } from "@/components/tools/PrescriptionHealthPadStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digital Doctor Rx Prescription Pad & Vitals Studio — THE SABBiR OS",
  description:
    "Professional digital doctor prescription pad with Bangla dosage scheduling (১+০+১ খাবার পর), patient vitals, and printable A4 doctor Rx sheet.",
  path: "/tools/prescription-health-pad",
  keywords: [
    "doctor prescription pad bangla",
    "rx prescription maker",
    "medicine scheduler bd",
    "patient vitals tracker",
    "the sabbir os",
  ],
});

export default function PrescriptionHealthPadPage() {
  return <PrescriptionHealthPadStudio />;
}
