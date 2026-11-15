import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { SmsCampaignStudio } from "@/components/tools/SmsCampaignStudio";

export const metadata = pageMetadata({
  title: "Customer CRM Segmenter & Bangla SMS Campaign Studio | Free Browser Tool | THE SABBiR",
  description: "Segment customer lists into VIP, Baki/Due, and Inactive groups, generate personalized SMS messages, and calculate exact GSM-7 vs Unicode costs in BDT.",
  path: "/tools/sms-campaign-studio",
});

export default function SmsCampaignPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "SMS Campaign Studio" }]}
        eyebrow="CRM & Messaging"
        title={<>Customer CRM &amp; <Accent>Bangla SMS Studio</Accent></>}
        lede="Segment retail customer lists, craft personalized Bangla/English SMS reminders, and calculate exact GSM-7/Unicode multi-part segments and BDT gateway costs."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <SmsCampaignStudio />
      </div>
    </div>
  );
}
