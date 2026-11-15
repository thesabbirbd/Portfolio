import { MedicineSchedulerStudio } from "@/components/tools/MedicineSchedulerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prescription Dose Chart (1+0+1), Pill Refill & Alarm Studio | THE SABBiR",
  description:
    "Convert Bangladeshi prescription doses (1+1+1, 1+0+1) into printable family wall charts, calculate exact pill refills & pharmacy costs, and export calendar alarms (.ics).",
  path: "/tools/medicine-scheduler",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Prescription Dose Chart & Pill Refill Studio",
      "operatingSystem": "All",
      "applicationCategory": "HealthApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Free printable prescription schedule builder, pill refill cost calculator, and .ics calendar alarm generator.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "প্রেসক্রিপশনের 1+0+1 মানে কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1+0+1 মানে হলো সকালে ১টি, দুপুরে ০টি (খাবেন না) এবং রাতে ১টি ট্যাবলেট বা ক্যাপসুল সেবন করতে হবে।",
          },
        },
        {
          "@type": "Question",
          "name": "ওষুধের রিমাইন্ডার কি মোবাইলের ক্যালেন্ডারে নেওয়া যায়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হ্যাঁ, এই টুল থেকে সরাসরি RFC 5545 মানসম্মত .ics ফাইল ডাউনলোড করে Google Calendar, Apple Calendar বা Outlook-এ সকাল, দুপুর ও রাতের অ্যালার্ম সেট করা যায়।",
          },
        },
      ],
    },
  ],
};

export default function MedicineSchedulerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <MedicineSchedulerStudio />
      </div>
    </>
  );
}
