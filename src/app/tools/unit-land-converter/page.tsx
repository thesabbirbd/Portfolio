import { UnitLandConverterStudio } from "@/components/tools/UnitLandConverterStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "BD Land Area (Katha/Decimal/Bigha) & Gold Vori Studio — THE SABBiR OS",
  description:
    "Authentic Bangladeshi land survey unit converter (Decimal, Katha, Bigha, Chotak, Sq.Ft) and BAJUS gold jewellery price, vori, ana, ratti, and 5% VAT invoice estimator.",
  path: "/tools/unit-land-converter",
});

export default function UnitLandConverterPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <UnitLandConverterStudio />
    </div>
  );
}
