import { EventDawatPlannerStudio } from "@/components/tools/EventDawatPlannerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dawat, Wedding & Picnic Raw Catering Sizer & Chanda Splitter | THE SABBiR",
  description:
    "Accurate raw catering ingredient calculator in kg and liters for Kacchi Biryani, Polao, and Roast, plus multi-person picnic and tour Chanda cost splitter.",
  path: "/tools/event-dawat-planner",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Dawat Catering & Picnic Chanda Splitter Studio",
      "operatingSystem": "All",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Per-head raw ingredient sizing in kg/liters for Bangladeshi events (Kacchi, Polao, Roast) and equitable multi-person cost settlements.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "১০০ জন মানুষের কাচ্চি বিরিয়ানিতে কত কেজি চাল ও মাংস লাগে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "সাধারণত ১০০ জন মেহমানের জন্য প্রায় ২৫ কেজি মাংস (জনপ্রতি ২৫০ গ্রাম), ১২.৫ কেজি চাল (জনপ্রতি ১২৫ গ্রাম) এবং ৮ কেজি আলু প্রয়োজন হয়।",
          },
        },
        {
          "@type": "Question",
          "name": "পিকনিকের চাঁদা স্প্লিটার কীভাবে হিসাব করে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "সকল সদস্যের ব্যক্তিগত খরচ যোগ করে মাথাপিছু সমান শেয়ার বের করা হয় এবং সর্বনিম্ন সংখ্যক লেনদেনে কে কাকে কত টাকা ফেরত দেবে তা অটোমেটিকভাবে বের করা হয়।",
          },
        },
      ],
    },
  ],
};

export default function EventDawatPlannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <EventDawatPlannerStudio />
      </div>
    </>
  );
}
