import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { ChequeAuditStudio } from "@/components/tools/ChequeAuditStudio";

export const metadata = pageMetadata({
  title: "BD Bank Cheque, Taka-in-Words & Deposit Slip Auditor | Free Browser Tool | THE SABBiR",
  description: "Convert numbers to Bangladeshi banking words in Bangla and English, audit stale or post-dated cheques, and export bank deposit reconciliation slips.",
  path: "/tools/cheque-audit",
});

export default function ChequeAuditPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Cheque & Taka-in-Words Auditor" }]}
        eyebrow="Banking & Finance"
        title={<>BD Bank Cheque &amp; <Accent>Taka-in-Words Auditor</Accent></>}
        lede="Instant Bangla and English Lakh/Crore banking words converter, stale and post-dated clearing risk auditor, and deposit slip exporter."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <ChequeAuditStudio />
      </div>
    </div>
  );
}
