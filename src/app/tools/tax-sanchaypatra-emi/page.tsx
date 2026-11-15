import { TaxSanchaypatraEmiStudio } from "@/components/tools/TaxSanchaypatraEmiStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tax, Sanchaypatra Profit & Bank Loan EMI Calculator | THE SABBiR",
  description:
    "Accurate BD Income Tax slabs for FY 2025-26, National Savings Certificate (সঞ্চয়পত্র) tiered net monthly profit calculator, and Bank Loan reducing EMI planner.",
  path: "/tools/tax-sanchaypatra-emi",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Tax, Sanchaypatra & EMI Studio",
      "operatingSystem": "All",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Calculate Bangladesh individual income tax with investment rebates, Sanchaypatra tiered profit with 5%/10% TDS, and monthly reducing EMI.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "পরিবার সঞ্চয়পত্রে কত টাকা রাখলে প্রতি মাসে কত টাকা মুনাফা পাওয়া যায়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "১৫ লাখ টাকা পর্যন্ত পরিবার সঞ্চয়পত্রে সর্বোচ্চ ১১.৫২% মুনাফা পাওয়া যায়। ৫% বা ১০% উৎসে কর কাটার পর প্রতি মাসে নির্দিষ্ট নিট মুনাফা ব্যাংক একাউন্টে জমা হয়।",
          },
        },
        {
          "@type": "Question",
          "name": "২০২৫-২৬ অর্থবছরে ব্যক্তি শ্রেণির সাধারণ করমুক্ত আয়ের সীমা কত?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "সাধারণ করদাতাদের জন্য করমুক্ত আয়ের সীমা ৩,৫০,০০০ টাকা। মহিলা ও ৬৫ বছরের বেশি বয়স্ক করদাতাদের জন্য ৪,০০,০০০ টাকা এবং প্রতিবন্ধী করদাতাদের জন্য ৪,৭৫,০০০ টাকা।",
          },
        },
        {
          "@type": "Question",
          "name": "ব্যাংক লোনের ইএমআই (EMI) কীভাবে হিসাব করা হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "রেডিউসিং ব্যালেন্স পদ্ধতিতে মাসিক চক্রবৃদ্ধি সুদের ফর্মুলা [P x R x (1+R)^N]/[(1+R)^N - 1] প্রয়োগ করে প্রতি মাসের নির্দিষ্ট কিস্তি নির্ধারণ করা হয়।",
          },
        },
      ],
    },
  ],
};

export default function TaxSanchaypatraEmiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <TaxSanchaypatraEmiStudio />
      </div>
    </>
  );
}
