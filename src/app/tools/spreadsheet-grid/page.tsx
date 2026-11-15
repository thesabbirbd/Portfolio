import { SpreadsheetGridStudio } from "@/components/tools/SpreadsheetGridStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Smart Khata & Formula Spreadsheet Studio — THE SABBiR OS",
  description:
    "Excel & Google Sheets alternative. In-browser reactive formula engine (=SUM, =AVERAGE, =IF), Dokan cashbook and family budget templates, real-time charts, and CSV export.",
  path: "/tools/spreadsheet-grid",
});

export default function SpreadsheetGridPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <SpreadsheetGridStudio />
    </div>
  );
}
