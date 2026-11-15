import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { CvPrivacyStudio } from "@/components/tools/CvPrivacyStudio";

export const metadata = pageMetadata({
  title: "Public CV Privacy Cleaner & ATS Keyword Matcher | Free Browser Tool | THE SABBiR",
  description: "Score your resume 0-100% against job descriptions, discover missing ATS keywords, and auto-scrub phone, NID, and address for safe public sharing.",
  path: "/tools/cv-privacy-shield",
});

export default function CvPrivacyShieldPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "CV Privacy & ATS Matcher" }]}
        eyebrow="Career & Privacy"
        title={<>Public CV Privacy &amp; <Accent>ATS Matcher</Accent></>}
        lede="Analyze resume match rates against target job descriptions, find missing keywords, and automatically strip sensitive personal information for public LinkedIn posts."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <CvPrivacyStudio />
      </div>
    </div>
  );
}
