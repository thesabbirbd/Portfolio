import { DocumentScannerStudio } from "@/components/tools/DocumentScannerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Document Cam-Scanner & White-Paper Deskew Studio — THE SABBiR OS",
  description:
    "Turn smartphone photos of documents, receipts, and book pages into clean, shadow-free white photocopy scans with client-side illumination flattening.",
  path: "/tools/document-scanner",
});

export default function DocumentScannerPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <DocumentScannerStudio />
    </div>
  );
}
