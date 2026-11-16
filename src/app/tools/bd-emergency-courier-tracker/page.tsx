import { BdEmergencyCourierStudio } from "@/components/tools/BdEmergencyCourierStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "BD Courier Charges & National Emergency Helpline Hub — THE SABBiR OS",
  description:
    "Compare Steadfast, Pathao, RedX delivery charges, search 64 district postcodes, and access 999, 333, 109 emergency helplines.",
  path: "/tools/bd-emergency-courier-tracker",
  keywords: [
    "courier charge bd",
    "steadfast pathao redx",
    "delivery charge compare",
    "postcode 64 district",
    "999 helpline",
    "the sabbir os",
  ],
});

export default function BdEmergencyCourierPage() {
  return <BdEmergencyCourierStudio />;
}
