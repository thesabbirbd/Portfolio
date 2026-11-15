import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { PrivacyRedactorStudio } from "@/components/tools/PrivacyRedactorStudio";

export const metadata = pageMetadata({
  title: "Privacy NID, Phone & Bank Statement PDF Redactor Studio | THE SABBiR",
  description: "Detect and redact Bangladeshi NID numbers, phone numbers, emails, and financial information. Blackout sensitive text and export safe watermarked files.",
  path: "/tools/pdf-redactor",
});

export default function PdfRedactorPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "PDF Redactor" }]}
        eyebrow="Security & Privacy"
        title={<>NID, Phone & <Accent>PII Redactor Studio</Accent></>}
        lede="Protect confidential information in contracts, CVs, bank slips, and national IDs with automated PII pattern detection and client-side redaction."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <PrivacyRedactorStudio />
      </div>
    </div>
  );
}
