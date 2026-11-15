import { AgeHealthCardStudio } from "@/components/tools/AgeHealthCardStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Exact Job Age Calculator (BCS Cutoff), BMI & Emergency Medical ID | THE SABBiR",
  description:
    "Exact calendar age in years, months, and days with BCS 32-year age limit verification, Mifflin-St Jeor BMI/BMR calorie targets, and wallet-sized printable Emergency Medical ID card.",
  path: "/tools/age-health-card",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Exact Job Age & Emergency Medical ID Studio",
      "operatingSystem": "All",
      "applicationCategory": "HealthApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Calendar exact age calculator with Bangladesh Civil Service (BCS) job cutoff validation, BMI/BMR health metrics, and emergency medical identification cards.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "বর্তমানে সরকারি চাকরিতে প্রবেশের বয়সসীমা কত?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "বাংলাদেশ সরকারের সাম্প্রতিক সিদ্ধান্ত অনুযায়ী সাধারণ প্রার্থীদের ক্ষেত্রে সরকারি চাকরিতে প্রবেশের সর্বোচ্চ বয়সসীমা ৩২ বছর এবং মুক্তিযোদ্ধা ও প্রতিবন্ধী কোটায় ৩৫ বছর নির্ধারণ করা হয়েছে।",
          },
        },
        {
          "@type": "Question",
          "name": "এমার্জেন্সি মেডিকেল আইডি কার্ডের সুবিধা কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "রাস্তায় কোনো দুর্ঘটনা ঘটলে বা জরুরি চিকিৎসার প্রয়োজনে এই কার্ডে রক্তের গ্রুপ, ওষুধ এলার্জি এবং তাৎক্ষণিক পরিবারের জরুরি কন্টাক্ট নম্বর পাওয়া যায়।",
          },
        },
      ],
    },
  ],
};

export default function AgeHealthCardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <AgeHealthCardStudio />
      </div>
    </>
  );
}
