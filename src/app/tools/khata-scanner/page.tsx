import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { KhataScannerStudio } from "@/components/tools/KhataScannerStudio";

export const metadata = pageMetadata({
  title: "Bangla Khata, Cash Memo & Receipt OCR-to-Excel Scanner | THE SABBiR",
  description: "Parse handwritten or typed Bangla/English ledger lines and cash memos into an editable table with auto-totals, Baki audit, and instant Excel/CSV download.",
  path: "/tools/khata-scanner",
});

export default function KhataScannerPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Khata Scanner" }]}
        eyebrow="SME & Retail Utility"
        title={<>Dokan Khata & <Accent>Receipt to Excel</Accent></>}
        lede="Turn messy Bangla ledger memos, shopping lists, and store receipts into structured accounting spreadsheets with zero manual data entry."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <KhataScannerStudio />
      </div>
    </div>
  );
}
