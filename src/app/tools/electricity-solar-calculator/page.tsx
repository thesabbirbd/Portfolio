import { ElectricitySolarStudio } from "@/components/tools/ElectricitySolarStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "BD Electricity Bill (BERC LT-A Slab) & Home IPS/Solar Sizer | THE SABBiR",
  description:
    "Official BERC residential LT-A step-tariff electricity bill calculator with room appliance wattage inventory, plus home IPS VA, tubular battery Ah, and rooftop solar sizing.",
  path: "/tools/electricity-solar-calculator",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR BD Electricity Bill & Home IPS Sizer Studio",
      "operatingSystem": "All",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Calculate DESCO/DPDC/BPDB electricity bills using official BERC step-tariffs and size home IPS inverters and tubular batteries.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "আবাসিক বিদ্যুৎ বিলের লাইফ-লাইন ধাপ কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "বিইআরসি ট্যারিফ অনুযায়ী যদি কোনো মাসে মোট বিদ্যুৎ খরচ ৫০ ইউনিটের কম বা সমান হয়, তবে প্রতি ইউনিট ৪.৬৩ টাকা লাইফ-লাইন রেটে হিসাব করা হয়। ৫০ ইউনিট অতিক্রম করলেই ১ম ধাপ (০-৭৫ ইউনিট) ৫.২৬ টাকা থেকে শুরু হয়।",
          },
        },
        {
          "@type": "Question",
          "name": "আমার বাসার জন্য কত ভিএ (VA) আইপিএস ও ব্যাটারি প্রয়োজন?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "সাধারণত ৩টি ফ্যান (২২৫ ওয়াট), ৪টি এলইডি লাইট (৬০ ওয়াট) এবং ১টি রাউটার (১২ ওয়াট) মোট প্রায় ৩০০ ওয়াট লোডের জন্য ৮০০ ভিএ বা ১০০০ ভিএ ইনভার্টার এবং ৩-৪ ঘণ্টা ব্যাকআপের জন্য ১৩০ Ah বা ১৫০ Ah টিউবুলার ব্যাটারি যথেষ্ট।",
          },
        },
      ],
    },
  ],
};

export default function ElectricitySolarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <ElectricitySolarStudio />
      </div>
    </>
  );
}
