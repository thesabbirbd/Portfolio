import { SchoolResultIdStudio } from "@/components/tools/SchoolResultIdStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "School Result Marksheet & Student ID Card Studio — THE SABBiR OS",
  description:
    "Generate academic marksheet with automatic Bangla GPA calculation and batch student ID cards with QR verification.",
  path: "/tools/school-result-id-studio",
  keywords: [
    "school marksheet generator",
    "student id card batch",
    "gpa calculator bangla",
    "coaching result sheet",
    "the sabbir os",
  ],
});

export default function SchoolResultIdPage() {
  return <SchoolResultIdStudio />;
}
