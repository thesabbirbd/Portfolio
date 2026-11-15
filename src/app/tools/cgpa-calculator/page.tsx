import { CgpaCalculatorStudio } from "@/components/tools/CgpaCalculatorStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "SSC / HSC GPA & UGC University CGPA Calculator + Target Solver | THE SABBiR",
  description:
    "Official Bangladesh Education Board SSC/HSC GPA calculator with 4th-subject bonus, Golden A+ detection, UGC University semester CGPA, and reverse target grade predictor.",
  path: "/tools/cgpa-calculator",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR SSC/HSC & University CGPA Calculator Studio",
      "operatingSystem": "All",
      "applicationCategory": "EducationalApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Bangladesh Education Board GPA with 4th subject bonus, Golden A+ logic, UGC CGPA and reverse target solver.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "এসএসসি বা এইচএসসিতে ৪র্থ বিষয়ের পয়েন্ট কীভাবে যোগ হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "৪র্থ বিষয়ে প্রাপ্ত গ্রেড পয়েন্ট থেকে ২.০০ বাদ দিয়ে অবশিষ্ট পয়েন্ট আবশ্যিক বিষয়সমূহের সাথে যোগ করা হয়। মোট পয়েন্টকে আবশ্যিক বিষয়ের সংখ্যা দিয়ে ভাগ করে জিপিএ নির্ধারিত হয়, যা সর্বোচ্চ ৫.০০ হতে পারে।",
          },
        },
        {
          "@type": "Question",
          "name": "গোল্ডেন A+ কাকে বলে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "যদি কোনো শিক্ষার্থী ৪র্থ বিষয় ব্যতীত সকল আবশ্যিক বিষয়ে আলাদাভাবে A+ (৫.০০ পয়েন্ট) পায় এবং তার মোট জিপিএ ৫.০০ হয়, তবে তাকে গোল্ডেন A+ বলা হয়।",
          },
        },
      ],
    },
  ],
};

export default function CgpaCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <CgpaCalculatorStudio />
      </div>
    </>
  );
}
