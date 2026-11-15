import { BanglaConverterStudio } from "@/components/tools/BanglaConverterStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bijoy to Unicode & Unicode to Bijoy Converter + 12 Official Templates | THE SABBiR",
  description:
    "Fast, accurate, client-side Bijoy Classic (SutonnyMJ) to Unicode UTF-8 Bangla converter. Features 12 official administrative templates for banks, jobs, police GD, and schools.",
  path: "/tools/bangla-converter",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "THE SABBiR Bijoy ↔ Unicode Bangla Converter Studio",
      "operatingSystem": "All",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT",
      },
      "description":
        "Pure-TypeScript client-side bi-directional Bijoy SutonnyMJ to Unicode UTF-8 converter with official Bangla letter templates.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "বিজয় থেকে ইউনিকোড কনভার্ট করলে যুক্তবর্ণ বা কার চিহ্ন নষ্ট হয় কেন?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "বিজয় কিবোর্ডে ই-কার (ি) ও এ-কার (ে) বর্ণের পূর্বে টাইপ হয় কিন্তু ইউনিকোডে পরে যুক্ত হয়। আমাদের অ্যালগরিদম স্বয়ংক্রিয়ভাবে কার-চিহ্ন ও রেফ রি-অর্ডার করে নির্ভুল রাখে।",
          },
        },
        {
          "@type": "Question",
          "name": "এখানে কি সরকারি চাকরির আবেদন বা ব্যাংকের দরখাস্ত পাওয়া যাবে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হ্যাঁ, এই স্টুডিওতে ১২টি প্রমিত সরকারি ও প্রশাসনিক দরখাস্ত (যেমন ব্যাংক একাউন্ট খোলা, ছুটির আবেদন, পুলিশ জিডি ফরম) ১-ক্লিকে লোড ও এডিট করা যায়।",
          },
        },
      ],
    },
  ],
};

export default function BanglaConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <BanglaConverterStudio />
      </div>
    </>
  );
}
