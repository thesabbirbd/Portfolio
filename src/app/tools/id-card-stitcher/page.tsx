import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { IdCardStitcherStudio } from "@/components/tools/IdCardStitcherStudio";

export const metadata = pageMetadata({
  title: "NID & Dual-Side ID Card Smart Stitcher + Safety Watermark | Free Tool | THE SABBiR",
  description: "Photocopy and print Front & Back of National ID (NID), Smart Card, Driving License, or Student ID onto a single aligned A4 sheet with anti-misuse safety watermarks. 100% private, client-side.",
  path: "/tools/id-card-stitcher",
});

export default function IdCardStitcherPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "NID Card Stitcher" }]}
        eyebrow="Identity & Document Engineering"
        title={<>NID &amp; Dual-Side <Accent>ID Card Stitcher</Accent></>}
        lede="জাতীয় পরিচয়পত্র (NID), স্মার্ট কার্ড বা ড্রাইভিং লাইসেন্সের উভয় পিঠ এক পেজে সাজিয়ে অপব্যবহার রোধে সুরক্ষা জলছাপসহ A4 প্রিন্ট করুন।"
        expression="editorial"
      />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <IdCardStitcherStudio />
      </div>
    </div>
  );
}
