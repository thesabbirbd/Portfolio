import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { BarcodeQrStudio } from "@/components/tools/BarcodeQrStudio";

export const metadata = pageMetadata({
  title: "Bulk Barcode (Code-128) & Branded QR Sticker Sheet Studio | THE SABBiR",
  description: "Generate Code-128 retail barcodes and branded QR code stickers for shop inventory, retail labels, and print-ready A4 sticker sheets.",
  path: "/tools/barcode-studio",
});

export default function BarcodeStudioPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Barcode & QR Studio" }]}
        eyebrow="Retail & Inventory"
        title={<>Bulk Barcode & <Accent>QR Sticker Studio</Accent></>}
        lede="Design and print standard Code-128 product barcodes and branded QR codes on single labels or 3x8 printable sticker sheets with zero external software."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <BarcodeQrStudio />
      </div>
    </div>
  );
}
