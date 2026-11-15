import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { InvoiceMakerStudio } from "@/components/tools/InvoiceMakerStudio";

export const metadata = pageMetadata({
  title: "BD SME Business Invoice, Quotation & Cash Memo Maker | THE SABBiR",
  description: "Create professional business invoices, quotations, and 80mm POS thermal receipts with bKash/Nagad QR payments, VAT, and courier COD fees.",
  path: "/tools/invoice-maker",
});

export default function InvoiceMakerPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Invoice Maker" }]}
        eyebrow="Billing & POS"
        title={<>BD SME Invoice & <Accent>Cash Memo Maker</Accent></>}
        lede="Generate ready-to-print A4 corporate invoices and 80mm thermal receipts with bKash QR payment codes, shipping margins, and instant PDF download."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <InvoiceMakerStudio />
      </div>
    </div>
  );
}
